const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyAPnzRyWyD9sYomxUvjGPaGfeK7xSilNCI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function testGemini() {
  console.log('🔵 Testing Gemini API...\n');
  
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: "What are antibiotics?"
          }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );
    
    console.log('✅ API Response received!');
    console.log('\n📊 Full Response Structure:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.candidates && response.data.candidates[0]) {
      const text = response.data.candidates[0].content.parts[0].text;
      console.log('\n✅ Extracted Text:');
      console.log(text);
    }
  } catch (error) {
    console.log('❌ API Call Failed!');
    console.log('\n🔴 Error Details:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      console.log('\n⚠️  RATE LIMIT EXCEEDED - Wait a moment and try again');
    } else if (error.response?.status === 400) {
      console.log('\n⚠️  BAD REQUEST - Check API key or request format');
    } else if (error.response?.status === 403) {
      console.log('\n⚠️  API KEY INVALID OR EXPIRED');
      console.log('📝 Get new key: https://aistudio.google.com/app/apikey');
    }
  }
}

testGemini();
