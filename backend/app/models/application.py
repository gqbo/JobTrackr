from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ApplicationStatus(str, Enum):
    bookmarked = "bookmarked"
    applied = "applied"
    interviewing = "interviewing"
    accepted = "accepted"
    rejected = "rejected"
    ghosted = "ghosted"


class ApplicationModality(str, Enum):
    remote = "remote"
    hybrid = "hybrid"
    on_site = "on_site"


class Application(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    url: str
    company: str | None = None
    role: str | None = None
    status: ApplicationStatus
    modality: ApplicationModality | None = None
    location: str | None = None
    salary: str | None = None
    source: str | None = None
    created_at: datetime
    updated_at: datetime


class ApplicationCreate(BaseModel):
    url: str = Field(..., min_length=1)


class ApplicationUpdate(BaseModel):
    url: str | None = Field(default=None, min_length=1)
    company: str | None = None
    role: str | None = None
    status: ApplicationStatus | None = None
    modality: ApplicationModality | None = None
    location: str | None = None
    salary: str | None = None
    source: str | None = None


class PaginatedApplications(BaseModel):
    items: list[Application]
    total: int
    limit: int
    offset: int


class ApplicationNote(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    application_id: UUID
    user_id: UUID
    content: str
    created_at: datetime


class ApplicationNoteCreate(BaseModel):
    content: str = Field(..., min_length=1)
