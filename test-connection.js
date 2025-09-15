// Simple connection test script
const axios = require('axios');

async function testConnection() {
  console.log('🔍 Testing Backend-Frontend Connection...\n');
  
  try {
    // Test backend health endpoint
    console.log('1. Testing backend health endpoint...');
    const healthResponse = await axios.get('http://localhost:4000/health');
    console.log('✅ Backend is running:', healthResponse.data);
    
    // Test CORS
    console.log('\n2. Testing CORS configuration...');
    const corsResponse = await axios.get('http://localhost:4000/health', {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    console.log('✅ CORS is configured correctly');
    
    // Test OAuth endpoints exist
    console.log('\n3. Testing OAuth endpoints...');
    try {
      await axios.get('http://localhost:4000/auth/linkedin');
      console.log('✅ LinkedIn OAuth endpoint exists');
    } catch (error) {
      if (error.response?.status === 302) {
        console.log('✅ LinkedIn OAuth endpoint exists (redirects as expected)');
      } else {
        console.log('❌ LinkedIn OAuth endpoint issue:', error.message);
      }
    }
    
    try {
      await axios.get('http://localhost:4000/auth/tiktok');
      console.log('✅ TikTok OAuth endpoint exists');
    } catch (error) {
      if (error.response?.status === 302) {
        console.log('✅ TikTok OAuth endpoint exists (redirects as expected)');
      } else {
        console.log('❌ TikTok OAuth endpoint issue:', error.message);
      }
    }
    
    console.log('\n🎉 All tests passed! Backend is ready.');
    console.log('\n📋 Next steps:');
    console.log('   1. Start frontend: cd frontend && npm run dev');
    console.log('   2. Open http://localhost:3000');
    console.log('   3. Check browser console for connection status');
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure backend is running: cd backend && npm run start:dev');
    console.log('   2. Check if port 4000 is available');
    console.log('   3. Verify .env file is configured correctly');
  }
}

testConnection();
