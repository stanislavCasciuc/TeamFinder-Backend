from datetime import timedelta


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from fastapi.security import OAuth2PasswordRequestForm

from auth_register.schemas import Token
from auth_register.utils import authenticate_user, create_access_token
from functions.functions import get_user_roles
from storage.models import get_db


ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # one week


router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    user_roles = get_user_roles(user.id, db)
    access_token = create_access_token(
        data={"sub": user.email, "id": user.id, "roles": user_roles}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer" }




