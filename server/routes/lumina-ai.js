const express = require('express');
const router = express.Router();

// Alt-X AI Enhanced Knowledge Base
const LUMINA_KNOWLEDGE_BASE = {
  // === ANTIBIOTICS (WHO Guidelines) ===
  whoGuidelines: {
    amoxicillin: {
      indications: 'Community-acquired pneumonia, otitis media, urinary tract infections',
      dosage: {
        adult: '500-750mg every 8 hours',
        pediatric: '25-45 mg/kg/day divided into 3 doses',
        maxDaily: '3000mg'
      },
      warnings: ['Not for penicillin-allergic patients', 'Monitor renal function'],
      aware: 'Access Category - Core medicine for WHO essential medicines list',
      interactions: ['Warfarin', 'Methotrexate', 'Oral contraceptives']
    },
    ciprofloxacin: {
      indications: 'Lower respiratory tract infections, urinary tract infections, gastrointestinal infections',
      dosage: {
        adult: '250-500mg twice daily',
        pediatric: 'Not recommended in children',
        maxDaily: '1500mg'
      },
      warnings: ['Avoid in pregnancy', 'May cause tendon rupture', 'Can lower seizure threshold'],
      aware: 'Watch Category - Use with caution, monitor resistance'
    },
    azithromycin: {
      indications: 'Respiratory infections, skin/soft tissue infections, STIs',
      dosage: {
        adult: '500mg day 1, then 250mg daily for 4 days',
        pediatric: '10 mg/kg on day 1, then 5 mg/kg daily',
        maxDaily: '500mg'
      },
      warnings: ['Monitor QT interval', 'May cause GI upset', 'Risk of C. difficile infection'],
      aware: 'Watch Category - Suitable for respiratory infections'
    },
    ceftriaxone: {
      indications: 'Severe bacterial infections, meningitis, gonorrhea',
      dosage: {
        adult: '1-2g IV/IM once or twice daily',
        pediatric: '50-80 mg/kg/day',
        maxDaily: '4000mg'
      },
      warnings: ['Monitor for allergic reactions', 'Discontinue if rash develops', 'Risk of Clostridioides difficile'],
      aware: 'Access Category - Critical for severe infections'
    },
    levofloxacin: {
      indications: 'Respiratory infections, UTIs, prostatitis, complicated skin infections',
      dosage: {
        adult: '500mg once daily',
        pediatric: 'Not routinely recommended',
        maxDaily: '500mg'
      },
      warnings: ['Risk of tendonitis', 'May prolong QT interval', 'Photosensitivity possible'],
      aware: 'Watch Category - Reserve for resistant organisms'
    },
    metronidazole: {
      indications: 'Anaerobic infections, protozoal infections, bacterial vaginosis',
      dosage: {
        adult: '400-500mg 2-3 times daily',
        pediatric: '7.5 mg/kg 3 times daily',
        maxDaily: '1500mg'
      },
      warnings: ['Disulfiram-like reaction with alcohol', 'Peripheral neuropathy risk', 'Dark urine may occur'],
      aware: 'Access Category - Core for anaerobic coverage'
    },
    trimethoprim: {
      indications: 'UTIs, PCP prophylaxis, some respiratory infections',
      dosage: {
        adult: '100mg twice daily',
        pediatric: '2-4 mg/kg twice daily',
        maxDaily: '400mg'
      },
      warnings: ['Risk of hyperkalemia', 'Monitor for rash', 'May cause bone marrow suppression'],
      aware: 'Access Category - Useful for specific infections'
    }
  },
  
  dosageCalculation: {
    tips: [
      'Always verify renal function before dosing fluoroquinolones',
      'Consider liver function for macrolides and metronidazole',
      'Pediatric doses must be calculated by weight',
      'Elderly patients may need dose adjustment',
      'Maximum daily doses should never be exceeded'
    ]
  },

  patientSafety: {
    allergyChecks: 'Always verify patient allergies before prescribing - particularly penicillins, cephalosporins, and macrolides',
    drugInteractions: 'Check for significant interactions with current medications',
    renalDosing: 'Adjust doses in renal impairment (CrCl <30 mL/min)',
    hepaticDosing: 'Reduce doses in liver disease, especially for macrolides',
    pregnancy: 'Avoid fluoroquinolones and some other antibiotics in pregnancy'
  },

  clinicalGuidance: {
    empiricTherapy: 'Start with empiric coverage for likely organisms pending cultures',
    cultureSensitivity: 'Always obtain culture before antibiotics when possible',
    durationGuidance: 'Community-acquired pneumonia: 5-7 days; UTI: 3-5 days; Skin infections: 7-10 days',
    monitoringPoints: ['Fever response', 'Clinical improvement', 'Adverse effects', 'Culture results']
  }
};

// POST endpoint for Alt-X AI queries
router.post('/query', async (req, res) => {
  try {
    const { query, context, patientInfo } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    const response = generateLuminaResponse(query, context, patientInfo);
    
    res.json({
      success: true,
      response: response,
      timestamp: new Date(),
      context: context || 'general'
    });
  } catch (error) {
    console.error('Alt-X AI error:', error);
    res.status(500).json({ 
      error: 'Failed to process Alt-X query',
      message: error.message 
    });
  }
});

