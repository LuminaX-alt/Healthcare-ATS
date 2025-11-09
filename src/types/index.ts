// User Authentication Types
export interface User {
    id: string;
    email: string;
    phoneNumber?: string;
    role: 'doctor' | 'admin' | 'pharmacist' | 'patient';
    isVerified: boolean;
    createdAt: string;
}

export interface AuditLog {
    id: string;
    eventTime: string;
    doctorId: string;
    doctorName: string;
    action: 'CREATE' | 'UPDATE' | 'REVIEW' | 'STOP' | 'OVERRIDE' | 'DELETE' | 'PATIENT_SELECTED' | 'MEDICATION_ADDED' | 'PRESCRIPTION_SAVED' | 'PATIENT_VITALS_RECORDED' | 'PATIENT_NOTE_ADDED';
    entity: 'PRESCRIPTION' | 'ANTIBIOTIC' | 'Patient' | 'Patient Profile' | 'Patient Vitals' | 'Patient Note' | 'Prescription';
    entityId: string;
    details: string;
    previousHash?: string;
    entryHash: string;
    patientName?: string;
    route?: 'Oral' | 'IV' | 'IM' | 'Topical' | 'Subcutaneous' | 'Inhalation' | 'N/A';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface OTPVerification {
    phoneNumber: string;
    otp: string;
}

// Patient Types
export interface Patient {
    id: string;
    phoneNumber: string;
    name?: string;
    email?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other' | 'not_specified';
    address?: string;
    medicalHistory: string[];
    allergies: string[];
    profileComplete: boolean;
    cart: CartItem[];
    vitals?: PatientVitals;
    timeline?: TimelineEvent[];
    prescriptions?: Prescription[];
    orders?: Order[];
}

export interface PatientProfile {
    name: string;
    email: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    address: string;
    emergencyContact: string;
    allergies: string[];
    medicalHistory: string[];
}

export interface PatientVitals {
    height?: number; // in cm
    weight?: number; // in kg
    bloodPressure?: string; // e.g., '120/80'
    temperature?: number; // in Celsius
    heartRate?: number; // bpm
    respiratoryRate?: number; // breaths per minute
    lastUpdated?: string; // e.g., '2025-10-10'
}

export interface TimelineEvent {
    id: string;
    date: string;
    type: 'Prescription' | 'Diagnosis' | 'Lab Result' | 'Note' | 'Vital Sign';
    title: string;
    description: string;
    icon: string;
}

// Doctor Types
export interface Doctor {
    id: string;
    _id?: string; // MongoDB ID field
    email: string;
    name: string;
    specialty: string;
    department: string;
    licenseNumber: string;
    patients: Patient[];
    prescriptions: Prescription[];
    antibioticUsageStats: AntibioticUsageStats;
    performanceMetrics: DoctorPerformanceMetrics;
    lastLogin?: string;
    isOnline?: boolean;
    onlineStatus?: 'online' | 'offline' | 'busy';
    lastStatusUpdate?: string;
    experience?: string;
    consultationFee?: number;
    rating?: number;
    availability?: {
        days: string[];
        hours: string;
    };
}

// Admin Types
export interface Admin {
    id: string;
    email: string;
    name: string;
    permissions: string[];
    lastLogin?: string;
}

// Pharmacist Types
export interface Pharmacist {
    id: string;
    email: string;
    name: string;
    pharmacyId: string;
    licenseNumber: string;
    lastLogin?: string;
}

export interface Pharmacy {
    id: string;
    name: string;
    location: string;
    pharmacistId: string;
    availableMedications: Medication[];
    orders: Order[];
}

// Medication and Antibiotic Types
export interface Medication {
    id: string;
    name: string;
    type: 'antibiotic' | 'general';
    category?: string;
    dosage: string;
    price: number;
    stock: number;
    manufacturer: string;
    expiryDate: string;
    requiresPrescription: boolean;
    sideEffects: string[];
}

export interface Antibiotic extends Medication {
    type: 'antibiotic';
    antibioticClass: string;
    spectrum: 'narrow' | 'broad';
    resistanceProfile: string[];
    indicatedConditions: string[];
}

export interface Prescription {
    id: string;
    doctorId: string;
    doctorName: string;
    patientId: string;
    medications: PrescribedMedication[];
    diagnosis: string;
    symptoms: string[];
    createdAt: string;
    modifiedAt?: string;
    status: 'pending' | 'dispensed' | 'completed' | 'stopped';
    notes?: string;
}

export interface PrescribedMedication {
    id: string;
    patient: Patient;
    medication: Medication;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    prescriptionDate: string;
    dispensed: boolean;
    dispenseDate?: string;
    pharmacistId?: string;
    route?: 'Oral' | 'IV' | 'IM' | 'Topical';
    indication?: string;
    startDate?: string;
    endDate?: string;
    reviewDate?: string;
    status?: 'active' | 'stopped' | 'reviewed';
    cultureResults?: CultureResult[];
    cultureLink?: string;
    isAntibiotic?: boolean;
}

export interface CultureResult {
    testName: string;
    result: string;
}

// Cart and Order Types
export interface CartItem {
    medicationId: string;
    medicationName: string;
    quantity: number;
    price: number;
    prescriptionId?: string;
    addedAt: string;
}

export interface Order {
    id: string;
    patientId: string;
    patientName?: string;
    pharmacyId: string;
    items: CartItem[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'dispatched' | 'delivered';
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt: string;
    dispatchedAt?: string;
    deliveredAt?: string;
    deliveryAddress: string;
}

// Analytics, Audit, and Guideline Types
export interface AntibioticGuideline {
    infectionType: string;
    recommendedAntibiotic: string;
    maxDurationDays: number; // in days
}

export interface AuditLog {
    id: string;
    eventTime: string;
    doctorId: string;
    doctorName: string;
    action: 'CREATE' | 'UPDATE' | 'REVIEW' | 'STOP' | 'OVERRIDE' | 'DELETE' | 'PATIENT_SELECTED' | 'MEDICATION_ADDED' | 'PRESCRIPTION_SAVED' | 'PATIENT_VITALS_RECORDED' | 'PATIENT_NOTE_ADDED';
    entity: 'PRESCRIPTION' | 'ANTIBIOTIC' | 'Patient' | 'Patient Profile' | 'Patient Vitals' | 'Patient Note' | 'Prescription';
    entityId: string;
    details: string; // e.g., "Prescribed Amoxicillin for John Doe"
    previousHash?: string;
    entryHash: string; // sha256(JSON.stringify(log_without_hash))
    patientName?: string; // Track which patient
}

export interface DoctorPerformanceMetrics {
    prescriptionsCreated: number;
    prescriptionsReviewed: number;
    prescriptionsDeEscalated: number;
    complianceScore: number; // percentage
    antibioticUsageTrend: Array<{ month: string; count: number }>;
}

export interface LabResult {
    id: string;
    patientId: string;
    cultureType: string;
    organism: string;
    sensitivity: Array<{ antibiotic: string; result: 'S' | 'R' | 'I' }>; // Sensitive, Resistant, Intermediate
    collectedAt: string;
}

export interface Notification {
    id: string;
    type: 'alert' | 'nudge' | 'info';
    message: string;
    patientId?: string;
    createdAt: string;
    read: boolean;
}

// Analytics Types
export interface AntibioticUsageStats {
    totalPrescribed: number;
    byClass: Record<string, number>;
    byCondition: Record<string, number>;
    monthlyTrends: Array<{
        month: string;
        count: number;
    }>;
}

export interface SystemAnalytics {
    totalDoctors: number;
    totalPatients: number;
    totalPharmacists: number;
    totalPrescriptions: number;
    antibioticPrescriptions: number;
    resistanceTrends: Array<{
        antibiotic: string;
        resistanceRate: number;
    }>;
}