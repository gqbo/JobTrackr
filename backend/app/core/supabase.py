"""Supabase client factory.

WARNING: Uses the service-role key which bypasses Row Level Security.
The repository layer MUST filter by user_id in every query.
"""

from functools import lru_cache

from supabase import Client, create_client

from app.core.config import Settings


@lru_cache(maxsize=1)
def _cached_client(supabase_url: str, supabase_service_role_key: str) -> Client:
    return create_client(supabase_url, supabase_service_role_key)


def get_supabase_client(settings: Settings) -> Client:
    """Return a cached supabase-py Client using the service-role key.

    NOT a FastAPI dependency — called by repository factory functions only.
    Client is created once and reused across requests.
    """
    return _cached_client(settings.supabase_url, settings.supabase_service_role_key)
