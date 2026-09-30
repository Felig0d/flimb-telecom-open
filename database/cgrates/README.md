# CGRateS storage

CGRateS owns charging runtime and charging persistence.

## StorDB

PostgreSQL database: `cgrates`

Use the schema/migration tooling from the selected CGRateS build.

## DataDB

Dedicated Redis instance/database.

Do not share the CGRateS Redis namespace with generic application cache.

## Rule

ODIN may consume normalized charging results through supported APIs/adapters for reporting and Revenue Assurance, but it must not become a second writer of native CGRateS session state.
