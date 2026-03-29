
import uuid

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
