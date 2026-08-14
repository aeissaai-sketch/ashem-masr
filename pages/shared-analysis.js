(function () {
    if (window.openStockAnalysis) return;

    let miniChart = null;
    let advPriceChart = null;
    let advVolumeChart = null;
    let advRsiChart = null;
    let currentSymbol = null;
    let currentPoints = [];
    let currentSignals = null;
    let analysisScale = 1;
    let newsRefreshTimer = null;

    // LWC integration variables
    let gaLwcChart = null;
    let gaLwcMainSeries = null;
    let gaLwcVolumeSeries = null;
    let gaLwcPriceLines = [];
    let gaLwcChartType = 'candle'; // 'candle' or 'line'
    let gaLwcResizeObserver = null;

    function getJsonFromStorage(key) {
        const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
    }

    function getProcessedData() {
        const data = getJsonFromStorage('processedData');
        return Array.isArray(data) ? data : [];
    }

    function getCompanies() {
        const data = getJsonFromStorage('stocksData');
        if (!data) return [];
        const source = data.companies || data;
        if (Array.isArray(source)) return source;
        if (source && typeof source === 'object') return Object.values(source);
        return [];
    }

    function findCompanyBySymbol(symbol) {
        const upper = (symbol || '').toUpperCase();
        return getCompanies().find(c => (c?.symbol || '').toUpperCase() === upper) || null;
    }

    function isSymbolInPortfolio(symbol) {
        const upper = String(symbol || '').toUpperCase();
        if (!upper) return false;
        const portfolio = getJsonFromStorage('userPortfolio');
        if (!Array.isArray(portfolio)) return false;
        return portfolio.some(item => String(item?.symbol || '').toUpperCase() === upper);
    }

        function parseDate(dateStr) {
        if (!dateStr) return new Date(0);
        
        let clean = String(dateStr).trim().replace(/^['"]|['"]$/g, '');
        if (!clean) return new Date(0);

        if (clean.includes('T')) {
            const d = new Date(clean);
            if (!isNaN(d.getTime())) return d;
        }

        let parts = clean.split(/[-/. ]+/);
        if (parts.length === 3) {
            let p0 = parseInt(parts[0], 10);
            let p1 = parseInt(parts[1], 10);
            let p2 = parseInt(parts[2], 10);

            if (!isNaN(p0) && !isNaN(p1) && !isNaN(p2)) {
                let year = -1;
                let month = -1;
                let day = -1;

                if (parts[0].length === 4 || p0 > 31) {
                    year = p0;
                    if (p1 > 12) {
                        day = p1;
                        month = p2 - 1;
                    } else {
                        month = p1 - 1;
                        day = p2;
                    }
                } else if (parts[2].length === 4 || p2 > 31) {
                    year = p2;
                    if (p0 > 12) {
                        day = p0;
                        month = p1 - 1;
                    } else if (p1 > 12) {
                        month = p0 - 1;
                        day = p1;
                    } else {
                        day = p0;
                        month = p1 - 1;
                    }
                } else {
                    day = p0;
                    month = p1 - 1;
                    year = p2 + 2000;
                }

                if (year > 0 && month >= 0 && month < 12 && day > 0 && day <= 31) {
                    return new Date(year, month, day);
                }
            }
        }

        const d = new Date(clean);
        return isNaN(d.getTime()) ? new Date(0) : d;
    }

    function getHistoryPoints(company) {
        if (!company) return [];
        const rows = company.historical || company.daily || [];
        const points = rows
            .map(r => ({
                date: r?.date,
                open: Number(r?.open ?? r?.o ?? r?.price ?? r?.close),
                high: Number(r?.high ?? r?.h ?? r?.close ?? r?.price),
                low: Number(r?.low ?? r?.l ?? r?.close ?? r?.price),
                close: Number(r?.close ?? r?.price ?? r?.value),
                volume: Number(r?.volume ?? r?.vol ?? 0)
            }))
            .filter(p => p.date && Number.isFinite(p.close));

        for (const point of points) {
            if (!Number.isFinite(point.open)) point.open = point.close;
            if (!Number.isFinite(point.high)) point.high = Math.max(point.open, point.close);
            if (!Number.isFinite(point.low)) point.low = Math.min(point.open, point.close);
            if (point.high < point.low) {
                const tmp = point.high;
                point.high = point.low;
                point.low = tmp;
            }
        }

        points.sort((a, b) => parseDate(a.date) - parseDate(b.date));
        return points;
    }

    function calcRSISeries(prices, period = 14) {
        if (!Array.isArray(prices) || prices.length === 0) return [];
        const out = [];
        for (let i = 0; i < prices.length; i++) {
            if (i < period) {
                out.push(null);
                continue;
            }
            let gains = 0;
            let losses = 0;
            for (let j = i - period + 1; j <= i; j++) {
                const diff = prices[j] - prices[j - 1];
                if (diff >= 0) gains += diff;
                else losses -= diff;
            }
            const avgGain = gains / period;
            const avgLoss = losses / period;
            if (avgLoss === 0) {
                out.push(70);
            } else if (avgGain === 0) {
                out.push(30);
            } else {
                const rs = avgGain / avgLoss;
                out.push(Math.round((100 - (100 / (1 + rs))) * 10) / 10);
            }
        }
        return out;
    }

    function calcSMA(values, period) {
        if (!Array.isArray(values)) return [];
        const out = [];
        for (let i = 0; i < values.length; i++) {
            if (i < period - 1) {
                out.push(null);
                continue;
            }
            const windowVals = values.slice(i - period + 1, i + 1);
            const sum = windowVals.reduce((acc, val) => acc + (Number(val) || 0), 0);
            out.push(Math.round((sum / period) * 100) / 100);
        }
        return out;
    }

    function calcATRSeries(points, period = 14) {
        if (!Array.isArray(points) || points.length === 0) return [];
        const trs = [];
        for (let i = 0; i < points.length; i++) {
            const high = Number(points[i].high ?? points[i].close ?? 0);
            const low = Number(points[i].low ?? points[i].close ?? 0);
            const prevClose = i > 0 ? Number(points[i - 1].close ?? points[i - 1].open ?? 0) : low;
            const tr = Math.max(
                high - low,
                Math.abs(high - prevClose),
                Math.abs(low - prevClose)
            );
            trs.push(tr);
        }
        const atrs = [];
        let currentATR = 0;
        for (let i = 0; i < trs.length; i++) {
            if (i < period - 1) {
                atrs.push(null);
                continue;
            }
            if (i === period - 1) {
                const sum = trs.slice(0, period).reduce((a, b) => a + b, 0);
                currentATR = sum / period;
            } else {
                currentATR = (currentATR * (period - 1) + trs[i]) / period;
            }
            atrs.push(Math.round(currentATR * 1000) / 1000);
        }
        return atrs;
    }

    function calcVWAPSeries(points) {
        if (!Array.isArray(points) || points.length === 0) return [];
        const vwaps = [];
        let cumulativeTPV = 0;
        let cumulativeVol = 0;
        for (let i = 0; i < points.length; i++) {
            const high = Number(points[i].high ?? points[i].close ?? 0);
            const low = Number(points[i].low ?? points[i].close ?? 0);
            const close = Number(points[i].close ?? 0);
            const volume = Math.max(1, Number(points[i].volume ?? 0));
            const typicalPrice = (high + low + close) / 3;
            cumulativeTPV += typicalPrice * volume;
            cumulativeVol += volume;
            const vwap = cumulativeVol > 0 ? (cumulativeTPV / cumulativeVol) : close;
            vwaps.push(Math.round(vwap * 100) / 100);
        }
        return vwaps;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function clearNewsAutoRefresh() {
        if (newsRefreshTimer) {
            clearInterval(newsRefreshTimer);
            newsRefreshTimer = null;
        }
    }

    function normalizeRecommendationToken(value) {
        const text = String(value || '').trim().toLowerCase();
        if (!text) return 'neutral';

        if (text.includes('strong-buy') || text.includes('شراء قوي')) return 'strong-buy';
        if (text.includes('strong-sell') || text.includes('بيع قوي')) return 'strong-sell';
        if ((text.includes('buy') && !text.includes('strong')) || (text.includes('شراء') && !text.includes('قوي'))) return 'buy';
        if ((text.includes('sell') && !text.includes('strong')) || (text.includes('بيع') && !text.includes('قوي'))) return 'sell';
        if (text.includes('reduce') || text.includes('تقليل')) return 'reduce';
        if (text.includes('hold') || text.includes('احتفاظ')) return 'hold';
        if (text.includes('warn') || text.includes('wait') || text.includes('انتظار') || text.includes('حذر')) return 'warn';
        return 'neutral';
    }

    function getRecommendationMeta(value) {
        const key = normalizeRecommendationToken(value);
        if (key === 'strong-buy') return { key, label: 'شراء قوي', cls: 'signal-good' };
        if (key === 'buy') return { key, label: 'شراء', cls: 'signal-good' };
        if (key === 'strong-sell') return { key, label: 'بيع قوي', cls: 'signal-bad' };
        if (key === 'sell') return { key, label: 'بيع', cls: 'signal-bad' };
        if (key === 'reduce') return { key, label: 'تقليل مراكز', cls: 'signal-warn' };
        if (key === 'hold') return { key, label: 'احتفاظ', cls: 'signal-mid' };
        if (key === 'warn') return { key, label: 'انتظار بحذر', cls: 'signal-warn' };
        return { key: 'neutral', label: 'محايد', cls: 'signal-mid' };
    }

    function buildUnifiedPortfolioAdvice(input, portfolioTotalValue = 0) {
        const symbol = input?.symbol || '-';
        const name = input?.name || symbol;
        const qty = Math.max(1, Number(input?.qty || 1));
        const entry = Number(input?.entry || 0);
        const current = Number(input?.current || 0);
        const ret = Number.isFinite(Number(input?.ret)) ? Number(input.ret) : (entry > 0 ? ((current - entry) / entry) * 100 : 0);
        const rsi = Number(input?.rsi);
        const support = Number(input?.support);
        const resistance = Number(input?.resistance);
        const score = Number(input?.score);
        const volatility = Number(input?.volatility || 15);
        const volRatio = Number(input?.volumeRatio || 1);
        const recMeta = getRecommendationMeta(input?.recommendation || input?.actionType);

        // جلب بيانات تاريخ السهم لحساب ATR و VWAP الدقيقين
        const company = findCompanyBySymbol(symbol);
        const points = company ? getHistoryPoints(company) : [];
        let latestATR = null;
        let latestVWAP = null;

        if (points.length >= 14) {
            const atrs = calcATRSeries(points, 14);
            latestATR = atrs[atrs.length - 1];
            const vwaps = calcVWAPSeries(points);
            latestVWAP = vwaps[vwaps.length - 1];
        }

        const reasons = [];
        const plan = { actionQty: null, actionPrice: null, targetPrice: null, whyQty: '', atr: latestATR, vwap: latestVWAP };

        // 1. حساب الوزن النسبي للمركز في المحفظة
        const stockValue = qty * current;
        const weight = portfolioTotalValue > 0 ? (stockValue / portfolioTotalValue) * 100 : 0;

        reasons.push(`التوصية الفنية الحالية: ${recMeta.label}`);
        reasons.push(`العائد الحالي في المحفظة: ${ret.toFixed(2)}%`);
        if (weight > 0) reasons.push(`الوزن النسبي للسهم في المحفظة: ${weight.toFixed(1)}%`);
        if (Number.isFinite(rsi)) reasons.push(`RSI الحالي: ${rsi.toFixed(1)}`);
        
        if (latestVWAP) {
            const isAboveVwap = current >= latestVWAP;
            reasons.push(`مؤشر VWAP (التكلفة المرجحة بالسيولة): ${latestVWAP.toFixed(2)} ج.م (${isAboveVwap ? 'السعر أعلى من VWAP - القوة الشرائية في المضمون' : 'السعر دون VWAP - السهم يبحث عن استقرار فوق التكلفة'}).`);
        }

        // 2. وقف خسارة ديناميكي متكيف مع مؤشر ATR والتذبذب
        let dynamicStopLoss = Math.min(15, Math.max(8, volatility * 0.7));
        if (latestATR && current > 0) {
            const atrStopLossPrice = Math.max(0.01, current - (latestATR * 1.8));
            const atrStopLossPct = ((current - atrStopLossPrice) / current) * 100;
            dynamicStopLoss = Math.min(15, Math.max(6, atrStopLossPct));
            reasons.push(`مؤشر ATR اليومي (${latestATR.toFixed(3)} ج.م) يحدد وقف الخسارة المتحرك عند ${atrStopLossPrice.toFixed(2)} ج.م (${dynamicStopLoss.toFixed(1)}%).`);
        } else {
            reasons.push(`حد وقف الخسارة الديناميكي المعتمد: ${dynamicStopLoss.toFixed(1)}%.`);
        }

        const strongNegative = recMeta.key === 'strong-sell' || recMeta.key === 'sell';
        const strongPositive = recMeta.key === 'strong-buy' || recMeta.key === 'buy';

        // شرط الخروج لحماية رأس المال
        const isStopLossTriggered = ret <= -dynamicStopLoss;
        const isPanicSellTriggered = strongNegative && ret <= -(dynamicStopLoss / 2) && volRatio >= 1.3;

        if (isStopLossTriggered || isPanicSellTriggered) {
            reasons.push(`تجاوز السعر حد وقف الخسارة الديناميكي المخصص لهذا السهم (${dynamicStopLoss.toFixed(1)}%).`);
            if (volRatio >= 1.3) reasons.push('⚠️ الهبوط مصحوب بسيولة بيع قوية (تأكيد خروج).');
            reasons.push('الأولوية القصوى هي حماية رأس المال المتبقي.');
            return { text: 'خروج', cls: 'opinion-exit', symbol, name, reasons, plan };
        }

        // شرط تقليل المراكز (تأمين الأرباح أو تفادي التشبع)
        const isOverBought = Number.isFinite(rsi) && rsi >= 74;
        const isProfitTakingTriggered = ret >= 18 && !(strongPositive && volRatio >= 1.4);
        const isTrendWeakening = Number.isFinite(score) && score <= -2.0 && ret >= 6;

        if (strongNegative || isOverBought || isProfitTakingTriggered || isTrendWeakening) {
            const reducePct = (Number.isFinite(rsi) && rsi >= 78) || recMeta.key === 'strong-sell' ? 0.45 : 0.30;
            const sellQty = Math.max(1, Math.round(qty * reducePct));
            const suggestedSellPrice = Number.isFinite(resistance) ? Math.max(current, resistance * 0.995) : current;
            const nextTarget = Number.isFinite(resistance) ? resistance * 1.03 : current * 1.05;

            reasons.push('إشارات تشبع شرائي أو كسر جزئي للزخم؛ يفضل تأمين جزء من الأرباح.');
            if (ret >= 18) reasons.push('وصل السهم لمستهدف جني الأرباح المعتاد.');
            
            plan.actionQty = sellQty;
            plan.actionPrice = suggestedSellPrice;
            plan.targetPrice = nextTarget;
            plan.whyQty = `تم اقتراح جني أرباح لـ ${Math.round(reducePct * 100)}% من الكمية (${sellQty.toLocaleString('ar-EG')} سهم) وتأمين السيولة.`;

            return { text: 'تقليل مراكز', cls: 'opinion-reduce', symbol, name, reasons, plan };
        }

        // شرط زيادة المراكز (تعزيز مع حماية تنويع المحفظة)
        const isHealthyRsi = !Number.isFinite(rsi) || rsi <= 62;
        const isUnderWeightLimit = weight < 20;
        const isTechnicalBuy = recMeta.key === 'strong-buy' || (recMeta.key === 'buy' && (Number.isFinite(score) && score >= 2.5) && ret < 8);

        if (isTechnicalBuy && isHealthyRsi) {
            if (!isUnderWeightLimit) {
                reasons.push('⚠️ السهم لديه إشارة شراء فنية، ولكن تم إلغاء الزيادة لتفادي مخاطر تركيز المحفظة (الوزن النسبي تجاوز 20%).');
                reasons.push('الاحتفاظ بالمركز الحالي هو البديل الآمن.');
                return { text: 'احتفاظ', cls: 'opinion-hold', symbol, name, reasons, plan };
            }

            const addPct = recMeta.key === 'strong-buy' ? 0.35 : 0.20;
            const buyQty = Math.max(1, Math.round(qty * addPct));
            const suggestedBuyPrice = Number.isFinite(support) ? Math.min(current, support * 1.01) : current * 0.995;
            const upsideTarget = Number.isFinite(resistance) ? resistance : current * 1.08;

            reasons.push('إشارات فنية قوية تدعم زيادة الحجم تدريجياً وبأمان.');
            if (volRatio >= 1.2) reasons.push('سيولة السهم ممتازة وتؤكد دخول قوى شرائية.');

            plan.actionQty = buyQty;
            plan.actionPrice = suggestedBuyPrice;
            plan.targetPrice = upsideTarget;
            plan.whyQty = `تعزيز المركز الحالي بزيادة قدرها ${Math.round(addPct * 100)}% (${buyQty.toLocaleString('ar-EG')} سهم) عند الدعم.`;

            return { text: 'زيادة مراكز', cls: 'opinion-add', symbol, name, reasons, plan };
        }

        reasons.push('السعر مستقر ولا توجد مؤشرات فنية أو مالية تستدعي تغيير حجم المركز حالياً.');
        reasons.push('الاحتفاظ بالأسهم ومراقبة مستويات الدعم والمقاومة.');
        return { text: 'احتفاظ', cls: 'opinion-hold', symbol, name, reasons, plan };
    }

    function generateSmartRebalancingPlan(portfolioList = [], companiesList = []) {
        if (!Array.isArray(portfolioList) || portfolioList.length === 0) return null;
        
        const sourceCandidates = [];
        let totalHarvestedCash = 0;
        const trimmedSymbols = new Set();
        
        portfolioList.forEach(item => {
            const qty = Number(item.quantity || item.qty || 0);
            const entry = Number(item.entryPrice || item.entry || 0);
            const current = Number(item.marketPrice || item.currentPrice || item.current || 0);
            const symbol = String(item.symbol || '').toUpperCase();
            const name = item.name || symbol;
            
            if (qty <= 0 || current <= 0) return;
            const pnlPct = entry > 0 ? ((current - entry) / entry) * 100 : 0;
            
            if (pnlPct >= 10 || pnlPct <= -12) {
                const trimPct = pnlPct >= 10 ? 0.35 : 0.50;
                const trimQty = Math.max(1, Math.round(qty * trimPct));
                const cashValue = trimQty * current;
                
                sourceCandidates.push({
                    symbol,
                    name,
                    qty,
                    trimQty,
                    currentPrice: current,
                    pnlPct: parseFloat(pnlPct.toFixed(2)),
                    cashValue: parseFloat(cashValue.toFixed(2)),
                    reason: pnlPct >= 10 ? `جني أرباح ممتازة بنسبة +${pnlPct.toFixed(1)}%` : `وقف خسارة وتأمين سيولة (-${Math.abs(pnlPct).toFixed(1)}%)`
                });
                
                totalHarvestedCash += cashValue;
                trimmedSymbols.add(symbol);
            }
        });

        if (sourceCandidates.length === 0 || totalHarvestedCash <= 0) {
            return {
                hasRecommendation: false,
                message: 'محفظتك حالياً في حالة توازن ممتاز ولا تتطلب إعادة هيكلة أو جني أرباح اضطراري.'
            };
        }

        const portfolioSymbols = new Set(portfolioList.map(p => String(p.symbol || '').toUpperCase()));
        const targetCandidates = [];
        const sourceCompanies = Array.isArray(companiesList) ? companiesList : Object.values(companiesList || {});

        sourceCompanies.forEach(comp => {
            if (!comp) return;
            const sym = String(comp.symbol || '').toUpperCase();
            if (!sym || trimmedSymbols.has(sym)) return;
            
            const points = getHistoryPoints(comp);
            if (points.length < 20) return;
            
            const last = points[points.length - 1];
            const closes = points.map(p => p.close);
            const volumes = points.map(p => p.volume || 0);
            
            const rsis = calcRSISeries(closes, 14);
            const vwaps = calcVWAPSeries(points);
            
            const lastRsi = rsis[rsis.length - 1] || 50;
            const lastVwap = vwaps[vwaps.length - 1] || last.close;
            
            const avgVol20 = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
            const volMult = avgVol20 > 0 ? (Number(last.volume || 0) / avgVol20) : 1;

            const inPortfolio = portfolioSymbols.has(sym);
            const change = Number(last.change ?? 0);
            
            if (lastRsi >= 35 && lastRsi <= 65 && last.close >= lastVwap * 0.94) {
                let score = (65 - lastRsi) + (last.close >= lastVwap ? 15 : 0) + (volMult >= 1.3 ? 12 : 0);
                
                if (inPortfolio) {
                    const portItem = portfolioList.find(p => String(p.symbol || '').toUpperCase() === sym);
                    const entryPrice = Number(portItem?.entryPrice || portItem?.entry || last.close);
                    const pnl = entryPrice > 0 ? ((last.close - entryPrice) / entryPrice) * 100 : 0;
                    if (pnl < 5) score += 10;
                }

                targetCandidates.push({
                    symbol: sym,
                    name: comp.shortName || comp.longName || sym,
                    currentPrice: last.close,
                    rsi: lastRsi,
                    vwap: lastVwap,
                    change: change,
                    score: (65 - lastRsi) + (last.close >= lastVwap ? 15 : 0)
                });
            }
        });

        targetCandidates.sort((a, b) => b.score - a.score);
        const topTarget = targetCandidates[0] || null;

        if (!topTarget) {
            return {
                hasRecommendation: false,
                message: 'تم تحديد سيولة قابلة للجني، لكن لا توجد فرص قاع فائقة الجودة بالسوق حالياً.'
            };
        }

        const suggestedBuyQty = Math.floor(totalHarvestedCash / topTarget.currentPrice);

        return {
            hasRecommendation: true,
            totalCashGenerated: parseFloat(totalHarvestedCash.toFixed(2)),
            sources: sourceCandidates,
            target: {
                ...topTarget,
                suggestedBuyQty,
                allocatedCash: parseFloat((suggestedBuyQty * topTarget.currentPrice).toFixed(2))
            }
        };
    }

    function analyzeCandlestickPatterns(points) {
        if (!Array.isArray(points) || points.length < 3) {
            return { tags: ['لا توجد بيانات شموع كافية'], notes: ['البيانات الحالية لا تكفي لتحليل الشموع.'] };
        }

        const tags = [];
        const notes = [];
        const last = points[points.length - 1];
        const prev = points[points.length - 2];

        const body = Math.abs((last.close || 0) - (last.open || 0));
        const range = Math.max((last.high || last.close || 0) - (last.low || last.close || 0), 0.0001);
        const lowerWick = Math.min(last.open || last.close || 0, last.close || 0) - (last.low || 0);
        const upperWick = (last.high || 0) - Math.max(last.open || last.close || 0, last.close || 0);

        const isHammer = lowerWick >= body * 2.5 && upperWick <= body * 0.4 && (last.close || 0) >= (last.open || 0);
        const isInvertedHammer = upperWick >= body * 2.5 && lowerWick <= body * 0.4;
        const isDoji = body / range <= 0.12;

        if (isHammer) {
            tags.push('Hammer 🔨');
            notes.push('الهامر: جسم صغير وذيل سفلي طويل، وتكون أقوى عادةً بعد اتجاه هابط.');
        }
        if (isInvertedHammer) {
            tags.push('Inverted Hammer');
            notes.push('المطرقة المقلوبة: إشارة انعكاس محتملة لكنها تحتاج شمعة تأكيد.');
        }
        if (isDoji) {
            tags.push('Doji');
            notes.push('الدوجي: حالة توازن/حيرة في السوق ويجب تأكيدها بالشمعة التالية.');
        }

        const prevBearish = (prev.close || 0) < (prev.open || 0);
        const lastBullish = (last.close || 0) > (last.open || 0);
        const bullishEngulfing = prevBearish && lastBullish && (last.open || 0) <= (prev.close || 0) && (last.close || 0) >= (prev.open || 0);
        if (bullishEngulfing) {
            tags.push('Bullish Engulfing');
            notes.push('الابتلاع الصاعد: شمعة صاعدة تبتلع جسم الشمعة الهابطة السابقة.');
        }

        const closes = points.slice(-35).map(p => Number(p.close)).filter(Number.isFinite);
        if (closes.length >= 15) {
            const peaks = [];
            const troughs = [];
            for (let i = 1; i < closes.length - 1; i++) {
                if (closes[i] > closes[i - 1] && closes[i] > closes[i + 1]) peaks.push(i);
                if (closes[i] < closes[i - 1] && closes[i] < closes[i + 1]) troughs.push(i);
            }

            for (let i = 0; i < peaks.length - 2; i++) {
                const l = closes[peaks[i]];
                const h = closes[peaks[i + 1]];
                const r = closes[peaks[i + 2]];
                const shouldersSimilar = Math.abs(l - r) / Math.max(l, r) <= 0.05;
                if (h > l * 1.03 && h > r * 1.03 && shouldersSimilar) {
                    tags.push('Head & Shoulders');
                    notes.push('الرأس والكتفين: نموذج انعكاس هابط محتمل بعد موجة صعود.');
                    break;
                }
            }

            for (let i = 0; i < troughs.length - 2; i++) {
                const l = closes[troughs[i]];
                const h = closes[troughs[i + 1]];
                const r = closes[troughs[i + 2]];
                const shouldersSimilar = Math.abs(l - r) / Math.max(l, r) <= 0.05;
                if (h < l * 0.97 && h < r * 0.97 && shouldersSimilar) {
                    tags.push('Inverse H&S');
                    notes.push('الرأس والكتفين المقلوب: نموذج انعكاس صاعد محتمل بعد هبوط.');
                    break;
                }
            }
        }

        if (!tags.length) {
            tags.push('لا توجد إشارة قوية حالياً');
            notes.push('لا يوجد نموذج شموعي مكتمل بوضوح في آخر الجلسات.');
        }

        return { tags, notes };
    }

    function buildNewsKeywords(symbol, companyName) {
        const symbolToken = String(symbol || '').trim().toUpperCase();
        const words = String(companyName || '')
            .replace(/[()\-_/]/g, ' ')
            .split(/\s+/)
            .map(w => w.trim())
            .filter(w => w.length >= 3)
            .slice(0, 3);
        return [symbolToken, ...words].filter(Boolean);
    }

    function parseNewsRss(xmlText) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        const items = Array.from(xml.querySelectorAll('item'));
        return items.map(item => ({
            title: (item.querySelector('title')?.textContent || '').trim(),
            link: (item.querySelector('link')?.textContent || '').trim(),
            pubDate: (item.querySelector('pubDate')?.textContent || '').trim(),
            source: (item.querySelector('source')?.textContent || 'Internet').trim()
        })).filter(x => x.title && x.link);
    }

    async function fetchTextWithFallback(url) {
        const endpoints = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint, { cache: 'no-store' });
                if (!response.ok) continue;
                const text = await response.text();
                if (endpoint.includes('/get?url=')) {
                    try {
                        const payload = JSON.parse(text);
                        const contents = payload?.contents;
                        if (typeof contents === 'string' && contents.length > 10) return contents;
                    } catch {
                    }
                } else if (text && text.length > 10) {
                    return text;
                }
            } catch {
            }
        }
        return '';
    }

    async function fetchInternetNewsByQuery(query) {
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ar&gl=EG&ceid=EG:ar`;
        const xmlText = await fetchTextWithFallback(rssUrl);
        if (!xmlText) return [];
        return parseNewsRss(xmlText);
    }

    function buildMubasherAnnouncementsUrl(symbol) {
        const normalized = String(symbol || '').trim().toLowerCase();
        if (!normalized) return 'https://www.mubasher.info/markets/EGX';
        return `https://www.mubasher.info/markets/EGX/stocks/${encodeURIComponent(normalized)}/announcements`;
    }

    function renderNewsList(news, infoText, stock = null) {
        const meta = document.getElementById('gaNewsMeta');
        const list = document.getElementById('gaNewsList');
        if (!meta || !list) return;
        meta.textContent = infoText || `آخر تحديث: ${new Date().toLocaleString('ar-EG')}`;

        const mubasherLink = buildMubasherAnnouncementsUrl(stock?.symbol || currentSymbol);
        const mubasherCard = `
            <div class="ga-news-item">
                <a href="${escapeHtml(mubasherLink)}" target="_blank" rel="noopener noreferrer" class="ga-news-link">إعلانات مباشر الرسمية للسهم</a>
                <div class="ga-news-meta">Mubasher Announcements</div>
            </div>
        `;

        if (!news.length) {
            list.innerHTML = `${mubasherCard}<div class="ga-news-item">لا توجد أخبار متاحة حالياً لهذا السهم.</div>`;
            return;
        }

        list.innerHTML = mubasherCard + news.map(item => {
            const published = item.pubDate ? new Date(item.pubDate).toLocaleString('ar-EG') : 'غير محدد';
            return `
                <div class="ga-news-item">
                    <a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="ga-news-link">${escapeHtml(item.title)}</a>
                    <div class="ga-news-meta">${escapeHtml(item.source)} • ${escapeHtml(published)}</div>
                </div>
            `;
        }).join('');
    }

    async function fetchAndRenderStockNews(stock, forceLoading = false) {
        const list = document.getElementById('gaNewsList');
        const meta = document.getElementById('gaNewsMeta');
        if (!list || !meta || !stock) return;

        if (forceLoading) {
            meta.textContent = 'جاري جلب آخر الأخبار من الإنترنت...';
            list.innerHTML = '<div class="ga-news-item">جاري التحميل...</div>';
        }

        const keywords = buildNewsKeywords(stock.symbol, stock.name || stock.longName || '');
        const mubasherAnnouncementsUrl = buildMubasherAnnouncementsUrl(stock.symbol);
        const queries = [
            mubasherAnnouncementsUrl,
            `site:mubasher.info/markets/EGX/stocks/${String(stock.symbol || '').trim().toLowerCase()}/announcements`,
            `${stock.symbol} ${stock.name || stock.longName || ''} سهم`,
            `${stock.name || stock.symbol} اخبار البورصة المصرية`,
            `${stock.name || stock.symbol} موقع الشرق اقتصاد`,
            `${stock.symbol} Asharq Business`,
            `${stock.symbol} EGX stock news`,
            `البورصة المصرية اخبار شركات`
        ];

        const allNews = [];
        for (const query of queries) {
            const rows = await fetchInternetNewsByQuery(query);
            if (rows.length) allNews.push(...rows);
            if (allNews.length >= 20) break;
        }

        if (!allNews.length) {
            renderNewsList([], 'تعذر جلب الأخبار من الإنترنت الآن.', stock);
            return;
        }

        const unique = [];
        const seen = new Set();
        allNews.forEach(item => {
            const key = (item.link || item.title || '').toLowerCase();
            if (!key || seen.has(key)) return;
            seen.add(key);
            unique.push({ ...item, source: item.source || 'Internet' });
        });

        const filtered = unique.filter(item => {
            const hay = `${item.title} ${item.link}`.toUpperCase();
            return keywords.some(keyword => hay.includes(String(keyword).toUpperCase()));
        });
        const news = (filtered.length ? filtered : unique).slice(0, 6);
        renderNewsList(news, news.length ? undefined : 'لا توجد نتائج أخبار حديثة من الإنترنت.', stock);
    }

    function calcNearestLevels(prices, stock) {
        if (!prices.length) return { support: null, resistance: null };
        const latest = prices[prices.length - 1];
        const supports = [];
        const resistances = [];

        if (Array.isArray(stock?.support)) {
            supports.push(...stock.support.filter(n => Number.isFinite(Number(n))).map(Number));
        }
        if (Array.isArray(stock?.resistance)) {
            resistances.push(...stock.resistance.filter(n => Number.isFinite(Number(n))).map(Number));
        }

        for (let i = 2; i < prices.length - 2; i++) {
            const p = prices[i];
            if (p <= prices[i - 1] && p <= prices[i + 1] && p <= prices[i - 2] && p <= prices[i + 2]) {
                supports.push(p);
            }
            if (p >= prices[i - 1] && p >= prices[i + 1] && p >= prices[i - 2] && p >= prices[i + 2]) {
                resistances.push(p);
            }
        }

        const nearestSupport = supports
            .filter(s => s <= latest)
            .sort((a, b) => b - a)[0] ?? null;
        const nearestResistance = resistances
            .filter(r => r >= latest)
            .sort((a, b) => a - b)[0] ?? null;

        return { support: nearestSupport, resistance: nearestResistance };
    }

    function buildTradingSignals(stock, prices, volumes) {
        const latest = prices[prices.length - 1] || Number(stock?.currentPrice || 0);
        const prev = prices[prices.length - 2] || latest;
        const changePct = prev ? ((latest - prev) / prev) * 100 : 0;
        const rsiVal = Number(stock?.rsi);

        const sma20 = calcSMA(prices, 20);
        const sma50 = calcSMA(prices, 50);
        const lastSma20 = sma20[sma20.length - 1];
        const lastSma50 = sma50[sma50.length - 1];

        const volAvg20 = calcSMA(volumes, 20);
        const volAvg7 = calcSMA(volumes, 7);
        const latestVol = volumes[volumes.length - 1] || 0;
        const avgVol = volAvg20[volAvg20.length - 1] || 0;
        const avgVol7 = volAvg7[volAvg7.length - 1] || 0;
        const volumeRatio20 = avgVol > 0 ? latestVol / avgVol : 1;
        const volumeRatio7 = avgVol7 > 0 ? latestVol / avgVol7 : 1;
        const ret10 = prices.length > 10 ? ((latest - prices[prices.length - 11]) / prices[prices.length - 11]) * 100 : 0;

        const levels = calcNearestLevels(prices, stock);
        const supportDistance = levels.support ? ((latest - levels.support) / levels.support) * 100 : null;
        const resistanceDistance = levels.resistance ? ((levels.resistance - latest) / latest) * 100 : null;

        let score = 0;
        const notes = [];

        if (Number.isFinite(rsiVal)) {
            if (rsiVal <= 30) { score += 2; notes.push('RSI في منطقة تشبع بيعي (احتمال ارتداد)'); }
            else if (rsiVal <= 40) { score += 1; notes.push('RSI منخفض نسبيًا'); }
            else if (rsiVal >= 70) { score -= 2; notes.push('RSI في تشبع شرائي (خطر جني أرباح)'); }
            else if (rsiVal >= 60) { score -= 1; notes.push('RSI مرتفع نسبيًا'); }
        }

        if (Number.isFinite(lastSma20) && Number.isFinite(lastSma50)) {
            if (latest > lastSma20 && lastSma20 > lastSma50) {
                score += 2;
                notes.push('اتجاه صاعد: السعر فوق SMA20 وSMA50');
            } else if (latest < lastSma20 && lastSma20 < lastSma50) {
                score -= 2;
                notes.push('اتجاه هابط: السعر أسفل SMA20 وSMA50');
            }
        }

        if (changePct >= 2) {
            score += 1;
            notes.push('زخم يومي إيجابي');
        } else if (changePct <= -2) {
            score -= 1;
            notes.push('ضغط بيعي يومي');
        }

        if (ret10 >= 6) {
            score += 1;
            notes.push('أداء 10 أيام داعم للاتجاه');
        } else if (ret10 <= -6) {
            score -= 1;
            notes.push('أداء 10 أيام ضعيف');
        }

        if (avgVol > 0) {
            if (volumeRatio20 >= 1.35 && changePct >= 0.8) {
                score += 1.5;
                notes.push('زخم صعودي مؤكد بحجم تداول قوي');
            } else if (volumeRatio20 >= 1.35 && changePct <= -0.8) {
                score -= 1.5;
                notes.push('ضغط بيعي قوي مدعوم بارتفاع الحجم');
            } else if (volumeRatio20 >= 1.15 || volumeRatio7 >= 1.2) {
                score += 0.5;
                notes.push('نشاط سيولة أعلى من الطبيعي');
            } else if (volumeRatio20 <= 0.55) {
                score -= 0.5;
                notes.push('ضعف واضح في السيولة');
            }
        }

        if (prices.length >= 7 && avgVol > 0) {
            let upHighVolDays = 0;
            let downHighVolDays = 0;
            for (let i = Math.max(1, prices.length - 6); i < prices.length; i++) {
                const dayVol = Number(volumes[i] || 0);
                if (dayVol < avgVol * 1.1) continue;
                const dayChange = prices[i - 1] ? ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100 : 0;
                if (dayChange > 0) upHighVolDays++;
                else if (dayChange < 0) downHighVolDays++;
            }

            if (upHighVolDays >= 3 && upHighVolDays > downHighVolDays) {
                score += 1;
                notes.push('تجميع شرائي ملحوظ في الجلسات الأخيرة');
            } else if (downHighVolDays >= 3 && downHighVolDays > upHighVolDays) {
                score -= 1;
                notes.push('تصريف ملحوظ في الجلسات الأخيرة');
            }
        }

        if (supportDistance !== null && supportDistance <= 3.2) {
            score += 1;
            notes.push('السعر قريب من دعم مهم');
        }
        if (resistanceDistance !== null && resistanceDistance <= 2.8) {
            score -= 1;
            notes.push('السعر قريب من مقاومة مهمة');
        }

        const inPortfolio = isSymbolInPortfolio(stock?.symbol);

        let recommendation = 'محايد';
        let color = '#e2e8f0';
        if (score >= 4) { recommendation = 'شراء قوي'; color = '#22c55e'; }
        else if (score >= 2) { recommendation = 'شراء'; color = '#84cc16'; }
        else if (score <= -4) { recommendation = inPortfolio ? 'بيع قوي' : 'تجنب دخول'; color = '#ef4444'; }
        else if (score <= -2) { recommendation = inPortfolio ? 'تقليل مراكز' : 'انتظار'; color = '#f97316'; }

        const stopLoss = levels.support ? Math.round(levels.support * 0.985 * 100) / 100 : null;
        const target1 = levels.resistance ? Math.round(levels.resistance * 0.985 * 100) / 100 : null;
        const target2 = levels.resistance ? Math.round(levels.resistance * 1.025 * 100) / 100 : null;

        return {
            score,
            notes,
            recommendation,
            color,
            levels,
            stopLoss,
            target1,
            target2,
            sma20,
            sma50
        };
    }

    function ensureChartPluginsRegistered() {
        if (!window.Chart || !window.Chart.register) return;
        if (window.ChartAnnotation) {
            try { window.Chart.register(window.ChartAnnotation); } catch { }
        }
    }

    function buildFallbackHistory(stock) {
        const now = new Date();
        const prev = new Date(now);
        prev.setDate(now.getDate() - 1);
        const price = Number(stock?.currentPrice || 0);
        const prevPrice = Number(price * (1 - (Number(stock?.change || 0) / 100))) || price;
        return [
            {
                date: `${prev.getDate()}/${prev.getMonth() + 1}/${prev.getFullYear()}`,
                open: prevPrice,
                high: Math.max(prevPrice, price),
                low: Math.min(prevPrice, price),
                close: prevPrice,
                volume: 0
            },
            {
                date: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
                open: prevPrice,
                high: Math.max(prevPrice, price),
                low: Math.min(prevPrice, price),
                close: price,
                volume: 0
            }
        ];
    }

    function ensureModal() {
        if (document.getElementById('globalAnalysisModal')) return;

        const style = document.createElement('style');
        style.textContent = `
            .ga-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.95);z-index:9999;padding:20px;overflow-y:auto}
            .ga-overlay.active{display:block}
            .ga-modal{--ga-scale:1;width:min(calc(1400px * var(--ga-scale)),95vw);height:min(calc(880px * var(--ga-scale)),88vh);min-width:760px;min-height:520px;max-width:95vw;max-height:90vh;margin:20px auto;background:#1e293b;border-radius:20px;padding:calc(25px * var(--ga-scale));border:2px solid #fbbf24;position:relative;color:#e2e8f0;font-size:calc(1rem * var(--ga-scale));overflow:auto;resize:both}
            .ga-close{position:absolute;top:10px;left:15px;background:none;border:none;color:#94a3b8;font-size:2em;cursor:pointer;line-height:1}
            .ga-title{color:#fbbf24;margin-bottom:16px;font-size:1.5rem}
            .ga-info-card{background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:12px;padding:20px;margin-bottom:18px;border:1px solid #fbbf24;display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
            .ga-card{text-align:center}
            .ga-card .k{color:#94a3b8;font-size:.9em;margin-bottom:6px}
            .ga-card .v{font-size:1.2em;font-weight:700;color:#fbbf24}
            .ga-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
            .ga-btn{background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;border-radius:50px;padding:10px 18px;cursor:pointer;font-weight:700}
            .ga-analysis-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:20px;margin-top:12px}
            .ga-subtitle{color:#fbbf24;margin:8px 0 10px}
            .ga-chart-container{width:100%;height:calc(350px * var(--ga-scale));background:#0f172a;border-radius:12px;padding:15px;border:1px solid #334155}
            .ga-chart-container canvas{width:100% !important;height:100% !important;display:block}
            .ga-reason-box{background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);padding:18px;border-radius:12px;margin-top:14px;border-right:4px solid #10b981;line-height:1.9}
            .ga-indicators-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:8px 0 14px}
            .ga-indicator-item{background:#0f172a;padding:12px;border-radius:8px;text-align:center;border:1px solid #334155}
            .ga-indicator-label{color:#94a3b8;font-size:.9em;margin-bottom:4px}
            .ga-indicator-value{font-size:1.1em;font-weight:700}
            .ga-sr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0}
            .ga-sr-item{background:#0f172a;padding:10px;border-radius:8px;text-align:center}
            .ga-support{color:#10b981;font-weight:700}
            .ga-resistance{color:#ef4444;font-weight:700}
            .ga-signal{background:#0f172a;padding:10px;border-radius:8px;margin:8px 0;border-right:4px solid}
            .ga-action{background:#0f172a;padding:14px;border-radius:8px;line-height:1.9}
            .ga-chip-list{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
            .ga-chip{padding:6px 10px;border-radius:999px;border:1px solid #334155;background:#111827;color:#e2e8f0;font-size:.85em}
            .ga-news-meta{color:#94a3b8;font-size:.85em;margin-bottom:8px}
            .ga-news-list{display:grid;gap:8px}
            .ga-news-item{background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155}
            .ga-news-link{color:#e2e8f0;text-decoration:none;font-weight:700;display:block;margin-bottom:4px}
            .ga-news-link:hover{color:#fbbf24}
            .ga-size-controls{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
            .ga-size-btn{background:#334155;color:#e2e8f0;border:none;border-radius:8px;padding:6px 10px;cursor:pointer;font-weight:700}
            .ga-size-label{color:#94a3b8;font-size:.9em;min-width:62px;text-align:center}
            
            /* LWC Fullscreen Overlay Style */
            .ga-full{--ga-scale:1;display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:#0d1117;z-index:10000;padding:24px;overflow:hidden;font-size:calc(1rem * var(--ga-scale))}
            .ga-full.active{display:flex;flex-direction:column}
            .ga-full-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #334155}
            .ga-full-head h3{color:#fbbf24;font-size:1.4rem;margin:0}
            .ga-full-close{background:none;border:none;color:#94a3b8;font-size:2.5em;cursor:pointer;line-height:1}
            .ga-lwc-container{flex:1;width:100%;background:#0f172a;border-radius:12px;border:1px solid #334155;position:relative}

            @media (max-width: 920px){
                .ga-analysis-grid{grid-template-columns:1fr}
                .ga-sr-grid{grid-template-columns:repeat(2,1fr)}
                .ga-modal{min-width:unset;min-height:unset;width:95vw;height:88vh;resize:none}
            }
            @keyframes gaSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        const modal = document.createElement('div');
        modal.id = 'globalAnalysisModal';
        modal.className = 'ga-overlay';
        modal.innerHTML = `
            <div class="ga-modal">
                <button class="ga-close" onclick="closeStockAnalysis()">&times;</button>
                <h2 class="ga-title" id="gaTitle">تحليل متقدم للسهم</h2>

                <div class="ga-size-controls" style="margin-bottom:10px;">
                    <button class="ga-size-btn" onclick="adjustAnalysisSize(-0.1)">A-</button>
                    <span class="ga-size-label" id="gaScaleLabel">100%</span>
                    <button class="ga-size-btn" onclick="adjustAnalysisSize(0.1)">A+</button>
                    <button class="ga-size-btn" onclick="resetAnalysisSize()">إعادة الحجم</button>
                </div>

                <div class="ga-info-card">
                    <div class="ga-card"><div class="k">الرمز</div><div class="v" id="gaSymbol">-</div></div>
                    <div class="ga-card"><div class="k">الشركة</div><div class="v" id="gaName">-</div></div>
                    <div class="ga-card"><div class="k">السعر</div><div class="v" id="gaPrice">-</div></div>
                    <div class="ga-card"><div class="k">التغير %</div><div class="v" id="gaChange">-</div></div>
                    <div class="ga-card"><div class="k">RSI</div><div class="v" id="gaRsi">-</div></div>
                    <div class="ga-card"><div class="k">التوصية</div><div class="v" id="gaRec">-</div></div>
                </div>

                <div class="ga-actions" style="display:flex; gap:10px; margin-bottom:12px;">
                    <button class="ga-btn" onclick="openAdvancedStockAnalysis()" style="background: linear-gradient(135deg, #fbbf24, #f59e0b); color:#0f172a; font-weight:800; display:inline-flex; align-items:center; gap:6px;"><i class="fas fa-chart-line"></i> عرض الرسم البياني المحترف</button>
                </div>

                <div class="ga-analysis-grid">
                    <div>
                        <h3 class="ga-subtitle">📈 الرسم البياني الخطي (انقر للتفاصيل والشموع)</h3>
                        <div class="ga-chart-container" style="cursor:pointer;" onclick="openAdvancedStockAnalysis()">
                            <canvas id="gaMiniChart"></canvas>
                        </div>

                        <!-- Target levels and Fibonacci tables side-by-side -->
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-top:12px;">
                            <!-- Target levels table -->
                            <div style="background:#0f172a; padding:14px; border-radius:12px; border:1px solid #334155;">
                                <div style="color:#fbbf24; font-weight:bold; font-size:0.92em; margin-bottom:10px; display:flex; align-items:center; gap:6px;"><i class="fas fa-bullseye"></i> مستويات التداول المستهدفة</div>
                                <table style="width:100%; border-collapse:collapse; font-size:0.88em;">
                                    <tr style="border-bottom:1px solid #1e293b;"><td style="padding:6px 0; color:#94a3b8;">المستهدف الثاني</td><td id="gaValTarget2" style="text-align:left; font-weight:bold; color:#10b981; font-family:monospace;">-</td></tr>
                                    <tr style="border-bottom:1px solid #1e293b;"><td style="padding:6px 0; color:#94a3b8;">المستهدف الأول</td><td id="gaValTarget1" style="text-align:left; font-weight:bold; color:#10b981; font-family:monospace;">-</td></tr>
                                    <tr style="border-bottom:1px solid #1e293b;"><td style="padding:6px 0; color:#94a3b8;">الدخول الأمثل</td><td id="gaValEntry" style="text-align:left; font-weight:bold; color:#fbbf24; font-family:monospace;">-</td></tr>
                                    <tr><td style="padding:6px 0; color:#94a3b8;">وقف الخسارة</td><td id="gaValStop" style="text-align:left; font-weight:bold; color:#ef4444; font-family:monospace;">-</td></tr>
                                </table>
                            </div>
                            
                            <!-- Fibonacci levels table -->
                            <div style="background:#0f172a; padding:14px; border-radius:12px; border:1px solid #334155;">
                                <div style="color:#fbbf24; font-weight:bold; font-size:0.92em; margin-bottom:10px; display:flex; align-items:center; gap:6px;"><i class="fas fa-project-diagram"></i> مستويات فيبوناتشي التلقائية</div>
                                <table style="width:100%; border-collapse:collapse; font-size:0.88em;">
                                    <tr style="border-bottom:1px solid #1e293b;"><td style="padding:4px 0; color:#94a3b8;">100% (القمة)</td><td id="gaValFibo100" style="text-align:left; font-family:monospace; color:#cbd5e1;">-</td></tr>
                                    <tr style="border-bottom:1px solid #1e293b;"><td style="padding:4px 0; color:#94a3b8;">61.8% (الذهبي)</td><td id="gaValFibo61" style="text-align:left; font-family:monospace; color:#fbbf24;">-</td></tr>
                                    <tr style="border-bottom:1px solid #1e293b;"><td style="padding:4px 0; color:#94a3b8;">50.0% (المنتصف)</td><td id="gaValFibo50" style="text-align:left; font-family:monospace; color:#3b82f6;">-</td></tr>
                                    <tr style="border-bottom:1px solid #1e293b;"><td style="padding:4px 0; color:#94a3b8;">38.2% (الدعم)</td><td id="gaValFibo38" style="text-align:left; font-family:monospace; color:#10b981;">-</td></tr>
                                    <tr><td style="padding:4px 0; color:#94a3b8;">0% (القاع)</td><td id="gaValFibo0" style="text-align:left; font-family:monospace; color:#cbd5e1;">-</td></tr>
                                </table>
                            </div>
                        </div>

                        <div class="ga-reason-box" id="gaReasonText"></div>
                    </div>
                    <div>
                        <h3 class="ga-subtitle">📊 المؤشرات الفنية</h3>
                        <div class="ga-indicators-grid" id="gaIndicators"></div>
                        <h3 class="ga-subtitle">📉 مستويات الدعم والمقاومة</h3>
                        <div class="ga-sr-grid" id="gaSR"></div>
                        <h3 class="ga-subtitle">📈 إشارات التداول</h3>
                        <div id="gaSignals"></div>
                        <h3 class="ga-subtitle">💡 التوصية وخطة العمل</h3>
                        <div id="gaAction" class="ga-action"></div>
                        <h3 class="ga-subtitle">🕯️ شرح علامات الشموع</h3>
                        <div class="ga-action" id="gaCandleGuide"></div>
                        <h3 class="ga-subtitle">🔍 تحليل الشموع للسهم</h3>
                        <div id="gaCandleSignals" class="ga-action"></div>
                        <h3 class="ga-subtitle">📰 آخر الأخبار</h3>
                        <div class="ga-action">
                            <div id="gaNewsMeta" class="ga-news-meta">جاري تجهيز الأخبار...</div>
                            <div id="gaNewsList" class="ga-news-list"></div>
                            <div style="margin-top:8px;">
                                <button class="ga-btn" onclick="refreshCurrentStockNews(true)">تحديث الأخبار الآن</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Append overlay container for LWC chart
        const fullscreen = document.createElement('div');
        fullscreen.id = 'globalAdvancedModal';
        fullscreen.className = 'ga-full';
        fullscreen.innerHTML = `
            <div class="ga-full-head" style="display:flex; justify-content:space-between; align-items:center; padding: 10px 20px; flex-wrap:wrap; gap:10px;">
                <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
                    <h3 id="gaFullTitle" style="margin:0; font-size:1.15em;">الرسم البياني المحترف والتفاعلي</h3>
                    
                    <!-- Support and Resistance mini table -->
                    <div id="gaSrMiniTable" style="display: flex; align-items: center; gap: 12px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); padding: 4px 10px; border-radius: 6px; font-size: 0.78em; direction: rtl;">
                        <div style="display: flex; align-items: center; gap: 6px; color: #10b981;">
                            <span style="color: #94a3b8; font-weight: bold;">المقاومات:</span>
                            <span id="gaSrRes2" style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 1px 4px; border-radius: 3px;">م2: -</span>
                            <span id="gaSrRes1" style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 1px 4px; border-radius: 3px;">م1: -</span>
                        </div>
                        <div style="border-left: 1px solid rgba(255,255,255,0.1); height: 14px; margin: 0 4px;"></div>
                        <div style="display: flex; align-items: center; gap: 6px; color: #f43f5e;">
                            <span style="color: #94a3b8; font-weight: bold;">الدعوم:</span>
                            <span id="gaSrSup1" style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 1px 4px; border-radius: 3px;">د1: -</span>
                            <span id="gaSrSup2" style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 1px 4px; border-radius: 3px;">د2: -</span>
                        </div>
                    </div>
                </div>
                <div style="display:flex; gap:12px; align-items:center; direction:rtl; flex-wrap:wrap;">
                    <span style="font-size:0.9em; color:#fbbf24; font-weight:bold;"><i class="fas fa-search"></i> السهم:</span>
                    <div style="position:relative; width:220px; z-index:150;">
                        <input type="text" id="gaLwcStockSearch" style="background:#1e293b; color:#fbbf24; border:1px solid #334155; padding:6px 12px; border-radius:6px; font-size:0.9em; font-weight:bold; width:100%; box-sizing:border-box;" placeholder="اكتب اسم أو رمز السهم..." autocomplete="off">
                        <div id="gaLwcAutocompleteList" style="display:none; position:absolute; top:100%; right:0; left:0; background:#0f172a; border:1px solid #334155; border-radius:6px; max-height:250px; overflow-y:auto; z-index:200; text-align:right;"></div>
                    </div>
                    <select id="gaLwcLookback" style="background:#1e293b; color:#e2e8f0; border:1px solid #334155; padding:6px 12px; border-radius:6px; font-size:0.9em; cursor:pointer;">
                        <option value="30">30 جلسة</option>
                        <option value="60" selected>60 جلسة</option>
                        <option value="90">90 جلسة</option>
                        <option value="180">180 جلسة</option>
                    </select>
                    <div style="display:flex; border:1px solid #334155; border-radius:6px; overflow:hidden; font-size:0.9em;">
                        <button id="gaLwcTypeCandle" style="background:#fbbf24; color:#0f172a; border:none; padding:6px 12px; cursor:pointer; font-weight:bold;">شموع</button>
                        <button id="gaLwcTypeLine" style="background:#0f172a; color:#cbd5e1; border:none; padding:6px 12px; cursor:pointer;">خطي</button>
                    </div>
                    <button class="ga-full-close" onclick="closeAdvancedStockAnalysis()">&times;</button>
                </div>
            </div>
            <div class="ga-lwc-container" id="gaLwcChartContainer">
                <div id="gaLwcLoader" style="position:absolute; top:0; left:0; right:0; bottom:0; background:rgba(11, 15, 25, 0.8); display:flex; align-items:center; justify-content:center; z-index:20; border-radius:12px; backdrop-filter:blur(2px);">
                    <div style="width:30px; height:30px; border:3px solid rgba(59, 130, 246, 0.1); border-top-color:#fbbf24; border-radius:50%; animation:gaSpin 1s infinite linear;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(fullscreen);

        // Hook lookback and type events in LWC overlay
        const selectLookback = document.getElementById('gaLwcLookback');
        const btnCandle = document.getElementById('gaLwcTypeCandle');
        const btnLine = document.getElementById('gaLwcTypeLine');
        
        // Setup custom autocomplete stock search in modal
        const modalSearchInput = document.getElementById('gaLwcStockSearch');
        const modalAutocompleteList = document.getElementById('gaLwcAutocompleteList');

        function renderModalAutocomplete(list) {
            if (!modalAutocompleteList) return;
            modalAutocompleteList.innerHTML = '';
            if (list.length === 0) {
                modalAutocompleteList.style.display = 'none';
                return;
            }

            list.forEach(item => {
                const div = document.createElement('div');
                div.style.padding = '8px 12px';
                div.style.cursor = 'pointer';
                div.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                div.style.display = 'flex';
                div.style.justifyContent = 'space-between';
                div.style.alignItems = 'center';
                div.style.fontSize = '0.85em';
                div.innerHTML = `
                    <span style="color:#fbbf24; font-weight:bold;">${item.symbol}</span>
                    <span style="color:#94a3b8; margin-right:10px;" dir="ltr">${item.longName || item.shortName || item.name}</span>
                `;
                div.addEventListener('click', () => {
                    modalSearchInput.value = `${item.symbol} - ${item.longName || item.shortName || item.name}`;
                    modalAutocompleteList.style.display = 'none';
                    if (item.symbol !== currentSymbol) {
                        window.openStockAnalysis(item.symbol);
                        updateLwcChart();
                    }
                });
                modalAutocompleteList.appendChild(div);
            });
        }

        if (modalSearchInput) {
            modalSearchInput.addEventListener('input', (e) => {
                const text = String(e.target.value).trim().toLowerCase();
                const listSource = getCompanies() || [];
                if (!text) {
                    renderModalAutocomplete(listSource.slice(0, 100));
                    modalAutocompleteList.style.display = 'block';
                    return;
                }

                const filtered = listSource.filter(c => 
                    String(c.symbol).toLowerCase().includes(text) || 
                    String(c.longName || c.shortName || c.name).toLowerCase().includes(text)
                );

                renderModalAutocomplete(filtered.slice(0, 100));
                modalAutocompleteList.style.display = 'block';
            });

            modalSearchInput.addEventListener('focus', function() {
                this.select(); // Highlight text for quick overwrite search
                const listSource = getCompanies() || [];
                renderModalAutocomplete(listSource.slice(0, 100));
                modalAutocompleteList.style.display = 'block';
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (modalSearchInput && !e.target.closest('#gaLwcAutocompleteList') && e.target !== modalSearchInput) {
                if (modalAutocompleteList) modalAutocompleteList.style.display = 'none';
            }
        });

        if (selectLookback) {
            selectLookback.addEventListener('change', () => {
                updateLwcChart();
            });
        }
        if (btnCandle) {
            btnCandle.addEventListener('click', () => {
                btnCandle.style.background = '#fbbf24';
                btnCandle.style.color = '#0f172a';
                btnCandle.style.fontWeight = 'bold';
                btnLine.style.background = '#0f172a';
                btnLine.style.color = '#cbd5e1';
                btnLine.style.fontWeight = 'normal';
                gaLwcChartType = 'candle';
                recreateLwcSeries();
                updateLwcChart();
            });
        }
        if (btnLine) {
            btnLine.addEventListener('click', () => {
                btnLine.style.background = '#fbbf24';
                btnLine.style.color = '#0f172a';
                btnLine.style.fontWeight = 'bold';
                btnCandle.style.background = '#0f172a';
                btnCandle.style.color = '#cbd5e1';
                btnCandle.style.fontWeight = 'normal';
                gaLwcChartType = 'line';
                recreateLwcSeries();
                updateLwcChart();
            });
        }

        modal.addEventListener('click', function (event) {
            if (event.target === modal) closeStockAnalysis();
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeStockAnalysis();
                closeAdvancedStockAnalysis();
            }
        });
    }

    function applyAnalysisScale() {
        const modal = document.querySelector('#globalAnalysisModal .ga-modal');
        const full = document.getElementById('globalAdvancedModal');
        const pct = `${Math.round(analysisScale * 100)}%`;
        if (modal) modal.style.setProperty('--ga-scale', String(analysisScale));
        if (full) full.style.setProperty('--ga-scale', String(analysisScale));
        const label1 = document.getElementById('gaScaleLabel');
        const label2 = document.getElementById('gaScaleLabelFull');
        if (label1) label1.textContent = pct;
        if (label2) label2.textContent = pct;
    }

    window.adjustAnalysisSize = function (delta) {
        analysisScale = Math.max(0.8, Math.min(1.4, Math.round((analysisScale + delta) * 100) / 100));
        applyAnalysisScale();
        if (advPriceChart) advPriceChart.resize();
        if (advVolumeChart) advVolumeChart.resize();
        if (advRsiChart) advRsiChart.resize();
        if (miniChart) miniChart.resize();
    };

    window.resetAnalysisSize = function () {
        analysisScale = 1;
        applyAnalysisScale();
        if (advPriceChart) advPriceChart.resize();
        if (advVolumeChart) advVolumeChart.resize();
        if (advRsiChart) advRsiChart.resize();
        if (miniChart) miniChart.resize();
    };

    function getSupportResistanceAnnotations(levels) {
        const annotations = {};
        if (!levels) return annotations;

        if (Number.isFinite(levels.support)) {
            annotations.supportLine = {
                type: 'line',
                yMin: levels.support,
                yMax: levels.support,
                borderColor: '#22c55e',
                borderWidth: 1,
                label: {
                    display: true,
                    content: `دعم ${levels.support.toFixed(2)}`,
                    color: '#fff',
                    backgroundColor: '#16a34a'
                }
            };
        }
        if (Number.isFinite(levels.resistance)) {
            annotations.resistanceLine = {
                type: 'line',
                yMin: levels.resistance,
                yMax: levels.resistance,
                borderColor: '#ef4444',
                borderWidth: 1,
                label: {
                    display: true,
                    content: `مقاومة ${levels.resistance.toFixed(2)}`,
                    color: '#fff',
                    backgroundColor: '#dc2626'
                }
            };
        }
        return annotations;
    }

    function renderMiniChart(labels, prices, levels) {
        const canvas = document.getElementById('gaMiniChart');
        if (!canvas || !window.Chart) return;
        if (miniChart) miniChart.destroy();

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 350);
        gradient.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0.00)');

        const miniOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#94a3b8',
                    bodyColor: '#e2e8f0',
                    borderColor: '#fbbf24',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: (ctx) => `السعر: ${Number(ctx.raw || 0).toFixed(2)} ج.م`
                    }
                }
            },
            scales: {
                y: { 
                    grid: { color: 'rgba(51, 65, 85, 0.15)' }, 
                    ticks: { color: '#94a3b8', font: { family: 'Segoe UI' } } 
                },
                x: { 
                    grid: { display: false }, 
                    ticks: { color: '#94a3b8', maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } 
                }
            }
        };
        if (window.ChartAnnotation) {
            miniOptions.plugins = {
                ...miniOptions.plugins,
                annotation: {
                    annotations: getSupportResistanceAnnotations(levels)
                }
            };
        }

        try {
            miniChart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'السعر',
                        data: prices,
                        borderColor: '#fbbf24',
                        backgroundColor: gradient,
                        tension: 0.3,
                        fill: true,
                        pointRadius: 0
                    }]
                },
                options: miniOptions
            });
        } catch (err) {
            console.error('Mini chart error:', err);
        }
    }

    function createLinePriceChart(priceCanvas, labels, prices, sma20, sma50, priceOptions) {
        return new Chart(priceCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'السعر', data: prices, borderColor: '#22c55e', tension: 0.2, pointRadius: 0 },
                    { label: 'SMA 20', data: sma20, borderColor: '#38bdf8', pointRadius: 0, spanGaps: true },
                    { label: 'SMA 50', data: sma50, borderColor: '#f97316', pointRadius: 0, spanGaps: true }
                ]
            },
            options: priceOptions
        });
    }

    function drawCustomCandles(canvas, points, sma20, sma50, levels) {
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const width = Math.max(300, Math.floor(rect.width));
        const height = Math.max(220, Math.floor(rect.height));
        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const pad = { top: 16, right: 56, bottom: 26, left: 12 };
        const drawW = width - pad.left - pad.right;
        const drawH = height - pad.top - pad.bottom;
        if (drawW <= 20 || drawH <= 20) return;

        const highs = points.map(p => Number(p.high ?? p.close)).filter(Number.isFinite);
        const lows = points.map(p => Number(p.low ?? p.close)).filter(Number.isFinite);
        const closes = points.map(p => Number(p.close)).filter(Number.isFinite);
        if (!highs.length || !lows.length || !closes.length) return;

        let maxP = Math.max(...highs);
        let minP = Math.min(...lows);
        if (!Number.isFinite(maxP) || !Number.isFinite(minP)) return;
        if (maxP === minP) {
            maxP += 1;
            minP -= 1;
        }
        const pricePad = (maxP - minP) * 0.08;
        maxP += pricePad;
        minP -= pricePad;

        const yOf = (price) => pad.top + ((maxP - price) / (maxP - minP)) * drawH;
        const xStep = drawW / points.length;
        const candleW = Math.max(3, Math.min(14, xStep * 0.7));

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = pad.top + (drawH / 5) * i;
            ctx.beginPath();
            ctx.moveTo(pad.left, y);
            ctx.lineTo(width - pad.right, y);
            ctx.stroke();

            const price = maxP - ((maxP - minP) / 5) * i;
            ctx.fillStyle = '#94a3b8';
            ctx.font = '11px Segoe UI';
            ctx.textAlign = 'right';
            ctx.fillText(price.toFixed(2), width - 6, y + 4);
        }

        const drawLevel = (value, color) => {
            if (!Number.isFinite(value)) return;
            const y = yOf(value);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(pad.left, y);
            ctx.lineTo(width - pad.right, y);
            ctx.stroke();
            ctx.restore();
        };
        drawLevel(Number(levels?.support), '#10b981');
        drawLevel(Number(levels?.resistance), '#ef4444');

        points.forEach((point, i) => {
            const close = Number(point.close);
            const open = Number.isFinite(Number(point.open)) ? Number(point.open) : (i > 0 ? Number(points[i - 1].close) : close);
            let high = Number(point.high);
            let low = Number(point.low);

            if (!Number.isFinite(high)) high = Math.max(open, close);
            if (!Number.isFinite(low)) low = Math.min(open, close);
            high = Math.max(high, open, close);
            low = Math.min(low, open, close);

            const x = pad.left + i * xStep + xStep / 2;
            const yOpen = yOf(open);
            const yClose = yOf(close);
            const yHigh = yOf(high);
            const yLow = yOf(low);
            const up = close >= open;
            const color = up ? '#10b981' : '#ef4444';

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(x, yHigh);
            ctx.lineTo(x, yLow);
            ctx.stroke();

            const bodyTop = Math.min(yOpen, yClose);
            const bodyH = Math.max(1.5, Math.abs(yClose - yOpen));
            ctx.fillStyle = color;
            ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
        });

        const drawSmaLine = (series, color) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.4;
            let started = false;
            for (let i = 0; i < series.length; i++) {
                const val = Number(series[i]);
                if (!Number.isFinite(val)) continue;
                const x = pad.left + i * xStep + xStep / 2;
                const y = yOf(val);
                if (!started) {
                    ctx.moveTo(x, y);
                    started = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            if (started) ctx.stroke();
        };

        drawSmaLine(sma20, '#38bdf8');
        drawSmaLine(sma50, '#f97316');

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px Segoe UI';
        ctx.textAlign = 'left';
        ctx.fillText('🕯️ شموع السعر', pad.left + 4, 14);
    }

    function renderAdvancedCharts(points, analysisSignals) {
        if (!window.Chart) return;
        if (!Array.isArray(points) || points.length < 2) return;
        const labels = points.map(p => p.date);
        const prices = points.map(p => p.close);
        const volumes = points.map(p => p.volume || 0);
        const rsi = calcRSISeries(prices);
        const sma20 = analysisSignals?.sma20 || calcSMA(prices, 20);
        const sma50 = analysisSignals?.sma50 || calcSMA(prices, 50);

        if (advPriceChart) advPriceChart.destroy();
        if (advVolumeChart) advVolumeChart.destroy();
        if (advRsiChart) advRsiChart.destroy();

        const priceCanvas = document.getElementById('gaPriceChart');
        const volumeCanvas = document.getElementById('gaVolumeChart');
        const rsiCanvas = document.getElementById('gaRsiChart');
        if (!priceCanvas || !volumeCanvas || !rsiCanvas) return;

        const ensureCanvas = (canvas) => {
            const wrap = canvas.parentElement;
            if (!wrap) return;
            const rect = wrap.getBoundingClientRect();
            if (rect.height < 120) {
                wrap.style.height = '320px';
            }
        };
        ensureCanvas(priceCanvas);
        ensureCanvas(volumeCanvas);
        ensureCanvas(rsiCanvas);

        const priceOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true }
            }
        };
        if (window.ChartAnnotation) {
            priceOptions.plugins.annotation = {
                annotations: getSupportResistanceAnnotations(analysisSignals?.levels)
            };
        }

        try {
            drawCustomCandles(priceCanvas, points, sma20, sma50, analysisSignals?.levels);
        } catch (error) {
            console.error('Custom candles failed, fallback to line:', error);
            advPriceChart = createLinePriceChart(priceCanvas, labels, prices, sma20, sma50, priceOptions);
        }

        try {
            advVolumeChart = new Chart(volumeCanvas.getContext('2d'), {
                type: 'bar',
                data: { labels, datasets: [{ label: 'الحجم', data: volumes, backgroundColor: 'rgba(59,130,246,.6)' }] },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                        y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
                    }
                }
            });

            const avgVolume = volumes.length ? Math.round(volumes.reduce((a, b) => a + (Number(b) || 0), 0) / volumes.length) : 0;
            const avgNode = document.getElementById('gaAvgVolume');
            if (avgNode) avgNode.textContent = avgVolume.toLocaleString();
        } catch (error) {
            console.error('Volume chart error:', error);
        }

        try {
            advRsiChart = new Chart(rsiCanvas.getContext('2d'), {
                type: 'line',
                data: { labels, datasets: [{ label: 'RSI', data: rsi, borderColor: '#f59e0b', pointRadius: 0, spanGaps: true }] },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { min: 0, max: 100, ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                        x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
                    },
                    plugins: {
                        annotation: window.ChartAnnotation ? {
                            annotations: {
                                rsiOverbought: {
                                    type: 'line',
                                    yMin: 70,
                                    yMax: 70,
                                    borderColor: '#ef4444',
                                    borderWidth: 1
                                },
                                rsiOversold: {
                                    type: 'line',
                                    yMin: 30,
                                    yMax: 30,
                                    borderColor: '#22c55e',
                                    borderWidth: 1
                                }
                            }
                        } : undefined
                    }
                }
            });
        } catch (error) {
            console.error('RSI chart error:', error);
        }
    }

    // ==========================================
    // LWC Helpers for Modal Integration
    // ==========================================
    function formatDateToISO(dateVal) {
        if (!dateVal) return null;
        
        if (typeof dateVal === 'number') {
            const d = new Date(dateVal);
            if (!isNaN(d.getTime())) {
                return d.toISOString().split('T')[0];
            }
        }
        
        let str = String(dateVal).trim().replace(/"/g, '');
        if (!str) return null;
        
        let parts = str.split(/[-/]/);
        if (parts.length === 3) {
            let y = parts[0].trim();
            let m = parts[1].trim();
            let d = parts[2].trim();
            
            if (y.length === 4) {
                // YYYY-MM-DD or YYYY/MM/DD
                return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            } else if (d.length === 4) {
                // DD/MM/YYYY or DD-MM-YYYY
                return `${d}-${m.padStart(2, '0')}-${y.padStart(2, '0')}`;
            } else if (d.length === 2 && y.length === 2) {
                // DD/MM/YY
                d = '20' + d;
                return `${d}-${m.padStart(2, '0')}-${y.padStart(2, '0')}`;
            }
        }
        
        const d = new Date(str);
        if (!isNaN(d.getTime())) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return null;
    }

    function recreateLwcSeries() {
        if (!gaLwcChart) return;
        if (gaLwcMainSeries) {
            try { gaLwcChart.removeSeries(gaLwcMainSeries); } catch(e) {}
        }
        
        if (gaLwcChartType === 'candle') {
            gaLwcMainSeries = gaLwcChart.addCandlestickSeries({
                upColor: '#10b981',
                downColor: '#ef4444',
                borderDownColor: '#ef4444',
                borderUpColor: '#10b981',
                wickDownColor: '#ef4444',
                wickUpColor: '#10b981',
            });
        } else {
            gaLwcMainSeries = gaLwcChart.addLineSeries({
                color: '#fbbf24',
                lineWidth: 2,
            });
        }
    }

    function initializeLwcChart() {
        const container = document.getElementById('gaLwcChartContainer');
        if (!container || gaLwcChart) return;

        if (typeof LightweightCharts === 'undefined') {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #fbbf24; direction:rtl;">
                    ⚠️ تعذر تحميل مكتبة الرسم البياني (TradingView). تأكد من اتصالك بالإنترنت.
                </div>`;
            return;
        }

        try {
            gaLwcChart = LightweightCharts.createChart(container, {
                rightPriceScale: {
                    borderColor: '#334155',
                    scaleMargins: {
                        top: 0.1,
                        bottom: 0.25,
                    },
                },
                layout: {
                    background: { type: LightweightCharts.ColorType.Solid, color: '#0f172a' },
                    textColor: '#cbd5e1',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                },
                grid: {
                    vertLines: { color: 'rgba(51, 65, 85, 0.1)' },
                    horzLines: { color: 'rgba(51, 65, 85, 0.1)' },
                },
                crosshair: {
                    mode: LightweightCharts.CrosshairMode.Normal,
                },
                timeScale: {
                    borderColor: '#334155',
                    rightOffset: 5,
                },
                localization: {
                    locale: 'ar-EG',
                }
            });

            recreateLwcSeries();

            gaLwcVolumeSeries = gaLwcChart.addHistogramSeries({
                color: 'rgba(59, 130, 246, 0.2)',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '', // Overlay series
            });

            gaLwcVolumeSeries.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            });

            // Handle resize
            gaLwcResizeObserver = new ResizeObserver(entries => {
                if (entries.length === 0 || !entries[0]) return;
                const { width, height } = entries[0].contentRect;
                if (gaLwcChart && width > 0 && height > 0) {
                    gaLwcChart.resize(width, height);
                }
            });
            gaLwcResizeObserver.observe(container);

        } catch (e) {
            console.error("LWC init error:", e);
        }
    }

    let gaLwcFiboSeriesArray = [];

    function clearLwcPriceLines() {
        if (gaLwcFiboSeriesArray && gaLwcChart) {
            gaLwcFiboSeriesArray.forEach(s => {
                try { gaLwcChart.removeSeries(s); } catch(e) {}
            });
        }
        gaLwcFiboSeriesArray = [];
    }

    function addTradingDays(dateStr, days) {
        if (!dateStr) return null;
        let date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        let added = 0;
        while (added < days) {
            date.setDate(date.getDate() + 1);
            let day = date.getDay();
            if (day !== 5 && day !== 6) { // skip Friday and Saturday (EGX weekend)
                added++;
            }
        }
        return date.toISOString().split('T')[0];
    }

    function drawLwcPriceLine(price, color, title, startDate, endDate, futureDate, style = 2, labelSide = 'left') {
        if (!gaLwcChart || !Number.isFinite(price) || price <= 0 || !startDate || !endDate || !futureDate) return;
        
        const lineStyle = style === 0 ? LightweightCharts.LineStyle.Solid : LightweightCharts.LineStyle.Dotted;

        try {
            const fiboSeries = gaLwcChart.addLineSeries({
                color: color,
                lineWidth: 1.5,
                lineStyle: lineStyle,
                priceLineVisible: false,
                lastValueVisible: false,
            });

            fiboSeries.setData([
                { time: startDate, value: price },
                { time: endDate, value: price },
                { time: futureDate, value: price }
            ]);

            const markerTime = labelSide === 'left' ? startDate : futureDate;

            fiboSeries.setMarkers([
                {
                    time: markerTime, // Anchor based on parameter
                    position: 'aboveBar', // Place text above line for perfect styling and stability
                    color: color,
                    shape: 'circle',
                    text: `${title} (${price.toFixed(2)})`
                }
            ]);

            gaLwcFiboSeriesArray.push(fiboSeries);
        } catch(e) {
            console.error("Failed to draw LWC custom line:", e);
        }
    }

    function updateLwcChart() {
        const loader = document.getElementById('gaLwcLoader');
        if (loader) loader.style.display = 'flex';

        if (!gaLwcChart || !currentPoints || currentPoints.length === 0) {
            if (loader) loader.style.display = 'none';
            return;
        }

        const selectLookback = document.getElementById('gaLwcLookback');
        const lookback = selectLookback ? Math.max(10, Number(selectLookback.value)) : 60;
        const rangeData = currentPoints.slice(-lookback);

        const chartData = [];
        const volumeData = [];
        const seenDates = new Set();

        currentPoints.forEach(item => {
            const dateStr = formatDateToISO(item.date);
            if (!dateStr || seenDates.has(dateStr)) return;
            seenDates.add(dateStr);

            const closeVal = Number(item.close ?? item.price ?? 0);
            const openVal = Number(item.open ?? closeVal);
            const highVal = Number(item.high ?? Math.max(openVal, closeVal));
            const lowVal = Number(item.low ?? Math.min(openVal, closeVal));
            const volVal = Number(item.volume ?? 0);

            if (gaLwcChartType === 'candle') {
                chartData.push({
                    time: dateStr,
                    open: openVal,
                    high: highVal,
                    low: lowVal,
                    close: closeVal
                });
            } else {
                chartData.push({
                    time: dateStr,
                    value: closeVal
                });
            }

            volumeData.push({
                time: dateStr,
                value: volVal,
                color: closeVal >= openVal ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'
            });
        });

        // Sort ascending
        chartData.sort((a, b) => a.time.localeCompare(b.time));
        volumeData.sort((a, b) => a.time.localeCompare(b.time));

        // Extend time scale with 3 future trading days for line projection via Volume Series
        if (chartData.length > 0) {
            const lastDate = chartData[chartData.length - 1].time;
            let d = lastDate;
            for (let i = 1; i <= 3; i++) {
                d = addTradingDays(d, 1);
                volumeData.push({
                    time: d,
                    value: 0
                });
            }
        }

        try {
            gaLwcChart.priceScale('right').applyOptions({
                autoScale: true,
            });
            gaLwcMainSeries.setData(chartData);
            if (gaLwcVolumeSeries) gaLwcVolumeSeries.setData(volumeData);
            gaLwcChart.timeScale().fitContent(); // Auto scale LWC
        } catch(e) {
            console.error("LWC setData error:", e);
        }

        // Draw Fibo and Technical levels
        clearLwcPriceLines();

        // Calculate Fibonacci levels on lookback range
        const rangeHighs = rangeData.map(item => Number(item.high ?? item.close)).filter(Number.isFinite);
        const rangeLows = rangeData.map(item => Number(item.low ?? item.close)).filter(Number.isFinite);
        const maxHigh = rangeHighs.length > 0 ? Math.max(...rangeHighs) : 0;
        const minLow = rangeLows.length > 0 ? Math.min(...rangeLows) : 0;
        const diff = maxHigh - minLow;

        const fibo = {
            f100: maxHigh,
            f61: minLow + diff * 0.618,
            f50: minLow + diff * 0.5,
            f38: minLow + diff * 0.382,
            f0: minLow
        };

        // Calculate Support & Resistance
        const closePrices = rangeData.map(item => Number(item.close ?? item.price ?? 0)).filter(Number.isFinite);
        let s1 = 0, s2 = 0, r1 = 0, r2 = 0;
        if (closePrices.length >= 10) {
            const last10 = closePrices.slice(-10);
            const minVal = Math.min(...last10);
            const maxVal = Math.max(...last10);
            const current = closePrices[closePrices.length - 1];
            const rangeSR = maxVal - minVal;
            
            s1 = current - rangeSR * 0.382;
            s2 = current - rangeSR * 0.5;
            r1 = current + rangeSR * 0.382;
            r2 = current + rangeSR * 0.5;
        } else if (closePrices.length > 0) {
            const current = closePrices[closePrices.length - 1];
            s1 = current * 0.95;
            s2 = current * 0.90;
            r1 = current * 1.05;
            r2 = current * 1.10;
        }

        // Update modal mini S&R table
        const elRes2 = document.getElementById('gaSrRes2');
        const elRes1 = document.getElementById('gaSrRes1');
        const elSup1 = document.getElementById('gaSrSup1');
        const elSup2 = document.getElementById('gaSrSup2');
        
        if (elRes2) elRes2.textContent = r2 > 0 ? `م2: ${r2.toFixed(2)}` : 'م2: -';
        if (elRes1) elRes1.textContent = r1 > 0 ? `م1: ${r1.toFixed(2)}` : 'م1: -';
        if (elSup1) elSup1.textContent = s1 > 0 ? `د1: ${s1.toFixed(2)}` : 'د1: -';
        if (elSup2) elSup2.textContent = s2 > 0 ? `د2: ${s2.toFixed(2)}` : 'د2: -';

        // Update Fibonacci levels table
        document.getElementById('gaValFibo100').textContent = fibo.f100 > 0 ? fibo.f100.toFixed(2) : '-';
        document.getElementById('gaValFibo61').textContent = fibo.f61 > 0 ? fibo.f61.toFixed(2) : '-';
        document.getElementById('gaValFibo50').textContent = fibo.f50 > 0 ? fibo.f50.toFixed(2) : '-';
        document.getElementById('gaValFibo38').textContent = fibo.f38 > 0 ? fibo.f38.toFixed(2) : '-';
        document.getElementById('gaValFibo0').textContent = fibo.f0 > 0 ? fibo.f0.toFixed(2) : '-';

        // Calculate dates for projected lines
        const startDate = rangeData.length > 0 ? formatDateToISO(rangeData[0].date) : null;
        const endDate = rangeData.length > 0 ? formatDateToISO(rangeData[rangeData.length - 1].date) : null;
        const futureDate = endDate ? addTradingDays(endDate, 3) : null;

        // Draw Fibo lines
        if (gaLwcChartType === 'candle' && startDate && endDate && futureDate) {
            drawLwcPriceLine(fibo.f100, 'rgba(156,163,175,0.4)', 'فيبو 100%', startDate, endDate, futureDate);
            drawLwcPriceLine(fibo.f61, 'rgba(251,191,36,0.5)', 'فيبو 61.8%', startDate, endDate, futureDate);
            drawLwcPriceLine(fibo.f50, 'rgba(59,130,246,0.4)', 'فيبو 50.0%', startDate, endDate, futureDate);
            drawLwcPriceLine(fibo.f38, 'rgba(16,185,129,0.4)', 'فيبو 38.2%', startDate, endDate, futureDate);
            drawLwcPriceLine(fibo.f0, 'rgba(156,163,175,0.4)', 'فيبو 0%', startDate, endDate, futureDate);
        }

        // Draw technical decision lines
        const processed = getProcessedData();
        const stock = processed.find(s => (s.symbol || '').toUpperCase() === (currentSymbol || '').toUpperCase());
        
        let entryPrice = 0;
        let stopLoss = 0;
        let target1 = 0;
        let target2 = 0;

        if (stock) {
            entryPrice = Number(stock.entryPrice || 0);
            stopLoss = Number(stock.stopLoss || 0);
            target1 = Number(stock.target1 || 0);
            target2 = Number(stock.target2 || 0);
        }

        if (entryPrice <= 0 && currentPoints.length > 0) {
            const rangeClose = Number(currentPoints[currentPoints.length - 1].close);
            entryPrice = fibo.f61 > 0 ? fibo.f61 * 1.005 : rangeClose;
            stopLoss = fibo.f0 > 0 ? fibo.f0 * 0.985 : rangeClose * 0.90;
            target1 = fibo.f100 > 0 ? fibo.f100 : rangeClose * 1.10;
            target2 = target1 > 0 ? target1 * 1.05 : rangeClose * 1.15;
        }

        // Draw decision lines (solid style: 0)
        if (startDate && endDate && futureDate) {
            drawLwcPriceLine(entryPrice, '#fbbf24', 'الدخول الأمثل', startDate, endDate, futureDate, 0, 'right');
            drawLwcPriceLine(stopLoss, '#ef4444', 'وقف الخسارة', startDate, endDate, futureDate, 0, 'right');
            drawLwcPriceLine(target1, '#10b981', 'المستهدف الأول', startDate, endDate, futureDate, 0, 'right');
            drawLwcPriceLine(target2, '#059669', 'المستهدف الثاني', startDate, endDate, futureDate, 0, 'right');
        }

        // Update target levels table
        document.getElementById('gaValTarget2').textContent = target2 > 0 ? `${target2.toFixed(2)} ج` : '-';
        document.getElementById('gaValTarget1').textContent = target1 > 0 ? `${target1.toFixed(2)} ج` : '-';
        document.getElementById('gaValEntry').textContent = entryPrice > 0 ? `${entryPrice.toFixed(2)} ج` : '-';
        document.getElementById('gaValStop').textContent = stopLoss > 0 ? `${stopLoss.toFixed(2)} ج` : '-';

        if (loader) loader.style.display = 'none';
    }

    window.openStockAnalysis = function (symbol) {
        ensureModal();
        applyAnalysisScale();

        const processed = getProcessedData();
        const stock = processed.find(s => (s.symbol || '').toUpperCase() === (symbol || '').toUpperCase());
        const company = findCompanyBySymbol(symbol);
        let points = getHistoryPoints(company);

        if (!stock) {
            alert('لا توجد بيانات تحليل لهذا السهم');
            return;
        }
        if (!points.length) points = buildFallbackHistory(stock);

        currentSymbol = stock.symbol;
        currentPoints = points;

        const prices = points.map(p => p.close);
        const volumes = points.map(p => p.volume || 0);
        const labels = points.map(p => p.date);
        const signals = buildTradingSignals(stock, prices, volumes);
        currentSignals = signals;

        // Calculate Fibonacci levels on lookback range (default 60 sessions)
        const rangeData = points.slice(-60); 
        const rangeHighs = rangeData.map(item => Number(item.high ?? item.close)).filter(Number.isFinite);
        const rangeLows = rangeData.map(item => Number(item.low ?? item.close)).filter(Number.isFinite);
        const maxHigh = rangeHighs.length > 0 ? Math.max(...rangeHighs) : 0;
        const minLow = rangeLows.length > 0 ? Math.min(...rangeLows) : 0;
        const diff = maxHigh - minLow;

        const fibo = {
            f100: maxHigh,
            f61: minLow + diff * 0.618,
            f50: minLow + diff * 0.5,
            f38: minLow + diff * 0.382,
            f0: minLow
        };

        let entryPrice = Number(stock.entryPrice || 0);
        let stopLoss = Number(stock.stopLoss || 0);
        let target1 = Number(stock.target1 || 0);
        let target2 = Number(stock.target2 || 0);

        if (entryPrice <= 0 && points.length > 0) {
            const rangeClose = Number(points[points.length - 1].close);
            entryPrice = fibo.f61 > 0 ? fibo.f61 * 1.005 : rangeClose;
            stopLoss = fibo.f0 > 0 ? fibo.f0 * 0.985 : rangeClose * 0.90;
            target1 = fibo.f100 > 0 ? fibo.f100 : rangeClose * 1.10;
            target2 = target1 > 0 ? target1 * 1.05 : rangeClose * 1.15;
        }

        // Update Fibonacci levels table
        document.getElementById('gaValFibo100').textContent = fibo.f100 > 0 ? fibo.f100.toFixed(2) : '-';
        document.getElementById('gaValFibo61').textContent = fibo.f61 > 0 ? fibo.f61.toFixed(2) : '-';
        document.getElementById('gaValFibo50').textContent = fibo.f50 > 0 ? fibo.f50.toFixed(2) : '-';
        document.getElementById('gaValFibo38').textContent = fibo.f38 > 0 ? fibo.f38.toFixed(2) : '-';
        document.getElementById('gaValFibo0').textContent = fibo.f0 > 0 ? fibo.f0.toFixed(2) : '-';

        // Update target levels table
        document.getElementById('gaValTarget2').textContent = target2 > 0 ? `${target2.toFixed(2)} ج` : '-';
        document.getElementById('gaValTarget1').textContent = target1 > 0 ? `${target1.toFixed(2)} ج` : '-';
        document.getElementById('gaValEntry').textContent = entryPrice > 0 ? `${entryPrice.toFixed(2)} ج` : '-';
        document.getElementById('gaValStop').textContent = stopLoss > 0 ? `${stopLoss.toFixed(2)} ج` : '-';

        document.getElementById('gaTitle').textContent = `تحليل السهم: ${stock.symbol}`;
        document.getElementById('gaSymbol').textContent = stock.symbol;
        document.getElementById('gaName').textContent = stock.name || stock.symbol;
        document.getElementById('gaPrice').textContent = Number(stock.currentPrice || 0).toFixed(2);
        document.getElementById('gaChange').textContent = `${stock.changeValue >= 0 ? '+' : ''}${stock.change || 0}%`;
        document.getElementById('gaRsi').textContent = `${stock.rsi ?? '-'}`;
        const recNode = document.getElementById('gaRec');
        recNode.textContent = signals.recommendation;
        recNode.style.color = signals.color;

        const support = Number.isFinite(signals.levels.support) ? signals.levels.support.toFixed(2) : '-';
        const resistance = Number.isFinite(signals.levels.resistance) ? signals.levels.resistance.toFixed(2) : '-';
        const patterns = (stock.patterns || []).join(' - ') || 'لا يوجد';

        document.getElementById('gaReasonText').innerHTML = `
            <div style="color:#10b981;font-weight:700;margin-bottom:8px;">🔍 لماذا هذا السهم واعد؟</div>
            <ul style="margin:0;padding-right:18px;">
                <li>الأنماط: ${patterns}</li>
                <li>أقرب دعم: <b>${support}</b></li>
                <li>أقرب مقاومة: <b>${resistance}</b></li>
                <li>درجة الإشارة: <b>${signals.score}</b></li>
            </ul>
        `;

        const indicatorsHtml = `
            <div class="ga-indicator-item"><div class="ga-indicator-label">✨ السعر الحالي</div><div class="ga-indicator-value" style="color:#fbbf24;">${Number(stock.currentPrice || 0).toFixed(2)}</div></div>
            <div class="ga-indicator-item"><div class="ga-indicator-label">📊 RSI (14)</div><div class="ga-indicator-value" style="color:${Number(stock.rsi) < 30 ? '#10b981' : (Number(stock.rsi) > 70 ? '#ef4444' : '#fbbf24')};">${stock.rsi ?? 'N/A'}</div></div>
            <div class="ga-indicator-item"><div class="ga-indicator-label">📈 SMA 20</div><div class="ga-indicator-value">${signals.sma20[signals.sma20.length - 1] ?? 'N/A'}</div></div>
            <div class="ga-indicator-item"><div class="ga-indicator-label">📉 SMA 50</div><div class="ga-indicator-value">${signals.sma50[signals.sma50.length - 1] ?? 'N/A'}</div></div>
            <div class="ga-indicator-item"><div class="ga-indicator-label">🔢 أيام البيانات</div><div class="ga-indicator-value">${points.length} يوم</div></div>
            <div class="ga-indicator-item"><div class="ga-indicator-label">📌 التوصية</div><div class="ga-indicator-value" style="color:${signals.color};">${signals.recommendation}</div></div>
        `;
        document.getElementById('gaIndicators').innerHTML = indicatorsHtml;

        const srRows = [
            { title: '🔰 دعم 1', cls: 'ga-support', value: stock.support?.[0] },
            { title: '🔹 دعم 2', cls: 'ga-support', value: stock.support?.[1] },
            { title: '🔷 دعم 3', cls: 'ga-support', value: stock.support?.[2] },
            { title: '⚡ مقاومة 1', cls: 'ga-resistance', value: stock.resistance?.[0] },
            { title: '⚠️ مقاومة 2', cls: 'ga-resistance', value: stock.resistance?.[1] },
            { title: '🎯 مقاومة 3', cls: 'ga-resistance', value: stock.resistance?.[2] }
        ];
        document.getElementById('gaSR').innerHTML = srRows.map(row => `
            <div class="ga-sr-item">
                <div style="color:#94a3b8;margin-bottom:6px;">${row.title}</div>
                <div class="${row.cls}">${Number.isFinite(Number(row.value)) ? Number(row.value).toFixed(2) : 'N/A'}</div>
            </div>
        `).join('');

        const signalRows = (signals.notes.length ? signals.notes : ['لا توجد إشارات واضحة في الوقت الحالي'])
            .map(note => {
                const positive = /صاعد|شراء|دعم|ارتداد|إيجابي/.test(note);
                return `<div class="ga-signal" style="border-right-color:${positive ? '#10b981' : '#ef4444'};">${positive ? '🟢' : '🔴'} ${note}</div>`;
            }).join('');
        document.getElementById('gaSignals').innerHTML = signalRows;

        const actionHtml = `
            <div><strong style="color:#fbbf24;font-size:1.1em;">${signals.recommendation}</strong></div>
            <div>الدخول المقترح: ${entryPrice > 0 ? entryPrice.toFixed(2) : '-'} ج.م</div>
            <div>الهدف الأول: ${target1 > 0 ? target1.toFixed(2) : '-'} ج.م</div>
            <div>الهدف الثاني: ${target2 > 0 ? target2.toFixed(2) : '-'} ج.م</div>
            <div>وقف الخسارة: ${stopLoss > 0 ? stopLoss.toFixed(2) : '-'} ج.م</div>
        `;
        document.getElementById('gaAction').innerHTML = actionHtml;

        document.getElementById('gaCandleGuide').innerHTML = `
            <div>🔨 <strong>Hammer:</strong> جسم صغير وذيل سفلي طويل، وتزداد القوة بعد هبوط.</div>
            <div>🧭 <strong>Inverted Hammer:</strong> انعكاس محتمل ويحتاج تأكيد.</div>
            <div>📈 <strong>Bullish Engulfing:</strong> ابتلاع صاعد يدل على تحسن الزخم.</div>
            <div>🎯 <strong>Head & Shoulders:</strong> غالبًا انعكاس هابط بعد صعود.</div>
            <div>🔄 <strong>Inverse H&S:</strong> انعكاس صاعد محتمل بعد هبوط.</div>
            <div>⚖️ <strong>Doji:</strong> حيرة في السوق وتحتاج شمعة تأكيد.</div>
        `;

        const candlePatterns = analyzeCandlestickPatterns(points);
        document.getElementById('gaCandleSignals').innerHTML = `
            <div class="ga-chip-list">
                ${candlePatterns.tags.map(tag => `<span class="ga-chip">${tag}</span>`).join('')}
            </div>
            <ul style="margin:0;padding-right:18px;line-height:1.9;">
                ${candlePatterns.notes.map(note => `<li>${note}</li>`).join('')}
            </ul>
        `;

        document.getElementById('globalAnalysisModal').classList.add('active');

        clearNewsAutoRefresh();
        fetchAndRenderStockNews(stock, true);
        newsRefreshTimer = setInterval(() => {
            if (currentSymbol === stock.symbol) fetchAndRenderStockNews(stock, false);
        }, 300000);

        if (labels.length > 1) renderMiniChart(labels, prices, signals.levels);
    };

    window.closeStockAnalysis = function () {
        const modal = document.getElementById('globalAnalysisModal');
        if (modal) modal.classList.remove('active');
        closeAdvancedStockAnalysis();
        clearNewsAutoRefresh();
    };

    window.openAdvancedStockAnalysis = async function () {
        const fullscreen = document.getElementById('globalAdvancedModal');
        if (!fullscreen) return;
        
        fullscreen.classList.add('active');

        // Populate stock selector dropdown/search
        const modalSearchInput = document.getElementById('gaLwcStockSearch');
        if (modalSearchInput && currentSymbol) {
            const comp = findCompanyBySymbol(currentSymbol);
            if (comp) {
                modalSearchInput.value = `${currentSymbol} - ${comp.longName || comp.shortName || comp.name}`;
            } else {
                modalSearchInput.value = currentSymbol;
            }
        }

        // Dynamic load LWC if needed
        if (typeof LightweightCharts === 'undefined') {
            await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = "https://cdn.jsdelivr.net/npm/lightweight-charts@4.1.1/dist/lightweight-charts.standalone.production.js";
                script.onload = () => resolve();
                script.onerror = () => resolve();
                document.head.appendChild(script);
            });
        }

        initializeLwcChart();
        updateLwcChart();

        // Adjust LWC chart size
        setTimeout(() => {
            if (gaLwcChart) {
                const container = document.getElementById('gaLwcChartContainer');
                if (container) {
                    const rect = container.getBoundingClientRect();
                    gaLwcChart.resize(rect.width, rect.height);
                }
            }
        }, 100);
    };

    window.closeAdvancedStockAnalysis = function () {
        const fullscreen = document.getElementById('globalAdvancedModal');
        if (fullscreen) fullscreen.classList.remove('active');
    };

    window.refreshCurrentStockNews = function (forceLoading = true) {
        if (!currentSymbol) return;
        const processed = getProcessedData();
        const stock = processed.find(s => (s.symbol || '').toUpperCase() === (currentSymbol || '').toUpperCase());
        if (!stock) return;
        fetchAndRenderStockNews(stock, forceLoading);
    };

    window.goToProfessionalChart = function (symbol) {
        const isPage = window.location.pathname.includes('/pages/') || window.location.pathname.includes('\\pages\\');
        const path = isPage ? 'stock-chart.html' : 'pages/stock-chart.html';
        window.location.href = `${path}?symbol=${encodeURIComponent(symbol)}`;
    };

    window.normalizeUnifiedRecommendation = normalizeRecommendationToken;
    window.getUnifiedRecommendationMeta = getRecommendationMeta;
    window.getUnifiedPortfolioAdvice = buildUnifiedPortfolioAdvice;
    window.calcATRSeries = calcATRSeries;
    window.calcVWAPSeries = calcVWAPSeries;
    window.generateSmartRebalancingPlan = generateSmartRebalancingPlan;





    window.addEventListener('resize', function () {
        if (miniChart) miniChart.resize();
        if (advPriceChart) advPriceChart.resize();
        else {
            const full = document.getElementById('globalAdvancedModal');
            const isOpen = full && full.classList.contains('active');
            if (isOpen && currentPoints && currentPoints.length) {
                const priceCanvas = document.getElementById('gaPriceChart');
                if (priceCanvas) {
                    const sma20 = currentSignals?.sma20 || calcSMA(currentPoints.map(p => p.close), 20);
                    const sma50 = currentSignals?.sma50 || calcSMA(currentPoints.map(p => p.close), 50);
                    drawCustomCandles(priceCanvas, currentPoints, sma20, sma50, currentSignals?.levels);
                }
            }
        }
        if (advVolumeChart) advVolumeChart.resize();
        if (advRsiChart) advRsiChart.resize();
    });

    // ===== محرك التحليل الذكي (AnalysisEngine) =====
    // نظام التقييم التراكمي: السيولة 40% + الزخم 30% + الاتجاه 30%
    window.AnalysisEngine = {

        /**
         * isNearSupport — يتحقق أن السعر الحالي قريب من مستوى الدعم بنسبة سماحية 1.5% فقط
         * لمنع الإشارات الخاطئة بعيداً عن الدعم.
         */
        isNearSupport: function (price, support) {
            if (!Number.isFinite(price) || !Number.isFinite(support) || support <= 0) return false;
            const tolerance = 0.015; // 1.5%
            return price >= support && price <= support * (1 + tolerance);
        },

        /**
         * analyzeStock — يحسب درجة كلية للسهم من 100 بناءً على:
         * - السيولة (40%): مقارنة حجم التداول الحالي بمتوسط 20 يوم
         * - الزخم  (30%): مؤشر RSI (تشبع بيعي تحت 30 أقوى إشارة)
         * - الاتجاه(30%): ثبات السعر فوق الدعم + SMA20/50
         *
         * @param {object} company    — كائن الشركة من stocksData
         * @param {object} [processed] — صف processedData للسهم نفسه (اختياري)
         * @returns {{ score, liquidityScore, momentumScore, directionScore, rsi, volRatio, levels, nearSupport } | null}
         */
        analyzeStock: function (company, processed) {
            const points = getHistoryPoints(company);
            if (!points || points.length < 2) return null;

            const prices  = points.map(p => p.close);
            const volumes = points.map(p => p.volume || 0);
            const latest  = prices[prices.length - 1];

            // --- السيولة (40%) ---
            const sma20Vol  = calcSMA(volumes, 20);
            const avgVol20  = sma20Vol[sma20Vol.length - 1] || 0;
            const latestVol = volumes[volumes.length - 1] || 0;
            const volRatio  = avgVol20 > 0 ? latestVol / avgVol20 : 1;
            const liquidityScore = Math.min(40, Math.max(0,
                volRatio >= 2.5 ? 40 :
                volRatio >= 2.0 ? 36 :
                volRatio >= 1.5 ? 30 :
                volRatio >= 1.2 ? 22 :
                volRatio >= 0.8 ? 14 :
                volRatio >= 0.5 ? 7  : 0
            ));

            // --- الزخم (30%) — RSI تحت 30 = تشبع بيعي = فرصة ارتداد ---
            const rsiSeries = calcRSISeries(prices);
            const rsi = rsiSeries[rsiSeries.length - 1] ?? 50;
            const momentumScore = Math.min(30, Math.max(0,
                rsi <= 20 ? 30 :
                rsi <= 25 ? 27 :
                rsi <= 30 ? 24 :
                rsi <= 35 ? 18 :
                rsi <= 45 ? 12 :
                rsi <= 55 ? 8  :
                rsi <= 65 ? 4  : 0
            ));

            // --- الاتجاه (30%) — السعر فوق الدعم + SMA ---
            const levels      = calcNearestLevels(prices, processed || {});
            const nearSupport = this.isNearSupport(latest, levels.support);
            const sma20s      = calcSMA(prices, 20);
            const sma50s      = calcSMA(prices, 50);
            const lastSma20   = sma20s[sma20s.length - 1];
            const lastSma50   = sma50s[sma50s.length - 1];

            let directionScore = 0;
            if (nearSupport) directionScore += 15;
            if (Number.isFinite(lastSma20) && latest > lastSma20) directionScore += 8;
            if (Number.isFinite(lastSma50) && lastSma20 > lastSma50) directionScore += 7;
            directionScore = Math.min(30, Math.max(0, directionScore));

            const score = Math.round(liquidityScore + momentumScore + directionScore);

            return { score, liquidityScore, momentumScore, directionScore, rsi, volRatio, levels, nearSupport };
        }
    };
})();
