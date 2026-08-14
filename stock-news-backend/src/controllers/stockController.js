// src/controllers/stockController.js
const stocksList = require('../data/stocksList');
const scraper = require('../services/scraper');
const analyzer = require('../services/analyzer');

class StockController {
    async getAllStocks(req, res) {
        try {
            const stocksWithNews = [];
            
            for (const stock of stocksList) {
                try {
                    const news = await scraper.fetchNews(stock.url);
                    const analyzedNews = analyzer.analyzeNewsList(news);
                    
                    stocksWithNews.push({
                        ...stock,
                        news: analyzedNews
                    });
                } catch (error) {
                    stocksWithNews.push({
                        ...stock,
                        news: scraper.getFallbackNews().map(item => ({
                            ...item,
                            analysis: analyzer.analyzeNews(item.title)
                        })),
                        error: error.message
                    });
                }
            }

            res.json({
                success: true,
                data: stocksWithNews,
                total: stocksWithNews.length,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'حدث خطأ أثناء جلب البيانات',
                error: error.message
            });
        }
    }

    async getStockBySymbol(req, res) {
        const { symbol } = req.params;
        
        try {
            const stock = stocksList.find(s => s.symbol === symbol);
            
            if (!stock) {
                return res.status(404).json({
                    success: false,
                    message: `السهم بالرمز ${symbol} غير موجود`
                });
            }

            const news = await scraper.fetchNews(stock.url);
            const analyzedNews = analyzer.analyzeNewsList(news);

            res.json({
                success: true,
                data: {
                    ...stock,
                    news: analyzedNews
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: `حدث خطأ أثناء جلب أخبار ${symbol}`,
                error: error.message
            });
        }
    }

    searchStocks(req, res) {
        const { query } = req.query;
        
        if (!query) {
            return res.json({
                success: true,
                data: stocksList,
                total: stocksList.length
            });
        }

        const filtered = stocksList.filter(stock => 
            stock.name.toLowerCase().includes(query.toLowerCase()) ||
            stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
            stock.isin.toLowerCase().includes(query.toLowerCase())
        );

        res.json({
            success: true,
            data: filtered,
            total: filtered.length,
            query: query
        });
    }
}

module.exports = new StockController();