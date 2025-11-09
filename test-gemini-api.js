#!/usr/bin/env node

// Test script to verify Gemini API is working

const axios = require('axios');
require('dotenv').config({ path: './server/.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

console.log('🧪 Testing Gemini API...');
console.log('🔑 API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'MISSING!');
console.log('🌐 API URL:', GEMINI_API_URL);
console.log('');

async function testGemini() {
  try {
    console.log('📡 Sending test request to Gemini...');
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Say 'Hello! I am Google Gemini AI and I am working correctly.' in one sentence."
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    console.log('✅ SUCCESS! Gemini API is working!');
    console.log('');
    console.log('📊 Full Response:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('');
    
    const answer = response.data.candidates[0]?.content?.parts?.[0]?.text;
    console.log('💬 Gemini says:');
    console.log(answer);
    console.log('');
    console.log('🎉 TEST PASSED! Your Gemini API key is valid!');
    
  } catch (error) {
    console.error('❌ FAILED! Gemini API test failed!');
    console.error('');
    
    if (error.response) {
      console.error('📛 Error Status:', error.response.status);
      console.error('📛 Error Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('📛 No response received from Gemini API');
      console.error('📛 Error:', error.message);
    } else {
      console.error('📛 Error:', error.message);
    }
    
    console.error('');
    console.error('🔧 Possible fixes:');
    console.error('1. Check your internet connection');
    console.error('2. Verify API key at: https://aistudio.google.com/app/apikey');
    console.error('3. Check if Gemini API model name is correct');
    console.error('4. Wait a few minutes and try again (API might be rate limited)');
  }
}

testGemini();
