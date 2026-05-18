import sqlite3
import os
import hashlib
import hmac
import uuid

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DB_ACCOUNTS = (
    os.path.join(BASE_DIR, "accounts.db")
    if os.path.exists(os.path.join(BASE_DIR, "accounts.db"))
    else os.path.join(BASE_DIR, "account.db")
)

HASH_ITERATIONS = 200_000

def hash_password(password):
    salt = os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        HASH_ITERATIONS
    )
    return f"pbkdf2_sha256${HASH_ITERATIONS}${salt.hex()}${password_hash.hex()}"

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

if __name__ == "__main__":

    conn = sqlite3.connect(DB_ACCOUNTS)
    cursor = conn.cursor()

    ### TODO: Make a create account page, and make it so that the login page checks the database for the username and password, and if the username or password doesn't exist, sudjest making a new account.

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )
    """)

    cursor.execute("""
        INSERT OR IGNORE INTO accounts (account_id, username, email, password_hash)
        VALUES (?, ?, ?, ?)
    """, (
        str(uuid.uuid4()),
        "Arca",
        "samminator13@gmail.com",
        hash_password("J4john!13")
    ))

    conn.commit()

    cursor.execute("SELECT id, account_id, username, email FROM accounts")
    print(cursor.fetchall())
