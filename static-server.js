process.env.NODE_PATH = require('path').join(__dirname, 'stock-news-backend', 'node_modules');
require('module').Module._initPaths();

const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Cache duration: 5 minutes (300,000 ms)
const CACHE_DURATION = 5 * 60 * 1000;

// Supabase details
const SUPABASE_URL = "https://urshusyogkcmlvjqmjly.supabase.co";
const SUPABASE_KEY = "sb_publishable_CN_bPJCoE0nXcZTuSaWHoA_MsmD9bN0";

// Helper function to call Supabase REST API via Node https module (Zero-dependency)
function makeSupabaseRequest(method, pathStr, body = null, extraHeaders = {}) {
    return new Promise((resolve, reject) => {
        const url = `${SUPABASE_URL}/rest/v1${pathStr}`;
        const parsedUrl = new URL(url);
        
        const headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            ...extraHeaders
        };
        
        const options = {
            hostname: parsedUrl.hostname,
            port: 443,
            path: parsedUrl.pathname + parsedUrl.search,
            method: method,
            headers: headers
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(data ? JSON.parse(data) : {});
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject(new Error(`Supabase error (${res.statusCode}): ${data}`));
                }
            });
        });
        
        req.on('error', (e) => {
            reject(e);
        });
        
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

// Sync Functions
async function syncPortfolioFromSupabase() {
    try {
        console.log("🔄 Fetching portfolio from Supabase...");
        const rows = await makeSupabaseRequest('GET', '/portfolio');
        if (Array.isArray(rows)) {
            const portfolioData = rows.map(r => ({
                symbol: r.symbol,
                name: r.name,
                quantity: Number(r.quantity),
                entryPrice: Number(r.entry_price),
                addedDate: new Date(r.updated_at || Date.now()).toLocaleDateString('en-GB')
            }));
            const filePath = path.join(__dirname, 'Data', 'portfolio.json');
            fs.writeFileSync(filePath, JSON.stringify(portfolioData, null, 2), 'utf-8');
            console.log(`✅ Synced ${portfolioData.length} stocks from Supabase to portfolio.json`);
        }
    } catch (e) {
        console.error("❌ Failed to sync portfolio from Supabase:", e.message);
    }
}

async function syncStockDataFromSupabase() {
    try {
        console.log("🔄 Fetching stock history from Supabase...");
        const rows = await makeSupabaseRequest('GET', '/all_stocks_data');
        if (Array.isArray(rows)) {
            const companies = rows.map(r => ({
                symbol: r.symbol,
                longName: r.name,
                shortName: r.name,
                price: Number(r.current_price || 0),
                historical: r.history || []
            }));
            const stockDataJson = { companies };
            const filePath = path.join(__dirname, 'Data', 'stock_data.json');
            fs.writeFileSync(filePath, JSON.stringify(stockDataJson, null, 2), 'utf-8');
            console.log(`✅ Synced ${companies.length} stocks with 200-day histories from Supabase to stock_data.json`);
        }
    } catch (e) {
        console.error("❌ Failed to sync stock data from Supabase:", e.message);
    }
}

