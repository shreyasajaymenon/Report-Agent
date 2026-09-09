const llmClient = require('../llm/llmClient');

class BaseAgent {
  constructor(agentName, systemPrompt, useOpenRouter = true) {
    this.agentName = agentName;
    this.systemPrompt = systemPrompt;
    this.useOpenRouter = useOpenRouter;
    
    // Limits
    this.maxRetries = 3;
    this.timeoutMs = 60000;
  }

  async execute(userPrompt, options = {}) {
    const { schema = null, evidenceStore = null, telemetry = null, stateManager = null } = options;
    const startTime = Date.now();
    let retries = 0;
    let lastError = null;

    console.log(`[${this.agentName}] Starting execution...`);

    let messages = [
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const llmOptions = {
      messages,
      temperature: 0.1,
    };

    if (schema) {
      llmOptions.response_format = { type: 'json_object' };
      messages[1].content += '\n\nYou MUST return your answer in valid JSON exactly matching the provided schema structure. Do NOT wrap the JSON in Markdown (like ```json), just return the raw JSON object.';
    }

    while (retries < this.maxRetries) {
      try {
        // Enforce timeout for the agent level (if needed, though llmClient has its own timeout)
        const responsePromise = llmClient.getCompletion(llmOptions, this.useOpenRouter, telemetry);
        
        const response = await Promise.race([
          responsePromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Agent execution timeout')), this.timeoutMs))
        ]);

        let outputText = response.content.trim();

        if (schema) {
          try {
             // Handle cases where the LLM still returns markdown blocks despite instructions
             if (outputText.startsWith('```json')) {
               outputText = outputText.replace(/^```json/, '').replace(/```$/, '').trim();
             } else if (outputText.startsWith('```')) {
               outputText = outputText.replace(/^```/, '').replace(/```$/, '').trim();
             }

             const parsedData = JSON.parse(outputText);
             const validationResult = schema.safeParse(parsedData);

             if (!validationResult.success) {
                throw new Error(`Schema validation failed: ${JSON.stringify(validationResult.error.issues)}`);
             }

             const validData = validationResult.data;

             // Extract facts to Evidence Store if present and valid
             if (validData.facts && Array.isArray(validData.facts) && evidenceStore) {
               for (const fact of validData.facts) {
                 evidenceStore.addEvidence(
                   fact.claim,
                   fact.sourceUrl,
                   fact.evidenceText || fact.evidence,
                   this.agentName,
                   fact.confidence || 1.0,
                   fact.valuationImpact
                 );
               }
             }

             const endTime = Date.now();
             if (telemetry) telemetry.recordAgentRun(this.agentName, startTime, endTime, 'success', retries, null, response.usage);
             if (stateManager) stateManager.markAgentComplete(this.agentName);
             return validData;

          } catch (parseError) {
             console.warn(`[${this.agentName}] Output parsing/validation failed (Attempt ${retries + 1}): ${parseError.message}`);
             lastError = parseError;
             // Append correction prompt
             messages.push({ role: 'assistant', content: outputText });
             messages.push({ role: 'user', content: `Your previous response failed validation with error: ${parseError.message}. Please correct your JSON and try again. Return ONLY valid JSON.` });
             retries++;
             continue;
          }
        }

        // If no schema, return raw text
        const endTime = Date.now();
        if (telemetry) telemetry.recordAgentRun(this.agentName, startTime, endTime, 'success', retries, null, response.usage);
        if (stateManager) stateManager.markAgentComplete(this.agentName);
        return outputText;

      } catch (error) {
        console.error(`[${this.agentName}] Execution error (Attempt ${retries + 1}):`, error.message);
        lastError = error;
        retries++;
        // Short pause before general retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // If we exhaust retries, fail gracefully
    const endTime = Date.now();
    console.error(`[${this.agentName}] FAILED after ${this.maxRetries} retries. Reason: ${lastError.message}`);
    if (telemetry) telemetry.recordAgentRun(this.agentName, startTime, endTime, 'failed', retries, lastError.message);
    if (stateManager) {
       stateManager.addError(`[${this.agentName}] Failed: ${lastError.message}`);
       stateManager.markAgentFailed(this.agentName);
    }
    
    // Return null instead of throwing to prevent crashing Promise.allSettled
    return null;
  }
}

module.exports = BaseAgent;
