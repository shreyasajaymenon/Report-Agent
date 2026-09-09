class TelemetryTracker {
  constructor() {
    this.runStartTime = Date.now();
    this.metrics = [];
    this.llmCalls = 0;
    this.totalTokens = { input: 0, output: 0, total: 0 };
    this.searchCount = 0;
    this.retries = 0;
  }

  recordAgentRun(agentName, startTime, endTime, status, retries, error = null, tokens = {}) {
    const durationMs = endTime - startTime;
    this.metrics.push({
      agentName,
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date(endTime).toISOString(),
      durationMs,
      status,
      retries,
      error,
      tokens
    });
  }

  recordLLMCall(tokens, isRetry = false) {
    this.llmCalls++;
    if (tokens) {
      this.totalTokens.input += tokens.prompt_tokens || 0;
      this.totalTokens.output += tokens.completion_tokens || 0;
      this.totalTokens.total += tokens.total_tokens || 0;
    }
    if (isRetry) {
      this.retries++;
    }
  }

  recordSearch() {
    this.searchCount++;
  }

  getAgentMetrics() {
    return this.metrics;
  }

  getRunSummary(evidenceStore) {
    const runEndTime = Date.now();
    const agentsRun = this.metrics.length;
    const agentsSucceeded = this.metrics.filter(m => m.status === 'success').length;
    const agentsFailed = this.metrics.filter(m => m.status === 'failed').length;
    const totalRetries = this.metrics.reduce((acc, m) => acc + (m.retries || 0), 0) + this.retries;

    return {
      totalDurationMs: runEndTime - this.runStartTime,
      agentsRun,
      agentsSucceeded,
      agentsFailed,
      totalRetries,
      totalTokens: this.totalTokens.total,
      totalCitations: evidenceStore ? evidenceStore.getAllEvidence().length : 0,
      searchCount: this.searchCount,
      llmCalls: this.llmCalls
    };
  }
}

module.exports = TelemetryTracker;
