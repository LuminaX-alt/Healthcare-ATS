// WHO Antibiotic Guidelines Utility
// Based on WHO AWaRe (Access, Watch, Reserve) Classification

// Ensure this is treated as a module
export {};

export interface WHOGuideline {
  maxDailyDosage: number; // mg per day
  recommendedDosage: number; // mg per day
  maxDuration: number; // days
  indications: string[];
  awaReCategory: 'Access' | 'Watch' | 'Reserve';
  warnings: string[];
}

export interface DosageValidationResult {
  isValid: boolean;
  severity: 'info' | 'warning' | 'critical';
  warnings: Array<{
    severity: 'info' | 'warning' | 'critical';
    message: string;
  }>;
}

// WHO Antibiotic Guidelines Database
export const WHOAntibioticGuidelines: Record<string, WHOGuideline> = {
  'Amoxicillin 500mg': {
    maxDailyDosage: 3000, // mg per day
    recommendedDosage: 1500, // mg per day (500mg x 3 times)
    maxDuration: 10, // days
    indications: ['Respiratory tract infections', 'Urinary tract infections', 'Skin infections'],
    awaReCategory: 'Access',
    warnings: ['Monitor for allergic reactions', 'Complete full course']
  },
  'Ciprofloxacin 250mg': {
    maxDailyDosage: 1500, // mg per day
    recommendedDosage: 750, // mg per day (250mg x 3 times)
    maxDuration: 14,
    indications: ['Urinary tract infections', 'Bone and joint infections', 'Gastrointestinal infections'],
    awaReCategory: 'Watch',
    warnings: ['Risk of tendon rupture', 'Avoid in children', 'May cause QT prolongation']
  },
  'Azithromycin 250mg': {
    maxDailyDosage: 500, // mg per day
    recommendedDosage: 250, // mg per day (single dose)
    maxDuration: 5,
    indications: ['Respiratory infections', 'Skin infections', 'Sexually transmitted infections'],
    awaReCategory: 'Watch',
    warnings: ['Single daily dose recommended', 'Monitor for cardiac arrhythmias']
  },
  'Ceftriaxone 1g': {
    maxDailyDosage: 4000, // mg per day
    recommendedDosage: 2000, // mg per day
    maxDuration: 14,
    indications: ['Severe infections', 'Meningitis', 'Sepsis'],
    awaReCategory: 'Watch',
    warnings: ['Reserve for severe infections', 'IV/IM administration only']
  },
  'Metronidazole 400mg': {
    maxDailyDosage: 4000, // mg per day
    recommendedDosage: 1200, // mg per day (400mg x 3 times)
    maxDuration: 10,
    indications: ['Anaerobic infections', 'Protozoal infections', 'Dental infections'],
    awaReCategory: 'Access',
    warnings: ['Avoid alcohol during treatment', 'May cause metallic taste']
  },
  'Levofloxacin 500mg': {
    maxDailyDosage: 1000,
    recommendedDosage: 500,
    maxDuration: 14,
    indications: ['Respiratory infections', 'Urinary tract infections', 'Skin infections'],
    awaReCategory: 'Watch',
    warnings: ['Risk of tendon damage', 'Avoid in pregnancy']
  },
  'Vancomycin 1g': {
    maxDailyDosage: 4000,
    recommendedDosage: 2000,
    maxDuration: 14,
    indications: ['MRSA infections', 'Severe gram-positive infections'],
    awaReCategory: 'Reserve',
    warnings: ['Reserved for resistant infections only', 'Requires therapeutic drug monitoring', 'IV administration only']
  }
};

// Helper function to extract dosage amount from medication name
export const extractDosageAmount = (medicationName: string): number => {
  // Match patterns like "500mg", "1g", "250 mg"
  const mgMatch = medicationName.match(/(\d+)\s*mg/i);
  if (mgMatch) return parseInt(mgMatch[1]);
  
  const gMatch = medicationName.match(/(\d+)\s*g/i);
  if (gMatch) return parseInt(gMatch[1]) * 1000; // Convert g to mg
  
  return 0;
};

// Helper function to parse frequency
export const parseFrequency = (frequency: string): number => {
  if (!frequency) return 1;
  
  // Match patterns like "3 times daily", "twice daily", "once daily", "q8h", "q12h"
  const numberMatch = frequency.match(/(\d+)\s*(times?|x)/i);
  if (numberMatch) return parseInt(numberMatch[1]);
  
  if (frequency.toLowerCase().includes('twice') || frequency.toLowerCase().includes('bid')) return 2;
  if (frequency.toLowerCase().includes('three') || frequency.toLowerCase().includes('tid')) return 3;
  if (frequency.toLowerCase().includes('four') || frequency.toLowerCase().includes('qid')) return 4;
  if (frequency.toLowerCase().includes('q8h')) return 3;
  if (frequency.toLowerCase().includes('q6h')) return 4;
  if (frequency.toLowerCase().includes('q12h')) return 2;
  if (frequency.toLowerCase().includes('once') || frequency.toLowerCase().includes('daily')) return 1;
  
  return 1;
};

