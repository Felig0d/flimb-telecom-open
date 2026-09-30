from contextlib import asynccontextmanager

from psycopg_pool import AsyncConnectionPool

from .settings import settings


pool = AsyncConnectionPool(
    conninfo=settings.analytics_database_url,
    min_size=1,
    max_size=8,
    open=False,
)


async def open_pool() -> None:
    await pool.open()


async def close_pool() -> None:
    await pool.close()


@asynccontextmanager
async def connection():
    async with pool.connection() as conn:
        yield conn
