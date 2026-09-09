const BaseAgent = require('../core/BaseAgent');
const searchUtils = require('../retrieval/searchUtils');

class DataExtractionAgent extends BaseAgent {
  constructor() {
    super(
      'DataExtractionAgent',
      `You are a strict JSON Financial Data Extraction Agent. Your ONLY job is to extract exact financial numbers for the requested company and return them in a specific JSON format. Do NOT output any markdown, explanations, or text outside the JSON block. You must return valid JSON. If exact 5-year data is not available in the context, DO NOT fabricate or guess numbers. Leave them as null or 0 if appropriate.`
    );
  }

  async run(companyName, context, options = {}) {
    console.log(`[DataExtractionAgent] Extracting hard JSON financial data for ${companyName}...`);
    
    const searchContext = await searchUtils.searchAndScrape(
      `${companyName} screener.in financial results sales ebitda net profit 5 years`
    );

    const userPrompt = `
    Company: ${companyName}
    Search Context:
    ${searchContext}

    Extract the financials and output strictly the required JSON block.
    Ensure you output a valid JSON containing:
    ticker, cmp, market_cap_cr, pe_ratio, book_value, roce, roe, target, financials (years, sales, ebitda, net_profit, cfo, cfi, fcf arrays), balance_sheet (equity, reserves, borrowings, fixed_assets arrays), ratios (roce_pct, roe_pct, debt_equity arrays), peers (names, ev_ebitda arrays).
    DO NOT FABRICATE DATA.
    `;

    const ConfigManager = require('../config');
    const config = ConfigManager.getConfig();
    if (config.runtime.isMockMode) {
      return {
        ticker: 'MOCK',
        cmp: 100,
        market_cap_cr: 1000,
        pe_ratio: 10,
        book_value: 50,
        roce: 15,
        roe: 15,
        target: 120,
        financials: {
          years: ['FY20', 'FY21', 'FY22', 'FY23', 'FY24'],
          sales: [100, 110, 120, 130, 140],
          ebitda: [20, 22, 24, 26, 28],
          net_profit: [10, 11, 12, 13, 14],
          cfo: [10, 10, 10, 10, 10],
          cfi: [-5, -5, -5, -5, -5],
          fcf: [5, 5, 5, 5, 5]
        },
        balance_sheet: {
          equity: [10, 10, 10, 10, 10],
          reserves: [40, 50, 60, 70, 80],
          borrowings: [20, 15, 10, 5, 0],
          fixed_assets: [50, 55, 60, 65, 70]
        },
        ratios: {
          roce_pct: [15, 15, 15, 15, 15],
          roe_pct: [15, 15, 15, 15, 15],
          debt_equity: [0.4, 0.25, 0.14, 0.06, 0]
        },
        peers: {
          names: ['Peer1', 'Peer2', 'Peer3'],
          ev_ebitda: [8, 9, 10]
        },
        shareholding: {
          Promoters: 50,
          FII: 20,
          DII: 15,
          Public: 15
        }
      };
    }

    // We can rely on BaseAgent's execution framework to handle retries and JSON formatting
    // But since we didn't inject a strict Zod schema for this specific legacy python consumer, we'll just parse manually.
    try {
      let response = await this.execute(userPrompt, options);
      if (!response) return null;
      
      // Attempt manual parse if not schema validated
      if (typeof response === 'string') {
         response = response.replace(/```json/g, '').replace(/```/g, '').trim();
         return JSON.parse(response);
      }
      return response;
    } catch (error) {
      console.error(`[DataExtractionAgent] Execution failed:`, error.message);
      // DO NOT fabricate fallback financial numbers. Fail gracefully.
      return null;
    }
  }
}

module.exports = DataExtractionAgent;
