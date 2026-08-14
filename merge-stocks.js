
const fs = require('fs');
const path = require('path');

// قراءة البيانات
const stockDataPath = path.join(__dirname, 'New folder', 'Data', 'stock_data.json');
const stockData = JSON.parse(fs.readFileSync(stockDataPath, 'utf8'));

// نستخدم require مباشرة
const stocksList = require('./stock-news-backend/src/data/stocksList');

// نعمل خريطة للوصول السريع للأسهم القديمة
const oldStocksMap = {};
stocksList.forEach(stock => {
  oldStocksMap[stock.symbol] = stock;
});

// نجهز القائمة الجديدة
const newStocksData = Object.keys(stockData.companies).map(symbol => {
  const company = stockData.companies[symbol];
  const oldStock = oldStocksMap[symbol];
  
  let isin = symbol;
  let egxLink = 'https://www.egx.com.eg/ar/NewsList.aspx';
  
  if (oldStock) {
    isin = oldStock.isin;
    egxLink = oldStock.url;
  }
  
  return {
    name: company.longName || company.shortName || symbol,
    symbol: symbol,
    isin: isin,
    egxLink: egxLink
  };
});

console.log('تم دمج', newStocksData.length, 'سهم!');
console.log('مثال:', newStocksData.slice(0, 5));

// نكتب النتيجة لملف مؤقت
const outputJs = 'const stocksData = ' + JSON.stringify(newStocksData, null, 2) + ';';
fs.writeFileSync(path.join(__dirname, 'all-stocks-fixed.js'), outputJs);
console.log('تم الحفظ في all-stocks-fixed.js');
