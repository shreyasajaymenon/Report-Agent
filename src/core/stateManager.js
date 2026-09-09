const { CompanyStateSchema } = require('../validation/schemas');

class StateManager {
  constructor(companyName, ticker = '') {
    this.state = {
      companyName,
      ticker,
      status: 'initializing',
      data: {},
      completedAgents: [],
      failedAgents: [],
      telemetry: [],
      errors: [],
      evidence: []
    };
  }

  updateState(section, data) {
    if (data !== null && data !== undefined) {
      this.state.data[section] = data;
    }
    console.log(`[StateManager] Updated section: ${section}`);
  }

  updateMetadata(key, value) {
    this.state[key] = value;
  }

  addError(errorMsg) {
    this.state.errors.push(errorMsg);
    console.error(`[StateManager] Recorded Error: ${errorMsg}`);
  }

  addTelemetry(telemetryEntry) {
    this.state.telemetry.push(telemetryEntry);
  }

  markAgentComplete(agentName) {
    if (!this.state.completedAgents.includes(agentName)) {
      this.state.completedAgents.push(agentName);
    }
  }

  markAgentFailed(agentName) {
    if (!this.state.failedAgents.includes(agentName)) {
      this.state.failedAgents.push(agentName);
    }
  }

  setEvidence(evidenceList) {
    this.state.evidence = evidenceList;
  }

  getState() {
    return this.state;
  }

  validateState() {
    const result = CompanyStateSchema.safeParse(this.state);
    if (!result.success) {
      console.error('[StateManager] State validation failed!', JSON.stringify(result.error.issues, null, 2));
      throw new Error('State validation failed: ' + JSON.stringify(result.error.issues));
    }
    return result.data;
  }
}

module.exports = StateManager;
