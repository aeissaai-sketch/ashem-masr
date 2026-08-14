// server.js
const express = require('express');
const cors = require('cors');
const stockRoutes = require('./src/routes/stocks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/stocks', stockRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/', (req, res) => {
    res.json({
        name: 'Stock News API - البورصة المصرية',
        version: '1.0.0',
        endpoints: {
            'GET /api/stocks': 'الحصول على جميع الأسهم مع أخبارها',
            'GET /api/stocks/:symbol': 'الحصول على سهم واحد',
            'GET /api/stocks/search?query=': 'البحث عن أسهم',
            'GET /health': 'فحص صحة الخادم'
        }
    });
});

app.listen(PORT, () => {
    console.log('🚀 Server is starting...');
    console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
    console.log(`📊 API الأسهم: http://localhost:${PORT}/api/stocks`);
    console.log(`❤️  فحص الصحة: http://localhost:${PORT}/health`);
});