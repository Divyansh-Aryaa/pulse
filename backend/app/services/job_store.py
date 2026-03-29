
import uuid
import json
from app.services.redis_service import redis_client


def create_job():
    job_id = str(uuid.uuid4())

    redis_client.set(
        job_id,
        json.dumps({
            "status": "pending",
            "result": None
        })
    )

    return job_id


def complete_job(job_id, result):
    redis_client.set(
        job_id,
        json.dumps({
            "status": "completed",
            "result": result
        })
    )


def get_job(job_id):
    data = redis_client.get(job_id)

    if not data:
        return None

    return json.loads(data)