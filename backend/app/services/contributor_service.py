import requests
from app.config.settings import headers

BASE_URL = "https://api.github.com"

def get_contributors(owner, repo):
    url = f"{BASE_URL}/repos/{owner}/{repo}/contributors"
    res = requests.get(url, headers=headers)
    data = res.json()

    result = []

    for c in data:
        result.append({
            "name": c.get("login"),
            "commits": c.get("contributions")
        })

    return result