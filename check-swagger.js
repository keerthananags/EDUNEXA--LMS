const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api-docs/swagger.json',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const spec = JSON.parse(body);
      console.log('Swagger Spec Loaded!');
      console.log('Paths:', Object.keys(spec.paths || {}));
      console.log('Tags:', (spec.tags || []).map(t => t.name));
    } catch (e) {
      console.log('Error parsing spec:', e.message);
      console.log('Raw:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error('Request failed:', e.message));
req.end();
