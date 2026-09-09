const fs = require('fs');
const path = require('path');

const agents = [
  "ChiefResearchOfficerAgent", "PlannerAgent", "DiscoveryAgent", "NSEAgent", "BSEAgent",
  "CompanyIRAgent", "AnnualReportAgent", "QuarterlyAgent", "TranscriptAgent", "PresentationAgent",
  "FinancialEngine", "RatioEngine", "CompetitionAgent", "ValuationAgent", "RiskAgent",
  "InvestmentCommittee", "ChiefWriter", "Editor", "Formatter"
];

const dir = path.join(__dirname, 'src', 'agents');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

agents.forEach(name => {
  const code = `const BaseAgent = require('../BaseAgent');

class ${name} extends BaseAgent {
  constructor() {
    super(
      '${name}',
      'You are the ${name}. Process the state and pass it down the pipeline.'
    );
  }

  async run(companyName, state) {
    console.log('[${name}] Executing...');
    const prompt = \`Process this state for \${companyName}: \${JSON.stringify(state, null, 2)}\`;
    return this.invoke(prompt);
  }
}

module.exports = ${name};
`;

  fs.writeFileSync(path.join(dir, `${name}.js`), code);
  console.log(`Created ${name}.js`);
});
