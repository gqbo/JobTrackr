import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock

import pytest

from app.core.exceptions import NotFoundException
from app.models.application import (
    Application,
    ApplicationCreate,
    ApplicationModality,
    ApplicationNote,
    ApplicationNoteCreate,
    ApplicationStatus,
    ApplicationUpdate,
    PaginatedApplications,
)
from app.services.application_service import ApplicationService


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


def make_note(**kwargs) -> ApplicationNote:
    defaults = dict(
        id=uuid.uuid4(),
        application_id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        content="Test note content",
        created_at=datetime.now(timezone.utc),
    )
    defaults.update(kwargs)
    return ApplicationNote(**defaults)


@pytest.mark.asyncio
async def test_list_applications_returns_paginated() -> None:
    repo = AsyncMock()
    app1 = make_application()
    repo.list_by_user.return_value = ([app1], 5)

    service = ApplicationService(repo)
    result = await service.list_applications("user-123", limit=20, offset=0)

    assert isinstance(result, PaginatedApplications)
    assert result.total == 5
    assert result.limit == 20
    assert result.offset == 0
    assert len(result.items) == 1


@pytest.mark.asyncio
async def test_list_applications_clamps_limit_high() -> None:
    repo = AsyncMock()
    repo.list_by_user.return_value = ([], 0)

    service = ApplicationService(repo)
    await service.list_applications("user-123", limit=500, offset=0)

    repo.list_by_user.assert_called_once_with("user-123", limit=100, offset=0)


@pytest.mark.asyncio
async def test_list_applications_clamps_limit_low() -> None:
    repo = AsyncMock()
    repo.list_by_user.return_value = ([], 0)

    service = ApplicationService(repo)
    await service.list_applications("user-123", limit=0, offset=0)

    repo.list_by_user.assert_called_once_with("user-123", limit=1, offset=0)


@pytest.mark.asyncio
async def test_list_applications_clamps_negative_offset() -> None:
    repo = AsyncMock()
    repo.list_by_user.return_value = ([], 0)

    service = ApplicationService(repo)
    await service.list_applications("user-123", limit=20, offset=-5)

    repo.list_by_user.assert_called_once_with("user-123", limit=20, offset=0)


@pytest.mark.asyncio
async def test_get_application_returns_app() -> None:
    repo = AsyncMock()
    app = make_application()
    repo.get_by_id.return_value = app

    service = ApplicationService(repo)
    result = await service.get_application("user-123", str(app.id))

    assert result == app


@pytest.mark.asyncio
async def test_get_application_not_found_raises() -> None:
    repo = AsyncMock()
    repo.get_by_id.return_value = None

    service = ApplicationService(repo)
    with pytest.raises(NotFoundException):
        await service.get_application("user-123", str(uuid.uuid4()))


@pytest.mark.asyncio
async def test_update_application_not_found_raises() -> None:
    repo = AsyncMock()
    repo.update.return_value = None

    service = ApplicationService(repo)
    with pytest.raises(NotFoundException):
        await service.update_application(
            "user-123", str(uuid.uuid4()), ApplicationUpdate(status=ApplicationStatus.applied)
        )


@pytest.mark.asyncio
async def test_delete_application_success() -> None:
    repo = AsyncMock()
    repo.delete.return_value = True

    service = ApplicationService(repo)
    await service.delete_application("user-123", str(uuid.uuid4()))

    repo.delete.assert_called_once()


@pytest.mark.asyncio
async def test_delete_application_not_found_raises() -> None:
    repo = AsyncMock()
    repo.delete.return_value = False

    service = ApplicationService(repo)
    with pytest.raises(NotFoundException):
        await service.delete_application("user-123", str(uuid.uuid4()))


@pytest.mark.asyncio
async def test_list_notes_app_not_found_raises() -> None:
    repo = AsyncMock()
    repo.get_by_id.return_value = None

    service = ApplicationService(repo)
    with pytest.raises(NotFoundException):
        await service.list_notes("user-123", str(uuid.uuid4()))


@pytest.mark.asyncio
async def test_create_note_app_not_found_raises() -> None:
    repo = AsyncMock()
    repo.get_by_id.return_value = None

    service = ApplicationService(repo)
    with pytest.raises(NotFoundException):
        await service.create_note(
            "user-123", str(uuid.uuid4()), ApplicationNoteCreate(content="hi")
        )


@pytest.mark.asyncio
async def test_delete_note_not_found_raises() -> None:
    repo = AsyncMock()
    repo.delete_note.return_value = False

    service = ApplicationService(repo)
    with pytest.raises(NotFoundException):
        await service.delete_note("user-123", str(uuid.uuid4()), str(uuid.uuid4()))
