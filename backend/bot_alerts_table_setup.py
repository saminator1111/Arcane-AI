import sqlite3

if __name__ == "__main__":

    conn = sqlite3.connect("bots.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bot_alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bot_id TEXT,
            alert_type TEXT,
            alert_level TEXT,
            alert_message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()

    cursor.execute("SELECT * FROM bot_alerts")
    print(cursor.fetchall())

    conn.close()

