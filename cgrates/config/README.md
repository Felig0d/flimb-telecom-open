# CGRateS beta configuration

`10-native-beta.json` is a small public overlay intended for an isolated test environment.

It enables:

- JSON-RPC on loopback
- bidirectional JSON-RPC on loopback
- RALs
- CDRs
- SessionS
- 5 second prepaid debit interval
- stored session costs

It intentionally keeps `session_ttl` and `channel_sync_interval` disabled for the first phase. Enable them only after the SIP-side liveness contract is proven.

CGRateS can load configuration from multiple JSON files in one directory, so this file is intended as an overlay rather than a complete production configuration.
