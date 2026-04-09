import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock

import pytest
from httpx import AsyncClient

from app.models.application import (
    Application,
    ApplicationModality,
    ApplicationStatus,
    PaginatedApplications,
)


def make_application(**kwargs) -> Application:
    defaults = dict(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        url="https://example.com/job",
        company="Acme Corp",
        role="Software Engineer",
        status=ApplicationStatus.bookmarked,
        modality=ApplicationModality.remote,
        location=None,
        salary=None,
        source=None,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    defaults.update(kwargs)
    return Application(**defaults)


@pytest.mark.asyncio
async def test_list_applications_empty(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    mock_repo.list_by_user.return_value = ([], 0)

    response = await client.get("/applications", headers=auth_headers)

    assert response.status_code == 200
    body = response.json()
    assert body["items"] == []
    assert body["total"] == 0
    assert body["limit"] == 20
    assert body["offset"] == 0


@pytest.mark.asyncio
async def test_list_applications_with_data(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    apps = [make_application(), make_application(), make_application()]
    mock_repo.list_by_user.return_value = (apps, 3)

    response = await client.get("/applications", headers=auth_headers)

    assert response.status_code == 200
    body = response.json()
    assert len(body["items"]) == 3
    assert body["total"] == 3


@pytest.mark.asyncio
async def test_list_applications_limit_clamped(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    mock_repo.list_by_user.return_value = ([], 0)

    await client.get("/applications?limit=500", headers=auth_headers)

    mock_repo.list_by_user.assert_called_once_with("test-user-123", limit=100, offset=0)


@pytest.mark.asyncio
async def test_create_application_happy_path(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    app = make_application(url="https://example.com/job", status=ApplicationStatus.bookmarked, company=None, role=None)
    mock_repo.create.return_value = app

    response = await client.post(
        "/applications",
        json={"url": "https://example.com/job"},
        headers=auth_headers,
    )

    assert response.status_code == 201
    body = response.json()
    assert body["url"] == "https://example.com/job"
    assert body["status"] == "bookmarked"
    assert body["company"] is None


@pytest.mark.asyncio
async def test_create_application_missing_url(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client

    response = await client.post("/applications", json={}, headers=auth_headers)

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_application_empty_url(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client

    response = await client.post("/applications", json={"url": ""}, headers=auth_headers)

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_application_happy_path(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    app = make_application()
    mock_repo.get_by_id.return_value = app

    response = await client.get(f"/applications/{app.id}", headers=auth_headers)

    assert response.status_code == 200
    assert response.json()["id"] == str(app.id)


@pytest.mark.asyncio
async def test_get_application_not_found(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    mock_repo.get_by_id.return_value = None

    response = await client.get(f"/applications/{uuid.uuid4()}", headers=auth_headers)

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_patch_application_happy_path(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    app = make_application(status=ApplicationStatus.applied)
    mock_repo.update.return_value = app

    response = await client.patch(
        f"/applications/{app.id}",
        json={"status": "applied"},
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["status"] == "applied"


@pytest.mark.asyncio
async def test_patch_application_invalid_status(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client

    response = await client.patch(
        f"/applications/{uuid.uuid4()}",
        json={"status": "pizza"},
        headers=auth_headers,
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_patch_application_not_found(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    mock_repo.update.return_value = None

    response = await client.patch(
        f"/applications/{uuid.uuid4()}",
        json={"status": "applied"},
        headers=auth_headers,
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_application_happy_path(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    mock_repo.delete.return_value = True

    response = await client.delete(f"/applications/{uuid.uuid4()}", headers=auth_headers)

    assert response.status_code == 204
    assert response.content == b""


@pytest.mark.asyncio
async def test_delete_application_not_found(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    mock_repo.delete.return_value = False

    response = await client.delete(f"/applications/{uuid.uuid4()}", headers=auth_headers)

    assert response.status_code == 404


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "method,path",
    [
        ("GET", "/applications"),
        ("POST", "/applications"),
        ("GET", f"/applications/{uuid.uuid4()}"),
        ("PATCH", f"/applications/{uuid.uuid4()}"),
        ("DELETE", f"/applications/{uuid.uuid4()}"),
        # Note endpoints (/{id}/notes, /{id}/notes/{note_id}) are covered in test_notes.py
    ],
)
async def test_application_endpoints_require_auth(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
    method: str,
    path: str,
) -> None:
    client, _, _ = authenticated_client

    response = await client.request(method, path)

    assert response.status_code == 401
