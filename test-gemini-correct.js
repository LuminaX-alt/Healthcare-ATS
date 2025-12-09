const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyAPnzRyWyD9sYomxUvjGPaGfeK7xSilNCI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function testGemini() {
  console.log('🔵 Testing Gemini API with gemini-2.5-flash...');
  
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: "What are the common side effects of amoxicillin?"
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );
    
    console.log('✅ SUCCESS! Gemini API is working!');
    console.log('\n📝 Response:');
    console.log(response.data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.log('❌ ERROR:', error.response?.data || error.message);
    console.log('\n🔴 Status:', error.response?.status);
    if (error.response?.status === 400 || error.response?.status === 403) {
      console.log('\n⚠️  API KEY MAY BE INVALID, EXPIRED, OR RATE LIMITED');
      console.log('📝 Get a new FREE API key from: https://aistudio.google.com/app/apikey');
    }
  }
}

testGemini();
