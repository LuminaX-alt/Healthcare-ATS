const express = require('express');
const axios = require('axios');
const router = express.Router();

// 🆓 FREE LOCAL AI - Using Ollama + Llama 2
// No API costs, runs on your server, 100% private

// Ollama API endpoint (local)
const OLLAMA_API = 'http://localhost:11434/api/generate';
const OLLAMA_CHAT_API = 'http://localhost:11434/api/chat';
const DEFAULT_MODEL = 'llama2'; // 🔥 REAL AI MODEL - Can answer ANYTHING!

// Import existing knowledge base for hybrid approach
const { ENHANCED_KNOWLEDGE_BASE } = require('./lumina-ai-enhanced');

// Medical AI system prompt - REAL CONVERSATIONAL AI
const MEDICAL_SYSTEM_PROMPT = `You are Alt-X, a smart and friendly AI assistant.

You can talk about ANYTHING:
- Medical topics (drugs, treatments, diagnoses)
- General questions (how things work, explanations)
- Advice and recommendations
- Casual conversation
- Problem-solving

Be conversational and natural:
- Talk like you're chatting with a colleague over coffee
- Use simple, clear language
- Be helpful and supportive
- Don't be overly formal or robotic
- Keep responses concise but complete

You're an AI that actually THINKS and responds - not pre-programmed answers!`;

// 🎯 Main query endpoint with hybrid approach
router.post('/query', async (req, res) => {
  try {
    const { query, context, patientInfo } = req.body;
    
    console.log('🔵 [Alt-X] Query received:', query);
    console.log('👤 [Alt-X] Patient info:', patientInfo);

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    // 🤖 ALWAYS use real AI - NO knowledge base shortcuts!
    // This makes Alt-X a TRUE conversational AI that can discuss ANYTHING
    console.log('🤖 [Alt-X] Using REAL AI for conversational response...');
    const aiResponse = await queryLocalAI(query, patientInfo);
    console.log('✅ [Alt-X] AI Response ready:', aiResponse.answer.substring(0, 100) + '...');
    
    res.json({
      success: true,
      response: aiResponse,
      source: 'local-ai',
      cost: 0,
      model: 'llama2',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ [Alt-X] Error:', error.message);
    console.error('Local AI error:', error.message);
    
    // Fallback to knowledge base if AI fails
    const fallback = getFallbackResponse(req.body.query);
    
    res.json({
      success: true,
      response: fallback,
      source: 'fallback',
      warning: 'Local AI unavailable, using knowledge base',
      hint: 'Start Ollama: ollama serve'
    });
  }
});

// 🧠 Query local AI (Ollama)
async function queryLocalAI(query, patientInfo) {
  try {
    // Build natural conversational prompt
    let fullPrompt = MEDICAL_SYSTEM_PROMPT + '\n\n';
    
    // Add patient context if available
    if (patientInfo && Object.keys(patientInfo).length > 0) {
      fullPrompt += `Context: Working with a patient`;
      if (patientInfo.name) fullPrompt += ` named ${patientInfo.name}`;
      if (patientInfo.age) fullPrompt += `, age ${patientInfo.age}`;
      if (patientInfo.allergies?.length) {
        fullPrompt += `, allergies: ${patientInfo.allergies.join(', ')}`;
      }
      fullPrompt += '\n\n';
    }
    
    // Add the actual question
    fullPrompt += `Question: ${query}\n\nAnswer:`;
    
    // Call Ollama API with better settings for conversation
    const response = await axios.post(
      OLLAMA_API,
      {
        model: DEFAULT_MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.8,  // Higher = more creative and conversational
          top_p: 0.95,
          max_tokens: 800    // More tokens = longer, detailed responses
        }
      },
      {
        timeout: 120000
      }
    );
    
    const answer = response.data.response.trim();
    
    return {
      answer: answer,
      type: 'ai_response',
      model: DEFAULT_MODEL,
      patientAlerts: patientInfo ? generatePatientAlerts(query, patientInfo) : []
    };
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Ollama not running. Start with: ollama serve');
    }
    throw error;
  }
}

// 📚 Try knowledge base first (fast, accurate)
function tryKnowledgeBase(query, patientInfo) {
  const lowerQuery = query.toLowerCase();
  
  // Check if query matches known patterns
  if (lowerQuery.includes('dosage') || lowerQuery.includes('dose')) {
    // Check medications
    for (const [med, data] of Object.entries({
      ...ENHANCED_KNOWLEDGE_BASE.antibiotics,
      ...ENHANCED_KNOWLEDGE_BASE.commonMeds
    })) {
      if (lowerQuery.includes(med.toLowerCase())) {
        return {
          found: true,
          answer: formatDosageResponse(med, data, patientInfo),
          type: 'knowledge_base',
          references: [med]
        };
      }
    }
  }
  
  // Check for calculator queries
  if (lowerQuery.includes('calculate') || lowerQuery.includes('calculator')) {
    return {
      found: true,
      answer: formatCalculatorInfo(),
      type: 'knowledge_base'
    };
  }
  
  // Check for interaction queries
  if (lowerQuery.includes('interact')) {
    return {
      found: true,
      answer: formatInteractionInfo(),
      type: 'knowledge_base'
    };
  }
  
  return { found: false };
}

