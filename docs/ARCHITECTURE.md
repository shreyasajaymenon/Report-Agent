# Ventura V2 System Architecture

Ventura V2 transitions from a monolithic script to a modular, production-ready system.

## Directory Structure
- `src/core/`: Contains `BaseAgent` and `StateManager`.
- `src/agents/`: Individual agent implementations.
- `src/orchestration/`: `orchestrator.js` manages execution flow.
- `src/llm/`: Centralized `LLMClient` with Mock Mode.
- `src/retrieval/`: Search and fetch utilities.
- `src/validation/`: Strict Zod schemas.
- `src/evidence/`: In-memory evidence store and citation tracking.
- `src/telemetry/`: Observability and metrics.
- `src/config/`: Centralized configuration manager.
- `src/reporting/`: Python PDF generator.

## Key Improvements in V2
- **Centralized Configuration**: Environment variables and CLI arguments are resolved in `ConfigManager`.
- **Mock Mode**: Deterministic execution for CI/CD and demonstrations.
- **Zod Validation**: State is validated before final handoff.
- **Strict Critic Loop**: Critic outputs JSON, and Editor strictly follows the structured feedback.
