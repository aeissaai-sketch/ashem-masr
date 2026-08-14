// src/services/analyzer.js
class AnalyzerService {
    constructor() {
        this.positiveWords = [
            'ربح', 'أرباح', 'زيادة', 'نمو', 'توزيع', 'توسع', 
            'استحواذ', 'تفوق', 'ارتفاع', 'إيجابي', 'ممتاز', 
            'تطوير', 'نجاح', 'تحسن', 'مكاسب', 'توصية بشراء',
            'قوي', 'مستقر', 'تفاؤل', 'ازدهار'
        ];
        
        this.negativeWords = [
            'خسارة', 'تراجع', 'انخفاض', 'توقف', 'إلغاء', 
            'تأجيل', 'غرامة', 'دعوى', 'تحقيق', 'عجز', 
            'نقص', 'سلبي', 'انكماش', 'توصية ببيع',
            'ضعف', 'تراجع', 'أزمة', 'انهيار'
        ];
    }

    analyzeNews(title, content = '') {
        const text = (title + ' ' + content).toLowerCase();
        let positiveCount = 0;
        let negativeCount = 0;

        this.positiveWords.forEach(word => {
            if (text.includes(word)) positiveCount++;
        });

        this.negativeWords.forEach(word => {
            if (text.includes(word)) negativeCount++;
        });

        let impact = 'محايد';
        let sentiment = 'neutral';
        let summary = '';

        if (positiveCount > negativeCount) {
            impact = 'إيجابي';
            sentiment = 'positive';
            summary = 'الخبر يحمل دلالات إيجابية قد تنعكس إيجاباً على أداء السهم.';
        } else if (negativeCount > positiveCount) {
            impact = 'سلبي';
            sentiment = 'negative';
            summary = 'الخبر يحمل دلالات سلبية قد تؤثر سلباً على السهم.';
        } else {
            impact = 'محايد';
            sentiment = 'neutral';
            summary = 'الخبر لا يحمل تأثيراً واضحاً أو هو إعلامي بحت.';
        }

        // تفاصيل إضافية حسب نوع الخبر
        if (text.includes('أرباح') || text.includes('ربح')) {
            summary += ' يتعلق بالأرباح والإيرادات المالية.';
        } else if (text.includes('استحواذ') || text.includes('توسع')) {
            summary += ' يتعلق بعمليات نمو وتوسع استثماري.';
        } else if (text.includes('خسارة') || text.includes('تراجع')) {
            summary += ' يتعلق بخسائر أو تراجع في الأداء المالي.';
        } else if (text.includes('تعيين') || text.includes('رئيس') || text.includes('مجلس')) {
            summary += ' يتعلق بتغييرات في هيكل الإدارة.';
        } else if (text.includes('توزيع')) {
            summary += ' يتعلق بتوزيعات أرباح على المساهمين.';
        } else if (text.includes('صفقة') || text.includes('عقد')) {
            summary += ' يتعلق بإبرام صفقات أو عقود جديدة.';
        }

        return { impact, sentiment, summary };
    }

    analyzeNewsList(newsItems) {
        return newsItems.map(item => ({
            ...item,
            analysis: this.analyzeNews(item.title)
        }));
    }
}

module.exports = new AnalyzerService();