import time
from collections.abc import AsyncIterator
from unittest.mock import AsyncMock

import jwt
import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import Settings, get_settings
from app.core.dependencies import get_application_repository
from app.main import create_app

TEST_JWT_SECRET = "test-jwt-secret-for-testing-32bytes!"
TEST_USER_ID = "test-user-123"
ANOTHER_USER_ID = "other-user-456"


@pytest.fixture
def test_jwt_secret() -> str:
    return TEST_JWT_SECRET


@pytest.fixture
def test_user_id() -> str:
    return TEST_USER_ID


@pytest.fixture
def another_user_id() -> str:
    return ANOTHER_USER_ID


@pytest.fixture
def auth_headers(test_user_id: str) -> dict[str, str]:
    token = jwt.encode(
        {"sub": test_user_id, "exp": int(time.time()) + 3600},
        TEST_JWT_SECRET,
        algorithm="HS256",
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def mock_repo() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    app = create_app()

    def override_settings() -> Settings:
        return Settings(
            supabase_url="http://localhost:54321",
            supabase_key="test-anon-key",
            supabase_service_role_key="test-service-role-key",
            supabase_jwt_secret=TEST_JWT_SECRET,
        )

    app.dependency_overrides[get_settings] = override_settings

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def authenticated_client(
    mock_repo: AsyncMock,
    auth_headers: dict[str, str],
) -> AsyncIterator[tuple[AsyncClient, AsyncMock, dict[str, str]]]:
    app = create_app()

    def override_settings() -> Settings:
        return Settings(
            supabase_url="http://localhost:54321",
            supabase_key="test-anon-key",
            supabase_service_role_key="test-service-role-key",
            supabase_jwt_secret=TEST_JWT_SECRET,
        )

    app.dependency_overrides[get_settings] = override_settings
    app.dependency_overrides[get_application_repository] = lambda: mock_repo

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac, mock_repo, auth_headers
