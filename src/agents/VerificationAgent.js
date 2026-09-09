const BaseAgent = require('../core/BaseAgent');

class VerificationAgent extends BaseAgent {
  constructor() {
    super(
      'VerificationAgent',
      'You are a rigorous Fact-Checking and Verification Agent. Your job is to review the provided equity research text, cross-check it against the real-time data provided in the Evidence Store, and output a corrected, highly accurate version of the text. Do NOT add any conversational filler. Do NOT use bold text (`**`). Just output the corrected paragraphs. Ensure no false data or hallucinated numbers exist. If the original text is accurate, return it largely as is but still adhering to the formatting rules.'
    );
  }

  async verify(companyName, draftText, options = {}) {
    if (!draftText) return draftText;
    
    try {
      console.log(`[VerificationAgent] Verifying content for ${companyName}...`);
      
      // Grab verified context from EvidenceStore instead of doing a fresh ad-hoc search
      let evidenceContext = '';
      if (options.evidenceStore) {
         const allEvidence = options.evidenceStore.getAllEvidence();
         evidenceContext = allEvidence.map(e => `[${e.sourceUrl}] ${e.claim}`).join('\n');
      }

      if (!evidenceContext) {
         evidenceContext = 'No evidence provided in the global store for cross-checking.';
      }

      const userPrompt = `
      Company: ${companyName}
      Global Evidence Context:
      ${evidenceContext}

      Original Draft Text to Verify:
      ${typeof draftText === 'object' ? JSON.stringify(draftText, null, 2) : draftText}

      Please provide the corrected, 100% accurate version of the text based ONLY on the evidence provided. Do not hallucinate numbers. Output ONLY the text or the corrected JSON structure.
      `;

      const result = await this.execute(userPrompt, options);
      return result || draftText;
    } catch (error) {
      console.error(`[VerificationAgent] Execution failed:`, error.message);
      return draftText; // Fallback to original text if verification fails
    }
  }
}

module.exports = VerificationAgent;
