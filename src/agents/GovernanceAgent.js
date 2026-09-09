const BaseAgent = require('../core/BaseAgent');
const SearchUtils = require('../retrieval/searchUtils');

class GovernanceAgent extends BaseAgent {
  constructor() {
    super(
      'GovernanceAgent',
      'You are an expert equity research analyst. Your job is to produce a highly detailed, comprehensive, 800-1000 word equity research section written in classic institutional prose. You must use clean, professional paragraphs. DO NOT use bold text. DO NOT use bullet points unless absolutely necessary. Do NOT introduce yourself or use AI personas. Write exhaustive paragraphs expanding on all metrics, context, industry factors, and findings in a formal tone.'
    );
  }

  async run(companyName, context, options = {}) {
    console.log('[GovernanceAgent] Executing...');
    
    // Perform web search to gather rich context
    const searchContext = await SearchUtils.searchAndScrape(`${companyName} latest news financial reports`, 3);
    const prompt = `Context from Web Search:\n${searchContext}\n\nCurrent State:\n${JSON.stringify(context, null, 2)}\n\nTask: Generate a comprehensive, 1500+ word analysis for ${companyName} focusing on your role's domain. Format as high-quality professional text.`;
    return this.execute(prompt, options);
  }
}

module.exports = GovernanceAgent;
