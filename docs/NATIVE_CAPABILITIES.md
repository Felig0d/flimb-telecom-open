# Native capability map

## OpenSIPS

Prefer native modules for:

- transaction handling and retransmissions: TM
- dialog lifecycle: dialog
- Record-Route / in-dialog signaling: RR
- gateway selection and failover: drouting or dispatcher
- CGRateS authorization/accounting: cgrates
- SIP accounting where useful: acc

## CGRateS

Prefer native subsystems for:

- authorization
- SessionS lifecycle
- RALs / rating and balances
- periodic prepaid debit
- postpaid charging
- stored session costs
- CDR generation
- disconnect toward a bidirectionally connected SIP agent
- future session replication / HA experiments

## Application layer

Keep application logic outside the real-time lifecycle:

- provisioning
- commercial catalog
- reporting
- reconciliation / RA
- dashboards

Monitoring is an independent observer, not a second session-state authority.
