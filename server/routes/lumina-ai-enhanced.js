const express = require('express');
const router = express.Router();

// 🤖 Alt-X AI - Enhanced Medical Knowledge Base
const ENHANCED_KNOWLEDGE_BASE = {
  
  // === ANTIBIOTICS (WHO AWaRe Classification) ===
  antibiotics: {
    amoxicillin: {
      category: 'antibiotic',
      class: 'Penicillins',
      indications: ['Community-acquired pneumonia', 'Otitis media', 'UTIs', 'Dental infections'],
      dosage: {
        adult: '500-750mg every 8 hours',
        pediatric: '25-45 mg/kg/day divided into 3 doses',
        elderly: 'Same as adult, adjust for renal function',
        maxDaily: '3000mg',
        renalAdjustment: 'CrCl <30: Reduce frequency to every 12 hours'
      },
      warnings: ['Penicillin allergy', 'Mononucleosis', 'Severe renal impairment'],
      sideEffects: ['Nausea', 'Diarrhea', 'Rash', 'Hypersensitivity reactions'],
      interactions: ['Warfarin (↑ INR)', 'Methotrexate (↑ toxicity)', 'Oral contraceptives (↓ efficacy)'],
      pregnancy: 'Category B - Generally safe',
      lactation: 'Compatible',
      aware: 'Access - First-line empiric therapy',
      duration: '5-10 days depending on infection'
    },
    
    ciprofloxacin: {
      category: 'antibiotic',
      class: 'Fluoroquinolones',
      indications: ['Lower respiratory infections', 'UTIs', 'GI infections', 'Anthrax'],
      dosage: {
        adult: '250-500mg twice daily (PO) or 400mg twice daily (IV)',
        pediatric: 'Not recommended (except anthrax/plague)',
        elderly: 'Reduce dose if CrCl <50',
        maxDaily: '1500mg PO, 800mg IV',
        renalAdjustment: 'CrCl 30-50: 250-500mg q12h, CrCl <30: 250-500mg q18h'
      },
      warnings: ['Tendon rupture risk', 'QT prolongation', 'Seizure risk', 'Photosensitivity'],
      sideEffects: ['Nausea', 'Headache', 'Dizziness', 'Tendinitis', 'C. difficile'],
      interactions: ['Warfarin', 'Theophylline', 'NSAIDs (↑ seizure risk)', 'Antacids (↓ absorption)'],
      pregnancy: 'Category C - Avoid if possible',
      lactation: 'Avoid',
      aware: 'Watch - Use with caution, reserve for resistant infections',
      duration: '7-14 days'
    },
    
    azithromycin: {
      category: 'antibiotic',
      class: 'Macrolides',
      indications: ['Respiratory infections', 'Skin infections', 'STIs', 'Atypical pneumonia'],
      dosage: {
        adult: '500mg day 1, then 250mg daily for 4 days',
        pediatric: '10 mg/kg day 1, then 5 mg/kg days 2-5',
        elderly: 'Same as adult',
        maxDaily: '500mg',
        renalAdjustment: 'No adjustment needed'
      },
      warnings: ['QT prolongation', 'Liver disease', 'Myasthenia gravis'],
      sideEffects: ['GI upset', 'Diarrhea', 'Abdominal pain', 'Headache'],
      interactions: ['Warfarin', 'Digoxin', 'Antacids', 'QT-prolonging drugs'],
      pregnancy: 'Category B',
      lactation: 'Use with caution',
      aware: 'Watch - Suitable for respiratory infections',
      duration: '3-5 days'
    },
    
    ceftriaxone: {
      category: 'antibiotic',
      class: 'Cephalosporins (3rd generation)',
      indications: ['Severe bacterial infections', 'Meningitis', 'Gonorrhea', 'Sepsis'],
      dosage: {
        adult: '1-2g IV/IM once or twice daily',
        pediatric: '50-80 mg/kg/day (max 2g)',
        elderly: 'Same as adult',
        maxDaily: '4000mg',
        renalAdjustment: 'No adjustment unless severe renal AND hepatic impairment'
      },
      warnings: ['Cephalosporin/penicillin allergy', 'Biliary disease', 'Neonates with hyperbilirubinemia'],
      sideEffects: ['Injection site reactions', 'Diarrhea', 'Rash', 'C. difficile'],
      interactions: ['Calcium (do not mix)', 'Warfarin'],
      pregnancy: 'Category B',
      lactation: 'Compatible',
      aware: 'Access - Critical for severe infections',
      duration: '7-14 days'
    },
    
    metronidazole: {
      category: 'antibiotic',
      class: 'Nitroimidazoles',
      indications: ['Anaerobic infections', 'C. difficile', 'Bacterial vaginosis', 'Giardiasis'],
      dosage: {
        adult: '400-500mg 2-3 times daily',
        pediatric: '7.5 mg/kg 3 times daily',
        elderly: 'Reduce dose in hepatic impairment',
        maxDaily: '1500mg',
        renalAdjustment: 'No adjustment, but metabolites accumulate in severe renal failure'
      },
      warnings: ['Alcohol consumption', 'Peripheral neuropathy', 'CNS effects'],
      sideEffects: ['Metallic taste', 'Nausea', 'Dark urine', 'Neuropathy'],
      interactions: ['Alcohol (disulfiram reaction)', 'Warfarin', 'Lithium'],
      pregnancy: 'Category B - Avoid first trimester',
      lactation: 'Compatible but may cause infant GI upset',
      aware: 'Access - Core for anaerobic coverage',
      duration: '7-10 days'
    }
  },
  
  // === COMMON MEDICATIONS (Non-antibiotics) ===
  commonMeds: {
    paracetamol: {
      category: 'analgesic',
      class: 'Non-opioid analgesic',
      indications: ['Pain', 'Fever'],
      dosage: {
        adult: '500-1000mg every 4-6 hours',
        pediatric: '10-15 mg/kg every 4-6 hours',
        elderly: 'Same as adult',
        maxDaily: '4000mg (adults), 3000mg (elderly/chronic liver disease)'
      },
      warnings: ['Liver disease', 'Chronic alcohol use', 'Overdose risk'],
      sideEffects: ['Rare at therapeutic doses', 'Hepatotoxicity in overdose'],
      interactions: ['Warfarin (prolonged use may ↑ INR)', 'Alcohol'],
      pregnancy: 'Category B - Safe',
      lactation: 'Compatible'
    },
    
    ibuprofen: {
      category: 'analgesic',
      class: 'NSAID',
      indications: ['Pain', 'Inflammation', 'Fever'],
      dosage: {
        adult: '200-400mg every 4-6 hours',
        pediatric: '5-10 mg/kg every 6-8 hours',
        elderly: 'Use lowest effective dose',
        maxDaily: '2400mg (adults), 1200mg (OTC)'
      },
      warnings: ['GI bleeding', 'Renal impairment', 'CV disease', 'Asthma'],
      sideEffects: ['GI upset', 'Ulcers', 'Renal dysfunction', 'CV events'],
      interactions: ['Warfarin', 'ACE inhibitors', 'Lithium', 'Aspirin'],
      pregnancy: 'Category D (3rd trimester) - Avoid',
      lactation: 'Compatible'
    },
    
    metformin: {
      category: 'antidiabetic',
      class: 'Biguanide',
      indications: ['Type 2 diabetes', 'PCOS'],
      dosage: {
        adult: '500mg twice daily, titrate up to 2000-2550mg daily',
        pediatric: '500mg twice daily (≥10 years)',
        elderly: 'Use cautiously, monitor renal function',
        maxDaily: '2550mg'
      },
      warnings: ['Renal impairment (CrCl <30)', 'Lactic acidosis risk', 'Hold before contrast studies'],
      sideEffects: ['GI upset', 'Diarrhea', 'Vitamin B12 deficiency', 'Lactic acidosis (rare)'],
      interactions: ['Alcohol', 'Cimetidine', 'Contrast media'],
      pregnancy: 'Category B - Often used',
      lactation: 'Compatible'
    },
    
    lisinopril: {
      category: 'antihypertensive',
      class: 'ACE Inhibitor',
      indications: ['Hypertension', 'Heart failure', 'Post-MI'],
      dosage: {
        adult: '10-40mg once daily',
        pediatric: '0.07 mg/kg once daily (≥6 years)',
        elderly: 'Start 5mg daily',
        maxDaily: '80mg'
      },
      warnings: ['Pregnancy', 'Angioedema history', 'Bilateral renal artery stenosis'],
      sideEffects: ['Dry cough', 'Hyperkalemia', 'Dizziness', 'Angioedema (rare)'],
      interactions: ['NSAIDs', 'Potassium supplements', 'Diuretics'],
      pregnancy: 'Category D - Contraindicated',
      lactation: 'Probably compatible'
    },
    
    amlodipine: {
      category: 'antihypertensive',
      class: 'Calcium Channel Blocker',
      indications: ['Hypertension', 'Angina'],
      dosage: {
        adult: '5-10mg once daily',
        pediatric: '2.5-5mg once daily (≥6 years)',
        elderly: 'Start 2.5mg daily',
        maxDaily: '10mg'
      },
      warnings: ['Severe aortic stenosis', 'Heart failure'],
      sideEffects: ['Peripheral edema', 'Dizziness', 'Flushing', 'Headache'],
      interactions: ['Simvastatin (limit to 20mg)', 'Grapefruit juice'],
      pregnancy: 'Category C',
      lactation: 'Probably compatible'
    },
    
    omeprazole: {
      category: 'gastrointestinal',
      class: 'Proton Pump Inhibitor',
      indications: ['GERD', 'Peptic ulcer', 'H. pylori eradication'],
      dosage: {
        adult: '20-40mg once daily',
        pediatric: '0.5-1 mg/kg once daily',
        elderly: 'Same as adult',
        maxDaily: '80mg'
      },
      warnings: ['Long-term use (osteoporosis, hypomagnesemia)', 'C. difficile risk'],
      sideEffects: ['Headache', 'GI upset', 'Vitamin B12 deficiency'],
      interactions: ['Clopidogrel (↓ efficacy)', 'Methotrexate', 'Digoxin'],
      pregnancy: 'Category C',
      lactation: 'Probably compatible'
    },
    
    atorvastatin: {
      category: 'cardiovascular',
      class: 'Statin',
      indications: ['Hyperlipidemia', 'CV risk reduction'],
      dosage: {
        adult: '10-80mg once daily',
        pediatric: '10-20mg once daily (≥10 years)',
        elderly: 'Same as adult',
        maxDaily: '80mg'
      },
      warnings: ['Active liver disease', 'Pregnancy', 'Rhabdomyolysis risk'],
      sideEffects: ['Myalgia', 'Elevated liver enzymes', 'Rhabdomyolysis (rare)'],
      interactions: ['Gemfibrozil', 'Macrolides', 'Grapefruit juice', 'Amlodipine'],
      pregnancy: 'Category X - Contraindicated',
      lactation: 'Contraindicated'
    },
    
    levothyroxine: {
      category: 'endocrine',
      class: 'Thyroid Hormone',
      indications: ['Hypothyroidism', 'Thyroid suppression'],
      dosage: {
        adult: '1.6 mcg/kg/day (average 100-125 mcg)',
        pediatric: 'Age-dependent, 25-50 mcg initially',
        elderly: 'Start 25-50 mcg, titrate slowly',
        maxDaily: 'Variable based on response'
      },
      warnings: ['Cardiac disease', 'Adrenal insufficiency', 'Diabetes'],
      sideEffects: ['Tachycardia', 'Anxiety', 'Weight loss', 'Osteoporosis'],
      interactions: ['Iron', 'Calcium', 'PPIs (↓ absorption)', 'Warfarin'],
      pregnancy: 'Category A - Safe and essential',
      lactation: 'Compatible'
    }
  },
  
  // === MEDICAL CALCULATORS ===
  calculators: {
    creatinineClearance: {
      name: 'Creatinine Clearance (Cockcroft-Gault)',
      formula: 'Male: ((140-age) × weight) / (72 × SCr); Female: × 0.85',
      units: 'age in years, weight in kg, SCr in mg/dL',
      interpretation: {
        normal: '>90 mL/min',
        mild: '60-89 mL/min',
        moderate: '30-59 mL/min',
        severe: '15-29 mL/min',
        kidney_failure: '<15 mL/min'
      }
    },
    
    bmi: {
      name: 'Body Mass Index',
      formula: 'weight(kg) / height(m)²',
      interpretation: {
        underweight: '<18.5',
        normal: '18.5-24.9',
        overweight: '25-29.9',
        obese_class1: '30-34.9',
        obese_class2: '35-39.9',
        obese_class3: '≥40'
      }
    },
    
    idealBodyWeight: {
      name: 'Ideal Body Weight',
      formula: 'Male: 50kg + 2.3kg per inch over 5ft; Female: 45.5kg + 2.3kg per inch over 5ft'
    },
    
    curb65: {
      name: 'CURB-65 Score (Pneumonia Severity)',
      criteria: [
        'Confusion',
        'Urea >7 mmol/L (BUN >19 mg/dL)',
        'Respiratory rate ≥30',
        'Blood pressure: SBP <90 or DBP ≤60',
        'Age ≥65'
      ],
      interpretation: {
        '0-1': 'Low risk - outpatient treatment',
        '2': 'Moderate risk - consider hospitalization',
        '3-5': 'High risk - urgent hospitalization'
      }
    },
    
    chads2vasc: {
      name: 'CHA₂DS₂-VASc Score (Stroke Risk in AFib)',
      criteria: {
        CHF: 1,
        Hypertension: 1,
        Age_75_plus: 2,
        Diabetes: 1,
        Stroke_TIA_thromboembolism: 2,
        Vascular_disease: 1,
        Age_65_74: 1,
        Sex_female: 1
      },
      interpretation: {
        '0': 'Low risk - consider no anticoagulation',
        '1': 'Moderate risk - consider anticoagulation',
        '2+': 'High risk - anticoagulation recommended'
      }
    }
  },
  
  // === DRUG INTERACTIONS ===
  interactions: {
    major: [
      { drugs: ['Warfarin', 'NSAIDs'], effect: 'Increased bleeding risk', severity: 'major' },
      { drugs: ['Metformin', 'Contrast dye'], effect: 'Lactic acidosis risk', severity: 'major' },
      { drugs: ['Macrolides', 'Statins'], effect: 'Rhabdomyolysis risk', severity: 'major' },
      { drugs: ['ACE inhibitors', 'Potassium supplements'], effect: 'Hyperkalemia', severity: 'major' },
      { drugs: ['Fluoroquinolones', 'NSAIDs'], effect: 'Seizure risk', severity: 'major' }
    ],
    moderate: [
      { drugs: ['Omeprazole', 'Clopidogrel'], effect: 'Reduced antiplatelet effect', severity: 'moderate' },
      { drugs: ['Levothyroxine', 'Iron'], effect: 'Reduced absorption', severity: 'moderate' },
      { drugs: ['Antibiotics', 'Oral contraceptives'], effect: 'Reduced contraceptive efficacy', severity: 'moderate' }
    ]
  },
  
  // === CLINICAL GUIDELINES ===
  clinicalGuidance: {
    empiricTherapy: 'Start with empiric coverage for likely organisms pending cultures',
    cultureSensitivity: 'Always obtain culture before antibiotics when possible',
    durationGuidance: {
      'Community-acquired pneumonia': '5-7 days',
      'UTI (uncomplicated)': '3-5 days',
      'Skin infections': '7-10 days',
      'Intra-abdominal infections': '4-7 days',
      'Bacteremia': '14 days minimum'
    },
    monitoringPoints: ['Fever response', 'Clinical improvement', 'Adverse effects', 'Culture results', 'Renal function']
  },
  
  // === PATIENT SAFETY ===
  safetyChecks: {
    allergyChecks: 'Always verify patient allergies before prescribing',
    drugInteractions: 'Check for significant interactions with current medications',
    renalDosing: 'Adjust doses in renal impairment (CrCl <50 mL/min)',
    hepaticDosing: 'Reduce doses in liver disease, especially for hepatically metabolized drugs',
    pregnancy: 'Check pregnancy category and avoid Category D/X drugs in pregnancy',
    elderly: 'Start low, go slow - reduce doses in patients >65 years'
  }
};

