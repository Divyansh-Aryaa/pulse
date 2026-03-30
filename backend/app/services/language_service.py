import requests
from app.config.settings import headers

BASE_URL = "https://api.github.com"

# get languages used in the project.
def get_languages(owner, repo):
    url = f"{BASE_URL}/repos/{owner}/{repo}/languages"
    res = requests.get(url, headers=headers)

    return res.json()