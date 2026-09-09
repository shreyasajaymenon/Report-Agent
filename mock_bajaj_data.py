import json

text_content = """Bajaj Consumer Care Ltd. is a leading Indian FMCG company, primarily operating in the hair care segment. The company is renowned for its flagship brand, Bajaj Almond Drops Hair Oil, which commands a dominant market share in the light hair oil category. The company's strategic focus remains on expanding its footprint in both rural and urban markets through robust distribution networks and targeted marketing campaigns.

The FMCG sector in India is experiencing a structural shift driven by premiumization, rising disposable incomes, and an expanding middle class. Bajaj Consumer Care is well-positioned to capitalize on these trends by leveraging its strong brand equity and extensive reach. The company's transition from a single-product reliance to a diversified portfolio of personal care products underscores its commitment to long-term sustainable growth.

In recent quarters, the company has demonstrated resilience amidst inflationary pressures. The cooling off of key raw material prices, particularly Light Liquid Paraffin (LLP) and refined mustard oil, has provided significant tailwinds to gross margins. Management's proactive pricing strategies and cost optimization initiatives have further bolstered profitability, ensuring the company maintains its competitive edge in a highly contested market.

Volume growth remains the primary driver of top-line expansion. The company has aggressively invested in brand-building exercises and digital marketing to engage with younger demographics. E-commerce and modern trade channels have emerged as critical growth engines, compensating for occasional softness in traditional wholesale channels. The management's focus on data-driven decision-making has enhanced inventory management and supply chain efficiency.

The competitive landscape in the Indian hair oil market is intense, with established players like Marico, Dabur, and Emami vying for market share. Bajaj Consumer Care differentiates itself through its niche positioning in the premium light hair oil segment. The company's continuous investment in research and development has led to the successful launch of brand extensions, including serums and specialized hair care solutions, which have been well-received by consumers.

Financial prudence is a hallmark of Bajaj Consumer Care's operating philosophy. The company maintains a zero-debt balance sheet, providing it with immense financial flexibility to navigate macroeconomic uncertainties. Strong free cash flow generation enables the company to consistently reward shareholders through healthy dividend payouts and share buybacks. This disciplined capital allocation framework is highly regarded by institutional investors.

Rural demand, a critical component of the company's revenue matrix, has shown signs of revival following normalized monsoon patterns and increased government spending on agricultural infrastructure. The company's direct reach expansion initiatives in hinterland markets have yielded positive results, increasing product availability and visibility. The strategic deployment of localized marketing campaigns has deepened brand penetration across diverse geographies.

Looking ahead, Bajaj Consumer Care is pivoting towards a comprehensive personal care identity. The foray into skincare and hygiene products, while currently a small portion of the overall revenue, represents significant optionality. The management's willingness to explore inorganic growth opportunities through strategic acquisitions further enhances the long-term value proposition. The company's robust governance framework and experienced leadership team provide a strong foundation for future execution.

Valuation metrics indicate that the company trades at a discount to its FMCG peers, primarily due to historical product concentration risks. However, as the diversification strategy gains traction and volume-led growth materializes, a potential re-rating of the stock is highly probable. The combination of an attractive dividend yield, a pristine balance sheet, and improving operational metrics presents a compelling risk-reward scenario for long-term investors.

The company's ESG initiatives are gaining prominence, with a renewed focus on sustainable packaging and ethical sourcing. The reduction of plastic usage in product packaging and the transition towards renewable energy sources in manufacturing facilities align with global sustainability standards. These initiatives not only mitigate environmental risks but also resonate with conscious consumers, indirectly supporting brand loyalty and market positioning.

Overall, Bajaj Consumer Care stands at an inflection point. The successful execution of its premiumization and diversification strategies, coupled with a favorable raw material pricing environment, sets the stage for a period of accelerated earnings growth. The company's established brand heritage, combined with modern distribution capabilities, ensures it remains a formidable player in the Indian FMCG landscape for years to come."""

massive_text = "\n".join([text_content] * 40)

data = {
    "companyName": "Bajaj Consumer Care Ltd",
    "sections": {
        "cro": massive_text,
        "planner": massive_text,
        "discovery": massive_text,
        "competition": massive_text,
        "presentation": massive_text,
        "financial": massive_text,
        "ratio": massive_text,
        "annualReport": massive_text,
        "governance": massive_text,
        "industry": massive_text,
        "companyIR": massive_text,
        "quarterly": massive_text,
        "risk": massive_text,
        "bse": massive_text,
        "nse": massive_text,
        "transcript": massive_text,
        "valuation": massive_text,
        "finalText": massive_text
    }
}

with open("report_data.json", "w") as f:
    json.dump(data, f)

print("Mock data generated successfully.")
