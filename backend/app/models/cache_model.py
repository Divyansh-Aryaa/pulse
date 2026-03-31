
from sqlalchemy import Column, String, Text
from app.models.base import Base

class RepoCache(Base):
    __tablename__ = "repo_cache"

    id = Column(String, primary_key=True, index=True)
    repo = Column(String, unique=True, index=True)
    data = Column(Text)
