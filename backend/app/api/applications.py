from uuid import UUID

from fastapi import APIRouter, Response

from app.core.dependencies import ApplicationServiceDep, CurrentUserDep
from app.models.application import (
    Application,
    ApplicationCreate,
    ApplicationNote,
    ApplicationNoteCreate,
    ApplicationUpdate,
    PaginatedApplications,
)

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("", response_model=PaginatedApplications)
async def list_applications(
    user: CurrentUserDep,
    service: ApplicationServiceDep,
    limit: int = 20,
    offset: int = 0,
) -> PaginatedApplications:
    return await service.list_applications(user.user_id, limit=limit, offset=offset)


@router.post("", response_model=Application, status_code=201)
async def create_application(
    user: CurrentUserDep,
    service: ApplicationServiceDep,
    data: ApplicationCreate,
) -> Application:
    return await service.create_application(user.user_id, data)


@router.get("/{application_id}", response_model=Application)
async def get_application(
    application_id: UUID,
    user: CurrentUserDep,
    service: ApplicationServiceDep,
) -> Application:
    return await service.get_application(user.user_id, str(application_id))


@router.patch("/{application_id}", response_model=Application)
async def update_application(
    application_id: UUID,
    user: CurrentUserDep,
    service: ApplicationServiceDep,
    data: ApplicationUpdate,
) -> Application:
    return await service.update_application(user.user_id, str(application_id), data)


@router.delete("/{application_id}", status_code=204, response_class=Response)
async def delete_application(
    application_id: UUID,
    user: CurrentUserDep,
    service: ApplicationServiceDep,
) -> Response:
    await service.delete_application(user.user_id, str(application_id))
    return Response(status_code=204)


@router.get("/{application_id}/notes", response_model=list[ApplicationNote])
async def list_notes(
    application_id: UUID,
    user: CurrentUserDep,
    service: ApplicationServiceDep,
) -> list[ApplicationNote]:
    return await service.list_notes(user.user_id, str(application_id))


@router.post("/{application_id}/notes", response_model=ApplicationNote, status_code=201)
async def create_note(
    application_id: UUID,
    user: CurrentUserDep,
    service: ApplicationServiceDep,
    data: ApplicationNoteCreate,
) -> ApplicationNote:
    return await service.create_note(user.user_id, str(application_id), data)


@router.delete(
    "/{application_id}/notes/{note_id}", status_code=204, response_class=Response
)
async def delete_note(
    application_id: UUID,
    note_id: UUID,
    user: CurrentUserDep,
    service: ApplicationServiceDep,
) -> Response:
    await service.delete_note(user.user_id, str(application_id), str(note_id))
    return Response(status_code=204)
