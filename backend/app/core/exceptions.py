class DomainException(Exception):
    """Base class for all domain/business logic exceptions."""

    def __init__(self, detail: str, status_code: int = 400) -> None:
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class NotFoundException(DomainException):
    """Resource not found."""

    def __init__(self, detail: str = "Resource not found") -> None:
        super().__init__(detail=detail, status_code=404)


class ConflictException(DomainException):
    """Duplicate or conflicting resource."""

    def __init__(self, detail: str = "Resource already exists") -> None:
        super().__init__(detail=detail, status_code=409)


class ForbiddenException(DomainException):
    """User lacks permission."""

    def __init__(self, detail: str = "Forbidden") -> None:
        super().__init__(detail=detail, status_code=403)
