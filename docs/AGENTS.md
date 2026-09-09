# Ventura V2 Agents Architecture

Ventura V2 is built around a robust, layered agentic architecture. 
Each agent represents a specific capability or role, isolated from other agents, and executes within a resilient retry loop.

## Core Hierarchy
- **BaseAgent**: Provides retry logic, schema validation (Zod), and LLM interaction.
- **Specialized Agents**: Inherit from BaseAgent (e.g., `ChiefResearchOfficerAgent`, `PlannerAgent`, `DataExtractionAgent`).

## Execution Flow
1. **Planning**: CRO and Planner define the scope.
2. **Gathering**: Multiple agents gather data concurrently from distinct sources.
3. **Analysis**: Ratios, Financials, and Valuations are executed simultaneously.
4. **Synthesis & Critic Loop**: ChiefWriter produces a draft, and CriticAgent provides structured feedback in a loop. Editor applies the changes.
5. **Formatting**: PDF generation powered by Python.

## Principles
- **Schema strictness**: If an agent fails to match its Zod schema, the BaseAgent triggers an immediate retry.
- **No Hallucination**: Agents like DataExtractionAgent are instructed to return `null` instead of guessing financial data if extraction fails.
- **Resilience**: A single agent's failure does not crash the pipeline. StateManager handles `null` results gracefully.
