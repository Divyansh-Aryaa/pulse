
import uuid
<<<<<<< HEAD
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
=======

jobs = {}

def create_job():
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "status": "pending",
        "result": None
    }
    return job_id

def complete_job(job_id, result):
    if job_id in jobs:
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["result"] = result

def get_job(job_id):
    return jobs.get(job_id)        
>>>>>>> 20b91bfedf42484b71b9d9ee2e68944395b49316
