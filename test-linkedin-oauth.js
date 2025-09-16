#!/usr/bin/env node

/**
 * LinkedIn OAuth Configuration Test
 * 
 * This script helps verify your LinkedIn OAuth setup
 */

const https = require('https');
const http = require('http');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

console.log('🔍 LinkedIn OAuth Configuration Test');
console.log('=====================================\n');

// Test 1: Check if backend is running
async function testBackendHealth() {
  console.log('1. Testing backend health...');
  
  return new Promise((resolve) => {
    const url = new URL('/health', BACKEND_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.status === 'OK') {
            console.log('   ✅ Backend is running');
            resolve(true);
          } else {
            console.log('   ❌ Backend health check failed');
            resolve(false);
          }
        } catch (e) {
          console.log('   ❌ Invalid response from backend');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('   ❌ Backend is not running');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('   ❌ Backend connection timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 2: Check LinkedIn OAuth endpoint
async function testLinkedInEndpoint() {
  console.log('\n2. Testing LinkedIn OAuth endpoint...');
  
  return new Promise((resolve) => {
    const url = new URL('/auth/linkedin', BACKEND_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      if (res.statusCode === 302) {
        const location = res.headers.location;
        if (location && location.includes('linkedin.com/oauth/v2/authorization')) {
          console.log('   ✅ LinkedIn OAuth endpoint is working');
          console.log(`   🔗 Redirect URL: ${location}`);
          resolve(true);
        } else {
          console.log('   ❌ Invalid redirect URL');
          resolve(false);
        }
      } else if (res.statusCode === 500) {
        console.log('   ❌ LinkedIn OAuth configuration missing');
        resolve(false);
      } else {
        console.log(`   ❌ Unexpected status code: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ Error: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('   ❌ Request timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 3: Check environment variables
function testEnvironmentVariables() {
  console.log('\n3. Checking environment variables...');
  
  const requiredVars = [
    'LINKEDIN_CLIENT_ID',
    'LINKEDIN_CLIENT_SECRET', 
    'LINKEDIN_REDIRECT_URI'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      if (varName === 'LINKEDIN_CLIENT_SECRET') {
        console.log(`   ✅ ${varName}: Set (${value.length} characters)`);
      } else {
        console.log(`   ✅ ${varName}: Set (${value.substring(0, 8)}...)`);
      }
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// Test 4: Validate redirect URI format
function testRedirectURI() {
  console.log('\n4. Validating redirect URI...');
  
  const redirectURI = process.env.LINKEDIN_REDIRECT_URI;
  if (!redirectURI) {
    console.log('   ❌ No redirect URI configured');
    return false;
  }
  
  try {
    const url = new URL(redirectURI);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      console.log('   ❌ Redirect URI must use http or https protocol');
      return false;
    }
    
    if (!url.pathname.includes('/auth/linkedin/callback')) {
      console.log('   ⚠️  Redirect URI should end with /auth/linkedin/callback');
    }
    
    console.log(`   ✅ Redirect URI format is valid: ${redirectURI}`);
    return true;
  } catch (e) {
    console.log('   ❌ Invalid redirect URI format');
    return false;
  }
}

// Main test function
async function runTests() {
  const results = [];
  
  results.push(testEnvironmentVariables());
  results.push(testRedirectURI());
  results.push(await testBackendHealth());
  results.push(await testLinkedInEndpoint());
  
  console.log('\n📊 Test Results');
  console.log('================');
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  if (passed === total) {
    console.log(`✅ All tests passed (${passed}/${total})`);
    console.log('\n🎉 Your LinkedIn OAuth setup looks good!');
    console.log('\nNext steps:');
    console.log('1. Make sure your LinkedIn app is configured with the correct redirect URI');
    console.log('2. Test the OAuth flow by visiting your frontend');
    console.log('3. Check the browser console for any client-side errors');
  } else {
    console.log(`❌ ${total - passed} test(s) failed (${passed}/${total})`);
    console.log('\n🔧 Please fix the issues above before testing the OAuth flow');
  }
}

// Run the tests
runTests().catch(console.error);
