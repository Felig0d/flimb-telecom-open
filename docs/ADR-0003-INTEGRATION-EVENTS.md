# ADR-0003 — Control-plane integration

Status: Accepted for DEV/Beta.

## Decision

Use two integration styles:

- HTTP APIs for immediate request/response operations.
- NATS JetStream for durable asynchronous domain/provisioning events.

The event bus is not part of the SIP/charging real-time critical path.

## Example event classes

- organization/product activation
- technical provisioning requested/completed
- suspension/reactivation
- plan change
- recharge notification
- role/access change

## Reliability

Use idempotent consumers and an outbox pattern where a domain write and event publication must be coordinated.

A Central, ODIN API or NATS outage must not prevent an already admitted SIP dialog from terminating correctly.
