# Ventura V2 - Production-Grade Multi-Agent AI Equity Research System

Ventura V2 is a sophisticated multi-agent system designed to autonomously gather, analyze, and synthesize institutional-grade equity research reports using Large Language Models.

## Features
- **Concurrent Specialized Agents**: Over 20 distinct agents running concurrently in phases (Discovery, Analytics, Synthesis).
- **Strict Schema Validation**: Zod-based output validation prevents hallucinations.
- **Evidence & Citation Tracking**: Facts are anchored to source URLs.
- **Resilient Pipeline**: Graceful failure handling and automatic retry loops.
- **Mock Mode / CI-Ready**: Fully deterministic Mock Mode for automated testing.
- **Python PDF Generation**: Automated formatting and chart plotting.

## Getting Started

1. Install Node and Python dependencies.
2. Create `.env` (Optional if using Mock Mode).
3. Run `npm run demo` to execute the mock pipeline.
4. Run `npm run test` and `npm run research` for live API usage.
