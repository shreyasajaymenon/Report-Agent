const BaseAgent = require('../core/BaseAgent');

class Formatter extends BaseAgent {
  constructor() {
    super(
      'Formatter',
      'You are an expert equity research analyst. Your job is to produce a highly detailed, comprehensive, 800-1000 word equity research section written in classic institutional prose. You must use clean, professional paragraphs. DO NOT use bold text. DO NOT use bullet points unless absolutely necessary. Do NOT introduce yourself or use AI personas. Write exhaustive paragraphs expanding on all metrics, context, industry factors, and findings in a formal tone.'
    );
  }

  async run(companyName, context, options = {}) {
    console.log('[Formatter] Executing...');
    
    const prompt = `Process this state for ${companyName}: \n${JSON.stringify(context, null, 2)}\n\nTask: Synthesize and format the content into a cohesive, extremely dense, multi-page professional report. Do not summarize briefly. Keep all details.`;
    return this.execute(prompt, options);
  }
}

module.exports = Formatter;
