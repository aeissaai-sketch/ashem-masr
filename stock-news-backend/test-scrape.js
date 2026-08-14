const axios = require('axios');
const fs = require('fs');

async function testPrices() {
    try {
        console.log('Fetching main prices page...');
        const response = await axios.get('https://www.egx.com.eg/ar/prices.aspx', {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'ar,en-US;q=0.7,en;q=0.3'
            }
        });
        
        console.log('Main Prices Response Status:', response.status);
        console.log('Main Prices Response Headers:', response.headers);
        console.log('Main Prices Response Length:', response.data.length);
        fs.writeFileSync('prices_html.html', response.data);
        console.log('HTML saved to prices_html.html');
        
    } catch (e) {
        console.error('Error fetching main prices:', e.message);
        if (e.response) {
            console.error('Response status:', e.response.status);
            console.error('Response headers:', e.response.headers);
        }
    }
}

testPrices();
