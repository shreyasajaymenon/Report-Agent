# Ventura V2 Evaluation Strategy

We employ a strict, automated evaluation framework to ensure Ventura V2's performance does not regress.

## Heuristics Measured
- **Pipeline Latency**: Measures execution speed.
- **Agent Success Rate**: Percentage of agents that completed successfully without exhausting retries.
- **Retry Rate**: Number of transient errors (Rate Limits, Model Downtime) handled.
- **Completeness**: Checks if critical sections (`financial`, `risk`, etc.) are present in the final state.
- **Citations**: Minimum required citations to prove fact-checking.

## Golden Dataset
Located in `evaluation/datasets/mock_dataset.json`. 
It defines the baseline metrics expected during a mock run.

## CI/CD Integration
GitHub Actions runs `npm run demo` and `node evaluation/evaluators/evaluate.js` on every PR.
