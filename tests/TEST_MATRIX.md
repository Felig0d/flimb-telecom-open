# Native Beta Test Matrix

Use synthetic identities and isolated balances.

## Basic signaling

- normal INVITE / 200 / ACK / BYE
- CANCEL before answer
- 4xx / 5xx upstream failure
- 200 OK retransmission
- delayed ACK
- lost ACK
- re-INVITE inside an established dialog

## Charging lifecycle

- authorization allowed
- authorization denied
- one successful dialog creates one charging session
- normal BYE closes the charging session
- repeated SIP messages do not duplicate charging
- zero balance triggers expected fail-closed/disconnect behavior
- two concurrent calls against the same synthetic prepaid account

## Failure cases

- CGRateS unavailable before authorization
- CGRateS response timeout
- upstream timeout
- OpenSIPS restart
- CGRateS restart
- connection interruption between OpenSIPS and CGRateS

## Acceptance signals

- no orphan charging sessions
- no duplicate sessions
- no negative prepaid balance
- no open CDR after a definitively failed attempt
- failed monitoring must not be treated as proof that a dialog is absent
