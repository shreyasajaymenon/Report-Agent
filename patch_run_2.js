const fs = require('fs');

const validTcsData = {
  ticker: 'TCS',
  cmp: 3900,
  market_cap_cr: 1400000,
  pe_ratio: 30.5,
  book_value: 300,
  roce: 45.2,
  roe: 38.4,
  target: 4200,
  financials: {
    years: [ 'FY20', 'FY21', 'FY22', 'FY23', 'FY24' ],
    sales: [ 156949, 164177, 191754, 225458, 240893 ],
    ebitda: [ 42100, 46546, 53047, 59259, 62000 ],
    net_profit: [ 32340, 32430, 38327, 42147, 46199 ],
    cfo: [ 32000, 38000, 40000, 41000, 42000 ],
    cfi: [ -4000, -5000, -6000, -7000, -8000 ],
    fcf: [ 28000, 33000, 34000, 34000, 34000 ]
  },
  balance_sheet: {
    equity: [ 300, 300, 300, 300, 300 ],
    reserves: [ 80000, 85000, 90000, 95000, 100000 ],
    borrowings: [ 0, 0, 0, 0, 0 ],
    fixed_assets: [ 19000, 20000, 21000, 22000, 23000 ]
  },
  ratios: {
    roce_pct: [ 44, 45, 46, 47, 45 ],
    roe_pct: [ 37, 38, 39, 40, 38 ],
    debt_equity: [ 0, 0, 0, 0, 0 ]
  },
  shareholding: {
    Promoters: 72.3,
    FII: 12.5,
    DII: 10.1,
    Public: 5.1
  },
  peers: {
    names: [ 'Infosys', 'Wipro', 'HCL', 'TCS' ],
    ev_ebitda: [ 20, 18, 16, 22 ]
  }
};

const reportData = JSON.parse(fs.readFileSync('report_data.json', 'utf8'));
reportData.DATA_INPUT = validTcsData;
reportData.companyName = 'Tata Consultancy Services Ltd';
fs.writeFileSync('report_data.json', JSON.stringify(reportData, null, 2));

const execSync = require('child_process').execSync;
console.log(execSync('python src/equity_report_template.py').toString());
