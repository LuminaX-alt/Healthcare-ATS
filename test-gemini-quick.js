#!/usr/bin/env node

// Quick Gemini API Test - Tests multiple model versions

const axios = require('axios');
require('dotenv').config({ path: './server/.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MODELS_TO_TEST = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.0-pro'
];

console.log('🧪 Quick Gemini API Test');
console.log('========================');
console.log('🔑 API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 15)}...` : '❌ MISSING!');
console.log('');

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('❌ ERROR: No valid API key found!');
  console.error('');
  console.error('🔧 Get your FREE API key:');
  console.error('   https://aistudio.google.com/app/apikey');
  console.error('');
  console.error('Then update: /server/.env');
  console.error('   GEMINI_API_KEY=your_key_here');
  process.exit(1);
}

async function testModel(modelName) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await axios.post(
      url,
      {
        contents: [{
          parts: [{ text: "Say 'Hello! I work!' in exactly 3 words." }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 50
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      }
    );
    
    const answer = response.data.candidates[0]?.content?.parts?.[0]?.text;
    return { success: true, model: modelName, answer };
    
  } catch (error) {
    return { 
      success: false, 
      model: modelName, 
      error: error.response?.data?.error?.message || error.message 
    };
  }
}

async function runTests() {
  console.log('🔍 Testing models...');
  console.log('');
  
  for (const model of MODELS_TO_TEST) {
    process.stdout.write(`Testing ${model}... `);
    const result = await testModel(model);
    
    if (result.success) {
      console.log('✅ WORKS!');
      console.log(`   Response: ${result.answer}`);
      console.log('');
      console.log('🎉 SUCCESS! Use this model in your app!');
      console.log(`   Model: ${result.model}`);
      return;
    } else {
      console.log('❌ Failed');
      console.log(`   Error: ${result.error}`);
    }
  }
  
  console.log('');
  console.log('❌ ALL MODELS FAILED!');
  console.log('');
  console.log('🔧 Possible issues:');
  console.log('1. API key is invalid/expired');
  console.log('2. Get new key: https://aistudio.google.com/app/apikey');
  console.log('3. Check internet connection');
  console.log('4. Try again in a few minutes');
}

runTests();
