# Ventura V2 — Multi-Agent AI Equity Research System

> A production-oriented multi-agent AI system that autonomously researches companies, analyzes financial and market information, validates evidence, and generates structured equity research reports.

Ventura V2 is designed as an end-to-end AI research pipeline, rather than a single LLM prompt. It coordinates 20+ specialized agents through a phased orchestration architecture to transform raw company information into a structured, evidence-backed equity research report.

---

## 🚀 What Ventura V2 Does

Given a target company, Ventura V2 coordinates multiple specialized AI agents to:

1. Discover relevant company and market information
2. Retrieve financial, industry, and company-specific data
3. Analyze financial performance and key ratios
4. Evaluate competitors and industry conditions
5. Analyze management, governance, and business risks
6. Perform valuation analysis
7. Verify extracted claims against evidence
8. Synthesize findings from multiple agents
9. Generate a structured equity research report
10. Produce a formatted PDF with charts and supporting analysis

The result is an automated research workflow designed to reduce repetitive manual research while maintaining traceability between conclusions and their underlying evidence.

---

## 🧠 System Architecture

Ventura V2 uses a multi-agent, phased orchestration architecture.

```text
                         USER / COMPANY
                                  │
                                  ▼
                         ┌───────────────────┐
                         │   Planner Agent   │
                         └─────────┬─────────┘
                                   │
                                   ▼
                   ┌──────────────────────────────┐
                   │       DISCOVERY PHASE        │
                   │                              │
                   │ Company IR     NSE Agent     │
                   │ BSE Agent      Industry      │
                   │ Competition    Transcripts   │
                   │ Annual Reports Quarterly     │
                   └───────────────┬──────────────┘
                                   │
                                   ▼
                   ┌──────────────────────────────┐
                   │       ANALYTICS PHASE        │
                   │                              │
                   │ Financials     Ratios         │
                   │ Valuation      Risk           │
                   │ Governance     Industry       │
                   └───────────────┬──────────────┘
                                   │
                                   ▼
                   ┌──────────────────────────────┐
                   │      VERIFICATION PHASE      │
                   │                              │
                   │ Evidence Extraction          │
                   │ Source Verification          │
                   │ Claim Validation              │
                   └───────────────┬──────────────┘
                                   │
                                   ▼
                   ┌──────────────────────────────┐
                   │       SYNTHESIS PHASE        │
                   │                              │
                   │ Chief Research Officer       │
                   │ Writer                       │
                   │ Critic                       │
                   │ Editor                       │
                   │ Investment Committee         │
                   └───────────────┬──────────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ Report Formatter  │
                         │ + Chart Generator │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         📄 FINAL RESEARCH REPORT
```

---

## 🤖 Multi-Agent Architecture

Ventura V2 separates responsibilities across specialized agents instead of relying on one general-purpose LLM call.

### Research & Discovery

- `DiscoveryAgent`
- `CompanyIRAgent`
- `NSEAgent`
- `BSEAgent`
- `AnnualReportAgent`
- `QuarterlyAgent`
- `TranscriptAgent`
- `IndustryAgent`
- `CompetitionAgent`

### Financial Analysis

- `FinancialsAgent`
- `FinancialEngine`
- `RatioEngine`
- `ValuationAgent`
- `RiskAgent`
- `GovernanceAgent`

### Synthesis & Quality

- `ChiefResearchOfficerAgent`
- `WriterAgent`
- `ChiefWriter`
- `CriticAgent`
- `Editor`
- `VerificationAgent`
- `InvestmentCommittee`

### Presentation

- `Formatter`
- `PresentationAgent`

This separation allows individual components to be tested, replaced, and improved without redesigning the entire pipeline.

---

## ✨ Key Engineering Features

### 🔀 Concurrent Agent Orchestration

Independent research tasks can execute concurrently within defined phases, reducing unnecessary sequential operations and allowing specialized agents to work independently.

### 🛡️ Schema Validation

Agent outputs are validated using Zod schemas before being passed further through the pipeline.

This catches malformed or schema-invalid responses before they propagate to downstream agents.

```text
LLM Output
    │
    ▼
Schema Validation
    │
 ┌──┴──────┐
 │         │
Valid    Invalid
 │         │
 ▼         ▼
Next     Retry /
Agent    Failure Handling
```

### 🔎 Evidence & Citation Tracking

Research claims are associated with supporting source information.

Instead of treating an LLM response as an unquestioned source of truth, Ventura maintains an evidence-oriented workflow in which extracted facts can be traced back to their originating sources.

### ♻️ Resilient Pipeline

The pipeline includes:

- Retry mechanisms
- Graceful failure handling
- Validation checkpoints
- Agent-level isolation
- Recovery from unsuccessful model responses

A failure in one component should not unnecessarily bring down the entire research workflow.

### 🧪 Deterministic Mock Mode

Ventura V2 includes a Mock Mode designed for:

- Local development
- Automated testing
- CI pipelines
- Reproducible demonstrations
- Testing without live API calls

This allows the orchestration layer to be tested independently of external LLM providers.

### 📊 Automated Report Generation

The final research output can include:

- Company overview
- Financial analysis
- Key financial ratios
- Industry analysis
- Competitive analysis
- Management and governance analysis
- Risk assessment
- Valuation
- Investment thesis
- Supporting evidence
- Charts and visualizations

Python-based tooling is used for PDF generation and chart rendering.

---

