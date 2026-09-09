const axios = require('axios');
const ConfigManager = require('../config');
require('dotenv').config();

class SearchUtils {
  static getLangSearchKeys() {
    const config = ConfigManager.getConfig();
    if (!this.langSearchKeys) {
      this.langSearchKeys = config.retrieval.langsearchKeys;
      this.currentKeyIndex = 0;
    }
    return this.langSearchKeys;
  }

  static async searchAndScrape(query, limit = 5) {
    const config = ConfigManager.getConfig();
    if (config.runtime.isMockMode) {
      return `--- Source: http://mock-source.com ---\nMocked extracted evidence for query: ${query}`;
    }

    console.log(`[SearchUtils] Searching web for: "${query}"`);
    const keys = this.getLangSearchKeys();
    
    if (!keys || keys.length === 0) {
      console.warn('[SearchUtils] No LANGSEARCH_API_KEY found. Skipping web search.');
      return '[SEARCH_FAILED: No API key available]';
    }

    let attempts = 0;
    const maxAttempts = keys.length * 2; // Allow trying each key twice with backoff

    while (attempts < maxAttempts) {
      const apiKey = keys[this.currentKeyIndex];
      try {
        const response = await axios.post('https://api.langsearch.com/v1/web-search', {
          query: query,
          count: limit
        }, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 seconds max
        });

        if (!response.data || !response.data.data || !response.data.data.webPages) {
          throw new Error('Invalid response from LangSearch');
        }

        let aggregatedText = '';
        const results = response.data.data.webPages.value || [];
        const topResults = results.slice(0, limit);
        
        if (topResults.length === 0) {
          return '[SEARCH_RESULTS: No relevant sources found]';
        }

        for (const result of topResults) {
          aggregatedText += `\n\n--- Source: ${result.url || 'Unknown'} ---\n`;
          const content = result.summary || result.snippet || result.description || '';
          if (content.trim() === '') {
             aggregatedText += '[No content extracted]\n';
          } else {
             aggregatedText += content.substring(0, 3000) + '\n';
          }
        }
        
        return aggregatedText;

      } catch (error) {
        const isRateLimit = error.response && error.response.status === 429;
        const status = error.response ? error.response.status : 'Network/Timeout';
        console.warn(`[SearchUtils] Key index ${this.currentKeyIndex} failed (Status: ${status}). Rotating to next key...`);
        
        this.currentKeyIndex = (this.currentKeyIndex + 1) % keys.length;
        attempts++;
        
        // Backoff slightly before next attempt
        await new Promise(res => setTimeout(res, 1000 * attempts));
      }
    }
    
    console.error(`[SearchUtils] ALL search attempts failed for query: "${query}"`);
    return '[SEARCH_FAILED: Exhausted all retries. The agent MUST explicitly state that this information could not be retrieved and MUST NOT hallucinate data.]';
  }
}

module.exports = SearchUtils;