// GET all available antibiotics (must come before the parameterized route)
router.get('/guidelines', async (req, res) => {
  try {
    res.json({
      success: true,
      antibiotics: Object.keys(LUMINA_KNOWLEDGE_BASE.whoGuidelines),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Antibiotics list error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch antibiotics list',
      message: error.message 
    });
  }
});

// GET endpoint for WHO guidelines
router.get('/guidelines/:antibiotic', async (req, res) => {
  try {
    const { antibiotic } = req.params;
    const guidelines = LUMINA_KNOWLEDGE_BASE.whoGuidelines[antibiotic.toLowerCase()];

    if (!guidelines) {
      return res.status(404).json({ 
        error: 'Guideline not found',
        available: Object.keys(LUMINA_KNOWLEDGE_BASE.whoGuidelines)
      });
    }

    res.json({
      success: true,
      antibiotic: antibiotic.toLowerCase(),
      guidelines: guidelines,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Guidelines fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch guidelines',
      message: error.message 
    });
  }
});

// Function to generate contextual Lumina responses
function generateLuminaResponse(query, context, patientInfo) {
  const lowerQuery = query.toLowerCase();
  const knowledge = LUMINA_KNOWLEDGE_BASE;
  
  let response = {
    answer: '',
    type: 'general',
    references: []
  };

  // WHO Guideline Queries
  if (lowerQuery.includes('dosage') || lowerQuery.includes('dose') || lowerQuery.includes('mg')) {
    response.type = 'dosage_query';
    
    for (const [antibiotic, guidelines] of Object.entries(knowledge.whoGuidelines)) {
      if (lowerQuery.includes(antibiotic)) {
        response.answer = formatDosageResponse(antibiotic, guidelines, patientInfo);
        response.references.push(antibiotic);
        return response;
      }
    }
    
    response.answer = generateDosageGuidance(query, patientInfo);
  }
  
  // Allergy and Safety Checks
  else if (lowerQuery.includes('allerg') || lowerQuery.includes('contraindication') || lowerQuery.includes('safe')) {
    response.type = 'safety_query';
    response.answer = generateSafetyResponse(query, patientInfo, knowledge);
  }
  
  // Indication Queries
  else if (lowerQuery.includes('indication') || lowerQuery.includes('treat') || lowerQuery.includes('use')) {
    response.type = 'indication_query';
    response.answer = generateIndicationResponse(query, knowledge);
  }
  
  // Adverse Effects
  else if (lowerQuery.includes('side effect') || lowerQuery.includes('adverse') || lowerQuery.includes('reaction')) {
    response.type = 'adverse_effects_query';
    response.answer = generateAdverseEffectsResponse(query, knowledge);
  }
  
  // Drug Interactions
  else if (lowerQuery.includes('interact') || lowerQuery.includes('combine') || lowerQuery.includes('with')) {
    response.type = 'interaction_query';
    response.answer = generateInteractionResponse(query, knowledge);
  }
  
  // Clinical Guidance
  else if (lowerQuery.includes('duration') || lowerQuery.includes('course') || lowerQuery.includes('how long')) {
    response.type = 'clinical_guidance';
    response.answer = formatClinicalGuidance(knowledge);
  }
  
  // Default helpful response
  else {
    response.type = 'general_info';
    response.answer = generateDefaultResponse(query, knowledge);
  }

  return response;
}

function formatDosageResponse(antibiotic, guidelines, patientInfo) {
  const dosage = guidelines.dosage;
  let response = `**${antibiotic.toUpperCase()} Dosage Guidelines:**\n\n`;
  
  response += `• **Adult**: ${dosage.adult}\n`;
  response += `• **Pediatric**: ${dosage.pediatric}\n`;
  response += `• **Maximum Daily**: ${dosage.maxDaily}\n\n`;
  
  if (patientInfo?.ageGroup === 'pediatric') {
    response += `⚠️ **Pediatric Patient**: Dosage must be calculated based on weight: ${dosage.pediatric}\n`;
  } else if (patientInfo?.ageGroup === 'elderly') {
    response += `⚠️ **Elderly Patient**: Consider dose adjustment based on renal function.\n`;
  }
  
  response += `\n**Indications**: ${guidelines.indications}\n`;
  response += `\n**WHO Classification**: ${guidelines.aware}`;
  
  if (guidelines.warnings && guidelines.warnings.length > 0) {
    response += `\n\n**Warnings**: ${guidelines.warnings.join(', ')}`;
  }
  
  return response;
}

