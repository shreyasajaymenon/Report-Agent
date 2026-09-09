# Ventura V2 Setup Guide

## Requirements
- Node.js (v18+)
- Python 3.9+ (with `reportlab`, `pandas`, `matplotlib`)
- An OpenAI or OpenRouter API key.
- A LangSearch API key.

## Installation

1. **Install Node Dependencies**
   ```bash
   npm install
   ```

2. **Install Python Dependencies**
   ```bash
   pip install reportlab pandas matplotlib
   ```

3. **Environment Variables**
   Copy the example environment file and add your keys:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to include your actual API keys.

## Running the Pipeline

Run the orchestrator using the CLI:
```bash
node src/index.js --company "Apollo Hospitals"
```

## Running Tests and Evaluation

Run basic unit tests for the framework:
```bash
node tests/core.test.js
```

Run the evaluation script after a successful pipeline run to view telemetry:
```bash
node evaluation/evaluate.js
```
