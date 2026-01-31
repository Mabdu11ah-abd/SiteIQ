// Test script for authentication endpoints
// Run with: node backend/tests/auth.manual.test.js

const BASE_URL = 'http://localhost:4500/api/auth';

// Test user data
const testUser = {
  name: 'Test User',
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'TestPassword123!'
};

let authToken = '';

// Helper function for API calls
async function makeRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Request failed:', error);
    return { error: error.message };
  }
}

// Test 1: Register new user
async function testRegister() {
  console.log('\n🧪 Test 1: Register New User');
  console.log('POST /api/auth/register');
  console.log('Body:', JSON.stringify(testUser, null, 2));

  const result = await makeRequest('/register', 'POST', testUser);
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 201 && result.data.success) {
    console.log('✅ Registration successful!');
    authToken = result.data.token;
    return true;
  } else {
    console.log('❌ Registration failed!');
    return false;
  }
}

// Test 2: Login with credentials
async function testLogin() {
  console.log('\n🧪 Test 2: Login User');
  console.log('POST /api/auth/login');
  
  const loginData = {
    email: testUser.email,
    password: testUser.password
  };
  console.log('Body:', JSON.stringify(loginData, null, 2));

  const result = await makeRequest('/login', 'POST', loginData);
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 200 && result.data.success) {
    console.log('✅ Login successful!');
    authToken = result.data.token;
    return true;
  } else {
    console.log('❌ Login failed!');
    return false;
  }
}

// Test 3: Get current user with token
async function testGetCurrentUser() {
  console.log('\n🧪 Test 3: Get Current User');
  console.log('GET /api/auth/me');
  console.log('Authorization: Bearer [token]');

  const result = await makeRequest('/me', 'GET', null, authToken);
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 200 && result.data.success) {
    console.log('✅ Get current user successful!');
    return true;
  } else {
    console.log('❌ Get current user failed!');
    return false;
  }
}

// Test 4: Invalid token
async function testInvalidToken() {
  console.log('\n🧪 Test 4: Invalid Token');
  console.log('GET /api/auth/me');
  console.log('Authorization: Bearer invalid_token');

  const result = await makeRequest('/me', 'GET', null, 'invalid_token_xyz');
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 401 && !result.data.success) {
    console.log('✅ Invalid token handled correctly!');
    return true;
  } else {
    console.log('❌ Invalid token not handled properly!');
    return false;
  }
}

// Test 5: Duplicate registration
async function testDuplicateRegistration() {
  console.log('\n🧪 Test 5: Duplicate Registration');
  console.log('POST /api/auth/register');
  console.log('Body:', JSON.stringify(testUser, null, 2));

  const result = await makeRequest('/register', 'POST', testUser);
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 409 && !result.data.success) {
    console.log('✅ Duplicate registration prevented correctly!');
    return true;
  } else {
    console.log('❌ Duplicate registration not handled properly!');
    return false;
  }
}

// Test 6: Wrong password
async function testWrongPassword() {
  console.log('\n🧪 Test 6: Wrong Password');
  console.log('POST /api/auth/login');
  
  const loginData = {
    email: testUser.email,
    password: 'WrongPassword123!'
  };
  console.log('Body:', JSON.stringify(loginData, null, 2));

  const result = await makeRequest('/login', 'POST', loginData);
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));

  if (result.status === 401 && !result.data.success) {
    console.log('✅ Wrong password rejected correctly!');
    return true;
  } else {
    console.log('❌ Wrong password not handled properly!');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('='.repeat(60));
  console.log('🚀 Starting Authentication Tests');
  console.log('='.repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test User: ${testUser.email}`);

  const results = [];

  // Run tests sequentially
  results.push(await testRegister());
  results.push(await testLogin());
  results.push(await testGetCurrentUser());
  results.push(await testInvalidToken());
  results.push(await testDuplicateRegistration());
  results.push(await testWrongPassword());

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`Tests Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('✅ All tests passed!');
  } else {
    console.log('❌ Some tests failed!');
  }
  
  console.log('='.repeat(60));
}

// Run tests
runTests().catch(console.error);
