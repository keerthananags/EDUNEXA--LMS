const http = require('http');

const testRegister = () => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com',
      password: 'password123',
      role: 'student'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log('Register Test - Status:', res.statusCode);
        console.log('Response:', body);
        resolve({ status: res.statusCode, body: JSON.parse(body) });
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

const testLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log('\nLogin Test - Status:', res.statusCode);
        console.log('Response:', body);
        resolve({ status: res.statusCode, body: JSON.parse(body) });
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

async function runTests() {
  console.log('=== Testing EduNexa LMS API ===\n');
  
  try {
    // Test 1: Register
    console.log('Test 1: Register new user...');
    const registerResult = await testRegister();
    
    if (registerResult.status === 201) {
      console.log('✅ Register successful!');
      
      // Test 2: Login with the registered user
      console.log('\nTest 2: Login with registered user...');
      const loginResult = await testLogin(registerResult.body.email, 'password123');
      
      if (loginResult.status === 200) {
        console.log('✅ Login successful!');
        console.log('\n=== All tests passed! ===');
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log('❌ Register failed');
    }
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

runTests();
