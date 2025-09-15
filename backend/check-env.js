// Environment Configuration Checker
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Environment Configuration...\n');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Creating .env from env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from env.example');
    console.log('⚠️  Please edit .env file with your actual OAuth credentials\n');
  } else {
    console.log('❌ env.example file also not found!');
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config();

// Check required variables
const requiredVars = {
  'NODE_ENV': process.env.NODE_ENV,
  'PORT': process.env.PORT,
  'BACKEND_URL': process.env.BACKEND_URL,
  'FRONTEND_URL': process.env.FRONTEND_URL,
  'JWT_SECRET': process.env.JWT_SECRET,
  'LINKEDIN_CLIENT_ID': process.env.LINKEDIN_CLIENT_ID,
  'LINKEDIN_CLIENT_SECRET': process.env.LINKEDIN_CLIENT_SECRET,
  'LINKEDIN_REDIRECT_URI': process.env.LINKEDIN_REDIRECT_URI,
  'TIKTOK_CLIENT_ID': process.env.TIKTOK_CLIENT_ID,
  'TIKTOK_CLIENT_SECRET': process.env.TIKTOK_CLIENT_SECRET,
  'TIKTOK_REDIRECT_URI': process.env.TIKTOK_REDIRECT_URI,
};

console.log('📋 Environment Variables Status:');
console.log('================================');

let allSet = true;

Object.entries(requiredVars).forEach(([key, value]) => {
  const status = value ? '✅ Set' : '❌ Missing';
  const displayValue = value ? (key.includes('SECRET') ? '***hidden***' : value) : 'Not set';
  
  if (!value) allSet = false;
  
  console.log(`${key.padEnd(25)}: ${status} ${displayValue}`);
});

console.log('\n' + '='.repeat(50));

if (allSet) {
  console.log('🎉 All environment variables are configured!');
  console.log('✅ You can now start the backend server');
} else {
  console.log('⚠️  Some environment variables are missing');
  console.log('📝 Please edit your .env file with the missing values');
  console.log('\n🔧 Quick fix:');
  console.log('   1. Open backend/.env file');
  console.log('   2. Add your LinkedIn OAuth credentials');
  console.log('   3. Add your TikTok OAuth credentials (if available)');
  console.log('   4. Restart the server');
}

console.log('\n📖 For OAuth setup instructions, see README.md');
