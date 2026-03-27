def get_owner_repo(url: str):
    parts = url.strip().split("/")
    owner = parts[-2]
    repo = parts[-1]
    return owner, repo