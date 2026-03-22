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

# Build player lookup
print("Building player lookup...")
all_players = supabase.table('players')\
    .select('id,name').execute()
player_lookup = {p['name']: p['id'] 
    for p in all_players.data}
print(f"Loaded {len(player_lookup)} players")

def safe_int(val):
    try:
        return int(val) if pd.notna(val) else 0
    except:
        return 0

# Load one year at a time so failures 
# don't kill the whole run
YEARS = list(range(2009, 2016))
total_loaded = 0

for year in YEARS:
    print(f"\n--- Loading {year} ---")
    try:
        weekly = nfl.import_weekly_data([year])
        print(f"  Fetched {len(weekly)} rows")
        
        # Also add any new players from this year
        new_players = weekly[
            ['player_display_name', 'position', 
             'recent_team']
        ].drop_duplicates(
            subset=['player_display_name']
        ).dropna(subset=['player_display_name'])
        
        new_batch = []
        for _, row in new_players.iterrows():
            name = str(row.get(
                'player_display_name', ''))
            if not name or name == 'nan':
                continue
            if name not in player_lookup:
                new_batch.append({
                    'name': name,
                    'position': str(
                        row.get('position', '')),
                    'team': str(
                        row.get('recent_team', '')),
                    'status': 'active',
                    'is_prospect': False,
                })
        
        if new_batch:
            try:
                supabase.table('players')\
                    .upsert(new_batch,
                        on_conflict='name,position'
                    ).execute()
                # Refresh lookup
                result = supabase.table('players')\
                    .select('id,name').execute()
                player_lookup = {
                    p['name']: p['id'] 
                    for p in result.data
                }
                print(f"  Added {len(new_batch)} "
                      f"new players")
            except Exception as e:
                print(f"  Player upsert error: {e}")
        
        # Build stats for this year
        stats_batch = []
        for _, row in weekly.iterrows():
            try:
                name = str(row.get(
                    'player_display_name', ''))
                if not name or name == 'nan':
                    continue
                player_id = player_lookup.get(name)
                if not player_id:
                    continue
                    
                stats_batch.append({
                    'player_id': player_id,
                    'season': safe_int(
                        row.get('season')),
                    'week': safe_int(
                        row.get('week')),
                    'snap_count': safe_int(
                        row.get('offense_snaps')),
                    'targets': safe_int(
                        row.get('targets')),
                    'receptions': safe_int(
                        row.get('receptions')),
                    'rec_yards': safe_int(
                        row.get('receiving_yards')),
                    'rec_tds': safe_int(
                        row.get('receiving_tds')),
                    'carries': safe_int(
                        row.get('carries')),
                    'rush_yards': safe_int(
                        row.get('rushing_yards')),
                    'rush_tds': safe_int(
                        row.get('rushing_tds')),
                    'completions': safe_int(
                        row.get('completions')),
                    'attempts': safe_int(
                        row.get('attempts')),
                    'pass_yards': safe_int(
                        row.get('passing_yards')),
                    'pass_tds': safe_int(
                        row.get('passing_tds')),
                    'interceptions': safe_int(
                        row.get('interceptions')),
                    'fumbles': safe_int(
                        row.get('sack_fumbles', 0)
                    ) + safe_int(
                        row.get('rushing_fumbles', 0)
                    ),
                })
            except:
                continue

        # Deduplicate within batch - keep last occurrence
        # of same player_id + season + week combination
        seen = set()
        deduped_batch = []
        for row in stats_batch:
            key = (row['player_id'], row['season'], row['week'])
            if key not in seen:
                seen.add(key)
                deduped_batch.append(row)

        stats_batch = deduped_batch
        print(f"  After dedup: {len(stats_batch)} rows")

        # Insert this year's stats
        year_loaded = 0
        for i in range(0, len(stats_batch), 500):
            batch = stats_batch[i:i+500]
            try:
                supabase.table('player_game_stats')\
                    .upsert(batch,
                        on_conflict='player_id,season,week'
                    ).execute()
                year_loaded += len(batch)
            except Exception as e:
                print(f"  Batch error: {e}")
                continue
        
        total_loaded += year_loaded
        print(f"  ✓ {year}: {year_loaded} rows loaded"
              f" (total: {total_loaded:,})")
              
    except Exception as e:
        print(f"  ERROR loading {year}: {e}")
        print(f"  Skipping {year} and continuing...")
        continue

print(f"\n{'='*50}")
print(f"DONE! {total_loaded:,} rows loaded "
      f"for 2009-2015")
print(f"Total players: {len(player_lookup):,}")
print(f"{'='*50}")
