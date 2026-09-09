require('dotenv').config();
const { OpenAI } = require('openai');
const ConfigManager = require('../config');

class LLMClient {
  constructor() {
    const config = ConfigManager.getConfig();
    if (config.llm.openaiKey) {
      this.openaiClient = new OpenAI({
        apiKey: config.llm.openaiKey,
      });
    }

    this.openRouterKeys = config.llm.openrouterKeys;
      
    if (this.openRouterKeys.length === 0) {
      console.warn('[LLMClient] No OPENROUTER_API_KEY found in .env!');
    }
    
    this.currentKeyIndex = 0;
    this.currentModelIndex = 0;
    
    this.defaultModel = config.llm.defaultModel;
    this.fallbackModels = config.llm.fallbackModels;
  }
  
  getOpenRouterClient() {
    if (this.openRouterKeys.length === 0) return null;
    const key = this.openRouterKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.openRouterKeys.length;
    
    return new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: key,
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Ventura V2',
      }
    });
  }

  async getCompletion(options, useOpenRouter = true, telemetry = null) {
    const config = ConfigManager.getConfig();
    if (config.runtime.isMockMode) {
      return {
         content: JSON.stringify({
            content: "Mocked analysis for " + config.runtime.companyName,
            facts: [{ id: "mock-1", claim: "Mocked claim", sourceUrl: "http://mock.com", evidenceText: "Mock evidence" }],
            revenue: 1000000,
            boardIndependence: "High",
            status: "APPROVED",
            score: 100,
            issues: []
         }),
         latency: 50,
         usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 },
         model: "mock-model"
      };
    }

    if (!useOpenRouter && !this.openaiClient) {
      throw new Error('Requested OpenAI client is not configured. Missing API key in .env file.');
    }
    
    let retries = 5;
    let delay = 1000;
    const startTime = Date.now();

    while (retries > 0) {
      try {
        const client = useOpenRouter ? this.getOpenRouterClient() : this.openaiClient;
        if (!client) throw new Error('No LLM client available (missing keys).');
        
        let modelToUse = options.model || (useOpenRouter ? this.fallbackModels[this.currentModelIndex] : 'gpt-4o-mini');
        if (useOpenRouter && !options.model) {
           this.currentModelIndex = (this.currentModelIndex + 1) % this.fallbackModels.length;
        }

        const requestOptions = {
          model: modelToUse,
          messages: options.messages,
          temperature: options.temperature || 0.1, 
        };

        if (options.response_format) {
           // Not all OpenRouter models strictly support `response_format`, but we can pass it
           requestOptions.response_format = options.response_format;
        }

        const response = await client.chat.completions.create(requestOptions, { timeout: 30000 }); // 30s timeout

        if (!response || !response.choices || response.choices.length === 0) {
          throw new Error(`Invalid response structure from LLM`);
        }

        const endTime = Date.now();
        const latency = endTime - startTime;
        
        // Capture tokens
        const tokenUsage = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
        
        if (telemetry) {
           telemetry.recordLLMCall(tokenUsage, retries < 5);
        }

        return {
           content: response.choices[0].message.content,
           latency,
           usage: tokenUsage,
           model: response.model || modelToUse
        };

      } catch (error) {
        const isRateLimit = error.status === 429 || error.status === 502 || error.status === 524 || error.status === 503 || error.status === 402 || error.status === 400;
        const isTimeout = error.message && (error.message.includes('timeout') || error.message.includes('ECONNRESET') || error.message.includes('fetch failed'));
        const isModelDown = error.status === 404 || (error.message && error.message.includes('No endpoints found'));
        
        if ((isRateLimit || isTimeout || isModelDown) && retries > 1) {
          console.warn(`[LLMClient] Transient error (${error.status || 'timeout/down'}). Retrying in ${delay / 1000}s...`);
          await new Promise(res => setTimeout(res, delay));
          retries--;
          delay *= 2; // Exponential backoff
        } else {
          console.error('[LLMClient] Fatal error generating completion:', error.message);
          throw error;
        }
      }
    }
    throw new Error('LLM completion failed after max retries.');
  }
}

module.exports = new LLMClient();
