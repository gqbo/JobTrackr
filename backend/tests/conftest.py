from collections.abc import AsyncIterator

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import Settings, get_settings
from app.main import create_app

TEST_JWT_SECRET = "test-jwt-secret-for-testing-32bytes!"


@pytest.fixture
def test_jwt_secret() -> str:
    return TEST_JWT_SECRET


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    app = create_app()

    def override_settings() -> Settings:
        return Settings(
            supabase_url="http://localhost:54321",
            supabase_key="test-anon-key",
            supabase_jwt_secret=TEST_JWT_SECRET,
        )

    app.dependency_overrides[get_settings] = override_settings

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
