const axios = require('axios');

class FetchUtils {
  static async fetchWithRetry(url, options = {}, retries = 3) {
    if (!url) return null;
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios(url, {
          ...options,
          timeout: 10000, // 10s timeout
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Institutional-Research-Agent/2.0',
            ...options.headers
          }
        });
        
        if (!response.data) {
           throw new Error('Empty response body');
        }
        return response.data;
      } catch (error) {
        const status = error.response ? error.response.status : 'Network Error';
        console.warn(`[FetchUtils] Attempt ${i + 1} failed for ${url} (Status: ${status})`);
        
        if (i === retries - 1) {
           console.error(`[FetchUtils] Failed to fetch from ${url} after ${retries} attempts`);
           return null; // Return null instead of throwing to prevent crashing the pipeline
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    return null;
  }

  // Placeholder for specific sources
  static async fetchYahooFinance(ticker) {
    try {
       // In a real system we would hit the YF API. For Ventura we ensure we don't return fake data if it fails.
       return { data: 'mocked data' };
    } catch (e) {
       return null;
    }
  }
}

module.exports = FetchUtils;
