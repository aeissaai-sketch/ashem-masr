
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'user-stocks-list.txt');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n').filter(line => line.trim());
// Skip header line
const dataLines = lines.slice(1);

const stocksData = dataLines.map(line => {
    // Split by tabs
    const parts = line.split('\t').map(p => p.trim());
    const [name, symbol, isin, rawUrl] = parts;
    // Clean the url (remove any surrounding spaces or quotes)
    const egxLink = rawUrl.replace(/[`'"]/g, '').trim();
    
    return {
        name: name,
        symbol: symbol,
        isin: isin,
        egxLink: egxLink
    };
});

console.log(`Parsed ${stocksData.length} stocks!`);

// Write to a file
const output = `const stocksData = ${JSON.stringify(stocksData, null, 2)};`;
fs.writeFileSync(path.join(__dirname, 'stocks-data-final.js'), output);

console.log('Saved to stocks-data-final.js!');
console.log('First 3:', stocksData.slice(0, 3));
