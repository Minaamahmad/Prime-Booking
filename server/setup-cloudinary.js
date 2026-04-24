#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Cloudinary Setup Helper');
console.log('============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Creating from .env.example...\n');
  
  if (fs.existsSync(envExamplePath)) {
    // Copy .env.example to .env
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!\n');
  } else {
    console.log('❌ .env.example file not found. Creating new .env file...\n');
    
    const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hotel-booking

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server Port
PORT=5000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!\n');
  }
} else {
  console.log('✅ .env file already exists.\n');
}

// Read current .env content
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

// Check for Cloudinary variables
const cloudinaryVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingVars = [];

cloudinaryVars.forEach(varName => {
  const line = envLines.find(line => line.startsWith(`${varName}=`));
  if (!line || line.includes('your_')) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('❌ Missing Cloudinary configuration:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  
  console.log('\n📝 To fix this issue:');
  console.log('1. Get your Cloudinary credentials from https://cloudinary.com/console');
  console.log('2. Update the following variables in your .env file:');
  missingVars.forEach(varName => {
    console.log(`   ${varName}=your_actual_${varName.toLowerCase()}_here`);
  });
  console.log('3. Restart the server\n');
  
  process.exit(1);
} else {
  console.log('✅ Cloudinary configuration found!\n');
}

// Check package.json for required dependencies
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDeps = ['cloudinary', 'multer-storage-cloudinary'];
const missingDeps = [];

requiredDeps.forEach(dep => {
  if (!packageJson.dependencies[dep]) {
    missingDeps.push(dep);
  }
});

if (missingDeps.length > 0) {
  console.log('❌ Missing required dependencies:');
  missingDeps.forEach(dep => {
    console.log(`   - ${dep}`);
  });
  
  console.log('\n📦 Install missing dependencies:');
  console.log('npm install cloudinary multer-storage-cloudinary\n');
  process.exit(1);
} else {
  console.log('✅ All required dependencies are installed!\n');
}

// Check for common codebase errors
console.log('🔍 Checking for common codebase errors...\n');

// Check if middleware directory exists
const middlewarePath = path.join(__dirname, 'middleware');
if (!fs.existsSync(middlewarePath)) {
  console.log('⚠️  Middleware directory not found. Creating...\n');
  fs.mkdirSync(middlewarePath, { recursive: true });
} else {
  console.log('✅ Middleware directory exists.\n');
}

// Check if uploadErrorHandler.js exists
const uploadErrorHandlerPath = path.join(middlewarePath, 'uploadErrorHandler.js');
if (!fs.existsSync(uploadErrorHandlerPath)) {
  console.log('❌ uploadErrorHandler.js not found in middleware directory.\n');
} else {
  console.log('✅ uploadErrorHandler.js exists.\n');
}

// Check if config directory exists
const configPath = path.join(__dirname, 'config');
if (!fs.existsSync(configPath)) {
  console.log('⚠️  Config directory not found. Creating...\n');
  fs.mkdirSync(configPath, { recursive: true });
} else {
  console.log('✅ Config directory exists.\n');
}

// Check if cloudinary.js exists
const cloudinaryConfigPath = path.join(configPath, 'cloudinary.js');
if (!fs.existsSync(cloudinaryConfigPath)) {
  console.log('❌ cloudinary.js not found in config directory.\n');
} else {
  console.log('✅ cloudinary.js exists.\n');
}

console.log('🎉 Setup check completed!');
console.log('\n📋 Next steps:');
console.log('1. Make sure Cloudinary credentials are set in .env');
console.log('2. Start the server with: npm start');
console.log('3. Test image upload functionality\n');
