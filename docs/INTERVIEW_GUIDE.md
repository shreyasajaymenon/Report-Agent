# Ventura V2 Interview Guide

## Key Talking Points
1. **Agentic Design**: Discuss the transition from monolithic prompts to specialized agents with distinct Zod schemas and isolated failure boundaries.
2. **Resilience**: Explain the retry loops, rate-limit backoffs, and strict failure handling in `BaseAgent` and `StateManager`.
3. **Determinism (Mock Mode)**: Detail how the system uses deterministic JSON mocks for CI/CD pipelines to ensure reliability without API cost.
4. **Data Verification**: Highlight the `EvidenceStore` and the requirement for `DataExtractionAgent` to output `null` instead of fabricating data.
5. **Observability**: Point out `TelemetryTracker` which records tokens, latencies, and agent success rates.

## Demonstration Steps
1. Run `npm run demo` to show the fully deterministic mock run.
2. Show `ventura_run_telemetry.json` to prove structured state validation.
3. Show `report_data.json` and the final PDF output.
4. Run `npm test` and `node evaluation/evaluators/evaluate.js` to prove CI/CD readiness.
