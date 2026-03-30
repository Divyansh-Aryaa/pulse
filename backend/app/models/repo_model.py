from pydantic import BaseModel

# consists repo url sent by user to analyze
class RepoRequest(BaseModel):
    repo_url: str