// Helper function to parse duration
export const parseDuration = (duration: string): number => {
  if (!duration) return 0;
  
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

// Main validation function
export const validateAntibioticDosage = (
  medicationName: string,
  quantity: number,
  frequency: string,
  duration: string
): DosageValidationResult => {
  const guideline = WHOAntibioticGuidelines[medicationName];
  
  if (!guideline) {
    return {
      isValid: true,
      severity: 'info',
      warnings: [{
        severity: 'info',
        message: `No WHO guidelines available for ${medicationName}. Please verify dosing manually.`
      }]
    };
  }

  const warnings: Array<{ severity: 'info' | 'warning' | 'critical'; message: string }> = [];
  const dosagePerUnit = extractDosageAmount(medicationName);
  const timesPerDay = parseFrequency(frequency);
  const days = parseDuration(duration);
  
  // Calculate daily dosage
  const dailyDosage = dosagePerUnit * timesPerDay;
  
  // Critical: Daily dosage exceeds maximum
  if (dailyDosage > guideline.maxDailyDosage) {
    warnings.push({
      severity: 'critical',
      message: `🚨 CRITICAL: Daily dosage (${dailyDosage}mg) exceeds WHO maximum safe dosage (${guideline.maxDailyDosage}mg). Risk of toxicity!`
    });
  }
  // Warning: Daily dosage significantly above recommended
  else if (dailyDosage > guideline.recommendedDosage * 1.5) {
    warnings.push({
      severity: 'warning',
      message: `⚠️ WARNING: Daily dosage (${dailyDosage}mg) significantly exceeds WHO recommended dosage (${guideline.recommendedDosage}mg).`
    });
  }
  // Info: Within normal range
  else if (dailyDosage >= guideline.recommendedDosage * 0.8 && dailyDosage <= guideline.recommendedDosage * 1.2) {
    warnings.push({
      severity: 'info',
      message: `✓ Dosage (${dailyDosage}mg/day) is within WHO recommended range.`
    });
  }
  
  // Check duration
  if (days > guideline.maxDuration) {
    warnings.push({
      severity: 'warning',
      message: `⚠️ WARNING: Treatment duration (${days} days) exceeds WHO maximum (${guideline.maxDuration} days). Consider review or de-escalation.`
    });
  }
  
  // Add AWaRe category warning
  if (guideline.awaReCategory === 'Reserve') {
    warnings.push({
      severity: 'critical',
      message: `🔒 RESERVE ANTIBIOTIC: ${medicationName} is in WHO Reserve category. Should only be used for life-threatening infections resistant to other antibiotics.`
    });
  } else if (guideline.awaReCategory === 'Watch') {
    warnings.push({
      severity: 'warning',
      message: `👁️ WATCH ANTIBIOTIC: ${medicationName} is in WHO Watch category. Consider alternatives from Access group if possible.`
    });
  }
  
  // Add specific warnings for this antibiotic
  guideline.warnings.forEach(warning => {
    warnings.push({
      severity: 'warning',
      message: `ℹ️ ${warning}`
    });
  });
  
  // Determine overall validity
  const hasCriticalWarnings = warnings.some(w => w.severity === 'critical');
  const hasWarnings = warnings.some(w => w.severity === 'warning');
  
  return {
    isValid: !hasCriticalWarnings,
    severity: hasCriticalWarnings ? 'critical' : hasWarnings ? 'warning' : 'info',
    warnings
  };
};

// Play alert sound for critical warnings
export const playAlertSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Play three beeps for critical alert
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 800;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.5);
    }, 600);
    
    setTimeout(() => {
      const osc3 = audioContext.createOscillator();
      const gain3 = audioContext.createGain();
      osc3.connect(gain3);
      gain3.connect(audioContext.destination);
      osc3.frequency.value = 800;
      osc3.type = 'sine';
      gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      osc3.start(audioContext.currentTime);
      osc3.stop(audioContext.currentTime + 0.5);
    }, 1200);
  } catch (error) {
    console.error('Error playing alert sound:', error);
  }
};

// Get guideline information for a medication
export const getGuidelineInfo = (medicationName: string): WHOGuideline | null => {
  return WHOAntibioticGuidelines[medicationName] || null;
};

// Format dosage warning for display
export const formatDosageWarning = (result: DosageValidationResult): string => {
  return result.warnings.map(w => w.message).join('\n');
};
