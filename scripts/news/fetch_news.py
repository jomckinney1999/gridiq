"""
Ingest NFL news from RSS + Reddit into Supabase `news_feed`.
Run: pip install feedparser requests supabase python-dotenv python-dateutil
     python scripts/news/fetch_news.py
"""
import os
import re
import json
import email.utils
from datetime import datetime, timezone

import feedparser
import requests
from dotenv import load_dotenv
from supabase import create_client

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
load_dotenv(os.path.join(ROOT, ".env.local"))

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not url or not key:
    raise SystemExit("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(url, key)

RSS_SOURCES = [
    {"name": "ESPN NFL", "type": "ESPN", "url": "https://www.espn.com/espn/rss/nfl/news", "verified": True},
    {"name": "NFL.com", "type": "NFL", "url": "https://www.nfl.com/rss/rsslanding?searchString=home", "verified": True},
    {"name": "Pro Football Talk", "type": "PFT", "url": "https://profootballtalk.nbcsports.com/feed/", "verified": True},
    {"name": "NBC Sports", "type": "NBC", "url": "https://feeds.nbcsports.com/nbcsports/rss/nfl", "verified": True},
    {"name": "Pro Football Reference", "type": "PFR", "url": "https://www.pro-football-reference.com/rss", "verified": True},
    {"name": "Bleacher Report NFL", "type": "BR", "url": "https://bleacherreport.com/nfl.rss", "verified": False},
]

TEAMS = {
    "commanders": ["WAS", "Washington"],
    "cowboys": ["DAL", "Dallas"],
    "eagles": ["PHI", "Philadelphia"],
    "giants": ["NYG", "Giants", "New York Giants"],
    "chiefs": ["KC", "Kansas City"],
    "bills": ["BUF", "Buffalo"],
    "dolphins": ["MIA", "Miami"],
    "patriots": ["NE", "New England"],
    "ravens": ["BAL", "Baltimore"],
    "steelers": ["PIT", "Pittsburgh"],
    "browns": ["CLE", "Cleveland"],
    "bengals": ["CIN", "Cincinnati"],
    "texans": ["HOU", "Houston"],
    "colts": ["IND", "Indianapolis"],
    "titans": ["TEN", "Tennessee"],
    "jaguars": ["JAX", "Jacksonville"],
    "broncos": ["DEN", "Denver"],
    "chargers": ["LAC", "Los Angeles Chargers"],
    "raiders": ["LV", "Las Vegas"],
    "49ers": ["SF", "San Francisco"],
    "seahawks": ["SEA", "Seattle"],
    "rams": ["LAR", "Los Angeles Rams"],
    "cardinals": ["ARI", "Arizona"],
    "packers": ["GB", "Green Bay"],
    "vikings": ["MIN", "Minnesota"],
    "bears": ["CHI", "Chicago"],
    "lions": ["DET", "Detroit"],
    "saints": ["NO", "New Orleans"],
    "buccaneers": ["TB", "Tampa Bay"],
    "panthers": ["CAR", "Carolina"],
    "falcons": ["ATL", "Atlanta"],
}

PLAYERS = [
    "Patrick Mahomes",
    "Josh Allen",
    "Lamar Jackson",
    "Jayden Daniels",
    "Jalen Hurts",
    "Joe Burrow",
    "CeeDee Lamb",
    "Justin Jefferson",
    "Tyreek Hill",
    "Davante Adams",
    "Jaylen Waddle",
    "Terry McLaurin",
    "Saquon Barkley",
    "Derrick Henry",
    "Christian McCaffrey",
    "Travis Kelce",
    "Sam LaPorta",
    "Brock Bowers",
    "Micah Parsons",
    "Myles Garrett",
    "Maxx Crosby",
    "Rueben Bain",
    "Abdul Carter",
]


def extract_teams(text: str) -> list[str]:
    found: list[str] = []
    text_lower = text.lower()
    for team_key, aliases in TEAMS.items():
        if team_key in text_lower:
            found.append(aliases[0])
            continue
        for alias in aliases:
            if alias.lower() in text_lower:
                found.append(aliases[0])
                break
    return list(dict.fromkeys(found))


def extract_players(text: str) -> list[str]:
    tl = text.lower()
    found: list[str] = []
    for player in PLAYERS:
        if player.lower() in tl:
            found.append(player)
    return list(dict.fromkeys(found))


def parse_date(entry) -> str:
    for field in ("published", "updated", "created"):
        val = entry.get(field)
        if not val:
            continue
        try:
            parsed = email.utils.parsedate_to_datetime(val)
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            return parsed.isoformat()
        except Exception:
            pass
        try:
            from dateutil import parser as dparser

            p = dparser.parse(val)
            if p.tzinfo is None:
                p = p.replace(tzinfo=timezone.utc)
            return p.isoformat()
        except Exception:
            continue
    return datetime.now(timezone.utc).isoformat()


def fetch_rss_feeds():
    print("Fetching RSS feeds...")
    articles = []
    for source in RSS_SOURCES:
        try:
            print(f"  Fetching {source['name']}...")
            feed = feedparser.parse(source["url"])
            count = 0
            for entry in feed.entries[:20]:
                title = entry.get("title", "") or ""
                summary = entry.get("summary", "") or entry.get("description", "") or ""
                clean_body = re.sub(r"<[^>]+>", "", summary)[:500]
                link = (entry.get("link") or "").strip()
                if not link:
                    continue
                full_text = f"{title} {clean_body}"
                articles.append(
                    {
                        "source_name": source["name"],
                        "source_type": source["type"],
                        "author": entry.get("author") or source["name"],
                        "headline": title[:300],
                        "body": clean_body,
                        "url": link,
                        "team_tags": extract_teams(full_text),
                        "player_tags": extract_players(full_text),
                        "published_at": parse_date(entry),
                        "is_verified": source["verified"],
                        "upvotes": 0,
                        "comments": 0,
                        "views": 0,
                        "sentiment": "neutral",
                    }
                )
                count += 1
            print(f"    Got {count} articles")
        except Exception as e:
            print(f"    Error: {e}")
    return articles


SUBREDDITS = [
    {"sub": "nfl", "type": "Reddit", "label": "r/nfl"},
    {"sub": "fantasyfootball", "type": "Reddit", "label": "r/fantasyfootball"},
    {"sub": "NFLDraft", "type": "Reddit", "label": "r/NFLDraft"},
    {"sub": "Commanders", "type": "Reddit", "label": "r/Commanders", "team": "WAS"},
    {"sub": "cowboys", "type": "Reddit", "label": "r/cowboys", "team": "DAL"},
    {"sub": "eagles", "type": "Reddit", "label": "r/eagles", "team": "PHI"},
    {"sub": "KansasCityChiefs", "type": "Reddit", "label": "r/KansasCityChiefs", "team": "KC"},
    {"sub": "buffalobills", "type": "Reddit", "label": "r/buffalobills", "team": "BUF"},
    {"sub": "DolphinsTalk", "type": "Reddit", "label": "r/miamidolphins", "team": "MIA"},
    {"sub": "Ravens", "type": "Reddit", "label": "r/ravens", "team": "BAL"},
    {"sub": "steelers", "type": "Reddit", "label": "r/steelers", "team": "PIT"},
    {"sub": "49ers", "type": "Reddit", "label": "r/49ers", "team": "SF"},
    {"sub": "greenbaypackers", "type": "Reddit", "label": "r/greenbaypackers", "team": "GB"},
]

HEADERS = {"User-Agent": "NFLStatGuru/1.0 (news aggregator; contact: support@nflstatguru.local)"}


def fetch_reddit():
    print("Fetching Reddit...")
    posts = []
    for sub_data in SUBREDDITS:
        sub = sub_data["sub"]
        try:
            res = requests.get(
                f"https://www.reddit.com/r/{sub}/hot.json?limit=15",
                headers=HEADERS,
                timeout=15,
            )
            res.raise_for_status()
            data = res.json()
            children = data.get("data", {}).get("children", [])
            count = 0
            for post in children:
                p = post.get("data") or {}
                title = p.get("title", "") or ""
                if len(title) < 10:
                    continue
                permalink = p.get("permalink") or ""
                link = f"https://www.reddit.com{permalink}" if permalink else ""
                if not link:
                    continue
                team_tags = extract_teams(title)
                if sub_data.get("team"):
                    team_tags.append(sub_data["team"])
                team_tags = list(dict.fromkeys(team_tags))
                created = datetime.fromtimestamp(p.get("created_utc", 0), tz=timezone.utc).isoformat()
                selftext = (p.get("selftext") or "")[:500]
                posts.append(
                    {
                        "source_name": sub_data["label"],
                        "source_type": "Reddit",
                        "author": p.get("author_fullname") or p.get("author") or "Reddit",
                        "headline": title[:300],
                        "body": selftext or title,
                        "url": link,
                        "team_tags": team_tags,
                        "player_tags": extract_players(title),
                        "upvotes": int(p.get("score") or 0),
                        "comments": int(p.get("num_comments") or 0),
                        "views": 0,
                        "published_at": created,
                        "is_verified": False,
                        "sentiment": "neutral",
                    }
                )
                count += 1
            print(f"  r/{sub}: {count} posts")
        except Exception as e:
            print(f"  r/{sub} error: {e}")
    return posts


def save_to_supabase(items: list[dict]):
    print(f"Saving {len(items)} items to Supabase...")
    saved = 0
    errors = 0
    for item in items:
        try:
            u = item.get("url")
            if not u:
                continue
            existing = supabase.table("news_feed").select("id").eq("url", u).limit(1).execute()
            if existing.data:
                continue
            row = {k: v for k, v in item.items() if k in {
                "source_name", "source_type", "author", "headline", "body", "url",
                "team_tags", "player_tags", "published_at", "is_verified",
                "upvotes", "comments", "views", "sentiment",
            }}
            supabase.table("news_feed").insert(row).execute()
            saved += 1
        except Exception:
            errors += 1
            continue
    print(f"Saved {saved} new items ({errors} errors/skipped)")


def main():
    print("=== NFL Stat Guru News Fetcher ===")
    rss = fetch_rss_feeds()
    print(f"RSS total: {len(rss)} articles")
    reddit = fetch_reddit()
    print(f"Reddit total: {len(reddit)} posts")
    save_to_supabase(rss + reddit)
    print("=== Done! ===")


if __name__ == "__main__":
    main()
