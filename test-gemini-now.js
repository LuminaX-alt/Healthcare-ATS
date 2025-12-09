const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyAPnzRyWyD9sYomxUvjGPaGfeK7xSilNCI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function testGemini() {
  console.log('🔵 Testing Gemini API...');
  console.log('API Key:', GEMINI_API_KEY);
  
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: "Hello, can you help me?"
          }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    
    console.log('✅ SUCCESS! API key is working!');
    console.log('Response:', response.data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.log('❌ ERROR:', error.response?.data || error.message);
    if (error.response?.status === 400) {
      console.log('\n🔴 API KEY IS INVALID OR EXPIRED!');
      console.log('📝 Get a new FREE API key from: https://makersuite.google.com/app/apikey');
    }
  }
}

testGemini();
