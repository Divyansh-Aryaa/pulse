def get_owner_repo(url: str):
    url = url.strip().rstrip("/")
    parts = url.strip().split("/")

    # Check the url is in corrct fromat or not
    if len(parts) < 5:
        raise ValueError("Invalid Github Repo URL. Use format: https://github.com/owner/repo")

    owner = parts[-2]
    repo = parts[-1]
    return owner, repo