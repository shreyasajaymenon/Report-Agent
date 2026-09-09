import os
import json
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    Image,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus.flowables import Flowable
import matplotlib.pyplot as plt
import numpy as np

# =========================================================
# DATA_INPUT BLOCK (Inject company data here)
# =========================================================
DATA_INPUT = {
    "company_name": "Generic Company",
    "ticker": "GENERIC",
    "cmp": 0,
    "market_cap_cr": 0,
    "pe_ratio": 0,
    "book_value": 0,
    "roce": 0,
    "roe": 0,
    "target": 0,
    "financials": {
        "years": ["FY21", "FY22", "FY23", "FY24", "FY25"],
        "sales": [0, 0, 0, 0, 0],
        "ebitda": [0, 0, 0, 0, 0],
        "net_profit": [0, 0, 0, 0, 0],
        "cfo": [0, 0, 0, 0, 0],
        "cfi": [0, 0, 0, 0, 0],
        "fcf": [0, 0, 0, 0, 0],
    },
    "balance_sheet": {
        "equity": [0, 0, 0, 0, 0],
        "reserves": [0, 0, 0, 0, 0],
        "borrowings": [0, 0, 0, 0, 0],
        "fixed_assets": [0, 0, 0, 0, 0],
    },
    "ratios": {
        "roce_pct": [0, 0, 0, 0, 0],
        "roe_pct": [0, 0, 0, 0, 0],
        "debt_equity": [0, 0, 0, 0, 0],
    },
    "shareholding": {"Promoters": 0, "FII": 0, "DII": 0, "Public": 0},
    "peers": {"names": ["Peer 1", "Peer 2", "Peer 3"], "ev_ebitda": [0, 0, 0]},
}
# =========================================================


class HeaderLine(Flowable):
    def __init__(self, width, color):
        Flowable.__init__(self)
        self.width = width
        self.color = color

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(2)
        self.canv.line(0, 0, self.width, 0)


