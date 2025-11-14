"""import_export.py
Utilities to export/import user profiles and conversation history as JSON.
Provides:
  - export_user(user_id, out_path)
  - import_user(json_path)
"""
import json, sqlite3, os
DB = os.path.join(os.path.dirname(__file__), '..', 'symbiocoder.db')
def get_conn():
    return sqlite3.connect(DB)
def export_user(user_id, out_path):
    conn = get_conn()
    c = conn.cursor()
    user = c.execute('SELECT id, username, created_at FROM users WHERE id=?', (user_id,)).fetchone()
    profile = c.execute('SELECT data FROM profiles WHERE user_id=?', (user_id,)).fetchone()
    convs = c.execute('SELECT role, message, timestamp FROM conversations WHERE user_id=? ORDER BY id', (user_id,)).fetchall()
    conn.close()
    if not user:
        raise ValueError("User not found")
    payload = {
        "user": {"id": user[0], "username": user[1], "created_at": user[2]},
        "profile": json.loads(profile[0]) if profile and profile[0] else {},
        "conversations": [{"role": r, "message": m, "timestamp": t} for (r,m,t) in convs]
    }
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2)
    print("Exported user", user_id, "->", out_path)
def import_user(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        payload = json.load(f)
    conn = get_conn()
    c = conn.cursor()
    user = payload.get("user", {})
    c.execute('INSERT OR IGNORE INTO users (id, username) VALUES (?,?)', (user.get("id"), user.get("username")))
    profile = payload.get("profile", {})
    c.execute('INSERT OR REPLACE INTO profiles (user_id, data) VALUES (?,?)', (user.get("id"), json.dumps(profile)))
    for conv in payload.get("conversations", []):
        c.execute('INSERT INTO conversations (user_id, role, message, timestamp) VALUES (?,?,?,?)',
                  (user.get("id"), conv.get("role"), conv.get("message"), conv.get("timestamp")))
    conn.commit()
    conn.close()
    print("Imported data from", json_path)
