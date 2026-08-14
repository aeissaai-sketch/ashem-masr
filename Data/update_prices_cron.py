import json
import requests
import yfinance as yf
from datetime import datetime
import pytz
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Configuration
SUPABASE_URL = "https://urshusyogkcmlvjqmjly.supabase.co"
SUPABASE_KEY = "sb_publishable_CN_bPJCoE0nXcZTuSaWHoA_MsmD9bN0"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

# Cairo timezone
cairo_tz = pytz.timezone('Africa/Cairo')
today_cairo = datetime.now(cairo_tz).strftime('%Y-%m-%d')

print(f"Starting update cron at {datetime.now(cairo_tz).strftime('%Y-%m-%d %I:%M:%S %p')} Cairo Time")

# 1. Fetch symbols from Supabase tables
print("Fetching active symbols from database...")
try:
    # Get symbols from portfolio
    res_p = requests.get(f"{SUPABASE_URL}/rest/v1/portfolio", headers=headers)
    portfolio_symbols = [r['symbol'].upper().strip() for r in res_p.json()] if res_p.status_code == 200 else []
    
    # Get symbols from all_stocks_data
    res_a = requests.get(f"{SUPABASE_URL}/rest/v1/all_stocks_data?select=symbol,name,history", headers=headers)
    all_stocks = res_a.json() if res_a.status_code == 200 else []
except Exception as e:
    print("Failed to fetch database symbols:", e)
    exit(1)

if not all_stocks:
    print("No stocks found in database to update.")
    exit(1)

# Extract symbols
symbols_list = [s['symbol'] for s in all_stocks]
yf_symbols = [f"{s}.CA" for s in symbols_list]

print(f"Found {len(symbols_list)} stocks. Downloading live prices from Yahoo Finance...")

# 2. Download prices from yfinance (using 5d period for high stability and to avoid Yahoo rate-limits/empty responses)
try:
    data = yf.download(yf_symbols, period="5d")
except Exception as e:
    print("Yahoo Finance download failed:", e)
    exit(1)

# 3. Process updates
all_stocks_payload = []
portfolio_payload = []

print("Processing stock price updates and appending to history...")
for stock in all_stocks:
    sym = stock['symbol']
    name = stock['name']
    history = stock.get('history', [])
    if not isinstance(history, list):
        history = []
        
    yf_sym = f"{sym}.CA"
    current_price = None
    current_open = None
    current_high = None
    current_low = None
    current_volume = 0
    
    # Extract OHLCV from yfinance
    if data is not None and yf_sym in data['Close'].columns:
        closes = data['Close'][yf_sym].dropna()
        if not closes.empty:
            idx = closes.index[-1]
            current_price = float(closes.iloc[-1])
            
            try:
                current_open = float(data['Open'][yf_sym].loc[idx])
            except:
                current_open = current_price
                
            try:
                current_high = float(data['High'][yf_sym].loc[idx])
            except:
                current_high = current_price
                
            try:
                current_low = float(data['Low'][yf_sym].loc[idx])
            except:
                current_low = current_price
                
            try:
                current_volume = int(data['Volume'][yf_sym].loc[idx])
            except:
                current_volume = 0
            
    if current_price is None or current_price == 0:
        # Skip updating if no price fetched
        continue

    # Update history array
    # If today's date exists, update it. Otherwise append.
    date_exists = False
    for point in history:
        if point.get('date') == today_cairo:
            point['close'] = current_price
            point['open'] = current_open if current_open is not None else current_price
            point['high'] = current_high if current_high is not None else current_price
            point['low'] = current_low if current_low is not None else current_price
            point['volume'] = current_volume
            date_exists = True
            break
            
    if not date_exists:
        history.append({
            "date": today_cairo,
            "close": current_price,
            "open": current_open if current_open is not None else current_price,
            "high": current_high if current_high is not None else current_price,
            "low": current_low if current_low is not None else current_price,
            "volume": current_volume
        })
        # Keep history capped at 200 days
        if len(history) > 200:
            history = history[-200:]
            
    all_stocks_payload.append({
        "symbol": sym,
        "name": name,
        "current_price": current_price,
        "history": history
    })
    
    # If this stock is in user portfolio, update portfolio market price
    if sym in portfolio_symbols:
        portfolio_payload.append({
            "symbol": sym,
            "market_price": current_price
        })

# 4. Upload updates to Supabase
if all_stocks_payload:
    print(f"Uploading updates for {len(all_stocks_payload)} stocks to Supabase...")
    # Upload all stocks data in batches of 50
    batch_size = 50
    for i in range(0, len(all_stocks_payload), batch_size):
        batch = all_stocks_payload[i:i+batch_size]
        try:
            res = requests.post(f"{SUPABASE_URL}/rest/v1/all_stocks_data?on_conflict=symbol", headers=headers, json=batch)
            if res.status_code not in [200, 201]:
                print(f"Failed to upload batch {i//batch_size + 1}: {res.text}")
            else:
                print(f"Batch {i//batch_size + 1} uploaded successfully.")
        except Exception as e:
            print(f"Error uploading batch {i//batch_size + 1}: {e}")
else:
    print("No prices fetched to update.")

# Upload portfolio updates
if portfolio_payload:
    print(f"Updating market prices for {len(portfolio_payload)} stocks in user portfolio...")
    for item in portfolio_payload:
        # Patch single stock price in portfolio
        try:
            url = f"{SUPABASE_URL}/rest/v1/portfolio?symbol=eq.{item['symbol']}"
            res = requests.patch(url, headers=headers, json={"market_price": item['market_price']})
            if res.status_code not in [200, 201, 204]:
                print(f"Failed to patch portfolio for {item['symbol']}: {res.text}")
        except Exception as e:
            print(f"Error patching portfolio for {item['symbol']}: {e}")

print("Database synchronization completed successfully!")
