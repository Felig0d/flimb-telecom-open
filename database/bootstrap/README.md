# DEV database bootstrap

The platform keeps separate logical databases even when they share one PostgreSQL cluster.

Recommended DEV databases:

- `authentik`
- `flimb_central`
- `odin`
- `opensips`
- `cgrates`
- `analytics`

Each service receives a dedicated login role and must not write into another domain database.

Use service-native schema installers for Authentik, OpenSIPS and CGRateS.

Repository-owned migrations:

- ODIN: `database/odin/`
- Analytics projection: `database/analytics/`

The bootstrap script creates databases/roles and applies the repository-owned initial schemas. Passwords come only from local environment variables.
