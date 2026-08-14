import requests
import xml.etree.ElementTree as ET
from datetime import datetime
import json
import re

SUPABASE_URL = "https://urshusyogkcmlvjqmjly.supabase.co"
SUPABASE_KEY = "sb_publishable_CN_bPJCoE0nXcZTuSaWHoA_MsmD9bN0"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# 1. Fetch active stocks from Supabase to match keywords
print("Fetching active stocks from database...")
try:
    res = requests.get(f"{SUPABASE_URL}/rest/v1/all_stocks_data?select=symbol,name", headers=headers)
    all_stocks = res.json() if res.status_code == 200 else []
except Exception as e:
    print("Failed to fetch database symbols:", e)
    all_stocks = []

# Exclude NEWS_CACHE itself from stock universe
stocks = [s for s in all_stocks if s['symbol'] != 'NEWS_CACHE']
print(f"Loaded {len(stocks)} active stocks for matching.")

# Prepare keywords for matching
stop_words = {"شركة", "شركه", "المصرية", "المصريه", "للاستثمار", "القابضة", "القابضه", "سهم", "البورصة", "البورصه", "العامة", "العامه", "لصناعة", "لصناعه"}
stock_keywords = []
for s in stocks:
    sym = s['symbol'].upper().strip()
    name = s['name']
    
    # Clean name
    clean_name = re.sub(r'[^\w\s]', ' ', name)
    words = [w.strip() for w in clean_name.split() if w.strip()]
    keywords = [w for w in words if len(w) >= 3 and w not in stop_words]
    
    stock_keywords.append({
        "symbol": sym,
        "name": name,
        "keywords": keywords
    })

# 2. Fetch Google News RSS for EGX news
queries = [
    'البورصة المصرية',
    'مباشر مصر أسهم',
    'إفصاحات الشركات المقيدة البورصة'
]

raw_news_items = []
print("Fetching news feeds from Google News RSS...")
for q in queries:
    rss_url = f"https://news.google.com/rss/search?q={requests.utils.quote(q)}&hl=ar&gl=EG&ceid=EG:ar"
    try:
        res = requests.get(rss_url, timeout=15)
        if res.status_code == 200:
            root = ET.fromstring(res.content)
            for item in root.findall('.//item'):
                title = item.find('title').text if item.find('title') is not None else ''
                link = item.find('link').text if item.find('link') is not None else ''
                pubDate = item.find('pubDate').text if item.find('pubDate') is not None else ''
                description = item.find('description').text if item.find('description') is not None else ''
                source = item.find('source').text if item.find('source') is not None else 'Google News'
                
                # Deduplicate by link
                if not any(x['link'] == link for x in raw_news_items):
                    raw_news_items.append({
                        "title": title,
                        "link": link,
                        "pubDate": pubDate,
                        "description": description,
                        "source": source
                    })
    except Exception as e:
        print(f"Failed to fetch query '{q}': {e}")

print(f"Fetched {len(raw_news_items)} unique raw news items.")

# 3. Analyze and match news items
processed_news = []

positive_keywords = ["أرباح", "نمو", "ارتفاع", "صعود", "إيجابي", "زيادة", "توزيع", "شراء", "صعد", "ربح", "صافي", "استحواذ", "إيرادات"]
negative_keywords = ["خسائر", "تراجع", "انخفاض", "هبوط", "سلبي", "نقص", "تخفيض", "بيع", "هبط", "خسارة", "تراجعت", "تصفية"]

for item in raw_news_items:
    title = item['title']
    desc = item['description']
    text = f"{title} {desc}".lower()
    
    # Match stocks
    matched_stock = None
    # 1. Try symbol matching (strict word boundary)
    for sk in stock_keywords:
        sym = sk['symbol']
        # Match symbol
        if re.search(r'\b' + re.escape(sym) + r'\b', text.upper()):
            matched_stock = sk
            break
            
    # 2. Try keyword matching
    if not matched_stock:
        for sk in stock_keywords:
            keywords = sk['keywords']
            if len(keywords) >= 2:
                # Match at least 2 keywords
                matches = sum(1 for kw in keywords if kw.lower() in text)
                if matches >= 2:
                    matched_stock = sk
                    break
            elif len(keywords) == 1:
                # Match single unique keyword
                if keywords[0].lower() in text:
                    matched_stock = sk
                    break
                    
    # Sentiment analysis
    pos_count = sum(1 for w in positive_keywords if w in text)
    neg_count = sum(1 for w in negative_keywords if w in text)
    
    if pos_count > neg_count:
        sentiment = "positive"
        level = "strong" if pos_count > 2 else "medium"
        recommendation = "buy"
    elif neg_count > pos_count:
        sentiment = "negative"
        level = "strong" if neg_count > 2 else "medium"
        recommendation = "sell"
    else:
        sentiment = "neutral"
        level = "low"
        recommendation = "hold"
        
    # Format date
    try:
        dt = datetime.strptime(item['pubDate'], '%a, %d %b %Y %H:%M:%S %Z')
        pub_date_iso = dt.isoformat() + "Z"
    except:
        pub_date_iso = datetime.utcnow().isoformat() + "Z"
        
    processed_news.append({
        "title": title,
        "link": item['link'],
        "pubDate": pub_date_iso,
        "source": item['source'],
        "description": desc,
        "symbol": matched_stock['symbol'] if matched_stock else 'EGX',
        "name": matched_stock['name'] if matched_stock else 'البورصة المصرية العامة',
        "analysis": {
            "type": sentiment,
            "level": level,
            "recommendation": recommendation
        }
    })

# Sort news by pubDate descending
processed_news.sort(key=lambda x: x['pubDate'], reverse=True)

# Keep latest 120 news items
processed_news = processed_news[:120]

# 4. Upload to Supabase as NEWS_CACHE
print(f"Uploading {len(processed_news)} matched news items to NEWS_CACHE in Supabase...")
payload = [{
    "symbol": "NEWS_CACHE",
    "name": "News Cache",
    "current_price": 0.0,
    "history": processed_news
}]

try:
    res = requests.post(f"{SUPABASE_URL}/rest/v1/all_stocks_data?on_conflict=symbol", headers={**headers, "Prefer": "resolution=merge-duplicates"}, json=payload)
    if res.status_code in [200, 201]:
        print("NEWS_CACHE successfully updated in database!")
    else:
        print(f"Failed to update NEWS_CACHE: {res.text}")
except Exception as e:
    print(f"Error updating NEWS_CACHE: {e}")
