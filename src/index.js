const Orchestrator = require('./orchestration/orchestrator');
const ConfigManager = require('./config');

async function main() {
  const args = process.argv.slice(2);
  let companyName = '';
  let mockMode = false;
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--company' && args[i + 1]) {
      companyName = args[i + 1];
    } else if (args[i] === '--mock') {
      mockMode = true;
    } else if (args[i] === '--verbose') {
      verbose = true;
    }
  }

  if (!companyName && !mockMode) {
    console.error('Usage: npm run research -- --company "Company Name" [--mock] [--verbose]');
    process.exit(1);
  }
  
  if (mockMode && !companyName) {
    companyName = "Demo Company";
  }

  ConfigManager.setMockMode(mockMode);
  ConfigManager.setVerbose(verbose);

  console.log('==================================================');
  console.log(`🚀 VENTURA V2 CLI`);
  console.log(`🎯 Target Company: ${companyName}`);
  if (mockMode) console.log(`🛠️  Mode: MOCK (Deterministic dataset, no API cost)`);
  console.log('==================================================');

  const orchestrator = new Orchestrator(companyName);
  const startTime = Date.now();
  
  try {
     await orchestrator.runAgents();
     
     const endTime = Date.now();
     const durationSec = ((endTime - startTime) / 1000).toFixed(1);
     
     console.log('\n==================================================');
     console.log(`✅ VENTURA RUN COMPLETE`);
     console.log(`Company: ${companyName}`);
     console.log(`Status: SUCCESS`);
     console.log(`Duration: ${durationSec}s`);
     
     const fs = require('fs');
     if (fs.existsSync('ventura_run_telemetry.json')) {
        const data = JSON.parse(fs.readFileSync('ventura_run_telemetry.json', 'utf8'));
        const telemetry = data.runSummary;
        if (telemetry) {
           console.log(`Agents: ${telemetry.agentsRun}`);
           console.log(`Successful: ${telemetry.agentsSucceeded}`);
           console.log(`Failed: ${telemetry.agentsFailed}`);
           console.log(`LLM Calls: ${data.telemetry.length}`);
           console.log(`Tokens: ${telemetry.totalTokens}`);
           console.log(`Sources: ${telemetry.totalCitations}`);
           console.log(`Verified Claims: ${telemetry.totalCitations}`);
        }
     }
     console.log(`Report: ${companyName.replace(/ /g, '_')}_Equity_Research.pdf`);
     console.log('==================================================');
     process.exit(0);
     
  } catch (e) {
     console.error('\n❌ PIPELINE FAILED:', e.message);
     process.exit(1);
  }
}

main();
