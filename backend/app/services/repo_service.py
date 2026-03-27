import requests
from app.config.settings import headers

BASE_URL = "https://api.github.com"

def get_repo_info(owner, repo):
    url = f"{BASE_URL}/repos/{owner}/{repo}"
    res = requests.get(url, headers=headers)
    data = res.json()

    return {
        "repo_name": data.get("name"),
        "owner": data.get("owner", {}).get("login"),
        "stars": data.get("stargazers_count"),
        "forks": data.get("forks_count"),
        "open_issues": data.get("open_issues_count"),
        "created_at": data.get("created_at"),
        "updated_at": data.get("updated_at"),
        "language": data.get("language")
    }