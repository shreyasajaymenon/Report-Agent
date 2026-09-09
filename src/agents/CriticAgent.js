const BaseAgent = require('../core/BaseAgent');
const { CriticOutputSchema } = require('../validation/schemas');

class CriticAgent extends BaseAgent {
  constructor() {
    super(
      'CriticAgent',
      'You are the Chief Editor and Critic. Evaluate a draft equity research report section for missing sections, unsupported claims, contradictions, and missing citations. You must output strictly valid JSON matching the schema.',
      CriticOutputSchema
    );
  }

  async run(companyName, draftText, options = {}) {
    console.log(`[CriticAgent] Evaluating draft for ${companyName}...`);
    
    const userPrompt = `
    Company: ${companyName}
    
    Draft Text:
    ${draftText}

    Evaluate the draft. Output JSON with "status": "APPROVED" if it requires no changes, or "NEEDS_REVISION". Include score (0-100), issues, criticalIssues, and recommendations.
    `;

    return await this.execute(userPrompt, options);
  }
}

module.exports = CriticAgent;
