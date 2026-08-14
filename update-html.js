
const fs = require('fs');
const path = require('path');

// Read the final stocks data
const stocksDataPath = path.join(__dirname, 'final-stocks-data.json');
const stocksData = JSON.parse(fs.readFileSync(stocksDataPath, 'utf8'));

// Read the HTML file
const htmlPath = path.join(__dirname, 'pages', 'egypt-stocks-specific-news.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Find and replace the stocksData array
const oldStocksDataMatch = html.match(/const stocksData = \[[\s\S]*?\];/);
if (oldStocksDataMatch) {
  const newStocksDataStr = `const stocksData = ${JSON.stringify(stocksData, null, 2)};`;
  html = html.replace(oldStocksDataMatch[0], newStocksDataStr);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Successfully updated egypt-stocks-specific-news.html!');
} else {
  console.error('Could not find stocksData array in the HTML file.');
}