// 🎯 POST endpoint for Alt-X AI queries
router.post('/query', async (req, res) => {
  try {
    const { query, context, patientInfo } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query cannot be empty' });
    }

    const response = generateEnhancedResponse(query, context, patientInfo);
    
    res.json({
      success: true,
      response: response,
      timestamp: new Date(),
      context: context || 'general',
      patientContext: patientInfo || null
    });
  } catch (error) {
    console.error('Alt-X AI error:', error);
    res.status(500).json({ 
      error: 'Failed to process Alt-X query',
      message: error.message 
    });
  }
});

// 💊 GET all available medications
router.get('/medications', async (req, res) => {
  try {
    const allMeds = {
      ...ENHANCED_KNOWLEDGE_BASE.antibiotics,
      ...ENHANCED_KNOWLEDGE_BASE.commonMeds
    };
    
    res.json({
      success: true,
      total: Object.keys(allMeds).length,
      antibiotics: Object.keys(ENHANCED_KNOWLEDGE_BASE.antibiotics),
      commonMedications: Object.keys(ENHANCED_KNOWLEDGE_BASE.commonMeds),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Medications list error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch medications list',
      message: error.message 
    });
  }
});

// 🧮 POST medical calculator
router.post('/calculate', async (req, res) => {
  try {
    const { calculator, params } = req.body;
    
    const result = performCalculation(calculator, params);
    
    res.json({
      success: true,
      calculator: calculator,
      result: result,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Calculator error:', error);
    res.status(500).json({ 
      error: 'Failed to perform calculation',
      message: error.message 
    });
  }
});

// ⚠️ POST interaction check
router.post('/interactions', async (req, res) => {
  try {
    const { medications } = req.body;
    
    if (!medications || medications.length < 2) {
      return res.status(400).json({ error: 'At least 2 medications required' });
    }
    
    const interactions = checkDrugInteractions(medications);
    
    res.json({
      success: true,
      medications: medications,
      interactions: interactions,
      hasInteractions: interactions.length > 0,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Interaction check error:', error);
    res.status(500).json({ 
      error: 'Failed to check interactions',
      message: error.message 
    });
  }
});

// 📖 GET medication details
router.get('/medication/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const medName = name.toLowerCase();
    
    let medication = ENHANCED_KNOWLEDGE_BASE.antibiotics[medName] || 
                     ENHANCED_KNOWLEDGE_BASE.commonMeds[medName];
    
    if (!medication) {
      return res.status(404).json({ 
        error: 'Medication not found',
        available: [...Object.keys(ENHANCED_KNOWLEDGE_BASE.antibiotics), 
                    ...Object.keys(ENHANCED_KNOWLEDGE_BASE.commonMeds)]
      });
    }
    
    res.json({
      success: true,
      medication: medName,
      details: medication,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Medication details error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch medication details',
      message: error.message 
    });
  }
});

// === HELPER FUNCTIONS ===

function generateEnhancedResponse(query, context, patientInfo) {
  const lowerQuery = query.toLowerCase();
  const kb = ENHANCED_KNOWLEDGE_BASE;
  
  let response = {
    answer: '',
    type: 'general',
    references: [],
    patientAlerts: []
  };
  
  // Check patient context for safety alerts
  if (patientInfo) {
    response.patientAlerts = generatePatientAlerts(lowerQuery, patientInfo);
  }
  
  // === CALCULATOR QUERIES ===
  if (lowerQuery.includes('calculat') || lowerQuery.includes('creatinine') || 
      lowerQuery.includes('crcl') || lowerQuery.includes('bmi')) {
    response.type = 'calculator';
    response.answer = formatCalculatorResponse(kb.calculators);
    return response;
  }
  
  // === DOSAGE QUERIES ===
  if (lowerQuery.includes('dosage') || lowerQuery.includes('dose') || lowerQuery.includes('mg')) {
    response.type = 'dosage_query';
    
    // Check antibiotics
    for (const [med, data] of Object.entries(kb.antibiotics)) {
      if (lowerQuery.includes(med)) {
        response.answer = formatDosageResponse(med, data, patientInfo);
        response.references.push(med);
        return response;
      }
    }
    
    // Check common meds
    for (const [med, data] of Object.entries(kb.commonMeds)) {
      if (lowerQuery.includes(med)) {
        response.answer = formatDosageResponse(med, data, patientInfo);
        response.references.push(med);
        return response;
      }
    }
    
    response.answer = 'Please specify which medication you need dosage information for.';
    return response;
  }
  
  // === INTERACTION QUERIES ===
  if (lowerQuery.includes('interact') || lowerQuery.includes('combine')) {
    response.type = 'interaction_query';
    response.answer = formatInteractionResponse(query, kb.interactions);
    return response;
  }
  
  // === SAFETY QUERIES ===
  if (lowerQuery.includes('allerg') || lowerQuery.includes('safe') || lowerQuery.includes('contraindication')) {
    response.type = 'safety_query';
    response.answer = generateSafetyResponse(query, patientInfo, kb);
    return response;
  }
  
  // === INDICATION QUERIES ===
  if (lowerQuery.includes('indication') || lowerQuery.includes('use for') || lowerQuery.includes('treat')) {
    response.type = 'indication_query';
    response.answer = generateIndicationResponse(query, kb);
    return response;
  }
  
  // === SIDE EFFECTS ===
  if (lowerQuery.includes('side effect') || lowerQuery.includes('adverse')) {
    response.type = 'adverse_effects';
    response.answer = generateSideEffectsResponse(query, kb);
    return response;
  }
  
  // === PREGNANCY/LACTATION ===
  if (lowerQuery.includes('pregnan') || lowerQuery.includes('lactation') || lowerQuery.includes('breastfeed')) {
    response.type = 'pregnancy_query';
    response.answer = generatePregnancyResponse(query, kb);
    return response;
  }
  
  // === CLINICAL GUIDANCE ===
  if (lowerQuery.includes('duration') || lowerQuery.includes('how long') || lowerQuery.includes('treatment course')) {
    response.type = 'clinical_guidance';
    response.answer = formatClinicalGuidance(kb.clinicalGuidance);
    return response;
  }
  
  // === DEFAULT/HELP ===
  response.type = 'help';
  response.answer = generateHelpResponse(kb);
  return response;
}

function formatDosageResponse(medName, data, patientInfo) {
  let response = `**${medName.toUpperCase()} - ${data.class}**\n\n`;
  
  response += `**📋 DOSAGE GUIDELINES:**\n`;
  response += `• Adult: ${data.dosage.adult}\n`;
  response += `• Pediatric: ${data.dosage.pediatric || 'Consult pediatric guidelines'}\n`;
  response += `• Elderly: ${data.dosage.elderly || 'Same as adult, adjust for organ function'}\n`;
  response += `• Max Daily: ${data.dosage.maxDaily}\n`;
  
  if (data.dosage.renalAdjustment) {
    response += `\n⚠️ **Renal Adjustment**: ${data.dosage.renalAdjustment}\n`;
  }
  
  // Patient-specific alerts
  if (patientInfo) {
    response += `\n**🔍 PATIENT-SPECIFIC CONSIDERATIONS:**\n`;
    
    if (patientInfo.age >= 65) {
      response += `• Elderly patient (${patientInfo.age}y): Monitor for reduced clearance\n`;
    }
    
    if (patientInfo.allergies && patientInfo.allergies.length > 0) {
      const allergyMatch = patientInfo.allergies.some(a => 
        a.toLowerCase().includes(data.class.toLowerCase().split(' ')[0])
      );
      if (allergyMatch) {
        response += `• ⚠️ **ALLERGY ALERT**: Patient allergic to ${data.class} - DO NOT PRESCRIBE\n`;
      }
    }
  }
  
  response += `\n**💡 INDICATIONS:**\n`;
  if (Array.isArray(data.indications)) {
    data.indications.forEach(ind => response += `• ${ind}\n`);
  } else {
    response += `• ${data.indications}\n`;
  }
  
  if (data.warnings && data.warnings.length > 0) {
    response += `\n**⚠️ WARNINGS:**\n`;
    data.warnings.forEach(warning => response += `• ${warning}\n`);
  }
  
  if (data.aware) {
    response += `\n**🌍 WHO AWaRe**: ${data.aware}\n`;
  }
  
  return response;
}

function formatCalculatorResponse(calculators) {
  let response = `**🧮 MEDICAL CALCULATORS AVAILABLE:**\n\n`;
  
  response += `**1. Creatinine Clearance (Cockcroft-Gault)**\n`;
  response += `   Formula: ${calculators.creatinineClearance.formula}\n`;
  response += `   Use: Assess renal function for drug dosing\n\n`;
  
  response += `**2. Body Mass Index (BMI)**\n`;
  response += `   Formula: ${calculators.bmi.formula}\n`;
  response += `   Interpretation: Underweight <18.5, Normal 18.5-24.9, Overweight 25-29.9, Obese ≥30\n\n`;
  
  response += `**3. CURB-65 Score**\n`;
  response += `   Use: Pneumonia severity assessment\n`;
  response += `   Criteria: ${calculators.curb65.criteria.join(', ')}\n\n`;
  
  response += `**4. CHA₂DS₂-VASc Score**\n`;
  response += `   Use: Stroke risk in atrial fibrillation\n\n`;
  
  response += `*Ask "Calculate [name]" for step-by-step guidance*`;
  
  return response;
}

function formatInteractionResponse(query, interactions) {
  let response = `**⚠️ DRUG-DRUG INTERACTIONS:**\n\n`;
  
  response += `**Major Interactions (Avoid if possible):**\n`;
  interactions.major.forEach(int => {
    response += `• ${int.drugs.join(' + ')}: ${int.effect}\n`;
  });
  
  response += `\n**Moderate Interactions (Monitor closely):**\n`;
  interactions.moderate.forEach(int => {
    response += `• ${int.drugs.join(' + ')}: ${int.effect}\n`;
  });
  
  response += `\n💡 Always check specific drug combinations in a drug interaction database.`;
  
  return response;
}

function generateSafetyResponse(query, patientInfo, kb) {
  let response = `**🛡️ PATIENT SAFETY CHECKS:**\n\n`;
  
  response += `${kb.safetyChecks.allergyChecks}\n`;
  response += `${kb.safetyChecks.drugInteractions}\n`;
  response += `${kb.safetyChecks.renalDosing}\n`;
  response += `${kb.safetyChecks.hepaticDosing}\n\n`;
  
  if (patientInfo) {
    if (patientInfo.allergies && patientInfo.allergies.length > 0) {
      response += `**⚠️ PATIENT ALLERGIES:**\n`;
      patientInfo.allergies.forEach(allergy => {
        response += `• ${allergy}\n`;
      });
      response += `\nAvoid prescribing drugs in the same class or cross-reactive agents.\n`;
    }
    
    if (patientInfo.age >= 65) {
      response += `\n**Elderly Patient (${patientInfo.age}y):**\n`;
      response += `• Start with lower doses\n`;
      response += `• Monitor for adverse effects\n`;
      response += `• Check renal function\n`;
    }
  }
  
  return response;
}

function generateIndicationResponse(query, kb) {
  let response = `**💊 MEDICATION INDICATIONS:**\n\n`;
  
  // Check if specific medication mentioned
  for (const [med, data] of Object.entries({...kb.antibiotics, ...kb.commonMeds})) {
    if (query.toLowerCase().includes(med)) {
      response = `**${med.toUpperCase()} - ${data.class}**\n\n`;
      response += `**Indications:**\n`;
      if (Array.isArray(data.indications)) {
        data.indications.forEach(ind => response += `• ${ind}\n`);
      } else {
        response += `• ${data.indications}\n`;
      }
      return response;
    }
  }
  
  response += `Please specify which medication you need indication information for.\n\n`;
  response += `Available: amoxicillin, ciprofloxacin, azithromycin, metformin, lisinopril, and more.`;
  
  return response;
}

function generateSideEffectsResponse(query, kb) {
  let response = `**⚠️ ADVERSE EFFECTS:**\n\n`;
  
  for (const [med, data] of Object.entries({...kb.antibiotics, ...kb.commonMeds})) {
    if (query.toLowerCase().includes(med)) {
      response = `**${med.toUpperCase()} - Side Effects:**\n\n`;
      
      if (data.sideEffects && data.sideEffects.length > 0) {
        data.sideEffects.forEach(effect => response += `• ${effect}\n`);
      }
      
      if (data.warnings && data.warnings.length > 0) {
        response += `\n**Serious Warnings:**\n`;
        data.warnings.forEach(warning => response += `• ${warning}\n`);
      }
      
      return response;
    }
  }
  
  response += `Please specify which medication you need side effect information for.`;
  return response;
}

function generatePregnancyResponse(query, kb) {
  let response = `**🤰 PREGNANCY & LACTATION SAFETY:**\n\n`;
  
  for (const [med, data] of Object.entries({...kb.antibiotics, ...kb.commonMeds})) {
    if (query.toLowerCase().includes(med)) {
      response = `**${med.toUpperCase()}:**\n\n`;
      response += `• Pregnancy: ${data.pregnancy}\n`;
      response += `• Lactation: ${data.lactation}\n`;
      return response;
    }
  }
  
  response += `Please specify which medication you need pregnancy/lactation information for.`;
  return response;
}

function formatClinicalGuidance(guidance) {
  let response = `**📋 CLINICAL TREATMENT GUIDANCE:**\n\n`;
  
  response += `**Treatment Durations:**\n`;
  for (const [condition, duration] of Object.entries(guidance.durationGuidance)) {
    response += `• ${condition}: ${duration}\n`;
  }
  
  response += `\n**Monitoring Points:**\n`;
  guidance.monitoringPoints.forEach(point => response += `• ${point}\n`);
  
  response += `\n**Best Practices:**\n`;
  response += `• ${guidance.empiricTherapy}\n`;
  response += `• ${guidance.cultureSensitivity}\n`;
  
  return response;
}

function generateHelpResponse(kb) {
  return `**👋 Welcome to Alt-X AI - Your Healthcare Assistant**\n\n` +
    `I can help you with:\n\n` +
    `**💊 Medications:**\n` +
    `• Dosage guidelines for 15+ medications\n` +
    `• Safety checks & contraindications\n` +
    `• Side effects & warnings\n` +
    `• Pregnancy/lactation compatibility\n\n` +
    `**🧮 Medical Calculators:**\n` +
    `• Creatinine Clearance (renal function)\n` +
    `• BMI calculator\n` +
    `• CURB-65 (pneumonia severity)\n` +
    `• CHA₂DS₂-VASc (stroke risk)\n\n` +
    `**⚠️ Drug Interactions:**\n` +
    `• Check for major & moderate interactions\n` +
    `• Combination safety alerts\n\n` +
    `**📖 Clinical Guidelines:**\n` +
    `• WHO AWaRe classification\n` +
    `• Treatment durations\n` +
    `• Evidence-based protocols\n\n` +
    `**Example Questions:**\n` +
    `• "What's the dosage for amoxicillin?"\n` +
    `• "Calculate creatinine clearance"\n` +
    `• "Is metformin safe in pregnancy?"\n` +
    `• "Side effects of ciprofloxacin"\n` +
    `• "Drug interactions with warfarin"`;
}

function generatePatientAlerts(query, patientInfo) {
  const alerts = [];
  
  if (patientInfo.allergies && patientInfo.allergies.length > 0) {
    alerts.push(`Patient has allergies: ${patientInfo.allergies.join(', ')}`);
  }
  
  if (patientInfo.age >= 65) {
    alerts.push(`Elderly patient (${patientInfo.age}y) - consider dose adjustments`);
  }
  
  if (patientInfo.age < 18) {
    alerts.push(`Pediatric patient (${patientInfo.age}y) - use weight-based dosing`);
  }
  
  return alerts;
}

function performCalculation(calculatorType, params) {
  switch (calculatorType) {
    case 'crcl':
    case 'creatinineClearance':
      return calculateCrCl(params);
    case 'bmi':
      return calculateBMI(params);
    default:
      throw new Error('Unknown calculator type');
  }
}

function calculateCrCl(params) {
  const { age, weight, scr, gender } = params;
  
  if (!age || !weight || !scr || !gender) {
    throw new Error('Missing parameters: age, weight, scr, gender required');
  }
  
  let crcl = ((140 - age) * weight) / (72 * scr);
  if (gender.toLowerCase() === 'female') {
    crcl *= 0.85;
  }
  
  let interpretation = '';
  if (crcl >= 90) interpretation = 'Normal kidney function';
  else if (crcl >= 60) interpretation = 'Mild kidney dysfunction';
  else if (crcl >= 30) interpretation = 'Moderate kidney dysfunction - adjust doses';
  else if (crcl >= 15) interpretation = 'Severe kidney dysfunction - significant dose adjustment needed';
  else interpretation = 'Kidney failure - dialysis may be required';
  
  return {
    value: crcl.toFixed(1),
    unit: 'mL/min',
    interpretation: interpretation,
    params: params
  };
}

function calculateBMI(params) {
  const { weight, height } = params;
  
  if (!weight || !height) {
    throw new Error('Missing parameters: weight (kg), height (m) required');
  }
  
  const bmi = weight / (height * height);
  
  let interpretation = '';
  if (bmi < 18.5) interpretation = 'Underweight';
  else if (bmi < 25) interpretation = 'Normal weight';
  else if (bmi < 30) interpretation = 'Overweight';
  else if (bmi < 35) interpretation = 'Obese (Class I)';
  else if (bmi < 40) interpretation = 'Obese (Class II)';
  else interpretation = 'Obese (Class III)';
  
  return {
    value: bmi.toFixed(1),
    unit: 'kg/m²',
    interpretation: interpretation,
    params: params
  };
}

function checkDrugInteractions(medications) {
  const kb = ENHANCED_KNOWLEDGE_BASE;
  const foundInteractions = [];
  
  // Check against known interactions
  [...kb.interactions.major, ...kb.interactions.moderate].forEach(interaction => {
    const matches = interaction.drugs.filter(drug => 
      medications.some(med => med.toLowerCase().includes(drug.toLowerCase()))
    );
    
    if (matches.length === interaction.drugs.length) {
      foundInteractions.push(interaction);
    }
  });
  
  return foundInteractions;
}

module.exports = router;
module.exports.ENHANCED_KNOWLEDGE_BASE = ENHANCED_KNOWLEDGE_BASE;
