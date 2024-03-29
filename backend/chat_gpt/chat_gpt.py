from itertools import chain

from fastapi import Depends, APIRouter

import json

from sqlalchemy import and_
from sqlalchemy.orm import Session

from chat_gpt.utils import get_chat_gpt_response
from functions.functions import get_current_user
from storage.models import get_db, ProjectEmployees, ProjectTechnologies, Project, Roles, Skills, ProjectSkill
from team_finder.utils import get_team_fider
from users.shemas import UserData

router = APIRouter()

@router.get('/chat_gpt/{project_id}')
async def get_team(project_id: int, message: str,  current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    users = get_team_fider(current_user, project_id, db)

    db_project_technologies = db.query(ProjectTechnologies.name).filter(ProjectTechnologies.project_id == project_id).all()
    project_technologies = list(chain(*db_project_technologies))

    project_start = db.query(Project.start_date).filter(Project.id == project_id).first()

    db_project_skills = db.query(Skills.name, ProjectSkill.min_level).join(ProjectSkill, Skills.id == ProjectSkill.skill_id).filter(ProjectSkill.project_id == project_id).all()
    project_skills = [{"name": skill.name, "min_level": skill.min_level} for skill in db_project_skills]

    db_project_roles = db.query(Roles.name).join(ProjectEmployees, Roles.id == ProjectEmployees.role_id).join(Project, Project.id == ProjectEmployees.project_id).filter(and_(ProjectEmployees.project_id == project_id, ProjectEmployees.user_id == None)).all()
    project_roles = list(chain(*db_project_roles))

    project_data = {
        "start_date": project_start[0].strftime('%Y-%m-%d'),
        "technologies": project_technologies,
        "project_skills": project_skills
    }
    content = {
        "users": users,
        "project_data": project_data,
        "project_roles": project_roles
    }
    json_content = json.dumps(content)
    print(json_content)
    chat_gpt_response = await get_chat_gpt_response(json_content, json.dumps(message))
    return chat_gpt_response






