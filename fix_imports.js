const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.split(search).join(replace);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. Update agents
const agentsDir = path.join(__dirname, 'src', 'agents');
const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.js'));
for (const agent of agents) {
  replaceInFile(path.join(agentsDir, agent), {
    "require('../BaseAgent')": "require('../core/BaseAgent')",
    "require('../searchUtils')": "require('../retrieval/searchUtils')",
    "require('../fetchUtils')": "require('../retrieval/fetchUtils')"
  });
}

// 2. Update core
replaceInFile(path.join(__dirname, 'src', 'core', 'BaseAgent.js'), {
  "require('./llmClient')": "require('../llm/llmClient')",
  "require('../llmClient')": "require('../llm/llmClient')"
});
replaceInFile(path.join(__dirname, 'src', 'core', 'stateManager.js'), {
  "require('./schemas')": "require('../validation/schemas')",
  "require('../schemas')": "require('../validation/schemas')"
});

// 3. Update orchestration
replaceInFile(path.join(__dirname, 'src', 'orchestration', 'orchestrator.js'), {
  "require('./stateManager')": "require('../core/stateManager')",
  "require('./evidenceStore')": "require('../evidence/evidenceStore')",
  "require('./telemetry')": "require('../telemetry/telemetry')",
  "require('./pdfGenerator')": "require('../reporting/pdfGenerator')",
  "require('./agents/": "require('../agents/",
  "python src/equity_report_template.py": "python src/reporting/equity_report_template.py"
});

// 4. Update index.js
replaceInFile(path.join(__dirname, 'src', 'index.js'), {
  "require('./orchestrator')": "require('./orchestration/orchestrator')"
});

console.log("Imports fixed.");
