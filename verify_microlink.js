import https from 'https';

https.get('https://api.microlink.io/?url=https://www.avdwb.com/&screenshot=true&meta=false&embed=screenshot.url', (res) => {
  console.log(res.statusCode);
  console.log(res.headers.location);
});
