# Ventura V2 Observability & Telemetry

## Telemetry Tracker
The `TelemetryTracker` records execution metrics for every agent.

Metrics captured:
- `startTime`, `endTime`, `durationMs`
- `status` (success, failed)
- `retries`
- `error` messages
- `tokenUsage` (prompt, completion, total)

## Evidence Store
All facts extracted by agents are stored in the `EvidenceStore`. 
This allows tracing any claim in the final report back to its source URL and extracting agent.

## Outputs
- `ventura_run_telemetry.json`: Contains the full pipeline state, errors, and telemetry metadata.