// 🆘 Fallback response
function getFallbackResponse(query) {
  return {
    answer: `I can help with medical queries, but I need Ollama running for complex questions.\n\n` +
      `**Quick Setup:**\n` +
      `1. Install Ollama: \`curl -fsSL https://ollama.com/install.sh | sh\`\n` +
      `2. Download model: \`ollama pull llama2\`\n` +
      `3. Start server: \`ollama serve\`\n\n` +
      `**Meanwhile, try specific queries like:**\n` +
      `• "Amoxicillin dosage"\n` +
      `• "Calculate creatinine clearance"\n` +
      `• "Drug interactions with warfarin"`,
    type: 'fallback'
  };
}

// 📝 Format dosage response
function formatDosageResponse(medName, data, patientInfo) {
  let response = `**${medName.toUpperCase()} - ${data.class}**\n\n`;
  
  response += `**📋 DOSAGE:**\n`;
  response += `• Adult: ${data.dosage.adult}\n`;
  response += `• Pediatric: ${data.dosage.pediatric || 'See guidelines'}\n`;
  response += `• Max Daily: ${data.dosage.maxDaily}\n`;
  
  if (patientInfo?.age >= 65) {
    response += `\n⚠️ **Elderly Patient**: Consider dose reduction\n`;
  }
  
  if (patientInfo?.allergies?.length > 0) {
    response += `\n⚠️ **PATIENT ALLERGIES**: ${patientInfo.allergies.join(', ')}\n`;
  }
  
  response += `\n**💡 INDICATIONS:**\n`;
  if (Array.isArray(data.indications)) {
    data.indications.forEach(ind => response += `• ${ind}\n`);
  } else {
    response += `• ${data.indications}\n`;
  }
  
  return response;
}

// 🧮 Format calculator info
function formatCalculatorInfo() {
  return `**🧮 MEDICAL CALCULATORS AVAILABLE:**\n\n` +
    `**1. Creatinine Clearance (CrCl)**\n` +
    `   Use: Assess renal function for drug dosing\n` +
    `   Endpoint: POST /api/lumina-ai/calculate\n\n` +
    `**2. Body Mass Index (BMI)**\n` +
    `   Use: Nutritional assessment\n\n` +
    `**3. CURB-65 Score**\n` +
    `   Use: Pneumonia severity\n\n` +
    `Ask "How to calculate [name]" for details.`;
}

// ⚠️ Format interaction info
function formatInteractionInfo() {
  return `**⚠️ DRUG INTERACTION CHECKER:**\n\n` +
    `To check interactions:\n` +
    `POST /api/lumina-ai/interactions\n` +
    `{ "medications": ["Drug1", "Drug2"] }\n\n` +
    `**Common Major Interactions:**\n` +
    `• Warfarin + NSAIDs → Bleeding risk\n` +
    `• Metformin + Contrast → Lactic acidosis\n` +
    `• Statins + Macrolides → Rhabdomyolysis\n\n` +
    `Ask about specific drug combinations for details.`;
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
    // Check if Ollama is running
    const response = await axios.get('http://localhost:11434/api/tags', {
      timeout: 2000
    });
    
    const models = response.data.models || [];
    
    res.json({
      success: true,
      status: 'online',
      models: models.map(m => m.name),
      recommended: 'llama2',
      cost: 0,
      privacy: 'local'
    });
    
  } catch (error) {
    res.json({
      success: false,
      status: 'offline',
      message: 'Ollama not running',
      setup: {
        install: 'curl -fsSL https://ollama.com/install.sh | sh',
        download: 'ollama pull llama2',
        start: 'ollama serve'
      }
    });
  }
});

// 🔧 Test AI endpoint
router.post('/test', async (req, res) => {
  try {
    const testQuery = "What is the standard dosage for amoxicillin in adults?";
    
    const response = await axios.post(OLLAMA_API, {
      model: DEFAULT_MODEL, // Use configured model (tinyllama for speed)
      prompt: `${MEDICAL_SYSTEM_PROMPT}\n\nDoctor's Question: ${testQuery}\n\nResponse:`,
      stream: false
    }, { timeout: 120000 }); // 120 second timeout
    
    res.json({
      success: true,
      test: 'passed',
      response: response.data.response.substring(0, 200) + '...',
      model: 'llama2',
      status: 'Local AI is working!'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      test: 'failed',
      error: error.message,
      hint: 'Make sure Ollama is running: ollama serve'
    });
  }
});

module.exports = router;
