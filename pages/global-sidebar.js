(function () {
    if (window.__globalSidebarLoaded) return;
    window.__globalSidebarLoaded = true;

    const DATA_CACHE_DB = 'stock-analysis-data-cache';
    const DATA_CACHE_STORE = 'datasets';
    const DATA_CACHE_KEY = 'primary';

    function openDataCacheDb() {
        return new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) {
                reject(new Error('IndexedDB is not supported in this browser'));
                return;
            }

            const request = indexedDB.open(DATA_CACHE_DB, 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(DATA_CACHE_STORE)) {
                    db.createObjectStore(DATA_CACHE_STORE);
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
        });
    }

    async function cacheSet(value) {
        const db = await openDataCacheDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(DATA_CACHE_STORE, 'readwrite');
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error || new Error('Failed to write cache'));
            tx.objectStore(DATA_CACHE_STORE).put(value, DATA_CACHE_KEY);
        });
    }

    async function cacheGet() {
        const db = await openDataCacheDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(DATA_CACHE_STORE, 'readonly');
            const req = tx.objectStore(DATA_CACHE_STORE).get(DATA_CACHE_KEY);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error || new Error('Failed to read cache'));
        });
    }

    function setStorageBestEffort(key, value) {
        let sessionOk = false;
        let localOk = false;

        try {
            sessionStorage.setItem(key, value);
            sessionOk = true;
        } catch {
        }

        try {
            localStorage.setItem(key, value);
            localOk = true;
        } catch {
        }

        return { sessionOk, localOk, ok: sessionOk || localOk };
    }

    function compactStocksDataObject(stocksDataObject, maxHistoryDays) {
        if (!stocksDataObject || typeof stocksDataObject !== 'object') return null;
        const sourceCompanies = stocksDataObject.companies || stocksDataObject;
        if (!sourceCompanies || typeof sourceCompanies !== 'object') return null;

        const asEntries = Array.isArray(sourceCompanies)
            ? sourceCompanies.map((company, index) => [String(company?.symbol || index), company])
            : Object.entries(sourceCompanies);

        const compactCompanies = {};
        asEntries.forEach(([symbolKey, company]) => {
            if (!company || typeof company !== 'object') return;
            const symbol = String(company.symbol || symbolKey || '').toUpperCase();
            if (!symbol) return;

            const historical = Array.isArray(company.historical)
                ? company.historical
                : (Array.isArray(company.daily) ? company.daily : []);

            const trimmed = historical.slice(-maxHistoryDays).map(item => ({
                date: item?.date || null,
                close: item?.close ?? item?.price ?? null,
                open: item?.open ?? null,
                high: item?.high ?? null,
                low: item?.low ?? null,
                volume: item?.volume ?? null,
                change: item?.change ?? null
            }));

            compactCompanies[symbol] = {
                symbol,
                shortName: company.shortName || company.longName || symbol,
                longName: company.longName || company.shortName || symbol,
                historical: trimmed,
                exclusion: company.exclusion || null,
                sector: company.sector || null
            };
        });

        return { companies: compactCompanies };
    }

    function compactProcessedRows(rows, maxRows) {
        const list = Array.isArray(rows) ? rows : [];
        return list.slice(0, maxRows).map(row => ({
            symbol: row?.symbol || '',
            name: row?.name || row?.symbol || '',
            currentPrice: Number(row?.currentPrice || 0),
            change: row?.change ?? '0.0',
            changeValue: Number(row?.changeValue || 0),
            rsi: Number(row?.rsi || 0),
            support: Array.isArray(row?.support) ? row.support : [],
            resistance: Array.isArray(row?.resistance) ? row.resistance : [],
            volumeRatio: Number(row?.volumeRatio || 1),
            recommendation: row?.recommendation || 'neutral'
        }));
    }

    async function saveFullDatasets(payload) {
        if (!payload) return false;

        let stocksDataRaw = payload.stocksDataRaw || null;
        if (!stocksDataRaw && payload.stocksData) {
            stocksDataRaw = JSON.stringify(payload.stocksData);
        }

        let processedDataRaw = payload.processedDataRaw || null;
        if (!processedDataRaw && payload.processedData) {
            processedDataRaw = JSON.stringify(payload.processedData);
        }

        const record = {
            savedAt: new Date().toISOString(),
            fileName: payload.fileName || null,
            stocksDataRaw: stocksDataRaw || null,
            processedDataRaw: processedDataRaw || null
        };

        try {
            await cacheSet(record);
            return true;
        } catch {
            return false;
        }
    }

    async function restoreDatasetsToStorageIfMissing() {
        const SUPABASE_URL = "https://urshusyogkcmlvjqmjly.supabase.co";
        const SUPABASE_KEY = "sb_publishable_CN_bPJCoE0nXcZTuSaWHoA_MsmD9bN0";
        const supabaseHeaders = {
            "apikey": SUPABASE_KEY,
            "Authorization": "Bearer " + SUPABASE_KEY,
            "Content-Type": "application/json"
        };

        // 1. Fetch portfolio from Supabase if not present in localStorage
        const hasPortfolio = Boolean(localStorage.getItem('userPortfolio'));
        if (!hasPortfolio) {
            try {
                console.log("🔍 Sidebar: Fetching portfolio from Supabase...");
                const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio?select=*`, { 
                    headers: supabaseHeaders,
                    cache: 'no-store'
                });
                if (res.ok) {
                    const rows = await res.json();
                    const port = rows.map(r => ({
                        symbol: r.symbol,
                        name: r.name,
                        quantity: Number(r.quantity),
                        entryPrice: Number(r.entry_price),
                        marketPrice: Number(r.market_price || r.entry_price),
                        sector: r.sector || 'Other',
                        addedDate: new Date(r.updated_at || Date.now()).toLocaleDateString('en-GB')
                    }));
                    localStorage.setItem('userPortfolio', JSON.stringify(port));
                    console.log("✅ Sidebar: Portfolio restored from Supabase!");
                }
            } catch (e) {
                console.error("Sidebar: Failed to restore portfolio:", e);
            }
        }

        let cached = null;
        try {
            cached = await cacheGet();
        } catch (e) {
            console.error("Failed to read IndexedDB:", e);
        }

        if (cached) {
            if (cached.stocksDataRaw) {
                try {
                    const parsed = JSON.parse(cached.stocksDataRaw);
                    const source = parsed.companies || parsed;
                    window.stocksData = Array.isArray(source) ? source : Object.values(source);
                } catch (e) {
                    console.error("Failed parsing stocksDataRaw from IndexedDB:", e);
                }
            }
            if (cached.processedDataRaw) {
                try {
                    window.processedData = JSON.parse(cached.processedDataRaw);
                } catch (e) {
                    console.error("Failed parsing processedDataRaw from IndexedDB:", e);
                }
            }
            if (cached.fileName) {
                try {
                    if (!localStorage.getItem('lastUploadedFileName')) {
                        localStorage.setItem('lastUploadedFileName', cached.fileName);
                    }
                } catch (e) {}
            }
        }

        // التراجع الاحتياطي (Fallback) لـ localStorage لضمان التوافق القديم
        let hasStocks = Boolean(sessionStorage.getItem('stocksData'));
        let hasProcessed = Boolean(sessionStorage.getItem('processedData'));
        const cacheTime = sessionStorage.getItem('lastSupabaseFetchTime');
        const isCacheValid = cacheTime && (Date.now() - Number(cacheTime) < 5 * 60 * 1000); // 5 minutes cache
        
        if (cached && (!hasStocks || !hasProcessed)) {
            if (!hasStocks && cached.stocksDataRaw) {
                const direct = setStorageBestEffort('stocksData', cached.stocksDataRaw);
                if (!direct.ok) {
                    try {
                        const parsed = JSON.parse(cached.stocksDataRaw);
                        const attempts = [220, 160, 120, 90, 70, 50, 40];
                        for (const days of attempts) {
                            const compact = compactStocksDataObject(parsed, days);
                            if (!compact) continue;
                            const ok = setStorageBestEffort('stocksData', JSON.stringify(compact));
                            if (ok.ok) break;
                        }
                    } catch (e) {}
                }
            }
            if (!hasProcessed && cached.processedDataRaw) {
                const direct = setStorageBestEffort('processedData', cached.processedDataRaw);
                if (!direct.ok) {
                    try {
                        const parsed = JSON.parse(cached.processedDataRaw);
                        const attempts = [1600, 1200, 900, 700, 500, 300, 180];
                        for (const size of attempts) {
                            const compact = compactProcessedRows(parsed, size);
                            const ok = setStorageBestEffort('processedData', JSON.stringify(compact));
                            if (ok.ok) break;
                        }
                    } catch (e) {}
                }
            }
            hasStocks = Boolean(sessionStorage.getItem('stocksData'));
            hasProcessed = Boolean(sessionStorage.getItem('processedData'));
        }

        // 3. IF STILL MISSING OR CACHE EXPIRED, fetch directly from Supabase and run calculations!
        if (!hasStocks || !hasProcessed || !isCacheValid) {
            try {
                console.log("🌐 Sidebar: Fetching fresh stock data from Supabase (Cache invalid or missing)...");
                const res = await fetch(`${SUPABASE_URL}/rest/v1/all_stocks_data?select=*`, { 
                    headers: supabaseHeaders,
                    cache: 'no-store'
                });
                if (res.ok) {
                    const rows = await res.json();
                    const companiesList = rows.map(r => ({
                        symbol: r.symbol,
                        longName: r.name,
                        shortName: r.name,
                        price: Number(r.current_price || 0),
                        historical: r.history || []
                    }));
                    const data = { companies: companiesList };

                    sessionStorage.setItem('stocksData', JSON.stringify(data));
                    localStorage.setItem('stocksData', JSON.stringify(data));
                    window.stocksData = companiesList;

                    // Calculate processedData
                    const processed = companiesList.map(company => {
                        const symbol = String(company.symbol || '').toUpperCase();
                        const name = company.longName || company.shortName || symbol;
                        
                        const pricePoints = (company.historical || []).map(item => ({
                            date: item.date,
                            price: parseFloat(item.close),
                            volume: Number(item.volume ?? item.vol ?? 0)
                        })).filter(p => p.date && !isNaN(p.price));
                        
                        if (pricePoints.length === 0) return null;
                        
                        // Sort pricePoints by date
                        pricePoints.sort((a, b) => {
                            const da = a.date.split(/[-/. ]+/);
                            const db = b.date.split(/[-/. ]+/);
                            return new Date(da[0], da[1]-1, da[2]) - new Date(db[0], db[1]-1, db[2]);
                        });
                        
                        const prices = pricePoints.map(p => p.price);
                        const volumes = pricePoints.map(p => p.volume);
                        const currentPrice = prices[prices.length - 1];
                        const previousPrice = prices.length > 1 ? prices[prices.length - 2] : currentPrice;
                        const changeValue = previousPrice ? ((currentPrice - previousPrice) / previousPrice * 100) : 0;
                        
                        const recentVolumes = volumes.slice(-20).filter(v => Number.isFinite(v) && v > 0);
                        const latestVolume = volumes.length ? Number(volumes[volumes.length - 1] || 0) : 0;
                        const avgVolume20 = recentVolumes.length
                            ? recentVolumes.reduce((sum, value) => sum + value, 0) / recentVolumes.length
                            : 0;
                        const volumeRatio = avgVolume20 > 0 ? latestVolume / avgVolume20 : 1;
                        
                        const rsi = typeof calculateRSI === 'function' ? calculateRSI(prices) : 50;
                        const sr = typeof calculateSupportResistance === 'function' ? calculateSupportResistance(prices) : { support: 0, resistance: 0 };
                        
                        let recText = 'neutral';
                        if (typeof getRecommendation === 'function') {
                            const recObj = getRecommendation(rsi, [], currentPrice, sr.support, sr.resistance, volumeRatio, changeValue, symbol);
                            recText = recObj.recommendation || 'neutral';
                        }
                        
                        return {
                            symbol: symbol,
                            name: name,
                            currentPrice: currentPrice,
                            change: changeValue.toFixed(1),
                            changeValue: changeValue,
                            volumeRatio: volumeRatio,
                            rsi: rsi,
                            support: sr.support,
                            resistance: sr.resistance,
                            recommendation: recText
                        };
                    }).filter(Boolean);

                    sessionStorage.setItem('processedData', JSON.stringify(processed));
                    localStorage.setItem('processedData', JSON.stringify(processed));
                    sessionStorage.setItem('lastSupabaseFetchTime', Date.now().toString());
                    window.processedData = processed;
                    console.log("✅ Sidebar: Successfully synchronized and processed stock data from Supabase!");
                }
            } catch (err) {
                console.error("Sidebar: Failed auto-sync with Supabase:", err);
            }
        }

        return Boolean(window.stocksData || window.processedData);
    }

    // ==========================================
    // طبقة تزييف التخزين (Storage Override Layer) لتفادي حدود 5MB
    // ==========================================
    window.stocksData = window.stocksData || null;
    window.processedData = window.processedData || null;

    const originalLocalGet = localStorage.getItem;
    const originalLocalSet = localStorage.setItem;
    const originalLocalRemove = localStorage.removeItem;
    const originalSessionGet = sessionStorage.getItem;
    const originalSessionSet = sessionStorage.setItem;
    const originalSessionRemove = sessionStorage.removeItem;

    localStorage.getItem = function(key) {
        if ((key === 'stocksData' || key === 'stockData') && window.stocksData) {
            return JSON.stringify(window.stocksData);
        }
        if (key === 'processedData' && window.processedData) {
            return JSON.stringify(window.processedData);
        }
        return originalLocalGet.apply(this, arguments);
    };

    sessionStorage.getItem = function(key) {
        if ((key === 'stocksData' || key === 'stockData') && window.stocksData) {
            return JSON.stringify(window.stocksData);
        }
        if (key === 'processedData' && window.processedData) {
            return JSON.stringify(window.processedData);
        }
        return originalSessionGet.apply(this, arguments);
    };

    localStorage.setItem = function(key, value) {
        if (key === 'stocksData' || key === 'stockData') {
            try {
                const parsed = JSON.parse(value);
                window.stocksData = Array.isArray(parsed) ? parsed : Object.values(parsed);
                saveFullDatasets({
                    stocksData: window.stocksData,
                    processedData: window.processedData,
                    fileName: localStorage.getItem('lastUploadedFileName') || localStorage.getItem('uploadedFileName')
                });
            } catch(e) {}
        }
        if (key === 'processedData') {
            try {
                window.processedData = JSON.parse(value);
                saveFullDatasets({
                    stocksData: window.stocksData,
                    processedData: window.processedData,
                    fileName: localStorage.getItem('lastUploadedFileName') || localStorage.getItem('uploadedFileName')
                });
            } catch(e) {}
        }

        try {
            return originalLocalSet.apply(this, arguments);
        } catch(e) {
            console.warn("localStorage.setItem failed (likely QuotaExceededError), intercepted by IndexedDB bridge:", e.message);
            return true;
        }
    };

    sessionStorage.setItem = function(key, value) {
        if (key === 'stocksData' || key === 'stockData') {
            try {
                const parsed = JSON.parse(value);
                window.stocksData = Array.isArray(parsed) ? parsed : Object.values(parsed);
                saveFullDatasets({
                    stocksData: window.stocksData,
                    processedData: window.processedData,
                    fileName: localStorage.getItem('lastUploadedFileName') || localStorage.getItem('uploadedFileName')
                });
            } catch(e) {}
        }
        if (key === 'processedData') {
            try {
                window.processedData = JSON.parse(value);
                saveFullDatasets({
                    stocksData: window.stocksData,
                    processedData: window.processedData,
                    fileName: localStorage.getItem('lastUploadedFileName') || localStorage.getItem('uploadedFileName')
                });
            } catch(e) {}
        }

        try {
            return originalSessionSet.apply(this, arguments);
        } catch(e) {
            console.warn("sessionStorage.setItem failed, intercepted by IndexedDB bridge:", e.message);
            return true;
        }
    };

    localStorage.removeItem = function(key) {
        if (key === 'stocksData' || key === 'stockData') {
            window.stocksData = null;
            saveFullDatasets({
                stocksData: null,
                processedData: window.processedData,
                fileName: localStorage.getItem('lastUploadedFileName')
            });
        }
        if (key === 'processedData') {
            window.processedData = null;
            saveFullDatasets({
                stocksData: window.stocksData,
                processedData: null,
                fileName: localStorage.getItem('lastUploadedFileName')
            });
        }
        return originalLocalRemove.apply(this, arguments);
    };

    sessionStorage.removeItem = function(key) {
        if (key === 'stocksData' || key === 'stockData') {
            window.stocksData = null;
            saveFullDatasets({
                stocksData: null,
                processedData: window.processedData,
                fileName: localStorage.getItem('lastUploadedFileName')
            });
        }
        if (key === 'processedData') {
            window.processedData = null;
            saveFullDatasets({
                stocksData: window.stocksData,
                processedData: null,
                fileName: localStorage.getItem('lastUploadedFileName')
            });
        }
        return originalSessionRemove.apply(this, arguments);
    };

    window.StockDataBridge = {
        saveFullDatasets,
        restoreDatasetsToStorageIfMissing,
        cacheGet
    };

    window.__stockDataRestorePromise = restoreDatasetsToStorageIfMissing().catch(() => false);

    const inPages = /\/pages\//i.test(String(location.pathname || '').replace(/\\/g, '/'));

    const items = [
        { label: 'الرئيسية', icon: 'fa-home', href: inPages ? '../index.html' : 'index.html' },
        { label: 'الجدول الرئيسي', icon: 'fa-table', href: inPages ? 'main-table.html' : 'pages/main-table.html' },
        { label: 'رفع البيانات', icon: 'fa-upload', href: inPages ? 'upload-data.html' : 'pages/upload-data.html' },
        { label: 'ملخص كل التقارير', icon: 'fa-star-half-alt', href: inPages ? 'all-reports-summary.html' : 'pages/all-reports-summary.html' },
        { label: 'تحليل المتوسطات', icon: 'fa-chart-area', href: inPages ? 'moving-averages.html' : 'pages/moving-averages.html' },
        { label: 'أهم 20 سهم مصري', icon: 'fa-trophy', href: inPages ? 'top20-egyptian.html' : 'pages/top20-egyptian.html' },
        { label: 'أسهم التجميع (نطاق ضيق)', icon: 'fa-layer-group', href: inPages ? 'accumulation-stocks.html' : 'pages/accumulation-stocks.html' },
        { label: 'تحليل المؤشرات', icon: 'fa-chart-line', href: inPages ? 'تحليل الموشرات.html' : 'pages/تحليل الموشرات.html' },
        { label: 'محفظتي الاستثمارية', icon: 'fa-wallet', href: inPages ? 'portfolio.html' : 'pages/portfolio.html' },
        { label: 'تدوير السيولة والقطاعات 🔄', icon: 'fa-sync-alt', href: inPages ? 'sector-rotation.html' : 'pages/sector-rotation.html' },
        { label: 'شمعة الهامر', icon: 'fa-hammer', href: inPages ? 'hammer-stocks.html' : 'pages/hammer-stocks.html' },
        { label: 'بداية ارتداد من الهبوط', icon: 'fa-undo', href: inPages ? 'rebound-reversal.html' : 'pages/rebound-reversal.html' },
        { label: 'الرسم البياني المحترف', icon: 'fa-chart-area', href: inPages ? 'stock-chart.html' : 'pages/stock-chart.html' },
        { label: 'فرص الجلسة القادمة', icon: 'fa-bullseye', href: inPages ? 'next-session-opportunities.html' : 'pages/next-session-opportunities.html' },
        { label: 'فرص الذكاء الاصطناعي للغد', icon: 'fa-brain', href: inPages ? 'ai-session-opportunities.html' : 'pages/ai-session-opportunities.html' },
        { label: 'إرشادات الجلسة القادمة', icon: 'fa-lightbulb', href: inPages ? 'session-guidelines.html' : 'pages/session-guidelines.html' },
        { label: 'اخبار الاسهم المصرية', icon: 'fa-newspaper', href: inPages ? 'egypt-stocks-news.html' : 'pages/egypt-stocks-news.html' },
        { label: 'التحليل ومساعد القرار الذكي (GPT)', icon: 'fa-robot', href: inPages ? 'ai-analysis.html' : 'pages/ai-analysis.html' },
        { label: 'تحليل خاص', icon: 'fa-bullseye', href: inPages ? 'special-analysis.html' : 'pages/special-analysis.html' },
        { label: 'مختبر Copilot الذكي', icon: 'fa-vial', href: inPages ? 'copilot-lab.html' : 'pages/copilot-lab.html' }
    ];

    function ensureFontAwesome() {
        if (document.querySelector('link[href*="font-awesome"]')) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(link);
    }

    function getProcessedCount() {
        try {
            const raw = sessionStorage.getItem('processedData') || localStorage.getItem('processedData') || '[]';
            const rows = JSON.parse(raw);
            return Array.isArray(rows) ? rows.length : 0;
        } catch {
            return 0;
        }
    }

    function getFileName() {
        const stored = localStorage.getItem('uploadedFileName') || localStorage.getItem('portfolioFileName') || localStorage.getItem('lastStockFileName');
        return stored && stored.trim() ? stored.trim() : 'stock_data.json';
    }

    function isActive(targetHref) {
        const path = String(location.pathname || '').replace(/\\/g, '/').toLowerCase();
        const clean = String(targetHref || '').replace(/\\/g, '/').replace(/^\.\//, '').toLowerCase();
        const normalized = clean.startsWith('../') ? clean.substring(3) : clean;
        return path.endsWith('/' + normalized) || path.endsWith(normalized);
    }

    function exportAllData() {
        try {
            const payload = {
                exportedAt: new Date().toISOString(),
                stocksData: JSON.parse(sessionStorage.getItem('stocksData') || localStorage.getItem('stocksData') || 'null'),
                processedData: JSON.parse(sessionStorage.getItem('processedData') || localStorage.getItem('processedData') || '[]'),
                userPortfolio: JSON.parse(localStorage.getItem('userPortfolio') || '[]')
            };
            const hasData = (Array.isArray(payload.processedData) && payload.processedData.length) || payload.stocksData || (Array.isArray(payload.userPortfolio) && payload.userPortfolio.length);
            if (!hasData) {
                alert('لا توجد بيانات كافية للتصدير حالياً.');
                return;
            }
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const d = new Date();
            a.href = url;
            a.download = `all_stock_data_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            alert('حدث خطأ أثناء تصدير البيانات.');
        }
    }

    function buildSidebar() {
        ensureFontAwesome();

        const style = document.createElement('style');
        style.textContent = `
            .gps-sidebar {
                position: fixed;
                right: 0;
                top: 0;
                width: 320px;
                height: 100vh;
                background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
                border-left: 1px solid #334155;
                z-index: 2000;
                display: flex;
                flex-direction: column;
                transform: translateX(100%);
                transition: transform .3s ease;
                box-shadow: 0 10px 30px rgba(0,0,0,.35);
            }
            .gps-sidebar.open { transform: translateX(0); }
            .gps-header {
                padding: 16px;
                border-bottom: 1px solid #334155;
                color: #fbbf24;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 700;
            }
            .gps-close {
                background: none;
                border: 1px solid #475569;
                color: #cbd5e1;
                width: 28px;
                height: 28px;
                border-radius: 6px;
                cursor: pointer;
            }
            .gps-menu { padding: 10px 10px 0; overflow-y: auto; flex: 1; }
            .gps-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                color: #e2e8f0;
                text-decoration: none;
                padding: 11px 12px;
                border-radius: 10px;
                margin-bottom: 5px;
                border: 1px solid transparent;
                background: transparent;
                width: 100%;
                font-size: 17px;
                cursor: pointer;
            }
            .gps-item:hover { background: rgba(59,130,246,.12); border-color: #3b82f6; }
            .gps-item.active { background: rgba(59,130,246,.2); color: #60a5fa; border-color: #3b82f6; }
            .gps-item i { width: 22px; text-align: center; color: #cbd5e1; }
            .gps-item.active i { color: #60a5fa; }
            .gps-divider { height: 1px; background: #334155; margin: 10px 6px; }
            .gps-footer {
                border-top: 1px solid #334155;
                padding: 12px 14px;
                color: #94a3b8;
                font-size: .95em;
            }
            .gps-info { display: flex; align-items: center; justify-content: space-between; margin: 6px 0; gap: 8px; }
            .gps-toggle {
                position: fixed;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                width: 34px;
                height: 70px;
                border-radius: 10px 0 0 10px;
                border: 1px solid #334155;
                border-right: none;
                background: rgba(15,23,42,.95);
                color: #cbd5e1;
                z-index: 1999;
                cursor: pointer;
                transition: right .3s ease;
            }

            @media (min-width: 900px) {
                body .container {
                    transition: margin-right .3s ease;
                }

                body.gps-sidebar-open .container {
                    margin-right: 322px !important;
                    margin-left: auto !important;
                }

                body.gps-sidebar-open .gps-toggle {
                    right: 322px;
                }
            }

            @media (max-width: 768px) {
                .gps-sidebar { width: min(320px, 88vw); }
            }
        `;
        document.head.appendChild(style);

        const sidebar = document.createElement('aside');
        sidebar.className = 'gps-sidebar';

        const menuHtml = items.map(item => `
            <a href="${item.href}" class="gps-item ${isActive(item.href) ? 'active' : ''}">
                <span>${item.label}</span>
                <i class="fas ${item.icon}"></i>
            </a>
        `).join('');

        sidebar.innerHTML = `
            <div class="gps-header">
                <span><i class="fas fa-bars"></i> القائمة الرئيسية</span>
                <button class="gps-close" type="button" aria-label="إغلاق">&times;</button>
            </div>
            <div class="gps-menu">
                ${menuHtml}
                <div class="gps-divider"></div>
                <button class="gps-item" type="button" id="gpsExportBtn">
                    <span>تصدير جميع البيانات</span>
                    <i class="fas fa-download"></i>
                </button>
            </div>
            <div class="gps-footer">
                <div class="gps-info"><span id="gpsStockCount">0 سهم</span><i class="fas fa-coins"></i></div>
                <div class="gps-info"><span id="gpsFileName">stock_data.json</span><i class="fas fa-file"></i></div>
            </div>
        `;

        const toggle = document.createElement('button');
        toggle.className = 'gps-toggle';
        toggle.type = 'button';
        toggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
        toggle.setAttribute('aria-label', 'فتح القائمة');

        function setOpen(nextOpen) {
            sidebar.classList.toggle('open', !!nextOpen);
            toggle.innerHTML = !!nextOpen ? '<i class="fas fa-chevron-right"></i>' : '<i class="fas fa-chevron-left"></i>';
            document.body.classList.toggle('gps-sidebar-open', !!nextOpen && window.innerWidth >= 900);
            localStorage.setItem('globalSidebarOpen', nextOpen ? '1' : '0');
        }

        const saved = localStorage.getItem('globalSidebarOpen');
        const shouldOpen = saved ? saved === '1' : window.innerWidth > 900;
        setOpen(shouldOpen);

        window.addEventListener('resize', () => {
            setOpen(sidebar.classList.contains('open'));
        });

        toggle.addEventListener('click', () => setOpen(!sidebar.classList.contains('open')));
        sidebar.querySelector('.gps-close')?.addEventListener('click', () => setOpen(false));
        sidebar.querySelector('#gpsExportBtn')?.addEventListener('click', exportAllData);

        const countEl = sidebar.querySelector('#gpsStockCount');
        const fileEl = sidebar.querySelector('#gpsFileName');
        if (countEl) countEl.textContent = `${getProcessedCount()} سهم`;
        if (fileEl) fileEl.textContent = getFileName();

        document.body.appendChild(sidebar);
        document.body.appendChild(toggle);

        const legacySidebar = document.getElementById('sidebar');
        const legacyToggle = document.querySelector('.sidebar-toggle-btn');
        if (legacySidebar) legacySidebar.style.display = 'none';
        if (legacyToggle) legacyToggle.style.display = 'none';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildSidebar);
    } else {
        buildSidebar();
    }
})();
