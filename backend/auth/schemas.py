from pydantic import BaseModel
from typing import List, Optional

class RegisterUser(BaseModel):
    organization_id: Optional[int] = None
    id: Optional[int] = None
    name: str
    email: str
    password: str
    role: str
    organization_name: Optional[str] = None
    organization_address: Optional[str] = None
    department_id: Optional[int] = None

class Token(BaseModel):
    access_token: str
    token_type: str


















