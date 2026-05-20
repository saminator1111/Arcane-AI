import base64
import hashlib
import hmac
import json
import os
import sqlite3
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


### Run server:
### uvicorn main:app --reload --port 3000

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (dev only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== PATHS =====

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DB_BOTS = os.path.join(BASE_DIR, "bots.db")

DB_ACCOUNTS = (
    os.path.join(BASE_DIR, "accounts.db")
    if os.path.exists(os.path.join(BASE_DIR, "accounts.db"))
    else os.path.join(BASE_DIR, "account.db")
)

HASH_ITERATIONS = 200_000


# ===== PASSWORD HELPERS =====

def verify_password(password, stored_password):
    try:
        algorithm, iterations, salt, password_hash = stored_password.split("$", 3)
    except ValueError:
        return False

    if algorithm != "pbkdf2_sha256":
        return False

    test_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        int(iterations)
    )

    return hmac.compare_digest(test_hash.hex(), password_hash)


# ===== DATABASE HELPERS =====

def get_connection(db_path):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_bots_table():
    conn = get_connection(DB_BOTS)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id TEXT,
            name TEXT,
            chatName TEXT,
            description TEXT,
            personality TEXT,
            scenario TEXT,
            firstMessage TEXT,
            exampleDialogue TEXT,
            model TEXT,
            temp REAL,
            tags TEXT,
            topP REAL,
            topK REAL,
            repetitionPenalty REAL,
            frequencyPenalty REAL,
            presencePenalty REAL,
            contextMessages REAL,
            image TEXT
        )
    """)

    cursor.execute("PRAGMA table_info(bots)")
    columns = {column["name"] for column in cursor.fetchall()}

    needed_columns = {
        "account_id": "TEXT",
        "name": "TEXT",
        "chatName": "TEXT",
        "description": "TEXT",
        "personality": "TEXT",
        "scenario": "TEXT",
        "firstMessage": "TEXT",
        "exampleDialogue": "TEXT",
        "model": "TEXT",
        "temp": "REAL",
        "tags": "TEXT",
        "topP": "REAL",
        "topK": "REAL",
        "repetitionPenalty": "REAL",
        "frequencyPenalty": "REAL",
        "presencePenalty": "REAL",
        "contextMessages": "REAL",
        "image": "TEXT"
    }

    for column_name, column_type in needed_columns.items():
        if column_name not in columns:
            cursor.execute(f"ALTER TABLE bots ADD COLUMN {column_name} {column_type}")

    conn.commit()
    conn.close()


def clean_tags(tags):
    try:
        parsed_tags = json.loads(tags)

        if not isinstance(parsed_tags, list):
            parsed_tags = [parsed_tags]

    except json.JSONDecodeError:
        parsed_tags = tags.split(",")

    selected_tags = []

    for tag in parsed_tags:
        clean_tag = str(tag).lower().replace("#", "").strip()

        if clean_tag and clean_tag not in selected_tags:
            selected_tags.append(clean_tag)

    return selected_tags


def parse_tags_from_db(tags_value):
    if not tags_value:
        return []

    try:
        parsed = json.loads(tags_value)

        if isinstance(parsed, list):
            return parsed

        return []

    except json.JSONDecodeError:
        return []


def bot_row_to_dict(row):
    return {
        "id": row["id"],
        "account_id": row["account_id"],
        "name": row["name"],
        "chatName": row["chatName"],
        "description": row["description"],
        "personality": row["personality"],
        "scenario": row["scenario"],
        "firstMessage": row["firstMessage"],
        "exampleDialogue": row["exampleDialogue"],
        "model": row["model"],
        "temp": row["temp"],
        "tags": parse_tags_from_db(row["tags"]),
        "topP": row["topP"],
        "topK": row["topK"],
        "repetitionPenalty": row["repetitionPenalty"],
        "frequencyPenalty": row["frequencyPenalty"],
        "presencePenalty": row["presencePenalty"],
        "contextMessages": row["contextMessages"],
        "image": row["image"]
    }


# ===== REQUEST MODELS =====

class LoginRequest(BaseModel):
    username: str
    password: str


class ChatRequest(BaseModel):
    message: str


class SearchRequest(BaseModel):
    search: str

ensure_bots_table()


# ===== ROUTES =====

@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/login")
def login(req: LoginRequest):
    conn = get_connection(DB_ACCOUNTS)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT account_id, username, password_hash
        FROM accounts
        WHERE username = ?
    """, (req.username,))

    user = cursor.fetchone()
    conn.close()

    if user and verify_password(req.password, user["password_hash"]):
        return {
            "ok": True,
            "message": "User found",
            "account_id": user["account_id"],
            "username": user["username"]
        }

    return {
        "ok": False,
        "message": "No user found"
    }


