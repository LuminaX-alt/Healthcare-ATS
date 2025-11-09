const express = require('express');
const axios = require('axios');
const router = express.Router();

// 🤖 CLAUDE AI INTEGRATION - High Quality AI Responses
// Using Anthropic's Claude API

// Claude API Configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'YOUR_API_KEY_HERE';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-sonnet-20240229'; // Fast & smart model

// Medical AI system prompt
const MEDICAL_SYSTEM_PROMPT = `You are Alt-X, a smart and friendly AI medical assistant helping doctors in a hospital.

You can discuss:
- Medical topics (drugs, treatments, diagnoses, procedures)
- Clinical guidelines and WHO protocols
- Patient case discussions
- Drug dosages and interactions
- Disease explanations
- General medical knowledge
- And any other questions doctors might have

Be conversational and natural:
- Talk like a knowledgeable colleague
- Use clear, professional language
- Be helpful and accurate
- Provide evidence-based information
- Keep responses concise but complete (2-4 paragraphs)

Always add a disclaimer that your advice should be verified with current guidelines.`;

// 🎯 Main query endpoint - PURE CLAUDE AI
router.post('/query', async (req, res) => {
  try {
    const { query, context, patientInfo } = req.body;
    
    console.log('🔵 [Alt-X Claude] Query received:', query);
    console.log('👤 [Alt-X Claude] Patient info:', patientInfo);

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    // Check if API key is configured
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.status(500).json({
        success: false,
        error: 'Claude API key not configured',
        message: 'Please set CLAUDE_API_KEY in environment variables',
        hint: 'Get your free API key from: https://console.anthropic.com/'
      });
    }

    // 🤖 Use Claude AI for response
    console.log('🤖 [Alt-X Claude] Sending to Claude AI...');
    const aiResponse = await queryClaudeAI(query, patientInfo);
    console.log('✅ [Alt-X Claude] AI Response ready');
    
    res.json({
      success: true,
      response: aiResponse,
      source: 'claude-ai',
      cost: 0.01, // Approximate cost per query
      model: CLAUDE_MODEL,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ [Alt-X Claude] Error:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      hint: 'Check API key and internet connection'
    });
  }
});

// 🧠 Query Claude AI
async function queryClaudeAI(query, patientInfo) {
  try {
    // Build conversational prompt
    let userMessage = '';
    
    // Add patient context if available
    if (patientInfo && Object.keys(patientInfo).length > 0) {
      userMessage += `Patient Context:\n`;
      if (patientInfo.name) userMessage += `- Patient: ${patientInfo.name}\n`;
      if (patientInfo.age) userMessage += `- Age: ${patientInfo.age} years old\n`;
      if (patientInfo.ageGroup) userMessage += `- Age Group: ${patientInfo.ageGroup}\n`;
      if (patientInfo.allergies?.length) {
        userMessage += `- ⚠️ ALLERGIES: ${patientInfo.allergies.join(', ')}\n`;
      }
      userMessage += '\n';
    }
    
    // Add the actual question
    userMessage += `Question: ${query}`;
    
    // Call Claude API
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: MEDICAL_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    const answer = response.data.content[0].text;
    
    // Add medical disclaimer
    const enhancedAnswer = answer + '\n\n' +
      '💡 *Please verify this information with current medical guidelines and use clinical judgment.*';
    
    return {
      answer: enhancedAnswer,
      type: 'ai_response',
      model: CLAUDE_MODEL,
      patientAlerts: patientInfo ? generatePatientAlerts(query, patientInfo) : []
    };
    
  } catch (error) {
    if (error.response) {
      // API error
      const errorMsg = error.response.data?.error?.message || error.message;
      throw new Error(`Claude API error: ${errorMsg}`);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Claude API. Check internet connection.');
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
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.json({
        success: false,
        status: 'not-configured',
        message: 'Claude API key not set',
        setup: {
          step1: 'Get API key from: https://console.anthropic.com/',
          step2: 'Set environment variable: CLAUDE_API_KEY=your_key',
          step3: 'Restart the server'
        }
      });
    }

    // Test API connection
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ]
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        timeout: 5000
      }
    );
    
    res.json({
      success: true,
      status: 'online',
      model: CLAUDE_MODEL,
      provider: 'Anthropic Claude',
      cost: '~$0.01 per message',
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
    
    const response = await queryClaudeAI(testQuery, null);
    
    res.json({
      success: true,
      test: 'passed',
      response: response.answer.substring(0, 200) + '...',
      model: CLAUDE_MODEL,
      status: 'Claude AI is working!'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      test: 'failed',
      error: error.message,
      hint: 'Check API key: https://console.anthropic.com/'
    });
  }
});

module.exports = router;