## 🏗️ Project Structure

```text
Report-Agent/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── src/
│   ├── agents/          # Specialized research and analysis agents
│   ├── core/            # Shared application logic
│   ├── evidence/        # Evidence and citation handling
│   ├── llm/             # LLM provider and model integration
│   ├── orchestration/   # Agent coordination and execution
│   ├── reporting/       # Report generation and formatting
│   ├── retrieval/       # Information retrieval
│   ├── telemetry/       # Runtime observability
│   ├── validation/      # Output and data validation
│   ├── config/          # Application configuration
│   ├── promptConfig.js  # Prompt configuration
│   └── index.js         # Application entry point
│
├── tests/               # Automated tests
├── evaluation/          # Evaluation datasets and evaluators
├── docs/                # Architecture and engineering documentation
│
├── Dockerfile
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Primary Language | JavaScript |
| AI / LLM | Large Language Models |
| Validation | Zod |
| Data Processing | Python |
| PDF Generation | Python |
| Visualization | Python plotting libraries |
| Testing | Node.js test tooling |
| CI | GitHub Actions |
| Containerization | Docker |
| Configuration | Environment Variables |

---

## ⚙️ Getting Started

### Prerequisites

Install:

- Node.js
- npm
- Python 3.x

### 1. Clone the repository

```bash
git clone https://github.com/shreyasajaymenon/Report-Agent.git
cd Report-Agent
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Install Python dependencies

Install the Python packages required by the report-generation and charting components according to your local Python environment.

### 4. Configure environment variables

Create a local `.env` file using `.env.example` as a template.

```bash
cp .env.example .env
```

Add your own API credentials.

> Never commit `.env` or API keys to GitHub.

---

## 🧪 Running the System

### Mock / Demo Mode

Run the deterministic demonstration pipeline:

```bash
npm run demo
```

Mock Mode is recommended for quickly testing the orchestration pipeline without requiring live API calls.

### Run Tests

```bash
npm run test
```

### Run Live Research

```bash
npm run research
```

Live execution requires the appropriate API credentials configured in `.env`.

---

## 📄 Example Output

Ventura V2 can generate complete equity research reports containing:

- Company overview
- Business analysis
- Financial performance
- Financial ratios
- Industry analysis
- Competitive landscape
- Management and governance analysis
- Risk assessment
- Valuation
- Investment thesis
- Supporting evidence
- Charts and visualizations

A representative generated report can be included in the repository under:

```text
examples/
```

---

## 🧪 Evaluation

Ventura V2 includes an evaluation layer for testing the behavior of the research pipeline.

The evaluation framework can be used to assess:

- Agent output validity
- Pipeline execution
- Structured response quality
- Evidence handling
- Report generation
- Regression behavior

Mock Mode enables reproducible evaluations without depending on external API availability.

---

## 🔐 Security

API credentials are loaded through environment variables.

Sensitive credentials should never be committed to GitHub.

Use:

```text
.env.example
```

as the configuration template.

The real `.env` file should remain local and be excluded through `.gitignore`.

---

## 🐳 Docker

Ventura V2 includes a Dockerfile for containerized execution.

Build the image:

```bash
docker build -t report-agent .
```

Run:

```bash
docker run --env-file .env report-agent
```

---

## 🎯 Engineering Challenges

### 1. Coordinating Multiple Agents

A large number of specialized agents must execute in the correct order while allowing independent tasks to run concurrently.

### 2. Maintaining Structured Context

Information generated by one agent must remain consistent and usable by downstream agents.

### 3. Handling Unreliable LLM Outputs

LLM responses can be incomplete, malformed, or inconsistent.

Schema validation, retries, and failure handling are therefore built into the pipeline.

### 4. Evidence Grounding

Research conclusions need to be connected to supporting information rather than relying solely on model-generated claims.

### 5. Producing Consistent Reports

Outputs from many different agents must be transformed into a coherent research document with a consistent structure.

### 6. Testing AI Workflows

Traditional deterministic testing is difficult for LLM systems.

Mock Mode and structured evaluation make it possible to test much of the orchestration layer without depending on live model responses.

---

## 📈 Future Improvements

Potential extensions include:

- Persistent research memory
- Additional financial data providers
- More sophisticated quantitative valuation models
- Human-in-the-loop review
- Agent performance benchmarking
- Distributed agent execution
- Improved source ranking
- Automated report comparison across companies
- Web-based research dashboard

---

## 👨‍💻 Author

Shreyas Ajay Menon

AI/ML Engineer focused on:

- Multi-Agent AI Systems
- LLM Applications
- Machine Learning
- AI Automation
- Intelligent Research Systems

---

## ⭐ Why Ventura V2?

Ventura V2 is not designed as a single chatbot or prompt wrapper.

It explores how specialized AI agents, structured validation, evidence tracking, orchestration, testing, and automated document generation can be combined into a complete AI engineering workflow.

The system moves from:

```text
Single LLM Prompt
       │
       ▼
   Response
```

to:

```text
Unstructured Information
          │
          ▼
   Multi-Agent Research
          │
          ▼
    Structured Analysis
          │
          ▼
 Evidence & Verification
          │
          ▼
       Synthesis
          │
          ▼
   Automated Report
```

---

## 📌 Project Status

Ventura V2 — Production-oriented research prototype

The current implementation focuses on multi-agent orchestration, evidence-aware research, structured validation, resilient execution, automated evaluation, and report generation.
