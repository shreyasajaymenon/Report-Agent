# Ventura V2 Security & Configuration

## Secrets Management
All API keys must reside strictly in `.env`.
The application fails securely if keys are not present.

## Dependency Security
- Do not run untrusted scripts.
- Only safe npm packages are permitted.
- `report_data.json` avoids SQL injection since it's locally generated text.

## Prompt Isolation
User inputs are treated strictly as contextual strings. The underlying logic uses strongly-typed Zod schemas to guarantee outputs, avoiding prompt-injection attacks breaking internal state.
