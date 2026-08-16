const SUPABASE_URL = "https://urshusyogkcmlvjqmjly.supabase.co";
const SUPABASE_KEY = "sb_publishable_CN_bPJCoE0nXcZTuSaWHoA_MsmD9bN0";

const supabaseHeaders = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
};

// Fetch portfolio from Supabase
async function getPortfolioFromSupabase() {
    console.log("🔍 Fetching portfolio from Supabase...");
    const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio?select=*`, { 
        headers: supabaseHeaders,
        cache: 'no-store'
    });
    if (!res.ok) throw new Error(`Supabase portfolio error: ${res.statusText}`);
    const rows = await res.json();
    return rows.map(r => ({
        symbol: r.symbol,
        name: r.name,
        quantity: Number(r.quantity),
        entryPrice: Number(r.entry_price),
        marketPrice: Number(r.market_price || r.entry_price),
        sector: r.sector || 'Other',
        addedDate: new Date(r.updated_at || Date.now()).toLocaleDateString('en-GB')
    }));
}

// Save portfolio to Supabase
async function savePortfolioToSupabase(portfolioData) {
    console.log("📤 Saving portfolio to Supabase...");
    // 1. Delete existing rows (using id=gt.0 filter to bypass PostgREST safety block)
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/portfolio?id=gt.0`, {
        method: "DELETE",
        headers: supabaseHeaders
    });
    if (!delRes.ok) throw new Error(`Failed to clear old portfolio: ${delRes.statusText}`);
    
    // 2. Insert new rows
    if (!Array.isArray(portfolioData) || portfolioData.length === 0) return;
    const payload = portfolioData.map(item => ({
        symbol: item.symbol,
        name: item.name,
        quantity: Number(item.quantity || 0),
        entry_price: Number(item.entryPrice || 0),
        market_price: Number(item.marketPrice || item.entryPrice || 0),
        sector: item.sector || 'Other'
    }));
    
    const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio`, {
        method: "POST",
        headers: supabaseHeaders,
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Save portfolio failed: ${res.statusText}`);
    console.log("✅ Portfolio saved to Supabase successfully.");
}

// Fetch stock data from Supabase (all 225 stocks with 200-day histories)
async function getStockDataFromSupabase() {
    console.log("🔍 Fetching all stocks and histories from Supabase...");
    const res = await fetch(`${SUPABASE_URL}/rest/v1/all_stocks_data?select=*`, { 
        headers: supabaseHeaders,
        cache: 'no-store'
    });
    if (!res.ok) throw new Error(`Supabase stock data error: ${res.statusText}`);
    const rows = await res.json();
    const companies = rows.map(r => ({
        symbol: r.symbol,
        longName: r.name,
        shortName: r.name,
        price: Number(r.current_price || 0),
        historical: r.history || []
    }));
    return { companies };
}

// Save stock data to Supabase (for manual upload)
async function saveStockDataToSupabase(stockData) {
    console.log("📤 Saving stock data to Supabase...");
    const companies = stockData.companies || stockData;
    const companiesList = Array.isArray(companies) ? companies : Object.values(companies);
    
    const payload = companiesList.map(item => ({
        symbol: item.symbol,
        name: item.longName || item.shortName || item.symbol,
        current_price: Number(item.price || 0),
        history: item.historical || []
    }));
    
    // Upload in batches of 50 to avoid size limits
    const batchSize = 50;
    for (let i = 0; i < payload.length; i += batchSize) {
        const batch = payload.slice(i, i + batchSize);
        const res = await fetch(`${SUPABASE_URL}/rest/v1/all_stocks_data`, {
            method: "POST",
            headers: {
                ...supabaseHeaders,
                "Prefer": "resolution=merge-duplicates"
            },
            body: JSON.stringify(batch)
        });
        if (!res.ok) throw new Error(`Save stock data batch failed: ${res.statusText}`);
    }
    console.log("✅ Stock data saved to Supabase successfully.");
}
