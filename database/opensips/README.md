# OpenSIPS database

OpenSIPS owns its native SIP runtime/configuration schema.

Use PostgreSQL and the schema tooling shipped with OpenSIPS 3.6.x.

Typical data may include:

- trusted peers / permissions
- dynamic routing tables
- gateway definitions
- optional registrar/usrloc persistence
- module-specific configuration

ODIN provisions OpenSIPS through a controlled adapter/API or validated provisioning job. Other products must not write OpenSIPS tables directly.

Do not create parallel ODIN copies of dialog state or transaction state.
