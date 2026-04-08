from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import DomainException
from app.models.common import ErrorResponse


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(DomainException)
    async def domain_exception_handler(
        request: Request, exc: DomainException
    ) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(
                detail=exc.detail,
                status_code=exc.status_code,
            ).model_dump(),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        # Log the real error here in production (future: structured logging)
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                detail="Internal server error",
                status_code=500,
            ).model_dump(),
        )
