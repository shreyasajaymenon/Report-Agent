const crypto = require('crypto');

class EvidenceStore {
  constructor() {
    this.evidenceList = [];
    this.citationsMap = new Map(); // url -> metadata
  }

  addEvidence(claim, sourceUrl, evidenceText, agentName, confidence = 1.0, valuationImpact = null) {
    if (!sourceUrl || sourceUrl.trim() === '') {
      sourceUrl = 'Unknown Source';
    }

    const id = crypto.randomUUID();
    const evidence = {
      id,
      claim,
      sourceUrl,
      evidenceText,
      agent: agentName,
      timestamp: new Date().toISOString(),
      confidence,
      valuationImpact,
      verificationStatus: 'pending'
    };

    this.evidenceList.push(evidence);

    if (!this.citationsMap.has(sourceUrl)) {
      this.citationsMap.set(sourceUrl, { citations: 1, firstSeen: evidence.timestamp });
    } else {
      const current = this.citationsMap.get(sourceUrl);
      this.citationsMap.set(sourceUrl, { 
        ...current, 
        citations: current.citations + 1 
      });
    }

    return evidence;
  }

  updateVerificationStatus(id, status) {
    const evidence = this.evidenceList.find(e => e.id === id);
    if (evidence) {
      evidence.verificationStatus = status;
      return true;
    }
    return false;
  }

  getAllEvidence() {
    return this.evidenceList;
  }

  getVerifiedEvidence() {
    return this.evidenceList.filter(e => e.verificationStatus === 'verified');
  }

  getCitationSummary() {
    return Array.from(this.citationsMap.entries()).map(([url, data]) => ({
      url,
      ...data
    }));
  }
}

// Export a singleton or class, we'll use a class so it can be instantiated per run.
module.exports = EvidenceStore;
