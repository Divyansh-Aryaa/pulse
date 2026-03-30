import requests
from concurrent.futures import ThreadPoolExecutor
from app.config.settings import headers

BASE_URL = "https://api.github.com"

# 1. Create a Session to reuse the connection. 
# This prevents GitHub from "hanging up"..
session = requests.Session()
session.headers.update(headers)

def get_commit_details(owner, repo, sha):
    """Fetches full stats for one commit."""
    url = f"{BASE_URL}/repos/{owner}/{repo}/commits/{sha}"
    try:
        # Added a timeout so a single slow request doesn't hang the whole app
        res = session.get(url, timeout=10)
        data = res.json()
        
        # GitHub can return an error message instead of commit data, so we check if it's a dict first.
        if not isinstance(data, dict):
            return {"additions": 0, "deletions": 0, "files_changed": 0}
        
        return {
            "additions": data.get("stats", {}).get("additions", 0),
            "deletions": data.get("stats", {}).get("deletions", 0),
            "files_changed": len(data.get("files", []))
        }
    except Exception:
        return {"additions": 0, "deletions": 0, "files_changed": 0}

def get_commits(owner, repo):
    """Fetches the list AND all individual details efficiently."""
    url = f"{BASE_URL}/repos/{owner}/{repo}/commits?per_page=20" # 20 is a safer 'full' limit
    
    try:
        res = session.get(url, timeout=10)
        data = res.json()

        if not isinstance(data, list):
            print(f"GitHub Error: {data.get('message')}")
            return []

        # 2. To get ALL details without hanging, we fetch them in parallel.
        # This uses 'Threads' to make multiple requests at the same time.
        with ThreadPoolExecutor(max_workers=5) as executor:
            # what is sha? it's a unique identifier for each commit and we need it to fetch the details of that commit.
            shas = [c.get("sha") for c in data]
            # Map the get_commit_details function to all SHAs
            all_details = list(executor.map(lambda s: get_commit_details(owner, repo, s), shas))

        result = []
        # 3. Combine the basic list data with the extra details we just fetched
        for c, details in zip(data, all_details):
            result.append({
                "message": c.get("commit", {}).get("message"),
                "author": c.get("commit", {}).get("author", {}).get("name"),
                "date": c.get("commit", {}).get("author", {}).get("date"),
                "sha": c.get("sha"),
                "additions": details["additions"],
                "deletions": details["deletions"],
                "files_changed": details["files_changed"]
            })

        return result
    except Exception as e:
        print(f"Error in get_commits: {e}")
        return []