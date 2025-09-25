#!/usr/bin/env python3
"""Update Codex config.toml with OpenMemory MCP settings."""

import argparse
import pathlib
import re

DEFAULT_API_BASE = "http://localhost:8765"
DEFAULT_USER_ID = "default_user"


def build_snippet(api_base: str, user_id: str) -> str:
    return f"""[mcp_servers.openmemory-local]
command = "npx"
args = [
    "-y",
    "supergateway",
    "--sse",
    "{api_base}/mcp/codex/sse/{user_id}"
]
startup_timeout_ms = 20_000
"""


def update_config(api_base: str, user_id: str) -> pathlib.Path:
    config_path = pathlib.Path.home() / ".codex" / "config.toml"
    config_path.parent.mkdir(parents=True, exist_ok=True)
    if not config_path.exists():
        config_path.touch()

    content = config_path.read_text(encoding="utf-8")
    snippet = build_snippet(api_base, user_id)
    pattern = re.compile(r"\[mcp_servers\.openmemory-local\][\s\S]*?(?=\r?\n\[|$)")

    if pattern.search(content):
        content = pattern.sub(snippet.strip(), content, count=1)
    else:
        prefix = content.rstrip()
        content = f"{prefix}\n\n{snippet.strip()}" if prefix else snippet.strip()

    config_path.write_text(content.rstrip() + "\n", encoding="utf-8")
    return config_path


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Configure Codex MCP endpoint for OpenMemory"
    )
    parser.add_argument(
        "--api-base",
        default=DEFAULT_API_BASE,
        help="OpenMemory API base URL",
    )
    parser.add_argument(
        "--user-id",
        default=DEFAULT_USER_ID,
        help="User identifier for Codex session",
    )
    args = parser.parse_args()

    path = update_config(args.api_base.rstrip("/"), args.user_id)
    print(f"Updated {path}")


if __name__ == "__main__":
    main()
