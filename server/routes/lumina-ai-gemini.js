const express = require('express');
const axios = require('axios');
const router = express.Router();

// 🆓 GOOGLE GEMINI AI - 100% FREE!
// No cost, no credit card, unlimited usage for personal use

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Medical AI system prompt
const MEDICAL_SYSTEM_PROMPT = `You are Alt-X, a smart and friendly AI medical assistant helping doctors in a hospital.

You can discuss:
- Medical topics (drugs, treatments, diagnoses, procedures)
- Clinical guidelines and WHO protocols
- Patient case discussions
- Drug dosages and interactions
- Disease explanations
- General medical knowledge
- Any questions doctors might have

Be conversational and natural:
- Talk like a knowledgeable colleague
- Use clear, professional language
- Be helpful and accurate
- Provide evidence-based information
- Keep responses concise but complete (2-4 paragraphs)

Always add a disclaimer that your advice should be verified with current guidelines.`;

// 🎯 Main query endpoint - GEMINI AI
router.post('/query', async (req, res) => {
  try {
    const { query, context, patientInfo } = req.body;
    
    console.log('🔵 [Alt-X Gemini] Query received:', query);
    console.log('👤 [Alt-X Gemini] Patient info:', patientInfo);

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key not configured',
        message: 'Please set GEMINI_API_KEY in environment variables',
        hint: 'Get your FREE API key from: https://makersuite.google.com/app/apikey'
      });
    }

    // 🤖 Use Gemini AI for response
    console.log('🤖 [Alt-X Gemini] Sending to Google Gemini AI...');
    const aiResponse = await queryGeminiAI(query, patientInfo);
    console.log('✅ [Alt-X Gemini] AI Response ready');
    
    res.json({
      success: true,
      response: aiResponse,
      source: 'gemini-ai',
      cost: 0, // 100% FREE!
      model: 'gemini-pro',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ [Alt-X Gemini] Error:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      hint: 'Check API key and internet connection'
    });
  }
});

// 🧠 Query Gemini AI
async function queryGeminiAI(query, patientInfo) {
  try {
    // Build conversational prompt
    let fullPrompt = MEDICAL_SYSTEM_PROMPT + '\n\n';
    
    // Add patient context if available
    if (patientInfo && Object.keys(patientInfo).length > 0) {
      fullPrompt += `Patient Context:\n`;
      if (patientInfo.name) fullPrompt += `- Patient: ${patientInfo.name}\n`;
      if (patientInfo.age) fullPrompt += `- Age: ${patientInfo.age} years old\n`;
      if (patientInfo.ageGroup) fullPrompt += `- Age Group: ${patientInfo.ageGroup}\n`;
      if (patientInfo.allergies?.length) {
        fullPrompt += `- ⚠️ ALLERGIES: ${patientInfo.allergies.join(', ')}\n`;
      }
      fullPrompt += '\n';
    }
    
    // Add the actual question
    fullPrompt += `Doctor's Question: ${query}\n\nYour helpful answer:`;
    
    // Call Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log('📊 [Gemini] Full response:', JSON.stringify(response.data, null, 2));
    
    // Safely extract the answer
    if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }
    
    const answer = response.data.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!answer) {
      throw new Error('Invalid response structure from Gemini API');
    }
    
    // Add medical disclaimer
    const enhancedAnswer = answer + '\n\n' +
      '💡 *Please verify this information with current medical guidelines and use clinical judgment.*';
    
    return {
      answer: enhancedAnswer,
      type: 'ai_response',
      model: 'gemini-2.5-flash',
      patientAlerts: patientInfo ? generatePatientAlerts(query, patientInfo) : []
    };
    
  } catch (error) {
    console.error('🔴 [Gemini] Full error:', error);
    if (error.response) {
      // API error
      console.error('🔴 [Gemini] API response error:', error.response.data);
      const errorMsg = error.response.data?.error?.message || error.message;
      throw new Error(`Gemini API error: ${errorMsg}`);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Gemini API. Check internet connection.');
    }
    throw error;
  }
}

// 🚨 Generate patient alerts
function generatePatientAlerts(query, patientInfo) {
  const alerts = [];
  
  if (patientInfo.allergies?.length > 0) {
    alerts.push(`Patient allergies: ${patientInfo.allergies.join(', ')}`);
  }
  
  if (patientInfo.age >= 65) {
    alerts.push(`Elderly patient - consider dose adjustments`);
  }
  
  if (patientInfo.age < 18) {
    alerts.push(`Pediatric patient - use weight-based dosing`);
  }
  
  return alerts;
}

// 🏥 Get AI status
router.get('/status', async (req, res) => {
  try {
    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.json({
        success: false,
        status: 'not-configured',
        message: 'Gemini API key not set',
        setup: {
          step1: 'Get FREE API key from: https://makersuite.google.com/app/apikey',
          step2: 'Set environment variable: GEMINI_API_KEY=your_key',
          step3: 'Restart the server',
          note: 'No credit card required! Completely FREE!'
        }
      });
    }

    // Test API connection with simple request
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: 'Hello'
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    
    res.json({
      success: true,
      status: 'online',
      model: 'gemini-pro',
      provider: 'Google Gemini',
      cost: 'FREE!',
      quality: 'Very High',
      speed: 'Fast (1-2 seconds)'
    });
    
  } catch (error) {
    res.json({
      success: false,
      status: 'offline',
      error: error.message,
      hint: 'Check API key and internet connection'
    });
  }
});

// 🔧 Test AI endpoint
router.post('/test', async (req, res) => {
  try {
    const testQuery = "What is the standard dosage for amoxicillin in adults?";
    
    const response = await queryGeminiAI(testQuery, null);
    
    res.json({
      success: true,
      test: 'passed',
      response: response.answer.substring(0, 200) + '...',
      model: 'gemini-pro',
      status: 'Gemini AI is working! 🎉'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      test: 'failed',
      error: error.message,
      hint: 'Get FREE API key: https://makersuite.google.com/app/apikey'
    });
  }
});

module.exports = router;
