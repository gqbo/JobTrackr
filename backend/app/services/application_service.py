import logging

from app.core.exceptions import NotFoundException
from app.models.application import (
    Application,
    ApplicationCreate,
    ApplicationNote,
    ApplicationNoteCreate,
    ApplicationUpdate,
    PaginatedApplications,
)
from app.repositories.application_repository import ApplicationRepository

logger = logging.getLogger(__name__)


class ApplicationService:
    def __init__(self, repository: ApplicationRepository) -> None:
        self._repository = repository

    async def list_applications(
        self, user_id: str, limit: int = 20, offset: int = 0
    ) -> PaginatedApplications:
        limit = max(1, min(limit, 100))
        offset = max(0, offset)
        logger.debug("list_applications", extra={"user_id": user_id, "limit": limit, "offset": offset})
        items, total = await self._repository.list_by_user(user_id, limit=limit, offset=offset)
        return PaginatedApplications(items=items, total=total, limit=limit, offset=offset)

    async def create_application(
        self, user_id: str, data: ApplicationCreate
    ) -> Application:
        logger.debug("create_application", extra={"user_id": user_id})
        return await self._repository.create(user_id, data)

    async def get_application(self, user_id: str, application_id: str) -> Application:
        logger.debug("get_application", extra={"user_id": user_id, "application_id": application_id})
        app = await self._repository.get_by_id(application_id, user_id)
        if app is None:
            raise NotFoundException("Application not found")
        return app

    async def update_application(
        self, user_id: str, application_id: str, data: ApplicationUpdate
    ) -> Application:
        logger.debug("update_application", extra={"user_id": user_id, "application_id": application_id})
        app = await self._repository.update(application_id, user_id, data)
        if app is None:
            raise NotFoundException("Application not found")
        return app

    async def delete_application(self, user_id: str, application_id: str) -> None:
        logger.debug("delete_application", extra={"user_id": user_id, "application_id": application_id})
        deleted = await self._repository.delete(application_id, user_id)
        if not deleted:
            raise NotFoundException("Application not found")

    async def list_notes(self, user_id: str, application_id: str) -> list[ApplicationNote]:
        logger.debug("list_notes", extra={"user_id": user_id, "application_id": application_id})
        app = await self._repository.get_by_id(application_id, user_id)
        if app is None:
            raise NotFoundException("Application not found")
        return await self._repository.list_notes(application_id, user_id)

    async def create_note(
        self, user_id: str, application_id: str, data: ApplicationNoteCreate
    ) -> ApplicationNote:
        logger.debug("create_note", extra={"user_id": user_id, "application_id": application_id})
        app = await self._repository.get_by_id(application_id, user_id)
        if app is None:
            raise NotFoundException("Application not found")
        return await self._repository.create_note(application_id, user_id, data)

    async def delete_note(
        self, user_id: str, application_id: str, note_id: str
    ) -> None:
        logger.debug("delete_note", extra={"user_id": user_id, "note_id": note_id})
        deleted = await self._repository.delete_note(note_id, application_id, user_id)
        if not deleted:
            raise NotFoundException("Note not found")
