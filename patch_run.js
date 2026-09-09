const fs = require('fs');
const DataExtractionAgent = require('./src/agents/DataExtractionAgent');

async function fix() {
  const agent = new DataExtractionAgent();
  const data = await agent.run('Tata Consultancy Services Ltd');
  console.log('Extracted Data:', data);
  
  const reportData = JSON.parse(fs.readFileSync('report_data.json', 'utf8'));
  reportData.DATA_INPUT = data;
  fs.writeFileSync('report_data.json', JSON.stringify(reportData, null, 2));
  
  const execSync = require('child_process').execSync;
  console.log(execSync('python src/equity_report_template.py').toString());
}

fix();
