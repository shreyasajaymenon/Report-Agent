# Ventura V2 Setup Guide

## Prerequisites
- Node.js 18+
- Python 3.9+
- `pip` package manager

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ai-report-generation-pipeline.git
   cd ai-report-generation-pipeline
   ```

2. **Install Node.js Dependencies:**
   ```bash
   npm install
   ```

3. **Install Python Dependencies:**
   ```bash
   pip install reportlab pandas matplotlib numpy
   ```

4. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```
   *Note: OpenRouter API keys are required for LLM calls. LangSearch keys are required for web retrieval.*

## Running the System

To run a deterministic mock pipeline (no API keys required):
```bash
npm run demo
```

To run a live equity research report:
```bash
node src/index.js --company "Apple Inc."
```

## Running Tests
```bash
npm test
```
