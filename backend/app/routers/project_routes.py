from fastapi import APIRouter
from app.models.repo_model import RepoRequest
from app.utils.parser import get_owner_repo

from app.services.job_store import create_job, complete_job, get_job
from app.services.analysis_service import run_analysis

router = APIRouter()

@router.post("/analyze-repo")
def analyze_repo(data: RepoRequest):
    try:
        owner, repo = get_owner_repo(data.repo_url)
    except Exception:
        return {"error" : "Invalid Github URL"}
    
    return run_analysis(owner, repo)

@router.post("/analyze")
def analyze_job(data: RepoRequest):
    job_id = create_job()

    try:
        owner, repo = get_owner_repo(data.repo_url)
        result = run_analysis(owner, repo)
        complete_job(job_id, result)
    except Exception as e:
        return {"error": str(e)}

    return{

        "job_id": job_id,
        "status": "completed"
    }    

@router.get("/results/{job_id}")
def get_results(job_id: str):
    job = get_job(job_id)

    if not job:
        return{"error": "Job not found"}
    
    return job

    