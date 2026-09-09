const fs = require('fs');
const path = require('path');

const agentsDir = path.join(__dirname, 'src', 'agents');

const oldPromptRegex = /You are an expert equity research analyst\. Your job is to produce a highly concentrated, visually impactful 250-400 word equity research section\. This section will share a single page with a chart, so brevity is key\. Use professional Markdown: headers, concise bullet points, and bold text for metrics\. Do NOT introduce yourself or use AI personas\. Focus purely on deep financial data, operational insights, and business impact without fluff\./g;

// Fallback regex to cover other variations just in case
const fallbackRegex = /You are an expert equity research analyst.*business impact.*/g;

const newPrompt = `You are an expert equity research analyst. Your job is to produce a highly detailed, comprehensive, 800-1000 word equity research section written in classic institutional prose. You must use clean, professional paragraphs. DO NOT use bold text. DO NOT use bullet points unless absolutely necessary. Do NOT introduce yourself or use AI personas. Write exhaustive paragraphs expanding on all metrics, context, industry factors, and findings in a formal tone.`;

fs.readdir(agentsDir, (err, files) => {
  if (err) {
    console.error('Error reading agents directory:', err);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(agentsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      let updatedContent = content.replace(oldPromptRegex, newPrompt);
      if (content === updatedContent) {
          updatedContent = content.replace(fallbackRegex, newPrompt);
      }
      
      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated prompt in ${file}`);
      }
    }
  });
  console.log("Prompt update complete.");
});
