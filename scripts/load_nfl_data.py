import os
import sys
from dotenv import load_dotenv

# Load .env.local from project root
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env.local')
load_dotenv(dotenv_path)

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

print(f"URL found: {bool(SUPABASE_URL)}")
print(f"KEY found: {bool(SUPABASE_KEY)}")

if not SUPABASE_URL or not SUPABASE_KEY:
    print(f"Looking for .env.local at: {dotenv_path}")
    sys.exit("ERROR: Missing Supabase credentials")

from supabase import create_client
import nfl_data_py as nfl
import pandas as pd

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
print("Connected to Supabase!")

batch_size = 500

# STEP 1: Load rosters — batch insert
print("Loading 2024 rosters...")
rosters = nfl.import_seasonal_rosters([2024])
rosters = rosters[rosters['position'].isin([
    'QB','WR','RB','TE','K','DT','DE','LB','CB','S'
])]
print(f"Found {len(rosters)} players")

players_batch = []
for _, row in rosters.iterrows():
    try:
        name = str(row.get('player_name', '') or row.get('full_name', ''))
        if not name or name == 'nan':
            continue
        players_batch.append({
            'name': name,
            'position': str(row.get('position', '')),
            'team': str(row.get('team', '') or row.get('team_abbr', '')),
            'jersey_number': int(row['jersey_number'])
                if pd.notna(row.get('jersey_number')) else None,
            'status': 'active',
            'is_prospect': False,
        })
    except Exception:
        continue

# Insert in batches of 500
for i in range(0, len(players_batch), batch_size):
    batch = players_batch[i:i + batch_size]
    try:
        supabase.table('players').upsert(batch).execute()
        print(f"Inserted players {i} to {i + len(batch)}")
    except Exception as e:
        print(f"Batch error: {e}")

print(f"Players loaded! {len(players_batch)} total")

# STEP 2: Load weekly stats — lookup + batch insert
print("Loading weekly stats 2023-2024...")
weekly = nfl.import_weekly_data([2023, 2024])
print(f"Found {len(weekly)} weekly rows")

print("Building player lookup...")
all_players = supabase.table('players').select('id,name').execute()
player_lookup = {p['name']: p['id'] for p in (all_players.data or [])}
print(f"Loaded {len(player_lookup)} players into lookup")


def safe_int(val):
    try:
        return int(val) if pd.notna(val) else 0
    except Exception:
        return 0


stats_batch = []
for _, row in weekly.iterrows():
    try:
        name = str(row.get('player_name', ''))
        if not name or name == 'nan':
            continue
        player_id = player_lookup.get(name)
        if not player_id:
            continue

        stats_batch.append({
            'player_id': player_id,
            'season': safe_int(row.get('season')),
            'week': safe_int(row.get('week')),
            'targets': safe_int(row.get('targets')),
            'receptions': safe_int(row.get('receptions')),
            'rec_yards': safe_int(row.get('receiving_yards')),
            'rec_tds': safe_int(row.get('receiving_tds')),
            'carries': safe_int(row.get('carries')),
            'rush_yards': safe_int(row.get('rushing_yards')),
            'rush_tds': safe_int(row.get('rushing_tds')),
            'completions': safe_int(row.get('completions')),
            'attempts': safe_int(row.get('attempts')),
            'pass_yards': safe_int(row.get('passing_yards')),
            'pass_tds': safe_int(row.get('passing_tds')),
            'interceptions': safe_int(row.get('interceptions')),
            'fumbles': safe_int(row.get('sack_fumbles', 0)) + safe_int(row.get('rushing_fumbles', 0)),
            'snap_count': safe_int(row.get('offense_snaps')),
        })
    except Exception:
        continue

print(f"Built {len(stats_batch)} stat rows, inserting in batches...")

for i in range(0, len(stats_batch), batch_size):
    batch = stats_batch[i:i + batch_size]
    try:
        supabase.table('player_game_stats').upsert(batch).execute()
        print(f"Inserted stats {i} to {i + len(batch)}")
    except Exception as e:
        print(f"Stats batch error: {e}")
        continue

print(f"Stats loaded! {len(stats_batch)} rows")

# STEP 3: Load NGS advanced metrics — batch insert
print("Loading NGS receiving metrics...")
try:
    ngs = nfl.import_ngs_data(stat_type='receiving', years=[2023, 2024])


    def safe_float(val):
        try:
            return float(val) if pd.notna(val) else None
        except Exception:
            return None


    adv_batch = []
    for _, row in ngs.iterrows():
        try:
            name = str(row.get('player_display_name', ''))
            if not name or name == 'nan':
                continue
            player_id = player_lookup.get(name)
            if not player_id:
                continue

            adv_batch.append({
                'player_id': player_id,
                'season': int(row['season']),
                'week': int(row['week']) if pd.notna(row.get('week')) else None,
                'yprr': safe_float(row.get('yards_per_route_run')),
                'separation_avg': safe_float(row.get('avg_separation')),
                'yac_per_reception': safe_float(row.get('avg_yac')),
                'target_share': safe_float(row.get('target_share')),
                'route_participation': safe_float(row.get('route_participation')),
            })
        except Exception:
            continue

    print(f"Built {len(adv_batch)} advanced metric rows, inserting in batches...")

    for i in range(0, len(adv_batch), batch_size):
        batch = adv_batch[i:i + batch_size]
        try:
            supabase.table('advanced_metrics').upsert(batch).execute()
            print(f"Inserted advanced metrics {i} to {i + len(batch)}")
        except Exception as e:
            print(f"Advanced metrics batch error: {e}")
            continue

    print(f"Advanced metrics loaded! {len(adv_batch)} rows")

except Exception as e:
    print(f"NGS error (non-critical): {e}")

print("DONE! Database fully populated with real NFL data.")
