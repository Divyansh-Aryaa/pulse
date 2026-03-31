
from app.services.db_service import engine
from app.models.base import Base
from app.models.cache_model import RepoCache


def init_db():
    print("Creating tables...") #debug test
    Base.metadata.create_all(bind=engine)