async function fetchYahooPrice(symbol) {
    return new Promise((resolve) => {
        const yahooSymbol = `${symbol}.CA`;
        const options = {
            hostname: 'query1.finance.yahoo.com',
            port: 443,
            path: `/v8/finance/chart/${yahooSymbol}?interval=1d&range=2d`,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Connection': 'keep-alive'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        if (json.chart && json.chart.result && json.chart.result[0]) {
                            const chart = json.chart.result[0];
                            const meta = chart.meta;
                            const currentPrice = meta.regularMarketPrice;
                            const prevClose = meta.chartPreviousClose || currentPrice;
                            const changeVal = currentPrice - prevClose;
                            const changePct = prevClose > 0 ? (changeVal / prevClose) * 100 : 0;
                            
                            const quotes = chart.indicators?.quote?.[0] || {};
                            const getVal = (arr, fallback) => (arr && arr.length > 0) ? arr[arr.length - 1] : fallback;
                            
                            const openVal = getVal(quotes.open, currentPrice);
                            const highVal = getVal(quotes.high, meta.regularMarketDayHigh || currentPrice);
                            const lowVal = getVal(quotes.low, meta.regularMarketDayLow || currentPrice);
                            const volumeVal = getVal(quotes.volume, meta.regularMarketVolume || 0);

                            resolve({
                                symbol: symbol,
                                price: currentPrice,
                                changeVal: changeVal,
                                changePct: changePct,
                                open: Number.isFinite(openVal) ? openVal : currentPrice,
                                high: Number.isFinite(highVal) ? highVal : currentPrice,
                                low: Number.isFinite(lowVal) ? lowVal : currentPrice,
                                volume: Number.isFinite(volumeVal) ? volumeVal : 0,
                                success: true
                            });
                        } else {
                            resolve({ symbol, success: false, error: 'No chart result data' });
                        }
                    } catch (e) {
                        resolve({ symbol, success: false, error: e.message });
                    }
                } else {
                    resolve({ symbol, success: false, error: `HTTP ${res.statusCode}` });
                }
            });
        });

        req.on('error', (e) => {
            resolve({ symbol, success: false, error: e.message });
        });

        req.end();
    });
}

app.use(express.json({ limit: '50mb' }));

// Intercept file requests to dynamically sync from Supabase database
app.get('/Data/portfolio.json', async (req, res) => {
    await syncPortfolioFromSupabase();
    res.sendFile(path.join(__dirname, 'Data', 'portfolio.json'));
});

app.get('/Data/stock_data.json', async (req, res) => {
    await syncStockDataFromSupabase();
    res.sendFile(path.join(__dirname, 'Data', 'stock_data.json'));
});

// Serve root and static frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(path.join(__dirname)));

