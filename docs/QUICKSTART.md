# Quickstart

This guide intentionally avoids production addresses, credentials and topology.

## 1. Install OpenSIPS 3.6.9 LTS

Use the official OpenSIPS repository for your distribution and install at minimum:

- OpenSIPS 3.6.x
- dialog
- TM / RR / SL / MAXFWD / XLOG
- CGRateS module
- optional drouting + selected DB driver

Verify the installed version before continuing.

## 2. Install CGRateS

Install a CGRateS build compatible with the OpenSIPS cgrates module.

Start CGRateS before OpenSIPS because the OpenSIPS connector establishes engine connections during runtime.

## 3. Prepare isolated configuration

Use local copies of:

```text
cgrates/config/10-native-beta.json
opensips/opensips.cfg.example
```

Keep them outside production. The examples bind CGRateS RPC endpoints to loopback and route SIP toward a synthetic loopback upstream.

## 4. Validate

Run:

```bash
./scripts/preflight.sh
./scripts/public-safety-check.sh
```

Then run the native syntax/config validation commands supplied by your installed OpenSIPS and CGRateS packages.

## 5. Test

Execute the scenarios in `tests/TEST_MATRIX.md`.

Do not add application-side financial lifecycle logic merely to make a test pass. If a native limitation is found, document it first.
