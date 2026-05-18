import sqlite3

if __name__ == "__main__":

    conn = sqlite3.connect("bots.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id,
            name,
            chatName,
            description,
            personality,
            scenario,
            firstMessage,
            exampleDialogue,
            temp,
            tags,
            topP,
            topK,
            repetitionPenalty,
            frequencyPenalty,
            presencePenalty,
            contextMessages,
            image,
            approved
        )
    """)

    conn.commit()

    cursor.execute("SELECT * FROM bots")
    print(cursor.fetchall())