// Save Portfolio API (Saves local + uploads to Supabase)
app.post('/api/save-portfolio', async (req, res) => {
    const portfolioData = req.body;
    const filePath = path.join(__dirname, 'Data', 'portfolio.json');
    try {
        // 1. Write local file
        fs.writeFileSync(filePath, JSON.stringify(portfolioData, null, 2), 'utf-8');
        console.log(`💾 Local portfolio.json updated.`);
        
        // 2. Sync to Supabase
        console.log("📤 Syncing portfolio to Supabase...");
        await makeSupabaseRequest('DELETE', '/portfolio?id=gt.0'); // Clear existing
        if (portfolioData.length > 0) {
            const payload = portfolioData.map(item => ({
                symbol: item.symbol,
                name: item.name,
                quantity: Number(item.quantity || 0),
                entry_price: Number(item.entryPrice || 0),
                market_price: Number(item.entryPrice || 0), // Initial default
                sector: item.sector || 'Other'
            }));
            await makeSupabaseRequest('POST', '/portfolio', payload);
        }
        console.log("✅ Supabase portfolio updated successfully.");
        res.json({ success: true, message: 'Portfolio saved successfully locally and on Supabase!' });
    } catch (error) {
        console.error('❌ Error saving portfolio:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save Stock Data API (Saves local + uploads to Supabase)
app.post('/api/save-stock-data', async (req, res) => {
    const stockData = req.body;
    const filePath = path.join(__dirname, 'Data', 'stock_data.json');
    try {
        // 1. Write local file
        fs.writeFileSync(filePath, JSON.stringify(stockData, null, 2), 'utf-8');
        console.log(`💾 Local stock_data.json updated.`);
        
        // 2. Sync to Supabase in batches of 50
        console.log("📤 Syncing stock data to Supabase...");
        const companies = stockData.companies || stockData;
        const companiesList = Array.isArray(companies) ? companies : Object.values(companies);
        
        const payload = companiesList.map(item => ({
            symbol: item.symbol,
            name: item.longName || item.shortName || item.symbol,
            current_price: Number(item.price || 0),
            history: item.historical || []
        }));
        
        const batchSize = 50;
        for (let i = 0; i < payload.length; i += batchSize) {
            const batch = payload.slice(i, i + batchSize);
            await makeSupabaseRequest('POST', '/all_stocks_data', batch, {
                "Prefer": "resolution=merge-duplicates"
            });
        }
        console.log("✅ Supabase stock data updated successfully.");
        res.json({ success: true, message: 'Stock data saved successfully locally and on Supabase!' });
    } catch (error) {
        console.error('❌ Error saving stock data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save Experts Recommendations API
app.post('/api/save-experts-recommendations', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, 'Data', 'experts_recommendations.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`💾 Experts recommendations updated and saved to: ${filePath}`);
        res.json({ success: true, message: 'Recommendations saved successfully!' });
    } catch (error) {
        console.error('Error saving experts recommendations:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Real-time EGX prices API with server-side caching
app.get('/api/prices', async (req, res) => {
    const symbolsStr = req.query.symbols || '';
    if (!symbolsStr) {
        return res.json({ success: false, error: 'No symbols specified' });
    }
    const symbols = symbolsStr.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    const now = Date.now();
    
    if (!global.pricesCacheMap) {
        global.pricesCacheMap = new Map();
    }
    
    const results = [];
    const fetchPromises = [];
    
    for (const symbol of symbols) {
        const cached = global.pricesCacheMap.get(symbol);
        if (cached && (now - cached.timestamp < CACHE_DURATION)) {
            results.push(cached.data);
        } else {
            fetchPromises.push(
                fetchYahooPrice(symbol).then(data => {
                    if (data.success) {
                        global.pricesCacheMap.set(symbol, {
                            timestamp: now,
                            data: data
                        });
                    }
                    return data;
                })
            );
        }
    }
    
    if (fetchPromises.length > 0) {
        const fetchedData = [];
        for (const p of fetchPromises) {
            const data = await p;
            fetchedData.push(data);
            await new Promise(r => setTimeout(r, 60)); // 60ms delay
        }
        results.push(...fetchedData);
    }
    
    res.json({ success: true, timestamp: now, data: results });
});

// XML Parsing Helper for RSS
function parseRss(xml) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
        const itemContent = match[1];
        const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
        const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
        const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        
        const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
        const link = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
        const pubDate = pubDateMatch ? pubDateMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
        
        if (title && link) {
            items.push({
                title,
                link,
                pubDate: pubDate ? new Date(pubDate).toLocaleDateString('ar-EG') : new Date().toLocaleDateString('ar-EG')
            });
        }
    }
    return items;
}

// Server-side CORS proxy to bypass blocks on news
app.get('/api/proxy', (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'No URL specified' });
    }
    
    https.get(targetUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*'
        }
    }, (proxyRes) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'text/xml; charset=utf-8');
        proxyRes.pipe(res);
    }).on('error', (e) => {
        res.status(500).json({ error: e.message });
    });
});

// JSON News API using Google News
app.get('/api/news', (req, res) => {
    const query = req.query.q || '';
    if (!query) {
        return res.json({ success: true, items: [] });
    }
    
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ar&gl=EG&ceid=EG:ar`;
    
    https.get(rssUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    }, (proxyRes) => {
        let body = '';
        proxyRes.on('data', chunk => body += chunk);
        proxyRes.on('end', () => {
            const parsed = parseRss(body);
            res.json({ success: true, items: parsed });
        });
    }).on('error', (e) => {
        res.status(500).json({ error: e.message });
    });
});

app.listen(PORT, async () => {
  console.log('🚀 Static server running at http://localhost:' + PORT);
  console.log('📂 Serving files from: ' + __dirname);
  
  // Perform initial synchronization on start
  await syncPortfolioFromSupabase();
  await syncStockDataFromSupabase();
});
