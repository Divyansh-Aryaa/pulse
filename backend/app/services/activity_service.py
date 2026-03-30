import requests
from app.config.settings import headers

BASE_URL = "https://api.github.com"

#commit activities for past weeks, with total commits per week and the week start data
def get_commit_activity(owner, repo):
    url = f"{BASE_URL}/repos/{owner}/{repo}/stats/commit_activity"
    res = requests.get(url, headers=headers)

    if res.status_code != 200:
        return []

    data = res.json()

    result = []

    for week in data:
        result.append({
            "week": week.get("week"),
            "total_commits": week.get("total")
        })

    return result