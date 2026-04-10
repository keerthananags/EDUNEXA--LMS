const http = require('http');

const postData = JSON.stringify({
  name: 'Admin User',
  email: 'admin@edunexa.com',
  password: 'admin123',
  role: 'admin'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
    const response = JSON.parse(data);
    if (response.role === 'admin') {
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@edunexa.com');
      console.log('Password: admin123');
    } else {
      console.log('User created but not admin role');
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(postData);
req.end();
