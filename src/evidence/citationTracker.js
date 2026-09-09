class CitationTracker {
  constructor() {
    this.citations = new Map(); // Source URL -> details
    this.facts = [];
  }

  addFact(claim, sourceUrl, evidence, valuationImpact) {
    const fact = {
      claim,
      sourceUrl,
      evidence,
      valuationImpact,
      timestamp: new Date().toISOString()
    };
    
    this.facts.push(fact);
    
    if (!this.citations.has(sourceUrl)) {
      this.citations.set(sourceUrl, { citations: 1, firstSeen: fact.timestamp });
    } else {
      const current = this.citations.get(sourceUrl);
      this.citations.set(sourceUrl, { ...current, citations: current.citations + 1 });
    }
    
    return fact;
  }

  getFacts() {
    return this.facts;
  }

  getCitationSummary() {
    return Array.from(this.citations.entries()).map(([url, data]) => ({
      url,
      ...data
    }));
  }
}

module.exports = CitationTracker;
