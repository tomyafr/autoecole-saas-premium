const https = require('https');
const fs = require('fs');

https.get('https://i.imgur.com/ZvGdbPc.png', {
    headers: { 'User-Agent': 'curl/7.68.0' }
}, (res) => {
    if (res.statusCode === 200) {
        const file = fs.createWriteStream('public/logo.png');
        res.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Logo downloaded successfully!');
        });
    } else {
        console.error('Failed to download image', res.statusCode);
    }
}).on('error', (err) => {
    console.error('Error:', err.message);
});
