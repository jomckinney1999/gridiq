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
print("Connected to Supabase!")

# All years 1999-2024
YEARS = list(range(1999, 2025))
print(f"Loading {len(YEARS)} seasons: {YEARS[0]}-{YEARS[-1]}")

# ============================================
# STEP 1: LOAD ALL WEEKLY STATS 1999-2024
# ============================================
print("\n=== LOADING WEEKLY STATS 1999-2024 ===")
print("This will take 10-15 minutes, please wait...")

# Load in chunks to avoid memory issues
chunk_size = 5  # 5 years at a time
all_weekly = []

for i in range(0, len(YEARS), chunk_size):
    chunk_years = YEARS[i:i+chunk_size]
    print(f"Fetching years {chunk_years[0]}-{chunk_years[-1]}...")
    try:
        chunk = nfl.import_weekly_data(chunk_years)
        all_weekly.append(chunk)
        print(f"  Got {len(chunk)} rows")
    except Exception as e:
        print(f"  Error fetching {chunk_years}: {e}")
        continue

weekly = pd.concat(all_weekly, ignore_index=True)
print(f"\nTotal weekly rows: {len(weekly)}")

# ============================================
# STEP 2: BUILD PLAYER LOOKUP FROM WEEKLY DATA
# ============================================
print("\n=== BUILDING PLAYER DATABASE ===")

# Get unique players from weekly data
players_df = weekly[
    ['player_id', 'player_display_name', 
     'position', 'recent_team']
].drop_duplicates(
    subset=['player_display_name', 'position']
).dropna(subset=['player_display_name'])

print(f"Found {len(players_df)} unique players across all seasons")

# Upsert all players
players_batch = []
for _, row in players_df.iterrows():
    try:
        name = str(row.get('player_display_name', ''))
        pos = str(row.get('position', ''))
        if not name or name == 'nan':
            continue
        players_batch.append({
            'name': name,
            'position': pos,
            'team': str(row.get('recent_team', '')),
            'status': 'active',
            'is_prospect': False,
        })
    except:
        continue

print(f"Inserting {len(players_batch)} players...")
for i in range(0, len(players_batch), 500):
    batch = players_batch[i:i+500]
    try:
        supabase.table('players').upsert(
            batch,
            on_conflict='name,position'
        ).execute()
        print(f"  Players {i}-{i+len(batch)} done")
    except Exception as e:
        print(f"  Player batch error: {e}")

print("Players loaded!")

# ============================================
# STEP 3: BUILD PLAYER LOOKUP DICT
# ============================================
print("\nBuilding player lookup dictionary...")
all_players_result = supabase.table('players')\
    .select('id,name,position').execute()

# Build lookup by name+position
player_lookup = {}
for p in all_players_result.data:
    key = f"{p['name']}"
    player_lookup[key] = p['id']

print(f"Lookup has {len(player_lookup)} entries")

# ============================================
# STEP 4: INSERT ALL WEEKLY STATS IN BATCHES
# ============================================
print("\n=== INSERTING ALL WEEKLY STATS ===")
print(f"Processing {len(weekly)} rows...")

def safe_int(val):
    try:
        return int(val) if pd.notna(val) else 0
    except:
        return 0

stats_batch = []
skipped = 0
matched = 0

for _, row in weekly.iterrows():
    try:
        name = str(row.get('player_display_name', ''))
        if not name or name == 'nan':
            skipped += 1
            continue

        player_id = player_lookup.get(name)
        if not player_id:
            skipped += 1
            continue

        matched += 1
        stats_batch.append({
            'player_id': player_id,
            'season': safe_int(row.get('season')),
            'week': safe_int(row.get('week')),
            'snap_count': safe_int(row.get('offense_snaps')),
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
            'interceptions': safe_int(
                row.get('interceptions')),
            'fumbles': safe_int(
                row.get('sack_fumbles', 0)) +
                safe_int(row.get('rushing_fumbles', 0)),
        })
    except:
        skipped += 1
        continue

