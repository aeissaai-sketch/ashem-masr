// src/services/scraper.js
const axios = require('axios');
const cheerio = require('cheerio');

class ScraperService {
    constructor() {
        this.timeout = 10000;
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    }

    async fetchNews(url) {
        try {
            const response = await axios.get(url, {
                timeout: this.timeout,
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml',
                    'Accept-Language': 'ar,en;q=0.9',
                }
            });

            return this.parseNews(response.data);
        } catch (error) {
            console.error(`خطأ في جلب البيانات:`, error.message);
            return this.getFallbackNews();
        }
    }

    parseNews(html) {
        const $ = cheerio.load(html);
        const newsItems = [];
        const seenTitles = new Set();

        // محاولة استخراج الأخبار من الجداول والقوائم
        const selectors = ['table tr', '.news-item', '.list-item', '.item', 'tr'];
        
        selectors.forEach(selector => {
            $(selector).each((index, element) => {
                const text = $(element).text().trim();
                
                if (text.length > 30 && text.length < 600) {
                    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/);
                    const date = dateMatch ? dateMatch[0] : new Date().toLocaleDateString('ar-EG');
                    
                    const cleanText = text
                        .replace(/\s+/g, ' ')
                        .replace(/[\n\r\t]/g, ' ')
                        .trim();

                    if (!seenTitles.has(cleanText) && cleanText.length > 10) {
                        seenTitles.add(cleanText);
                        newsItems.push({
                            date: date,
                            title: cleanText.substring(0, 300)
                        });
                    }
                }
            });
        });

        if (newsItems.length === 0) {
            return this.getFallbackNews();
        }

        return newsItems.slice(0, 10);
    }

    getFallbackNews() {
        return [
            { 
                date: new Date().toLocaleDateString('ar-EG'), 
                title: '📊 لا توجد أخبار جديدة متاحة حالياً' 
            },
            { 
                date: new Date().toLocaleDateString('ar-EG'), 
                title: '💡 يمكنك زيارة موقع البورصة مباشرة للحصول على آخر التحديثات' 
            }
        ];
    }
}

module.exports = new ScraperService();