import sys
import io
import json
import time
import urllib.request
import concurrent.futures

# Set UTF-8 encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Try importing DrissionPage, if fails, we fallback to Yahoo Finance only
try:
    from DrissionPage import ChromiumPage
    HAS_DRISSION = True
except ImportError:
    HAS_DRISSION = False

def clean_arabic_name(name):
    if not name:
        return ""
    # remove spaces and special characters for looser matching
    name = "".join(name.split())
    name = name.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ة", "ه").replace("ى", "ي")
    name = name.replace("عبد ", "عبد").replace("عبدال", "عبدال")
    return name

def fetch_nilex_data():
    if not HAS_DRISSION:
        return {}
    
    nilex_prices = {}
    try:
        page = ChromiumPage()
        url = "https://www.egx.com.eg/ar/Nilex.aspx"
        page.get(url)
        time.sleep(6) # wait for render
        
        table = page.ele("#ctl00_C_Nilex1_GridView1")
        if table:
            rows = table.eles("tag:tr")
            # Skip header row
            for r in rows[1:]:
                cells = r.eles("tag:td")
                if len(cells) >= 8:
                    name = cells[0].text.strip()
                    prev_close = cells[1].text.strip().replace(",", "")
                    close_price = cells[2].text.strip().replace(",", "")
                    change_pct = cells[3].text.strip()
                    volume = cells[5].text.strip().replace(",", "")
                    
                    try:
                        nilex_prices[clean_arabic_name(name)] = {
                            "close": float(close_price) if close_price else None,
                            "open": float(prev_close) if prev_close else None, # fallback open to prev_close
                            "high": float(close_price) if close_price else None,
                            "low": float(close_price) if close_price else None,
                            "volume": int(volume) if volume and volume.isdigit() else 0,
                            "change": f"{change_pct}%" if change_pct else "0%"
                        }
                    except ValueError:
                        pass
        page.quit()
    except Exception as e:
        sys.stderr.write(f"Nilex scraping warning: {e}\n")
    return nilex_prices

def fetch_yahoo_symbol(stock_info):
    symbol = stock_info["symbol"]
    isin = stock_info.get("isin", "")
    
    # Try symbol first
    yahoo_symbol = f"{symbol}.CA"
    success = False
    result_data = {}
    
    for term in [yahoo_symbol, f"{isin}.CA"]:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{term}?range=1d&interval=1d"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                res_data = json.loads(response.read().decode())
                meta = res_data['chart']['result'][0]['meta']
                price = meta.get('regularMarketPrice')
                prev_close = meta.get('chartPreviousClose')
                
                indicators = res_data['chart']['result'][0]['indicators']['quote'][0]
                volume = indicators.get('volume', [None])[0]
                open_val = indicators.get('open', [None])[0]
                high_val = indicators.get('high', [None])[0]
                low_val = indicators.get('low', [None])[0]
                
                # Calculate change percentage
                change_pct = 0.0
                if price is not None and prev_close is not None and prev_close > 0:
                    change_pct = ((price - prev_close) / prev_close) * 100
                
                # Format change
                change_str = f"{change_pct:+.2f}%"
                
                result_data = {
                    "close": price,
                    "open": open_val if open_val is not None else price,
                    "high": high_val if high_val is not None else price,
                    "low": low_val if low_val is not None else price,
                    "volume": volume if volume is not None else 0,
                    "change": change_str
                }
                success = True
                break
        except Exception:
            continue
            
    return symbol, success, result_data

def run():
    # Load user database configuration (symbols, names, isin)
    # The script runs from stock-news-backend dir, so the final-stocks-data.json is in parent dir
    db_config_path = "../final-stocks-data.json"
    try:
        with open(db_config_path, "r", encoding="utf-8") as f:
            stocks = json.load(f)
    except Exception as e:
        sys.stderr.write(f"Error loading final-stocks-data.json: {e}\n")
        # Fallback to local test config
        stocks = []

    print("Fetching Nilex data...", file=sys.stderr)
    nilex_data = fetch_nilex_data()
    print(f"Scraped {len(nilex_data)} Nilex stocks", file=sys.stderr)

    print(f"Fetching {len(stocks)} symbols from Yahoo Finance...", file=sys.stderr)
    merged_data = []
    
    # Fetch Yahoo in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=15) as executor:
        futures = {executor.submit(fetch_yahoo_symbol, s): s for s in stocks}
        for future in concurrent.futures.as_completed(futures):
            s = futures[future]
            symbol, success, yahoo_res = future.result()
            
            clean_name = clean_arabic_name(s["name"])
            
            # Merge logic
            if clean_name in nilex_data:
                # Nilex scraped data takes priority
                merged_data.append({
                    "symbol": s["symbol"],
                    "name": s["name"],
                    "isin": s["isin"],
                    **nilex_data[clean_name]
                })
            elif success:
                # Yahoo Finance succeeded
                merged_data.append({
                    "symbol": s["symbol"],
                    "name": s["name"],
                    "isin": s["isin"],
                    **yahoo_res
                })
            else:
                # Failed both
                merged_data.append({
                    "symbol": s["symbol"],
                    "name": s["name"],
                    "isin": s["isin"],
                    "close": None,
                    "open": None,
                    "high": None,
                    "low": None,
                    "volume": 0,
                    "change": "0.00%",
                    "error": "Not found"
                })

    # Return output as JSON
    session_date = time.strftime("%d/%m/%Y")
    output = {
        "success": True,
        "date": session_date,
        "stocks": merged_data
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    run()
