# Native Beta Test Matrix

Use synthetic identities, isolated balances and non-production destinations.

## Signaling

- normal INVITE / 200 / ACK / BYE
- CANCEL before answer
- upstream 4xx / 5xx
- upstream timeout
- 200 OK retransmission
- delayed ACK
- lost ACK
- re-INVITE inside an established dialog
- duplicate BYE
- serial gateway failover
- losing branch never becomes the billed winner

## Charging lifecycle

- prepaid authorization allowed
- prepaid authorization denied
- postpaid classification
- one successful dialog creates one charging session
- normal BYE closes the charging session
- retransmissions do not duplicate charging
- zero balance triggers native disconnect behavior
- two concurrent calls against one synthetic prepaid account
- CDR emitted once per completed billing session

## Failure injection

- CGRateS unavailable before authorization
- CGRateS reply timeout
- OpenSIPS <-> CGRateS connection loss
- OpenSIPS restart
- CGRateS restart
- upstream gateway failure before answer
- upstream gateway failure after answer
- failed monitoring with otherwise healthy call

## Routing

- route found
- no route found
- first gateway unavailable, second gateway selected
- gateway recovery
- route reload does not affect established dialog

## Acceptance

- no orphan charging sessions
- no duplicate charging sessions
- no negative prepaid balance
- no definitively failed attempt left open
- BYE/dialog end closes accounting without an application-side state machine
- financial failure is fail-closed
- monitoring failure alone does not invent SIP state
