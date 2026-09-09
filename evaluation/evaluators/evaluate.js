const fs = require('fs');
const path = require('path');

function evaluateRun() {
  const telemetryPath = path.join(process.cwd(), 'ventura_run_telemetry.json');
  if (!fs.existsSync(telemetryPath)) {
    console.error('No telemetry data found. Please run the pipeline first.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(telemetryPath, 'utf8'));
  const summary = data.runSummary;

  let dataset = null;
  const datasetPath = path.join(__dirname, '../datasets/mock_dataset.json');
  if (fs.existsSync(datasetPath)) {
     dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  }

  console.log('\n=============================================');
  console.log('🧪 VENTURA V2 AUTOMATED EVALUATION');
  console.log('=============================================');
  
  console.log(`Pipeline Latency: ${(summary.totalDurationMs / 1000).toFixed(1)}s`);
  const successRate = ((summary.agentsSucceeded / summary.agentsRun) * 100).toFixed(1);
  console.log(`Agent Success Rate: ${successRate}% (${summary.agentsSucceeded}/${summary.agentsRun})`);
  console.log(`Total Retries (LLM/Transient): ${summary.totalRetries}`);
  console.log(`Total Citations Generated: ${summary.totalCitations}`);
  
  const sectionsExpected = dataset ? dataset.expectedMetrics.sectionsPresent : ['cro', 'planner', 'discovery', 'nse', 'bse', 'companyIR', 'financial', 'risk', 'valuation', 'finalText'];
  let missing = [];
  sectionsExpected.forEach(sec => {
     if (!data.data[sec]) missing.push(sec);
  });
  
  const completeness = (((sectionsExpected.length - missing.length) / sectionsExpected.length) * 100).toFixed(1);
  console.log(`Section Completeness: ${completeness}%`);
  if (missing.length > 0) {
     console.log(`Missing Sections: ${missing.join(', ')}`);
  }

  let failed = false;
  if (dataset) {
     if (summary.totalCitations < (dataset.expectedMetrics.minCitations || 0)) {
        console.error(`❌ Citation threshold not met. Expected >= ${dataset.expectedMetrics.minCitations}`);
        failed = true;
     }
     if (missing.length > 0) {
        console.error(`❌ Missing required sections.`);
        failed = true;
     }
  }

  if (failed) {
     console.error('\n❌ Evaluation failed.');
     process.exit(1);
  } else {
     console.log('\n✅ Evaluation completed successfully.');
  }
}

evaluateRun();
