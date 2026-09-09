const PDFDocument = require('pdfkit-table'); // Upgraded to support tables
const fs = require('fs');

class PDFGenerator {
  constructor(companyName) {
    this.companyName = companyName;
    this.doc = new PDFDocument({ margin: 50, size: 'A4' });
    this.stream = fs.createWriteStream(`${companyName.replace(/ /g, '_')}_Equity_Research.pdf`);
    this.doc.pipe(this.stream);
    
    // Institutional colors
    this.colors = {
      deepBlue: '#1a365d',
      orange: '#f97316',
      text: '#334155',
      lightGray: '#f1f5f9'
    };
  }

  generateCoverPage() {
    this.doc.rect(0, 0, this.doc.page.width, 20).fill(this.colors.deepBlue);
    this.doc.moveDown(5);
    
    this.doc.fillColor(this.colors.deepBlue)
            .fontSize(32)
            .font('Helvetica-Bold')
            .text(`${this.companyName}`, { align: 'center' });
            
    this.doc.fillColor(this.colors.orange)
            .fontSize(20)
            .text(`Comprehensive Equity Research Report`, { align: 'center' });
            
    this.doc.moveDown(2);
    this.doc.fillColor(this.colors.text)
            .fontSize(12)
            .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
            
    this.doc.moveDown();
    this.doc.text(`Analyst: AI Research Swarm`, { align: 'center' });
    this.doc.text(`For Institutional Investors Only`, { align: 'center' });

    this.doc.addPage();
  }

  generateDisclaimer() {
    this.doc.fillColor(this.colors.deepBlue)
            .fontSize(22)
            .font('Helvetica-Bold')
            .text('Disclaimer', { underline: true });
            
    this.doc.moveDown();
    this.doc.fillColor(this.colors.text)
            .fontSize(10)
            .font('Helvetica')
            .text(
      'This equity research report is published for informational and educational purposes only and does not constitute ' +
      'investment advice, a solicitation, or an offer to buy or sell any securities. The information contained herein has been ' +
      'compiled from publicly available sources (via our web-scraping agents). No representation or warranty is made as to accuracy.'
    );
    this.doc.addPage();
  }

  async generateContentSection(title, content) {
    // If we are too close to the bottom, start a new page for the header
    if (this.doc.y > this.doc.page.height - 150) {
      this.doc.addPage();
    } else {
      this.doc.moveDown(2); // Just add some space if continuing on same page
    }

    // Add Blue Header
    this.doc.rect(this.doc.page.margins.left, this.doc.y, this.doc.page.width - 100, 30).fill(this.colors.lightGray);
    this.doc.fillColor(this.colors.deepBlue)
            .fontSize(20)
            .font('Helvetica-Bold')
            .text(title, { paragraphGap: 20 });
            
    this.doc.moveDown();
    
    // Parse content and simulate dense structure
    const paragraphs = content.split('\n\n');
    
    for (const paragraph of paragraphs) {
      if (paragraph.startsWith('##') || paragraph.startsWith('**')) {
        this.doc.fillColor(this.colors.deepBlue)
                .fontSize(14)
                .font('Helvetica-Bold')
                .text(paragraph.replace(/#/g, '').replace(/\*/g, ''), { paragraphGap: 10 });
      } else {
        this.doc.fillColor(this.colors.text)
                .fontSize(10)
                .font('Helvetica')
                .text(paragraph, { 
                  align: 'justify',
                  columns: 2, // Newspaper style columns
                  columnGap: 20,
                  paragraphGap: 15
                });
      }
      // Auto page break is handled natively by PDFKit
    }
    // Removed the forced this.doc.addPage() to prevent blank empty pages
  }

  async finalize(state) {
    this.doc.end();
    return new Promise((resolve) => {
      this.stream.on('finish', resolve);
    });
  }
}

module.exports = PDFGenerator;
