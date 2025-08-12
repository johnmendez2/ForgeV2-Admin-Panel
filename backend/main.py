import os
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException, Response
from dotenv import load_dotenv
from supabase_client import fetch_table
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import logging
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for quick dev testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path("data")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def ensure_data_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def save_table_json(table_name: str, data):
    ensure_data_dir()
    file_path = DATA_DIR / f"{table_name}.json"
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    return str(file_path)


def fetch_all_tables_and_save():
    tables_env = os.getenv("TABLES", "")
    if not tables_env:
        logger.error("No tables specified in TABLES env var.")
        return {"error": "No tables specified in TABLES env var."}
    table_names = [t.strip() for t in tables_env.split(",") if t.strip()]
    results = {}
    for table in table_names:
        try:
            data = fetch_table(table)
            saved = save_table_json(table, data)
            results[table] = {"rows": len(data), "saved_to": saved}
            logger.info(f"Fetched and saved table {table}: {len(data)} rows.")
        except Exception as e:
            results[table] = {"error": str(e)}
            logger.error(f"Error fetching {table}: {e}")
    return results


@app.on_event("startup")
def startup_tasks():
    ensure_data_dir()
    # Immediate fetch on startup
    fetch_all_tables_and_save()

    # Scheduler: daily at 2am UTC
    scheduler = BackgroundScheduler(timezone="UTC")
    trigger = CronTrigger(hour=2, minute=0)  # 02:00 UTC every day
    scheduler.add_job(fetch_all_tables_and_save, trigger=trigger, id="daily_fetch_all", replace_existing=True)
    scheduler.start()
    logger.info("Scheduler started: daily fetch at 02:00 UTC.")



@app.get("/update-all")
async def update_all():
    results = fetch_all_tables_and_save()
    return results


@app.get("/data/{table_name}")
async def get_table_data(table_name: str):
    file_path = DATA_DIR / f"{table_name}.json"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Data for table '{table_name}' not found. Run /update-all or wait for scheduled pull.")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading saved data: {e}")
    return {"table": table_name, "rows": len(content), "data": content}
