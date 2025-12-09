const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyAPnzRyWyD9sYomxUvjGPaGfeK7xSilNCI';

async function listModels() {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    
    console.log('📋 Available Gemini Models:');
    response.data.models.forEach(model => {
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log('✅', model.name);
      }
    });
  } catch (error) {
    console.log('❌ ERROR:', error.response?.data || error.message);
  }
}

listModels();
