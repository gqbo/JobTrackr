import time

import jwt
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_no_authorization_header_returns_401(client: AsyncClient) -> None:
    response = await client.get("/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_invalid_token_returns_401(client: AsyncClient) -> None:
    response = await client.get("/me", headers={"Authorization": "Bearer notavalidtoken"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_wrong_secret_returns_401(client: AsyncClient, test_jwt_secret: str) -> None:
    token = jwt.encode({"sub": "user-123"}, "wrong-secret", algorithm="HS256")
    response = await client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_expired_token_returns_401(client: AsyncClient, test_jwt_secret: str) -> None:
    token = jwt.encode(
        {"sub": "user-123", "exp": int(time.time()) - 1},
        test_jwt_secret,
        algorithm="HS256",
    )
    response = await client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_token_missing_sub_returns_401(client: AsyncClient, test_jwt_secret: str) -> None:
    token = jwt.encode({"role": "user"}, test_jwt_secret, algorithm="HS256")
    response = await client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_valid_token_returns_user_id(client: AsyncClient, test_jwt_secret: str) -> None:
    token = jwt.encode(
        {"sub": "test-user-123", "exp": int(time.time()) + 3600},
        test_jwt_secret,
        algorithm="HS256",
    )
    response = await client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["user_id"] == "test-user-123"
