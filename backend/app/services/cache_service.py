# Cache service for storing and retrieving GitHub repo data

import json
from app.services.db_service import SessionLocal
from app.models.cache_model import RepoCache


def get_cached_repo(repo):
    db = SessionLocal()

    try:
        result = db.query(RepoCache).filter(RepoCache.repo == repo).first()

        if result:
            return json.loads(result.data)

        return None

    finally:
        db.close()


def save_repo_cache(repo, data):
    db = SessionLocal()

    try:
        cache = RepoCache(
            id=repo,
            repo=repo,
            data=json.dumps(data)
        )

        db.merge(cache)
        db.commit()

    finally:
        db.close()