print(f"Built {len(stats_batch)} rows")
print(f"Matched: {matched}, Skipped: {skipped}")

# Clear existing stats first to avoid conflicts
print("\nClearing existing stats...")
try:
    supabase.table('player_game_stats')\
        .delete().neq('id', 
        '00000000-0000-0000-0000-000000000000')\
        .execute()
    print("Existing stats cleared!")
except Exception as e:
    print(f"Clear error (non-critical): {e}")

# Insert in batches of 500
print("Inserting all stats...")
success = 0
errors = 0

for i in range(0, len(stats_batch), 500):
    batch = stats_batch[i:i+500]
    try:
        supabase.table('player_game_stats')\
            .insert(batch).execute()
        success += len(batch)
        if success % 5000 == 0:
            pct = round(success/len(stats_batch)*100)
            print(f"  ✓ {success:,} / "
                  f"{len(stats_batch):,} rows "
                  f"({pct}%)")
    except Exception as e:
        errors += 1
        if errors <= 5:
            print(f"  Batch error at {i}: {e}")
        continue

print(f"\nStats done! {success:,} rows loaded, "
      f"{errors} batch errors")

# ============================================
# STEP 5: LOAD NGS TRACKING DATA (2016-2024)
# ============================================
print("\n=== LOADING NGS ADVANCED METRICS ===")
NGS_YEARS = list(range(2016, 2025))

try:
    print("Loading NGS receiving data...")
    ngs_chunks = []
    for i in range(0, len(NGS_YEARS), 3):
        chunk_years = NGS_YEARS[i:i+3]
        try:
            chunk = nfl.import_ngs_data(
                stat_type='receiving',
                years=chunk_years
            )
            ngs_chunks.append(chunk)
            print(f"  NGS {chunk_years[0]}-"
                  f"{chunk_years[-1]}: {len(chunk)} rows")
        except Exception as e:
            print(f"  NGS chunk error: {e}")
            continue

    ngs = pd.concat(ngs_chunks, ignore_index=True)
    print(f"Total NGS rows: {len(ngs)}")

    adv_batch = []
    for _, row in ngs.iterrows():
        try:
            name = str(row.get(
                'player_display_name', ''))
            if not name or name == 'nan':
                continue
            player_id = player_lookup.get(name)
            if not player_id:
                continue

            def safe_float(val):
                try:
                    return float(val) \
                        if pd.notna(val) else None
                except:
                    return None

            adv_batch.append({
                'player_id': player_id,
                'season': int(row['season']),
                'week': int(row['week'])
                    if pd.notna(row.get('week'))
                    else None,
                'yprr': safe_float(
                    row.get('yards_per_route_run')),
                'separation_avg': safe_float(
                    row.get('avg_separation')),
                'yac_per_reception': safe_float(
                    row.get('avg_yac')),
                'target_share': safe_float(
                    row.get('target_share')),
                'route_participation': safe_float(
                    row.get('route_participation')),
            })
        except:
            continue

    print(f"Inserting {len(adv_batch)} "
          f"advanced metric rows...")
    for i in range(0, len(adv_batch), 500):
        batch = adv_batch[i:i+500]
        try:
            supabase.table('advanced_metrics')\
                .upsert(batch).execute()
        except Exception as e:
            continue

    print(f"Advanced metrics loaded!")

except Exception as e:
    print(f"NGS error: {e}")

# ============================================
# STEP 6: LOAD SEASONAL PFR DATA
# ============================================
print("\n=== LOADING SEASONAL STATS ===")
try:
    seasonal = nfl.import_seasonal_data(
        list(range(2000, 2025))
    )
    print(f"Seasonal data: {len(seasonal)} rows")
    print(f"Columns: {list(seasonal.columns)[:10]}")
except Exception as e:
    print(f"Seasonal data error: {e}")

print("\n" + "="*50)
print("DONE! GridIQ database fully loaded.")
print(f"Players: check Supabase players table")
print(f"Stats: {success:,} weekly rows (1999-2024)")
print("="*50)
