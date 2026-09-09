const fs = require('fs');
const path = require('path');

const agentsDir = path.join(__dirname, 'src', 'agents');
const files = fs.readdirSync(agentsDir);

for (const file of files) {
  if (file.endsWith('.js') && file !== 'VerificationAgent.js' && file !== 'CriticAgent.js' && file !== 'DataExtractionAgent.js') {
    const filePath = path.join(agentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Update run signature
    if (content.includes('async run(companyName, state) {') || content.includes('async run(companyName, currentState) {') || content.includes('async run(companyName, draftText) {')) {
      content = content.replace(/async run\(companyName,\s*[a-zA-Z]+\)\s*\{/, 'async run(companyName, context, options = {}) {');
    }

    // Replace invoke with execute
    if (content.includes('this.invoke(prompt)')) {
      content = content.replace('this.invoke(prompt)', 'this.execute(prompt, options)');
    } else if (content.includes('this.invoke(userPrompt)')) {
      content = content.replace('this.invoke(userPrompt)', 'this.execute(userPrompt, options)');
    } else if (content.includes('this.invoke(')) {
       // Catch all
       content = content.replace(/this\.invoke\((.*?)\)/, 'this.execute($1, options)');
    }

    // Fix state reference if needed
    content = content.replace(/JSON\.stringify\(state,/g, 'JSON.stringify(context,');
    content = content.replace(/JSON\.stringify\(currentState,/g, 'JSON.stringify(context,');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
