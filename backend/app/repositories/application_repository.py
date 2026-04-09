import logging
from typing import Any

from supabase import Client

from app.core.exceptions import DomainException
from app.models.application import (
    Application,
    ApplicationCreate,
    ApplicationNote,
    ApplicationNoteCreate,
    ApplicationUpdate,
)

logger = logging.getLogger(__name__)


class ApplicationRepository:
    """Repository for applications and notes.

    Uses the service-role key (bypasses RLS).
    EVERY method MUST filter by user_id explicitly.
    """

    def __init__(self, client: Client) -> None:
        self._client = client

    def _to_application(self, data: dict[str, Any]) -> Application:
        return Application(**data)

    def _to_note(self, data: dict[str, Any]) -> ApplicationNote:
        return ApplicationNote(**data)

    async def list_by_user(
        self, user_id: str, limit: int, offset: int
    ) -> tuple[list[Application], int]:
        try:
            response = (
                self._client.table("applications")
                .select("*", count="exact")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .range(offset, offset + limit - 1)
                .execute()
            )
            items = [self._to_application(r) for r in response.data]
            return items, response.count or 0
        except Exception as exc:
            logger.error("list_by_user failed", extra={"user_id": user_id}, exc_info=exc)
            raise DomainException(detail="Database error", status_code=500) from exc

    async def create(self, user_id: str, data: ApplicationCreate) -> Application:
        try:
            response = (
                self._client.table("applications")
                .insert({"user_id": user_id, "url": data.url})
                .execute()
            )
            return self._to_application(response.data[0])
        except Exception as exc:
            logger.error("create failed", extra={"user_id": user_id}, exc_info=exc)
            raise DomainException(detail="Database error", status_code=500) from exc

    async def get_by_id(self, application_id: str, user_id: str) -> Application | None:
        try:
            response = (
                self._client.table("applications")
                .select("*")
                .eq("id", application_id)
                .eq("user_id", user_id)
                .maybe_single()
                .execute()
            )
            return self._to_application(response.data) if response.data else None
        except Exception as exc:
            logger.error(
                "get_by_id failed",
                extra={"user_id": user_id, "application_id": application_id},
                exc_info=exc,
            )
            raise DomainException(detail="Database error", status_code=500) from exc

    async def update(
        self, application_id: str, user_id: str, data: ApplicationUpdate
    ) -> Application | None:
        try:
            changes = data.model_dump(exclude_unset=True)
            if not changes:
                return await self.get_by_id(application_id, user_id)
            response = (
                self._client.table("applications")
                .update(changes)
                .eq("id", application_id)
                .eq("user_id", user_id)
                .execute()
            )
            if response.data:
                return self._to_application(response.data[0])
            # Supabase returned no rows — verify whether the app exists at all
            return await self.get_by_id(application_id, user_id)
        except Exception as exc:
            logger.error(
                "update failed",
                extra={"user_id": user_id, "application_id": application_id},
                exc_info=exc,
            )
            raise DomainException(detail="Database error", status_code=500) from exc

    async def delete(self, application_id: str, user_id: str) -> bool:
        try:
            response = (
                self._client.table("applications")
                .delete()
                .eq("id", application_id)
                .eq("user_id", user_id)
                .execute()
            )
            return len(response.data) > 0
        except Exception as exc:
            logger.error(
                "delete failed",
                extra={"user_id": user_id, "application_id": application_id},
                exc_info=exc,
            )
            raise DomainException(detail="Database error", status_code=500) from exc

    async def list_notes(self, application_id: str, user_id: str) -> list[ApplicationNote]:
        try:
            response = (
                self._client.table("application_notes")
                .select("*")
                .eq("application_id", application_id)
                .eq("user_id", user_id)
                .order("created_at", desc=False)
                .execute()
            )
            return [self._to_note(r) for r in response.data]
        except Exception as exc:
            logger.error(
                "list_notes failed",
                extra={"user_id": user_id, "application_id": application_id},
                exc_info=exc,
            )
            raise DomainException(detail="Database error", status_code=500) from exc

    async def create_note(
        self, application_id: str, user_id: str, data: ApplicationNoteCreate
    ) -> ApplicationNote:
        try:
            response = (
                self._client.table("application_notes")
                .insert(
                    {
                        "application_id": application_id,
                        "user_id": user_id,
                        "content": data.content,
                    }
                )
                .execute()
            )
            return self._to_note(response.data[0])
        except Exception as exc:
            logger.error(
                "create_note failed",
                extra={"user_id": user_id, "application_id": application_id},
                exc_info=exc,
            )
            raise DomainException(detail="Database error", status_code=500) from exc

    async def delete_note(
        self, note_id: str, application_id: str, user_id: str
    ) -> bool:
        try:
            response = (
                self._client.table("application_notes")
                .delete()
                .eq("id", note_id)
                .eq("application_id", application_id)
                .eq("user_id", user_id)
                .execute()
            )
            return len(response.data) > 0
        except Exception as exc:
            logger.error(
                "delete_note failed",
                extra={"user_id": user_id, "note_id": note_id},
                exc_info=exc,
            )
            raise DomainException(detail="Database error", status_code=500) from exc
