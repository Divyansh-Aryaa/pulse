#celery worker task to run the analysis in the background and store the result in redis

from app.celery_app import celery
from app.services.analysis_service import run_analysis
from app.services.job_store import complete_job

@celery.task
def run_analysis_task(job_id, owner,repo):
    try:
        result = run_analysis(owner, repo)
        complete_job(job_id, result)
    except Exception as e:
        complete_job(job_id, {"error": str(e)})
