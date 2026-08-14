
const axios = require('axios');
const cheerio = require('cheerio');

const testUrl = 'https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60121C018';

async function test() {
    try {
        console.log('Fetching:', testUrl);
        const response = await axios.get(testUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'ar,en;q=0.9',
            }
        });

        console.log('Status:', response.status);
        console.log('Content length:', response.data.length);
        console.log('\nFirst 1000 chars:');
        console.log(response.data.substring(0, 1000));

        const $ = cheerio.load(response.data);
        console.log('\nLooking for news...');
        const allLinks = $('a');
        console.log('Total links:', allLinks.length);
        allLinks.each((i, el) => {
            const text = $(el).text().trim();
            if (text.length > 10 && !text.includes('الصفحة') && !text.includes('التالي')) {
                console.log(i, ':', text);
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
        }
    }
}

test();
