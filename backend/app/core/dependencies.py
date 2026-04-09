import base64
import json
import urllib.request
from functools import lru_cache
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import Settings, get_settings
from app.core.supabase import get_supabase_client
from app.models.auth import UserContext
from app.repositories.application_repository import ApplicationRepository
from app.services.application_service import ApplicationService

SettingsDep = Annotated[Settings, Depends(get_settings)]

_bearer_scheme = HTTPBearer()


@lru_cache(maxsize=8)
def _get_ec_public_key(jwks_uri: str, kid: str):
    with urllib.request.urlopen(jwks_uri) as response:  # noqa: S310
        jwks = json.loads(response.read())
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return jwt.algorithms.ECAlgorithm.from_jwk(json.dumps(key))
    raise ValueError(f"Key {kid!r} not found in JWKS")


def _decode_token_header(token: str) -> dict:
    try:
        header_b64 = token.split(".")[0]
        header_b64 += "=" * (4 - len(header_b64) % 4)
        return json.loads(base64.urlsafe_b64decode(header_b64))
    except Exception:
        return {}


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
    settings: Settings = Depends(get_settings),
) -> UserContext:
    token = credentials.credentials
    try:
        header = _decode_token_header(token)
        alg = header.get("alg", "HS256")

        if alg == "ES256":
            kid = header["kid"]
            jwks_uri = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
            key = _get_ec_public_key(jwks_uri, kid)
            algorithms = ["ES256"]
        else:
            key = settings.supabase_jwt_secret
            algorithms = ["HS256"]

        payload = jwt.decode(
            token,
            key,
            algorithms=algorithms,
            options={"verify_aud": False},
        )
        user_id: str | None = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing sub claim",
            )
        return UserContext(user_id=user_id)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


CurrentUserDep = Annotated[UserContext, Depends(get_current_user)]


def get_application_repository(settings: SettingsDep) -> ApplicationRepository:
    client = get_supabase_client(settings)
    return ApplicationRepository(client)


def get_application_service(
    repo: Annotated[ApplicationRepository, Depends(get_application_repository)],
) -> ApplicationService:
    return ApplicationService(repo)


ApplicationServiceDep = Annotated[ApplicationService, Depends(get_application_service)]
