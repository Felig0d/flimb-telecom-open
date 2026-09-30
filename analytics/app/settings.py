from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    analytics_database_url: str = "postgresql://analytics_reader:change-me@127.0.0.1:5433/analytics"
    analytics_write_database_url: str = "postgresql://analytics_app:change-me@127.0.0.1:5432/analytics"
    analytics_api_host: str = "127.0.0.1"
    analytics_api_port: int = 8086
    analytics_max_page_size: int = 500
    nats_url: str = "nats://127.0.0.1:4222"
    nats_cdr_subject: str = "telecom.cdr.closed.v1"
    nats_cdr_durable: str = "odin-analytics-cdr-v1"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
