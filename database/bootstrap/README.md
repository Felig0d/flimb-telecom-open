# DEV database bootstrap

The platform keeps separate logical databases even when they share one PostgreSQL cluster.

Recommended DEV databases:

- `authentik`
- `flimb_central`
- `odin`
- `opensips`
- `cgrates`

Each service should have a dedicated login role and should not receive ownership or write privileges in another domain database.

Use service-native schema installers for Authentik, OpenSIPS and CGRateS. Use the ODIN migrations under `database/odin/` for the ODIN-owned schema.