@app.get("/bots")
def get_bots():
    ensure_bots_table()

    conn = get_connection(DB_BOTS)
    cursor = conn.cursor()

    conn_accounts = get_connection(DB_ACCOUNTS)
    cursor_accounts = conn_accounts.cursor()

    cursor.execute("SELECT * FROM bots")


    rows = cursor.fetchall()
    conn.close()

    bots = []

    for row in rows:
        bot = bot_row_to_dict(row)

        cursor_accounts.execute(
            "SELECT username FROM accounts WHERE account_id = ?",
            (bot["account_id"],)
        )

        user = cursor_accounts.fetchone()

        bot["username"] = user["username"] if user else "Unknown"

        bots.append(bot)

    conn_accounts.close()

    return {"bots": bots}


@app.get("/bot/{bot_id}")
def get_bot(bot_id: int):
    ensure_bots_table()

    conn = get_connection(DB_BOTS)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            account_id,
            name,
            chatName,
            description,
            personality,
            scenario,
            firstMessage,
            exampleDialogue,
            model,
            temp,
            tags,
            topP,
            topK,
            repetitionPenalty,
            frequencyPenalty,
            presencePenalty,
            contextMessages,
            image
        FROM bots
        WHERE id = ?
    """, (bot_id,))

    row = cursor.fetchone()
    conn.close()

    if not row:
        return {
            "ok": False,
            "message": "Bot not found"
        }

    return {
        "ok": True,
        "bot": bot_row_to_dict(row)
    }


@app.post("/submit")
async def submit(
    account_id: str = Form(...),
    name: str = Form(...),
    chatName: str = Form(...),
    description: str = Form(...),
    personality: str = Form(...),
    scenario: str = Form(...),
    firstMessage: str = Form(...),
    exampleDialogue: str = Form(...),

    model: Optional[str] = Form(None),
    temp: Optional[float] = Form(None),
    topP: Optional[float] = Form(None),
    topK: Optional[float] = Form(None),
    repetitionPenalty: Optional[float] = Form(None),
    frequencyPenalty: Optional[float] = Form(None),
    presencePenalty: Optional[float] = Form(None),
    contextMessages: Optional[float] = Form(None),

    tags: str = Form("[]"),
    image: Optional[UploadFile] = File(None)
):
    ensure_bots_table()

    selected_tags = clean_tags(tags)

    image_src = None

    if image is not None:
        image_bytes = await image.read()

        if image_bytes:
            image_type = image.content_type or "application/octet-stream"
            image_data = base64.b64encode(image_bytes).decode("ascii")
            image_src = f"data:{image_type};base64,{image_data}"

    conn = get_connection(DB_BOTS)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO bots (
            account_id,
            name,
            chatName,
            description,
            personality,
            scenario,
            firstMessage,
            exampleDialogue,
            model,
            temp,
            tags,
            topP,
            topK,
            repetitionPenalty,
            frequencyPenalty,
            presencePenalty,
            contextMessages,
            image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        account_id,
        name,
        chatName,
        description,
        personality,
        scenario,
        firstMessage,
        exampleDialogue,
        model,
        temp,
        json.dumps(selected_tags),
        topP,
        topK,
        repetitionPenalty,
        frequencyPenalty,
        presencePenalty,
        contextMessages,
        image_src
    ))

    bot_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return {
        "ok": True,
        "message": "Bot saved",
        "bot_id": bot_id
    }


@app.post("/chat")
def chat(req: ChatRequest):
    return {
        "you_sent": req.message,
        "reply": "I got it"
    }


@app.post("/search")
def search(req: SearchRequest):
    return {
        "you_searched": req.search,
        "reply": "I got it"
    }

@app.get("/accounts")
def get_accounts():
    conn = get_connection(DB_ACCOUNTS)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, account_id, username, email
        FROM accounts
    """)

    rows = cursor.fetchall()
    conn.close()

    accounts = []

    for row in rows:
        accounts.append({
            "id": row["id"],
            "account_id": row["account_id"],
            "username": row["username"],
            "email": row["email"]
        })

    return {"accounts": accounts}