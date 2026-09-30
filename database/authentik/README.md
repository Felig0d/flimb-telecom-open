# Authentik database boundary

Authentik is the identity authority.

Use a dedicated PostgreSQL database and Authentik's native migrations.

Applications must not write Authentik tables directly.

ODIN and Central integrate through OIDC and stable identity claims/references rather than shared database access.
