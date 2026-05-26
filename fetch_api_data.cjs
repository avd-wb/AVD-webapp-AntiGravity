const https = require('https');
const crypto = require('crypto');
const agent = new https.Agent({
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
});

https.get('https://ard.wb.gov.in/api/v1/appointments', { agent }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data.substring(0, 500)); // print first 500 characters
  });
});