function generateDosageGuidance(query, patientInfo) {
  let guidance = `**Dosage Calculation Tips:**\n\n`;
  
  guidance += `• Check current renal function before prescribing\n`;
  guidance += `• Verify liver function for hepatic-metabolized drugs\n`;
  
  if (patientInfo?.age && patientInfo.age > 65) {
    guidance += `• Patient is elderly (${patientInfo.age} years): May need dose adjustment\n`;
  }
  
  if (patientInfo?.allergies && patientInfo.allergies.length > 0) {
    guidance += `• **Patient Allergies**: ${patientInfo.allergies.join(', ')} - Verify compatibility\n`;
  }
  
  guidance += `\n**Always verify maximum daily doses are not exceeded.**`;
  
  return guidance;
}

function generateSafetyResponse(query, patientInfo, knowledge) {
  let safety = `**Safety & Allergy Check:**\n\n`;
  
  safety += `${knowledge.patientSafety.allergyChecks}\n\n`;
  
  if (patientInfo?.allergies && patientInfo.allergies.length > 0) {
    safety += `**⚠️ Patient Allergies**: ${patientInfo.allergies.join(', ')}\n`;
    safety += `Avoid beta-lactams (penicillins, cephalosporins) if penicillin allergy exists.\n\n`;
  }
  
  safety += `**Standard Safety Checks:**\n`;
  safety += `• ${knowledge.patientSafety.drugInteractions}\n`;
  safety += `• ${knowledge.patientSafety.renalDosing}\n`;
  safety += `• ${knowledge.patientSafety.hepaticDosing}\n`;
  
  return safety;
}

function generateIndicationResponse(query, knowledge) {
  let indications = `**Antibiotic Indications by WHO AWaRe:**\n\n`;
  
  for (const [antibiotic, guidelines] of Object.entries(knowledge.whoGuidelines)) {
    if (query.toLowerCase().includes(antibiotic)) {
      indications += `**${antibiotic.toUpperCase()}**:\n`;
      indications += `• Indications: ${guidelines.indications}\n`;
      indications += `• ${guidelines.aware}\n\n`;
    }
  }
  
  if (indications === `**Antibiotic Indications by WHO AWaRe:**\n\n`) {
    indications += `Please specify an antibiotic to see its indications. Available antibiotics: ${Object.keys(knowledge.whoGuidelines).join(', ')}`;
  }
  
  return indications;
}

function generateAdverseEffectsResponse(query, knowledge) {
  let effects = `**Adverse Effects & Warnings:**\n\n`;
  
  let found = false;
  for (const [antibiotic, guidelines] of Object.entries(knowledge.whoGuidelines)) {
    if (query.toLowerCase().includes(antibiotic)) {
      effects += `**${antibiotic.toUpperCase()}**:\n`;
      if (guidelines.warnings && guidelines.warnings.length > 0) {
        guidelines.warnings.forEach(warning => {
          effects += `• ${warning}\n`;
        });
      }
      effects += '\n';
      found = true;
    }
  }
  
  if (!found) {
    effects += `Please specify an antibiotic to see adverse effects and warnings.`;
  }
  
  return effects;
}

function generateInteractionResponse(query, knowledge) {
  return `**Drug Interaction Guidance:**\n\n` +
    `• Always check drug-drug interactions before prescribing\n` +
    `• Fluoroquinolones may interact with NSAIDs\n` +
    `• Macrolides can inhibit CYP3A4 metabolism\n` +
    `• Metronidazole has disulfiram-like reaction with alcohol\n` +
    `• Trimethoprim can increase potassium levels\n\n` +
    `**Recommendation**: Consult drug interaction checkers (e.g., UpToDate, micromedex) for specific medication combinations.`;
}

function formatClinicalGuidance(knowledge) {
  let guidance = `**Clinical Treatment Duration Guidelines:**\n\n`;
  
  knowledge.clinicalGuidance.monitoringPoints.forEach(point => {
    guidance += `• Monitor: ${point}\n`;
  });
  
  guidance += `\n**Typical Treatment Durations:**\n`;
  guidance += `• Community-acquired pneumonia: 5-7 days\n`;
  guidance += `• UTIs: 3-5 days\n`;
  guidance += `• Skin/soft tissue infections: 7-10 days\n`;
  guidance += `• Respiratory infections: 5-7 days\n`;
  
  return guidance;
}

function generateDefaultResponse(query, knowledge) {
  return `**Alt-X Assistant** can help you with:\n\n` +
    `• **WHO Antibiotic Dosage Guidelines** - Ask about dosing for specific antibiotics\n` +
    `• **Safety & Allergy Information** - Check contraindications and patient safety\n` +
    `• **Drug Indications** - Understand when to use specific antibiotics\n` +
    `• **Adverse Effects** - Learn about side effects and warnings\n` +
    `• **Drug Interactions** - Check for potential interactions\n` +
    `• **Clinical Guidance** - Get guidance on treatment duration\n\n` +
    `**Example Questions:**\n` +
    `• "What's the dosage for amoxicillin?"\n` +
    `• "Is this patient allergic to penicillins?"\n` +
    `• "What are the indications for ciprofloxacin?"\n` +
    `• "What are the side effects of azithromycin?"\n\n` +
    `**Available Antibiotics**: ${Object.keys(knowledge.whoGuidelines).join(', ')}`;
}

module.exports = router;
