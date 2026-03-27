import os
from dotenv import load_dotenv

# 1. This line is REQUIRED to read your .env file
load_dotenv()

# 2. Get the token. If not found, it will be None
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

# 3. Build headers only if token exists
headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json" # Good practice for GitHub API
} if GITHUB_TOKEN else {}