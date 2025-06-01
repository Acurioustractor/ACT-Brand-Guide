#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function setup() {
  console.log('\n🌱 A Curious Tractor - Brand Guide Setup\n');
  console.log('This script will help you configure your environment.\n');
  
  const useNotion = await ask('Do you want to set up Notion integration? (y/n): ');
  
  let config = {
    PORT: '3000',
    DEBUG: 'true'
  };
  
  if (useNotion.toLowerCase() === 'y' || useNotion.toLowerCase() === 'yes') {
    console.log('\n📝 Notion Integration Setup');
    console.log('You\'ll need to create a Notion integration first:');
    console.log('1. Visit: https://www.notion.so/my-integrations');
    console.log('2. Create a new integration');
    console.log('3. Copy the integration token\n');
    
    const token = await ask('Enter your Notion integration token (starts with secret_): ');
    config.NOTION_TOKEN = token;
    
    console.log('\nNext, you need your projects database ID:');
    console.log('1. Open your projects database in Notion');
    console.log('2. Copy the URL');
    console.log('3. Extract the database ID (the long string before ?v=)\n');
    
    const databaseId = await ask('Enter your projects database ID: ');
    config.NOTION_DATABASE_ID = databaseId;
    
    const useSubmissions = await ask('Do you want to enable project submissions? (y/n): ');
    if (useSubmissions.toLowerCase() === 'y' || useSubmissions.toLowerCase() === 'yes') {
      const submissionsId = await ask('Enter your submissions database ID: ');
      config.NOTION_SUBMISSIONS_DATABASE_ID = submissionsId;
    }
  }
  
  const customPort = await ask('Custom port (press enter for 3000): ');
  if (customPort && customPort !== '3000') {
    config.PORT = customPort;
  }
  
  // Create .env file
  const envContent = Object.entries(config)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const envPath = path.join(process.cwd(), '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Configuration saved to .env');
    
    if (config.NOTION_TOKEN) {
      console.log('\n🔗 Notion Integration Configured');
      console.log('Make sure to:');
      console.log('1. Share your database with the integration');
      console.log('2. Set up the correct properties in your database');
      console.log('3. See README.md for detailed instructions');
    } else {
      console.log('\n📋 Running with sample data');
      console.log('Your brand guide will show sample projects.');
      console.log('Set up Notion later by editing the .env file.');
    }
    
    console.log('\n🚀 Ready to start!');
    console.log('Run: npm start');
    
  } catch (error) {
    console.error('\n❌ Error creating .env file:', error.message);
  }
  
  rl.close();
}

// Run setup if called directly
if (require.main === module) {
  setup().catch(console.error);
}

module.exports = setup; 