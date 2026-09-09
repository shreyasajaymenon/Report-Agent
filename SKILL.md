---
name: hospital-equity-research
description: Generate a 50-page equity research report PDF for any listed Indian hospital company, using only Screener.in and BSE/NSE company filing data with zero hallucinated numbers
license: MIT
compatibility: opencode
metadata:
  output: PDF
  data_sources: Screener.in, BSE/NSE company filings
  sectors: Hospitals, Healthcare
  sections: 31
  pages: 50+
---

## What this skill does

Generates a comprehensive 50-page equity research report PDF for any listed Indian **hospital** company using:
1. **Screener.in** — consolidated financials (P&L, Balance Sheet, Cash Flow, Ratios, Quarterly, Shareholding)
2. **Company BSE/NSE filings** — investor presentations (PPT/PDF) for hospital operational metrics (bed count, occupancy, patient volumes, ARPOB, ALOS, etc.)
3. **Zero hallucinated data** — every number must be traceable to one of the two sources above

## When to use

- You have a **hospital stock/company ticker** and want a full fundamental research report
- You need a professional PDF output with charts and tables tailored for hospital sector analysis
- You want strict data provenance (no invented figures)

## Report structure (31 sections, 50+ pages)

| # | Section | Pages | Charts |
|---|---------|-------|--------|
| 1 | Cover Page | 1 | — |
| 2 | Executive Summary | 1 | — |
| 3 | Table of Contents | 1 | — |
| 4 | Company Overview | 2 | — |
| 5 | Industry & Market Analysis | 2 | Peer bed comparison |
| 6 | Peer Comparison & Competitive Landscape | 2 | Peer valuation, Peer beds |
| 7 | Products & Services | 1 | — |
| 8 | Revenue & Cost Structure | 3 | Revenue/EBITDA, Profit waterfall |
| 9 | Balance Sheet Analysis | 2 | BS structure, Debt/Equity |
| 10 | Operating Performance | 3 | Beds/Occupancy, Patient volumes, ARPOB |
| 11 | Management & Founders | 1 | — |
| 12 | Porter Five Forces | 1 | — |
| 13 | PESTEL Analysis | 1 | — |
| 14 | Customer & Payor Analysis | 1 | — |
| 15 | Supply Chain Analysis | 1 | — |
| 16 | R&D & Technology | 1 | — |
| 17 | Segmental Analysis | 2 | — |
| 18 | Capital & Debt Allocation | 2 | Capex/beds |
| 19 | SWOT Analysis | 2 | — |
| 20 | Moat Analysis | 2 | Economic moat assessment |
| 21 | Shareholding Pattern | 1 | Pie chart |
| 22 | Dividend Analysis | 1 | — |
| 23 | Earnings Quality | 2 | Cash flow, Ratios |
| 24 | Trading & Liquidity | 1 | — |
| 25 | Technical Analysis | 1 | — |
| 26 | Strategic Initiatives | 2 | — |
| 27 | Catalyst Analysis | 2 | Catalyst timeline |
| 28 | Financial Projections & DCF | 3 | — |
| 29 | Valuation & Recommendation | 2 | Peer valuation |
| 30 | ESG & Sustainability | 1 | — |
| 31 | Risks & Caveats | 2 | — |

## STEPS TO GENERATE A REPORT

### Step 1: Source financial data from Screener.in
1. Visit `https://www.screener.in/company/<TICKER>/consolidated/`
2. Extract:
   - P&L (6 years: Sales, Expenses, EBITDA, Interest, Dep, PBT, Tax, NP, EPS)
   - Balance Sheet (6 years: Equity, Reserves, Borrowings, Fixed Assets, CWIP, Total Assets)
   - Cash Flow (6 years: CFO, CFI, CFF, FCF)
   - Ratios (6 years: ROCE, ROE, Debtor Days, Working Capital Days)
   - Quarterly data (last 5+ quarters: Sales, EBITDA, NP, EPS)
   - Shareholding pattern (2 recent quarters: Promoters, FII, DII, Public)
   - Key market data: CMP, Market Cap, 52w H/L, P/E, Book Value

### Step 2: Source operational data from company BSE filings & official website
1. Visit `https://www.bseindia.com/corporate/<TICKER>.html` or search for investor presentations
2. Download the latest investor PPT/PDF
3. Extract only metrics that are explicitly stated in the filing:
   - Bed capacity (year-wise and current)
   - Occupancy rates
   - Patient volumes (OPD, IPD)
   - ARPOB and ALOS
   - Doctor/nurse counts
   - Hospital/ICU counts
   - Any other operational KPIs explicitly shown
4. **If data is missing from filings**, check the company's official website for:
   - Investor presentations / quarterly fact sheets
   - Annual report PDFs
   - Corporate presentation / business overview pages
   - "Our Network" or facility listing pages for hospital/unit counts
5. **Source-attribution must reflect the actual source** — append `(Source: Company Website, <URL>)` or `(Source: Company Annual Report, <year>)`

### Step 3: Generate the report
1. Open `src/equity_report_template.py` in the workspace
2. Replace the `DATA_INPUT` section with your hospital company's data
3. Run: `python src/equity_report_template.py`
4. Output PDF will be in `generated_reports/<hospital_company>_report.pdf`

## CRITICAL RULES (never violate)

1. **NEVER hallucinate operational data** — If the investor PPT doesn't have a specific metric, don't invent it. Use "Not publicly disclosed" instead.
2. **NEVER fabricate payor mix percentages** — These are rarely disclosed. State "exact mix not disclosed."
3. **NEVER fabricate revenue segmentation** — If the company doesn't break down IPD vs OPD revenue, don't invent percentages.
4. **NEVER fabricate market share** — Unless from an explicitly cited third-party report.
5. **NEVER fabricate procurement savings or cost structure breakdowns** — These are internal.
6. **ALWAYS source-attribution-tag every data point** — Append `(Source: Screener.in)`, `(Source: Company Investor Presentation, <date>)`, `(Source: Company Website, <URL>)`, or `(Source: Company Annual Report, <year>)` as applicable.
7. **ALWAYS mark forward-looking projections** — DCF and financial projections must be labeled `[Author's Estimate]`.
8. **P/E ratio must use Screener's consolidated EPS** — Derived as CMP / EPS.
9. **ALWAYS verify graph numbers are visible** — Data labels on bars/lines must have fontsize ≥ 9.
10. **Page count must be 50+** — Each section must have substantive content.

## File structure

```
.opencode/skills/equity-research-report/SKILL.md   # This file
src/equity_report_template.py                       # Reusable report generator
src/charts/                                         # Generated chart images
generated_reports/                                  # Output PDFs
```

## To invoke this skill

From the chat, type or have the AI load:
```
<skill>
<name>hospital-equity-research</name>
</skill>
```
