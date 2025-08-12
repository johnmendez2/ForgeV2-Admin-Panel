import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase URL or KEY missing in environment.")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_table(table_name: str, limit: int | None = None):
    query = supabase.table(table_name).select("*")
    if limit is not None:
        query = query.limit(limit)
    response = query.execute()

    # The proper data payload is in .data if present
    if hasattr(response, "data"):
        data = response.data
    else:
        data = response  # fallback, though ideally this shouldn't happen

    # Basic validation
    if data is None:
        raise RuntimeError(f"No data returned for table {table_name}.")

    return data  # expected to be list of dicts or serializable structure
