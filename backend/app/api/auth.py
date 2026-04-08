from fastapi import APIRouter

from app.core.dependencies import CurrentUserDep

router = APIRouter()


@router.get("/me")
async def get_me(user: CurrentUserDep) -> dict[str, str]:
    return {"user_id": user.user_id}
