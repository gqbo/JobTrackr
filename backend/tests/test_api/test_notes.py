import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock

import pytest
from httpx import AsyncClient

from app.models.application import (
    Application,
    ApplicationModality,
    ApplicationNote,
    ApplicationStatus,
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


def make_note(application_id: uuid.UUID, **kwargs) -> ApplicationNote:
    defaults = dict(
        id=uuid.uuid4(),
        application_id=application_id,
        user_id=uuid.uuid4(),
        content="Test note",
        created_at=datetime.now(timezone.utc),
    )
    defaults.update(kwargs)
    return ApplicationNote(**defaults)


@pytest.mark.asyncio
async def test_list_notes_empty(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    app = make_application()
    mock_repo.get_by_id.return_value = app
    mock_repo.list_notes.return_value = []

    response = await client.get(f"/applications/{app.id}/notes", headers=auth_headers)

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_list_notes_with_data(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    app = make_application()
    notes = [make_note(app.id), make_note(app.id)]
    mock_repo.get_by_id.return_value = app
    mock_repo.list_notes.return_value = notes

    response = await client.get(f"/applications/{app.id}/notes", headers=auth_headers)

    assert response.status_code == 200
    assert len(response.json()) == 2


@pytest.mark.asyncio
async def test_list_notes_app_not_found(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    mock_repo.get_by_id.return_value = None

    response = await client.get(f"/applications/{uuid.uuid4()}/notes", headers=auth_headers)

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_note_happy_path(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    app = make_application()
    note = make_note(app.id, content="Good interview")
    mock_repo.get_by_id.return_value = app
    mock_repo.create_note.return_value = note

    response = await client.post(
        f"/applications/{app.id}/notes",
        json={"content": "Good interview"},
        headers=auth_headers,
    )

    assert response.status_code == 201
    body = response.json()
    assert "id" in body
    assert body["content"] == "Good interview"
    assert "created_at" in body


@pytest.mark.asyncio
async def test_create_note_missing_content(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client

    response = await client.post(
        f"/applications/{uuid.uuid4()}/notes",
        json={},
        headers=auth_headers,
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_note_empty_content(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client

    response = await client.post(
        f"/applications/{uuid.uuid4()}/notes",
        json={"content": ""},
        headers=auth_headers,
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_note_app_not_found(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    mock_repo.get_by_id.return_value = None

    response = await client.post(
        f"/applications/{uuid.uuid4()}/notes",
        json={"content": "Some note"},
        headers=auth_headers,
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_note_happy_path(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    mock_repo.delete_note.return_value = True

    response = await client.delete(
        f"/applications/{uuid.uuid4()}/notes/{uuid.uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 204
    assert response.content == b""


@pytest.mark.asyncio
async def test_delete_note_not_found(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
) -> None:
    client, mock_repo, auth_headers = authenticated_client
    mock_repo.delete_note.return_value = False

    response = await client.delete(
        f"/applications/{uuid.uuid4()}/notes/{uuid.uuid4()}",
        headers=auth_headers,
    )

    assert response.status_code == 404


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "method,path_template",
    [
        ("GET", "/applications/{app_id}/notes"),
        ("POST", "/applications/{app_id}/notes"),
        ("DELETE", "/applications/{app_id}/notes/{note_id}"),
    ],
)
async def test_all_note_endpoints_require_auth(
    authenticated_client: tuple[AsyncClient, AsyncMock, dict],
    method: str,
    path_template: str,
) -> None:
    client, _, _ = authenticated_client
    path = path_template.format(app_id=uuid.uuid4(), note_id=uuid.uuid4())

    response = await client.request(method, path)

    assert response.status_code == 401
