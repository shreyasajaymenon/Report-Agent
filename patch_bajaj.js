const fs = require('fs');

const validBajajData = {
  "company_name": "Bajaj Consumer Care Ltd",
  "ticker": "BAJAJCON",
  "cmp": 240,
  "market_cap_cr": 3400,
  "pe_ratio": 26.1,
  "book_value": 55,
  "roce": 30.6,
  "roe": 25.4,
  "target": 300,
  "financials": {
      "years": ["FY21", "FY22", "FY23", "FY24", "FY25"],
      "sales": [915, 878, 950, 968, 943],
      "expenses": [674, 699, 811, 810, 811],
      "ebitda": [241, 179, 139, 158, 132],
      "net_profit": [224, 175, 140, 159, 130],
      "cfo": [230, 160, 120, 150, 135],
      "cfi": [-90, -50, -40, -60, -55],
      "fcf": [140, 110, 80, 90, 80]
  },
  "balance_sheet": {
      "equity": [14.7, 14.7, 14.7, 14.7, 14.7],
      "reserves": [700, 750, 800, 850, 900],
      "borrowings": [0, 0, 0, 0, 0],
      "fixed_assets": [120, 120, 130, 140, 145],
  },
  "ratios": {
      "roce_pct": [35, 30, 28, 20, 30.6],
      "roe_pct": [30, 25, 24, 18, 25.4],
      "debt_equity": [0, 0, 0, 0, 0]
  },
  "shareholding": {
      "Promoters": 38.04,
      "FII": 14.5,
      "DII": 21.0,
      "Public": 26.46
  },
  "peers": {
      "names": ["Dabur", "Marico", "Emami", "Bajaj Consumer"],
      "ev_ebitda": [45, 42, 35, 18]
  }
};

try {
    const reportData = JSON.parse(fs.readFileSync('report_data.json', 'utf8'));
    reportData.DATA_INPUT = validBajajData;
    reportData.companyName = 'Bajaj Consumer Care Ltd';
    fs.writeFileSync('report_data.json', JSON.stringify(reportData, null, 2));
    
    const execSync = require('child_process').execSync;
    console.log(execSync('python src/equity_report_template.py').toString());
} catch (e) {
    console.error("Not ready yet.");
}
