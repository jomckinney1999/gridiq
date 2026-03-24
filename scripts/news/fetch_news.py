"""
Ingest NFL news from RSS + Reddit into Supabase `news_feed`.
Run: pip install feedparser requests supabase python-dotenv python-dateutil
     python scripts/news/fetch_news.py
"""
import os
import re
import email.utils
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

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


def extract_image(entry: Any) -> Optional[str]:
    """Best-effort image URL from RSS entry (media_thumbnail, media, enclosures, HTML, ESPN CDN)."""
    # Method 1: media_thumbnail (PFT uses this)
    raw_thumbs = entry.get("media_thumbnail", []) or []
    if not isinstance(raw_thumbs, list):
        raw_thumbs = [raw_thumbs] if raw_thumbs else []
    thumbnails = raw_thumbs
    if thumbnails and isinstance(thumbnails[0], dict) and thumbnails[0].get("url"):
        return thumbnails[0]["url"]

    # Method 2: media_content
    for m in entry.get("media_content", []) or []:
        if not isinstance(m, dict):
            continue
        url = m.get("url", "") or ""
        t = m.get("type", "") or ""
        if url and (
            "jpg" in url
            or "jpeg" in url
            or "png" in url
            or "webp" in url
            or "image" in t
        ):
            return url

    # Method 3: enclosures
    for enc in entry.get("enclosures", []) or []:
        if not isinstance(enc, dict):
            continue
        t = enc.get("type", "") or ""
        if "image" in t:
            return enc.get("href") or enc.get("url", "")

    # Method 4: parse from HTML content
    content = ""
    for c in entry.get("content", []) or []:
        if isinstance(c, dict):
            content += c.get("value", "") or ""
    summary = (entry.get("summary", "") or "") + (entry.get("description", "") or "") + content

    for pattern in [
        r'<img[^>]+src=["\']([^"\']+)["\']',
        r"<img[^>]+src=([^ >]+)",
    ]:
        match = re.search(pattern, summary)
        if match:
            url = match.group(1).strip("\"'")
            if url.startswith("http"):
                return url
            if url.startswith("//"):
                return "https:" + url

    # Method 5: ESPN photo CDN from article ID
    link = entry.get("link", "") or ""
    espn_id = re.search(r"/id/(\d{8,})", link)
    if espn_id and "espn" in link.lower():
        return f"https://a.espncdn.com/photo/2025/0101/r{espn_id.group(1)}_576x324.jpg"

    return None


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
                img = extract_image(entry)
                articles.append(
                    {
                        "source_name": source["name"],
                        "source_type": source["type"],
                        "author": entry.get("author") or source["name"],
                        "headline": title[:300],
                        "body": clean_body,
                        "url": link,
                        "image_url": img,
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
                flair_raw = (p.get("link_flair_text") or "").strip()
                reddit_flair = flair_raw if flair_raw else None
                thumb = p.get("thumbnail") or ""
                if thumb in ("self", "default", "nsfw", "spoiler", "", None):
                    thumb = None
                elif isinstance(thumb, str) and thumb.startswith("//"):
                    thumb = "https:" + thumb
                preview_img = None
                preview = p.get("preview") or {}
                if isinstance(preview, dict):
                    imgs = preview.get("images") or []
                    if imgs and isinstance(imgs[0], dict):
                        src = (imgs[0].get("source") or {}).get("url")
                        if src:
                            preview_img = src.replace("&amp;", "&")
                image_url = preview_img or thumb
                author_u = p.get("author") or "reddit"
                posts.append(
                    {
                        "source_name": sub_data["label"],
                        "source_type": "Reddit",
                        "author": author_u,
                        "headline": title[:300],
                        "body": selftext or title,
                        "url": link,
                        "image_url": image_url,
                        "reddit_flair": reddit_flair,
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
                "image_url", "reddit_flair",
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
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=48)).isoformat()
    try:
        supabase.table("news_feed").delete().is_("image_url", "null").lt("fetched_at", cutoff).execute()
        print(f"Deleted stale rows with no image_url (fetched_at < {cutoff})")
    except Exception as e:
        print(f"Cleanup skipped: {e}")

    rss = fetch_rss_feeds()
    print(f"RSS total: {len(rss)} articles")
    reddit = fetch_reddit()
    print(f"Reddit total: {len(reddit)} posts")
    save_to_supabase(rss + reddit)
    print("=== Done! ===")


if __name__ == "__main__":
    main()