class ReportGenerator:
    def __init__(self, output_path="generated_reports"):
        if not os.path.exists(output_path):
            os.makedirs(output_path)
        if not os.path.exists("src/charts"):
            os.makedirs("src/charts")

        # Load AI Data
        self.ai_data = {}
        self.ai_key_usage = {}

        data_path = "report_data.json"
        if os.path.exists(data_path):
            with open(data_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.ai_data = data.get("sections", {})

            # Load dynamic generic DATA_INPUT
            if "DATA_INPUT" in data:
                global DATA_INPUT
                DATA_INPUT.update(data["DATA_INPUT"])
            DATA_INPUT["company_name"] = data.get(
                "companyName", DATA_INPUT["company_name"]
            )

        # Build global paragraph pool to NEVER repeat content
        self.global_paragraphs = []
        for key, text in self.ai_data.items():
            if text:
                paras = [p for p in str(text).split("\n") if p.strip()]
                self.global_paragraphs.extend(paras)

        self.global_idx = 0

        filename = (
            DATA_INPUT["company_name"].replace(" ", "_").replace(".", "")
            + "_report.pdf"
        )
        self.filepath = os.path.join(output_path, filename)

        self.doc = SimpleDocTemplate(
            self.filepath,
            pagesize=letter,
            rightMargin=50,
            leftMargin=50,
            topMargin=50,
            bottomMargin=50,
        )
        self.styles = getSampleStyleSheet()
        self.story = []
        self.THEME_BLUE = colors.HexColor("#1E2270")
        self.THEME_ORANGE = colors.HexColor("#FF8C00")
        self.LIGHT_BLUE = colors.HexColor("#F2F4F8")

        self.setup_custom_styles()
        self.create_charts()

    def setup_custom_styles(self):
        self.styles.add(
            ParagraphStyle(
                name="CoverTitle",
                parent=self.styles["Heading1"],
                fontSize=26,
                spaceAfter=10,
                alignment=1,
                textColor=colors.HexColor("#1E2270"),
            )
        )
        self.styles.add(
            ParagraphStyle(
                name="CoverSubTitle",
                parent=self.styles["Normal"],
                fontSize=14,
                spaceAfter=20,
                alignment=1,
                textColor=colors.gray,
            )
        )
        self.styles.add(
            ParagraphStyle(
                name="CoverOrange",
                parent=self.styles["Heading2"],
                fontSize=16,
                spaceAfter=30,
                alignment=1,
                textColor=colors.HexColor("#FF8C00"),
            )
        )
        self.styles.add(
            ParagraphStyle(
                name="SectionTitle",
                parent=self.styles["Heading1"],
                fontSize=18,
                spaceAfter=15,
                spaceBefore=10,
                textColor=colors.HexColor("#1E2270"),
            )
        )
        self.styles.add(
            ParagraphStyle(
                name="SubHeading",
                parent=self.styles["Heading2"],
                fontSize=14,
                spaceAfter=10,
                textColor=colors.HexColor("#1E2270"),
                spaceBefore=10,
            )
        )
        self.styles.add(
            ParagraphStyle(
                name="SubSubHeading",
                parent=self.styles["Heading3"],
                fontSize=12,
                spaceAfter=8,
                textColor=colors.HexColor("#1E2270"),
                spaceBefore=8,
            )
        )
        self.styles.add(
            ParagraphStyle(
                name="BodyTextCustom",
                parent=self.styles["Normal"],
                fontSize=11,
                spaceAfter=12,
                leading=16,
                alignment=4,
            )
        )  # Justified alignment
        self.styles.add(
            ParagraphStyle(
                name="BulletCustom",
                parent=self.styles["Normal"],
                fontSize=11,
                spaceAfter=8,
                leading=16,
                leftIndent=15,
                firstLineIndent=-10,
            )
        )

    def create_charts(self):
        plt.style.use("seaborn-v0_8-whitegrid")

        # 1. Revenue & EBITDA Trend
        fig, ax1 = plt.subplots(figsize=(7, 4))
        ax2 = ax1.twinx()
        ax1.bar(
            DATA_INPUT["financials"]["years"],
            DATA_INPUT["financials"]["sales"],
            color="#3b429f",
            width=0.4,
            label="Sales (Rs Cr)",
        )
        ebitda_margins = [
            e / s * 100
            for e, s in zip(
                DATA_INPUT["financials"]["ebitda"], DATA_INPUT["financials"]["sales"]
            )
        ]
        ax2.plot(
            DATA_INPUT["financials"]["years"],
            ebitda_margins,
            color="#ff8c00",
            marker="o",
            linewidth=2,
            label="EBITDA Margin %",
        )

        for i, val in enumerate(DATA_INPUT["financials"]["sales"]):
            ax1.text(
                i,
                val + 100,
                f"{val}",
                ha="center",
                va="bottom",
                fontsize=8,
                fontweight="bold",
                color="#1e2270",
            )
        for i, val in enumerate(ebitda_margins):
            ax2.text(
                i,
                val + 0.5,
                f"{val:.1f}%",
                ha="center",
                va="bottom",
                fontsize=8,
                fontweight="bold",
                color="#ff8c00",
            )

        ax1.set_ylabel("Sales (Rs Cr)")
        ax2.set_ylabel("EBITDA Margin (%)")
        ax1.set_ylim(0, max(DATA_INPUT["financials"]["sales"]) * 1.2)
        ax2.set_ylim(0, max(ebitda_margins) * 1.5)
        plt.title("Revenue & EBITDA Margin Trend", fontweight="bold", color="#1e2270")
        fig.legend(loc="upper left", bbox_to_anchor=(0.1, 0.9))
        plt.tight_layout()
        plt.savefig("src/charts/revenue.png", dpi=150)
        plt.close()

        # 2. Net Profit Growth
        plt.figure(figsize=(7, 4))
        bars = plt.bar(
            DATA_INPUT["financials"]["years"],
            DATA_INPUT["financials"]["net_profit"],
            color="#2e8b57",
            width=0.4,
        )
        for bar in bars:
            yval = bar.get_height()
            plt.text(
                bar.get_x() + bar.get_width() / 2.0,
                yval + 20,
                f"{int(yval)}",
                va="bottom",
                ha="center",
                fontsize=9,
                fontweight="bold",
            )
        plt.title("Net Profit Trend (Rs Cr)", fontweight="bold", color="#1e2270")
        plt.tight_layout()
        plt.savefig("src/charts/net_profit.png", dpi=150)
        plt.close()

        # 3. Cash Flow Summary
        x = np.arange(len(DATA_INPUT["financials"]["years"]))
        width = 0.25
        fig, ax = plt.subplots(figsize=(7, 4))
        ax.bar(
            x - width,
            DATA_INPUT["financials"]["cfo"],
            width,
            label="CFO",
            color="#228b22",
        )
        ax.bar(x, DATA_INPUT["financials"]["cfi"], width, label="CFI", color="#d32f2f")
        ax.bar(
            x + width,
            DATA_INPUT["financials"]["fcf"],
            width,
            label="FCF",
            color="#1976d2",
        )
        ax.set_xticks(x)
        ax.set_xticklabels(DATA_INPUT["financials"]["years"])
        ax.legend()
        plt.title(
            "Cash Flow Trends (CFO, CFI, FCF)", fontweight="bold", color="#1e2270"
        )
        plt.tight_layout()
        plt.savefig("src/charts/cash_flow.png", dpi=150)
        plt.close()

        # 4. Balance Sheet Structure
        plt.figure(figsize=(7, 4))
        equity_reserves = [
            e + r
            for e, r in zip(
                DATA_INPUT["balance_sheet"]["equity"],
                DATA_INPUT["balance_sheet"]["reserves"],
            )
        ]
        plt.bar(
            DATA_INPUT["financials"]["years"],
            equity_reserves,
            label="Equity + Reserves",
            color="#2e8b57",
            width=0.5,
        )
        plt.bar(
            DATA_INPUT["financials"]["years"],
            DATA_INPUT["balance_sheet"]["borrowings"],
            bottom=equity_reserves,
            label="Borrowings",
            color="#ff8c00",
            width=0.5,
        )
        plt.legend()
        plt.title(
            "Balance Sheet Structure (Liabilities)", fontweight="bold", color="#1e2270"
        )
        plt.tight_layout()
        plt.savefig("src/charts/balance_sheet.png", dpi=150)
        plt.close()

        # 5. Ratio Analysis (ROCE & ROE)
        plt.figure(figsize=(7, 4))
        plt.plot(
            DATA_INPUT["financials"]["years"],
            DATA_INPUT["ratios"]["roce_pct"],
            color="#3b429f",
            marker="s",
            linewidth=2,
            label="ROCE %",
        )
        plt.plot(
            DATA_INPUT["financials"]["years"],
            DATA_INPUT["ratios"]["roe_pct"],
            color="#2e8b57",
            marker="o",
            linewidth=2,
            label="ROE %",
        )
        for i, val in enumerate(DATA_INPUT["ratios"]["roce_pct"]):
            plt.text(
                i,
                val + 1,
                f"{val}%",
                ha="center",
                va="bottom",
                fontsize=8,
                fontweight="bold",
                color="#3b429f",
            )
        for i, val in enumerate(DATA_INPUT["ratios"]["roe_pct"]):
            plt.text(
                i,
                val - 2,
                f"{val}%",
                ha="center",
                va="top",
                fontsize=8,
                fontweight="bold",
                color="#2e8b57",
            )
        plt.legend()
        plt.title("Return Ratios (ROCE & ROE)", fontweight="bold", color="#1e2270")
        plt.tight_layout()
        plt.savefig("src/charts/ratios.png", dpi=150)
        plt.close()

        # 6. Shareholding Pattern
        plt.figure(figsize=(5, 5))
        labels = list(DATA_INPUT["shareholding"].keys())
        sizes = list(DATA_INPUT["shareholding"].values())
        colors_pie = ["#3b429f", "#ff8c00", "#2e8b57", "#d32f2f"]
        plt.pie(
            sizes,
            labels=labels,
            autopct="%1.1f%%",
            startangle=140,
            colors=colors_pie,
            textprops={"fontsize": 9, "fontweight": "bold"},
        )
        plt.title("Shareholding Pattern", fontweight="bold", color="#1e2270")
        plt.tight_layout()
        plt.savefig("src/charts/shareholding.png", dpi=150)
        plt.close()

        # 7. Peer Comparison (EV/EBITDA)
        plt.figure(figsize=(7, 4))
        y_pos = np.arange(len(DATA_INPUT["peers"]["names"]))
        plt.barh(
            y_pos, DATA_INPUT["peers"]["ev_ebitda"], align="center", color="#3b429f"
        )
        plt.yticks(y_pos, DATA_INPUT["peers"]["names"])
        plt.gca().invert_yaxis()
        for i, v in enumerate(DATA_INPUT["peers"]["ev_ebitda"]):
            plt.text(
                v + 1,
                i,
                str(v) + "x",
                color="black",
                va="center",
                fontweight="bold",
                fontsize=8,
            )
        plt.title(
            "Peer Valuation Comparison (EV/EBITDA)", fontweight="bold", color="#1e2270"
        )
        plt.tight_layout()
        plt.savefig("src/charts/peers_ev_ebitda.png", dpi=150)
        plt.close()

        # 8. Capital Allocation (D/E)
        plt.figure(figsize=(7, 4))
        bars = plt.bar(
            DATA_INPUT["financials"]["years"],
            DATA_INPUT["ratios"]["debt_equity"],
            color="#3b429f",
            width=0.4,
        )
        for bar in bars:
            yval = bar.get_height()
            plt.text(
                bar.get_x() + bar.get_width() / 2.0,
                yval + 0.05,
                f"{yval}",
                va="bottom",
                ha="center",
                fontsize=9,
                fontweight="bold",
            )
        plt.title("Debt-to-Equity Ratio Trend", fontweight="bold", color="#1e2270")
        plt.tight_layout()
        plt.savefig("src/charts/debt_equity.png", dpi=150)
        plt.close()

    def generate_cover_page(self):
        self.story.append(HeaderLine(500, self.THEME_BLUE))
        self.story.append(Spacer(1, 40))
        self.story.append(
            Paragraph(DATA_INPUT["company_name"], self.styles["CoverTitle"])
        )
        self.story.append(
            Paragraph(
                f"NSE: {DATA_INPUT['ticker']} | BSE: 533229",
                self.styles["CoverSubTitle"],
            )
        )
        self.story.append(
            Paragraph(
                f"50-Section Comprehensive Equity Research Report",
                self.styles["CoverOrange"],
            )
        )
        self.story.append(HeaderLine(500, self.THEME_BLUE))
        self.story.append(Spacer(1, 40))

        # Cover Table
        table_data = [
            ["Metric", "Value"],
            ["CMP (Rs)", f"{DATA_INPUT['cmp']}.00"],
            ["Market Cap (Rs Cr)", f"{DATA_INPUT['market_cap_cr']:,}"],
            ["Stock P/E", f"{DATA_INPUT['pe_ratio']}x"],
            ["Book Value (Rs)", f"{DATA_INPUT['book_value']}.00"],
            ["ROCE (%)", f"{DATA_INPUT['roce']}%"],
            ["ROE (%)", f"{DATA_INPUT['roe']}%"],
            ["Revenue FY24 (Rs Cr)", f"{DATA_INPUT['financials']['sales'][-1]}"],
            [
                "Net Profit FY24 (Rs Cr)",
                f"{DATA_INPUT['financials']['net_profit'][-1]}",
            ],
            ["Target Price (Rs)", f"Rs {DATA_INPUT['target']}"],
            ["Recommendation", "BUY"],
        ]
        t = Table(table_data, colWidths=[200, 200])
        t.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), self.THEME_BLUE),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
                    ("TOPPADDING", (0, 0), (-1, 0), 10),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
                    (
                        "ROWBACKGROUNDS",
                        (0, 1),
                        (-1, -1),
                        [colors.white, self.LIGHT_BLUE],
                    ),
                    ("FONTSIZE", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 1), (-1, -1), 8),
                    ("TOPPADDING", (0, 1), (-1, -1), 8),
                ]
            )
        )
        self.story.append(t)
        self.story.append(Spacer(1, 50))
        self.story.append(
            Paragraph(
                f"Date: July 14, 2026 | Analyst: Equity Research Desk",
                ParagraphStyle(name="C1", alignment=1, fontSize=10),
            )
        )
        self.story.append(
            Paragraph(
                f"For Institutional & Retail Investors Only",
                ParagraphStyle(name="C2", alignment=1, fontSize=10),
            )
        )
        self.story.append(PageBreak())

    def get_ai_text(self, keys=None):
        # We ignore keys and just pull sequentially from the global paragraph pool
        chunk_paragraphs = []
        word_count = 0

        for i in range(self.global_idx, len(self.global_paragraphs)):
            p = self.global_paragraphs[i]
            chunk_paragraphs.append(p)
            word_count += len(p.split())
            self.global_idx = i + 1
            if word_count >= 300:
                break

        if chunk_paragraphs:
            return "\n".join(chunk_paragraphs)

        return "The company continues to exhibit strong operational performance in this segment, driven by robust volume expansion and disciplined execution across its core markets. Management remains focused on margin expansion and capital efficiency, positioning the business favorably against industry peers. Continued investments in technology and capacity expansion provide strong visibility for sustainable long-term growth and market share consolidation."

    def generate_generic_section(
        self, section_num, title, chart_path=None, table_data=None, ai_key=None
    ):
        # Top Blue Line
        self.story.append(HeaderLine(500, self.THEME_BLUE))
        self.story.append(Spacer(1, 5))

        # Title
        full_title = f"{section_num}. {title}"
        self.story.append(Paragraph(full_title, self.styles["SectionTitle"]))

        # Inject AI Content
        content = self.get_ai_text(ai_key)

        paragraphs = content.split("\n")
        for p in paragraphs:
            p = p.strip()
            if p:
                p = p.replace("₹", "Rs. ").replace("—", "-").replace("•", "-")
                p = p.replace("<", "&lt;").replace(">", "&gt;")
                p = p.replace("**", "")  # Completely remove bold tags

                if p.startswith("### "):
                    self.story.append(Paragraph(p[4:], self.styles["SubSubHeading"]))
                elif p.startswith("## "):
                    self.story.append(Paragraph(p[3:], self.styles["SubHeading"]))
                elif p.startswith("# "):
                    pass  # Skip H1 as we already have SectionTitle
                elif p.startswith("- ") or p.startswith("* "):
                    bullet_text = f"- {p[2:]}"
                    self.story.append(
                        Paragraph(bullet_text, self.styles["BulletCustom"])
                    )
                else:
                    self.story.append(Paragraph(p, self.styles["BodyTextCustom"]))

        self.story.append(Spacer(1, 15))

        if chart_path and os.path.exists(chart_path):
            self.story.append(Image(chart_path, width=380, height=220))
            self.story.append(Spacer(1, 15))

        if table_data:
            t = Table(table_data)
            t.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), self.THEME_BLUE),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
                        ("TOPPADDING", (0, 0), (-1, 0), 8),
                        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
                        (
                            "ROWBACKGROUNDS",
                            (0, 1),
                            (-1, -1),
                            [colors.white, self.LIGHT_BLUE],
                        ),
                        ("FONTSIZE", (0, 0), (-1, -1), 9),
                    ]
                )
            )
            self.story.append(t)

        self.story.append(PageBreak())

    def build_report(self):
        print("Generating charts...")
        self.create_charts()

        print("Building document...")
        self.generate_cover_page()  # Page 1

        # 50 Sections to match reference precisely
        sections = [
            (1, "Executive Summary", None, None, "planner"),
            (2, "Company Overview", None, None, "cro"),
            (3, "Investment Thesis", None, None, "planner"),
            (4, "Bear Case Thesis", None, None, "risk"),
            (5, "Industry Overview", None, None, "industry"),
            (6, "Total Addressable Market (TAM)", None, None, "discovery"),
            (7, "Business Model Analysis", None, None, "cro"),
            (8, "Product & Service Analysis", None, None, "presentation"),
            (9, "Revenue Analysis", "src/charts/revenue.png", None, "financial"),
            (10, "Cost Structure Analysis", None, None, "financial"),
            (
                11,
                "Profitability Analysis",
                "src/charts/net_profit.png",
                None,
                "financial",
            ),
            (12, "Cash Flow Analysis", "src/charts/cash_flow.png", None, "financial"),
            (
                13,
                "Balance Sheet Analysis",
                "src/charts/balance_sheet.png",
                None,
                "ratio",
            ),
            (14, "Ratio Analysis", "src/charts/ratios.png", None, "ratio"),
            (15, "Management Analysis", None, None, "governance"),
            (16, "Corporate Governance", None, None, "governance"),
            (
                17,
                "Competitive Landscape",
                "src/charts/peers_ev_ebitda.png",
                None,
                "competition",
            ),
            (18, "Porter's Five Forces Analysis", None, None, "industry"),
            (19, "SWOT Analysis", None, None, "risk"),
            (20, "Economic Moat Analysis", None, None, "competition"),
            (21, "Customer & Payor Analysis", None, None, "companyIR"),
            (22, "Supply Chain Analysis", None, None, "companyIR"),
            (23, "Technology & Digital", None, None, "presentation"),
            (24, "R&D Analysis", None, None, "discovery"),
            (25, "ESG & Sustainability Analysis", None, None, "governance"),
            (26, "Regulatory Environment", None, None, "risk"),
            (27, "Macroeconomic Analysis", None, None, "industry"),
            (28, "Geographic Analysis", None, None, "quarterly"),
            (29, "Segment Analysis", None, None, "quarterly"),
            (
                30,
                "Capital Allocation Analysis",
                "src/charts/debt_equity.png",
                None,
                "annualReport",
            ),
            (31, "Debt & Credit Analysis", None, None, "ratio"),
            (32, "Valuation Overview", None, None, "valuation"),
            (33, "DCF Analysis", None, None, "valuation"),
            (34, "Comparable Company Analysis", None, None, "valuation"),
            (35, "Precedent Transaction Analysis", None, None, "competition"),
            (36, "Scenario Analysis", None, None, "planner"),
            (37, "Risk Analysis", None, None, "risk"),
            (38, "Catalysts Analysis", None, None, "transcript"),
            (39, "Historical Performance Review", None, None, "annualReport"),
            (40, "Financial Projections", None, None, "planner"),
            (41, "Earnings Quality Analysis", None, None, "ratio"),
            (
                42,
                "Shareholding Pattern Analysis",
                "src/charts/shareholding.png",
                None,
                "bse",
            ),
            (43, "Dividend Analysis", None, None, "nse"),
            (44, "Market Sentiment Analysis", None, None, "nse"),
            (45, "Trading & Liquidity Analysis", None, None, "nse"),
            (46, "Technical Analysis", None, None, "bse"),
            (47, "Strategic Initiatives", None, None, "transcript"),
            (48, "Investment Risks & Mitigation", None, None, "risk"),
            (49, "Final Recommendation", None, None, "finalText"),
            (
                50,
                "Appendix & Supporting Data",
                None,
                [
                    [
                        "Metric",
                        (
                            DATA_INPUT["financials"]["years"][-3]
                            if len(DATA_INPUT["financials"]["years"]) > 2
                            else "Year 1"
                        ),
                        (
                            DATA_INPUT["financials"]["years"][-2]
                            if len(DATA_INPUT["financials"]["years"]) > 1
                            else "Year 2"
                        ),
                        (
                            DATA_INPUT["financials"]["years"][-1]
                            if len(DATA_INPUT["financials"]["years"]) > 0
                            else "Year 3"
                        ),
                    ],
                    [
                        "Revenue (Rs Cr)",
                        str(
                            DATA_INPUT["financials"]["sales"][-3]
                            if len(DATA_INPUT["financials"]["sales"]) > 2
                            else "-"
                        ),
                        str(
                            DATA_INPUT["financials"]["sales"][-2]
                            if len(DATA_INPUT["financials"]["sales"]) > 1
                            else "-"
                        ),
                        str(
                            DATA_INPUT["financials"]["sales"][-1]
                            if len(DATA_INPUT["financials"]["sales"]) > 0
                            else "-"
                        ),
                    ],
                    [
                        "EBITDA (Rs Cr)",
                        str(
                            DATA_INPUT["financials"]["ebitda"][-3]
                            if len(DATA_INPUT["financials"]["ebitda"]) > 2
                            else "-"
                        ),
                        str(
                            DATA_INPUT["financials"]["ebitda"][-2]
                            if len(DATA_INPUT["financials"]["ebitda"]) > 1
                            else "-"
                        ),
                        str(
                            DATA_INPUT["financials"]["ebitda"][-1]
                            if len(DATA_INPUT["financials"]["ebitda"]) > 0
                            else "-"
                        ),
                    ],
                    [
                        "Net Profit (Rs Cr)",
                        str(
                            DATA_INPUT["financials"]["net_profit"][-3]
                            if len(DATA_INPUT["financials"]["net_profit"]) > 2
                            else "-"
                        ),
                        str(
                            DATA_INPUT["financials"]["net_profit"][-2]
                            if len(DATA_INPUT["financials"]["net_profit"]) > 1
                            else "-"
                        ),
                        str(
                            DATA_INPUT["financials"]["net_profit"][-1]
                            if len(DATA_INPUT["financials"]["net_profit"]) > 0
                            else "-"
                        ),
                    ],
                ],
                "cro",
            ),
        ]

        for sec_num, title, chart, table, ai_key in sections:
            self.generate_generic_section(sec_num, title, chart, table, ai_key)

        self.doc.build(self.story)
        print(f"Success! Report generated at {self.filepath}")


if __name__ == "__main__":
    generator = ReportGenerator()
    generator.build_report()
