
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'New folder', 'Data', 'stock_data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const companies = Object.keys(data.companies).map((symbol) => {
  const company = data.companies[symbol];
  return {
    name: company.longName || company.shortName || symbol,
    symbol: symbol,
    // We don't have ISIN, so we'll use symbol as a fallback
    isin: symbol,
    // Generate EGX link (we can use symbol as part of the URL, or a generic one)
    egxLink: `https://www.egx.com.eg/ar/NewsList.aspx`
  };
});

console.log('Found', companies.length, 'companies!');
console.log('Sample:', companies.slice(0, 5));

// Write to a JS file we can copy-paste
fs.writeFileSync(path.join(__dirname, 'all-companies.js'), `const stocksData = ${JSON.stringify(companies, null, 2)};`);
console.log('Wrote all-companies.js');
