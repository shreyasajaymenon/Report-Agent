require('dotenv').config();

const config = {
  llm: {
    openaiKey: process.env.OPENAI_API_KEY,
    openrouterKeys: [
      process.env.OPENROUTER_API_KEY_1,
      process.env.OPENROUTER_API_KEY_2
    ].filter(Boolean),
    defaultModel: process.env.DEFAULT_MODEL || 'google/gemini-1.5-pro',
    fallbackModels: [
      'google/gemini-1.5-flash',
      'anthropic/claude-3-haiku'
    ]
  },
  retrieval: {
    langsearchKeys: [
      process.env.LANGSEARCH_API_KEY_1
    ].filter(Boolean)
  },
  runtime: {
    isMockMode: false,
    maxRetries: 3,
    criticMaxIterations: 2,
    timeoutMs: 60000,
    verbose: false
  }
};

// Singleton configuration manager
class ConfigManager {
  static getConfig() {
    return config;
  }

  static setMockMode(mock) {
    config.runtime.isMockMode = mock;
  }
  
  static setVerbose(verbose) {
    config.runtime.verbose = verbose;
  }
}

module.exports = ConfigManager;
