const BaseAgent = require('../core/BaseAgent');

class Editor extends BaseAgent {
  constructor() {
    super(
      'Editor',
      'You are an expert equity research analyst. Your job is to produce a highly detailed, comprehensive, 800-1000 word equity research section written in classic institutional prose. You must use clean, professional paragraphs. DO NOT use bold text. DO NOT use bullet points unless absolutely necessary. Do NOT introduce yourself or use AI personas. Write exhaustive paragraphs expanding on all metrics, context, industry factors, and findings in a formal tone.'
    );
  }

  async run(companyName, context, options = {}) {
    console.log('[Editor] Executing...');
    const feedbackStr = typeof context.feedback === 'object' ? JSON.stringify(context.feedback, null, 2) : context.feedback;
    const prompt = `Process this state for ${companyName}: \nDraft:\n${context.draft}\n\nCritic Feedback:\n${feedbackStr}\n\nTask: Synthesize and format the content into a cohesive, extremely dense, multi-page professional report. Do not summarize briefly. Keep all details, but explicitly fix ALL issues raised by the Critic.`;
    return this.execute(prompt, options);
  }
}

module.exports = Editor;
