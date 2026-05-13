#!/usr/bin/env python3
"""Tiny HTTP server that serves tamandua workflow state as JSON."""
import json
import os
import sqlite3
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

DB_PATH = Path.home() / ".tamandua" / "tamandua.db"
PORT = 7331
SERVE_DIR = Path(__file__).resolve().parent


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SERVE_DIR), **kwargs)

    def do_GET(self):
        if self.path.startswith("/api/state"):
            self._serve_state()
        else:
            super().do_GET()

    def _serve_state(self):
        try:
            conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
            conn.row_factory = sqlite3.Row

            run = None
            for row in conn.execute(
                "SELECT id, run_number, workflow_id, task, status, tokens_spent, "
                "created_at, updated_at FROM runs ORDER BY created_at DESC LIMIT 1"
            ):
                run = dict(row)

            if run is None:
                self._json_response({"error": "no runs"}, 404)
                conn.close()
                return

            run_id = run["id"]

            steps = []
            for row in conn.execute(
                "SELECT id, step_id, agent_id, step_index, status, type, "
                "retry_count, max_retries, current_story_id, abandoned_count, "
                "created_at, updated_at "
                "FROM steps WHERE run_id = ? ORDER BY step_index",
                (run_id,),
            ):
                steps.append(dict(row))

            stories = []
            for row in conn.execute(
                "SELECT id, story_index, story_id, title, description, status, "
                "retry_count, max_retries, created_at, updated_at "
                "FROM stories WHERE run_id = ? ORDER BY story_index",
                (run_id,),
            ):
                stories.append(dict(row))

            conn.close()

            self._json_response({"run": run, "steps": steps, "stories": stories})
        except Exception as e:
            self._json_response({"error": str(e)}, 500)

    def _json_response(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass  # silence request logs


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Tamandua Kanban server on http://127.0.0.1:{PORT}/tamandua-kanban.html")
    server.serve_forever()
