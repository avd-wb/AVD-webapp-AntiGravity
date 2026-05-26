const https = require('https');
const crypto = require('crypto');
const agent = new https.Agent({
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
});

https.get('https://ard.wb.gov.in/appointment-transfers', { agent }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const match = data.match(/src=\"(\/static\/js\/main\.[^\"]+\.js)\"/);
    if (match) {
      https.get('https://ard.wb.gov.in' + match[1], { agent }, (res2) => {
        let jsData = '';
        res2.on('data', (chunk) => jsData += chunk);
        res2.on('end', () => {
          const apiMatches = jsData.match(/https?:\/\/[^\"]+/g);
          console.log([...new Set(apiMatches)].filter(s => s.includes('api') || s.includes('ard')));
        });
      });
    } else {
       console.log('Main JS not found');
    }
  });
});
