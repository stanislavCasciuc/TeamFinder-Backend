from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from skills.user_skills import user_skills
from users import users
from team_finder import team_finder
from projects.technologies import technologies
from projects import projects
from departament import department
from custom_roles import custom_roles
from skills.skills import skills
from skills.department_skills import department_skills
from storage import models
from departament.department_requests import requests
from auth import auth
from auth import register
from projects.project_employee import project_employee
from storage.config import engine

models.Base.metadata.create_all(bind=engine)



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router, tags=["auth"])

app.include_router(register.router, tags=["register"], prefix="/api")
app.include_router(skills.router, tags=["skills"])
app.include_router(department.router, tags=["department"], prefix="/api")
app.include_router(users.router, tags=["users"], prefix="/api")
app.include_router(department_skills.router, tags=["department_skills"], prefix="/api")
app.include_router(user_skills.router, tags=["user_skills"], prefix="/api")
app.include_router(custom_roles.router, tags=["roles"], prefix="/api")
app.include_router(projects.router, tags=["projects"], prefix="/api")
app.include_router(technologies.router, tags=["project_technologies"], prefix="/api")
app.include_router(team_finder.router, tags=["team_finder"], prefix="/api")
app.include_router(project_employee.router, tags=["project_employee"], prefix="/api")
app.include_router(requests.router, tags=["department_requests"], prefix="/api")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

