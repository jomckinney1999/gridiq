import os
import sys
from dotenv import load_dotenv

dotenv_path = os.path.join(
  os.path.dirname(os.path.abspath(__file__)), 
  '..', '.env.local'
)
load_dotenv(dotenv_path)

from supabase import create_client
import nfl_data_py as nfl
import pandas as pd

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
print("Connected!")

# STEP 1: Reload players WITH gsis_id from weekly data
# Weekly data has both display_name AND player_id (gsis_id)
print("Loading player IDs from weekly data...")
weekly = nfl.import_weekly_data([2023, 2024])
print(f"Weekly columns: {list(weekly.columns)}")

# Get unique players from weekly data
players_df = weekly[['player_id', 'player_name', 
    'player_display_name', 'position', 'recent_team']]\
    .drop_duplicates(subset=['player_id'])\
    .dropna(subset=['player_id'])

print(f"Found {len(players_df)} unique players in weekly data")
print(f"Sample display names: {players_df['player_display_name'].head(5).tolist()}")

# Upsert players using display_name (full name)
players_batch = []
for _, row in players_df.iterrows():
    try:
        name = str(row.get('player_display_name', '') or 
                   row.get('player_name', ''))
        if not name or name == 'nan':
            continue
        players_batch.append({
            'name': name,
            'position': str(row.get('position', '')),
            'team': str(row.get('recent_team', '')),
            'status': 'active',
            'is_prospect': False,
        })
    except:
        continue

print(f"Upserting {len(players_batch)} players with full names...")
for i in range(0, len(players_batch), 500):
    batch = players_batch[i:i+500]
    try:
        supabase.table('players').upsert(
            batch, on_conflict='name'
        ).execute()
        print(f"Players {i} to {i+len(batch)} done")
    except Exception as e:
        print(f"Players batch error: {e}")

print("Players updated with full names!")

# STEP 2: Rebuild lookup using full display names
print("Rebuilding player lookup...")
all_players = supabase.table('players')\
    .select('id,name').execute()
player_lookup = {p['name']: p['id'] for p in all_players.data}
print(f"Lookup has {len(player_lookup)} players")

# STEP 3: Build stats using display_name for matching
def safe_int(val):
    try:
        return int(val) if pd.notna(val) else 0
    except:
        return 0

print("Building stats batch using display names...")
stats_batch = []
skipped = 0

for _, row in weekly.iterrows():
    try:
        # Use display_name (full name) for matching
        name = str(row.get('player_display_name', ''))
        if not name or name == 'nan':
            skipped += 1
            continue
        
        player_id = player_lookup.get(name)
        if not player_id:
            skipped += 1
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
            'fumbles': safe_int(row.get('sack_fumbles', 0)) + 
                safe_int(row.get('rushing_fumbles', 0)),
            'snap_count': safe_int(row.get('offense_snaps')),
        })
    except:
        skipped += 1
        continue

print(f"Built {len(stats_batch)} rows ({skipped} skipped)")

if len(stats_batch) == 0:
    print("ERROR: Still 0 rows - check column names above")
    sys.exit(1)

# STEP 4: Insert in batches
print("Inserting stats in batches of 500...")
success = 0
for i in range(0, len(stats_batch), 500):
    batch = stats_batch[i:i+500]
    try:
        supabase.table('player_game_stats')\
            .upsert(batch).execute()
        success += len(batch)
        print(f"✓ {success} / {len(stats_batch)} rows inserted")
    except Exception as e:
        print(f"Batch error at {i}: {e}")
        continue

print(f"DONE! {success} stat rows loaded!")
