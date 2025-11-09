import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Doctor, Patient, Prescription, Medication, LabResult, AuditLog, AntibioticGuideline, PrescribedMedication, DoctorPerformanceMetrics, Notification } from '../types';
import { PrescriptionPDFGenerator, DigitalSignature } from '../utils/pdfGenerator';
import DigitalSignatureCapture from './DigitalSignatureCapture';
import api from '../api';
import { validateAntibioticDosage, playAlertSound, getGuidelineInfo } from '../utils/whoGuidelines';
import { 
  Users, 
  Pill, 
  FileText, 
  TrendingUp, 
  Search, 
  Plus, 
  Calendar,
  AlertTriangle,
  BarChart3,
  LogOut,
  User,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Heart,
  X,
  Save,
  Activity,
  ClipboardList,
  Download,
  PenTool,
  ShieldCheck,
  History,
  FlaskConical,
  Lightbulb,
  FileSpreadsheet,
  Bell,
  TrendingDown,
  Award,
  Loader2,
  BarChart,
  LayoutDashboard,
  XCircle,
  Send,
  CheckCircle,
  Clock
} from 'lucide-react';
import PatientProfile from './PatientProfile';
import PatientCard from './PatientCard';
import LuminaAssistant from './LuminaAssistant';

interface DashboardData {
  patients: Patient[];
  prescriptions: Prescription[];
  labResults: LabResult[];
  auditLogs: AuditLog[];
  guidelines: AntibioticGuideline[];
  notifications: Notification[];
  performanceMetrics: DoctorPerformanceMetrics | null;
  availableMedications: Medication[];
}

const DoctorDashboard: React.FC = () => {
  const { user, userProfile, isLoading: authLoading, logout } = useAuth();
  
  console.log('DoctorDashboard render:', { user, userProfile, authLoading });
  
  // ALL useState hooks MUST come before any conditional returns
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'lab-reports' | 'antibiotic-tracking' | 'analytics' | 'audit-log' | 'performance' | 'lumina-ai'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showPatientProfileModal, setShowPatientProfileModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [digitalSignature, setDigitalSignature] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [medicationQuantities, setMedicationQuantities] = useState<{ [key: string]: number }>({});
  
  // Lab Reports State
  const [labReports, setLabReports] = useState<any[]>([]);
  const [labReportsStats, setLabReportsStats] = useState({ total: 0, unread: 0, pending: 0 });
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [showReportDetailModal, setShowReportDetailModal] = useState(false);
  
  // WHO Antibiotic Guidelines State
  const [showDosageWarning, setShowDosageWarning] = useState(false);
  const [dosageWarnings, setDosageWarnings] = useState<Array<{
    medication: string;
    currentDosage: number;
    maxDosage: number;
    severity: 'warning' | 'critical';
    message: string;
  }>>([]);
  
  // Enhanced Patient Tracking Features
  const [showPatientNotesModal, setShowPatientNotesModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showVisitHistoryModal, setShowVisitHistoryModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [patientFilter, setPatientFilter] = useState<'all' | 'critical' | 'follow-up' | 'recent'>('all');
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    bloodType: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    insuranceProvider: '',
    insuranceNumber: ''
  });
  const [patientNotes, setPatientNotes] = useState<{[key: string]: any[]}>({});
  const [patientVisits, setPatientVisits] = useState<{[key: string]: any[]}>({});
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newVitals, setNewVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: '',
    respiratoryRate: ''
  });
  
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    symptoms: '',
    medications: [] as any[],
    notes: '',
    indication: '',
    route: 'Oral' as 'Oral' | 'IV' | 'IM' | 'Topical',
    frequency: '',
    duration: ''
  });
  const [prescribedMedications, setPrescribedMedications] = useState<PrescribedMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    patients: [],
    prescriptions: [],
    labResults: [],
    auditLogs: [],
    guidelines: [],
    notifications: [],
    performanceMetrics: null,
    availableMedications: []
  });

  const doctor = userProfile as Doctor;

  // Fetch lab reports from backend
  const fetchLabReports = async () => {
    try {
      console.log('🔬 Fetching lab reports for doctor...');
      const response = await api.get('/lab-reports');
      console.log('📊 Lab reports response:', response.data);
      
      if (response.data.success) {
        console.log(`✅ Found ${response.data.reports.length} lab reports`);
        setLabReports(response.data.reports);
        
        // Calculate stats
        const stats = {
          total: response.data.reports.length,
          unread: response.data.reports.filter((r: any) => r.sentToDoctor && !r.viewedByDoctor).length,
          pending: response.data.reports.filter((r: any) => r.status === 'pending').length
        };
        console.log('📈 Lab reports stats:', stats);
        setLabReportsStats(stats);
      } else {
        console.log('⚠️ API returned success: false');
      }
    } catch (error: any) {
      console.error('❌ Error fetching lab reports:', error);
      console.error('Error details:', error.response?.data);
      setLabReports([]);
    }
  };

  // Mark report as viewed
  const handleViewReport = async (reportId: string) => {
    try {
      console.log('👁️ Marking report as viewed:', reportId);
      await api.post(`/lab-reports/${reportId}/mark-viewed`);
      
      // Update local state
      setLabReports(labReports.map(r => 
        r.id === reportId ? { ...r, viewedByDoctor: true } : r
      ));
      
      // Update stats
      setLabReportsStats({
        ...labReportsStats,
        unread: Math.max(0, labReportsStats.unread - 1)
      });
      
      // Show alert with report details
      const report = labReports.find(r => r.id === reportId);
      if (report) {
        alert(`📋 Report Details:\n\nID: ${report.id}\nPatient: ${report.patientName}\nTest: ${report.testName}\nDate: ${new Date(report.uploadDate).toLocaleString()}\nNotes: ${report.notes || 'None'}`);
      }
    } catch (error) {
      console.error('Error marking report as viewed:', error);
      alert('Failed to mark report as viewed. Please try again.');
    }
  };

  // Download report file
  const handleDownloadReport = async (reportId: string) => {
    try {
      console.log('📥 Downloading report:', reportId);
      
      const report = labReports.find(r => r.id === reportId);
      if (!report?.fileUrl) {
        alert('⚠️ No file attached to this report');
        return;
      }
      
      const response = await api.get(`/lab-reports/download/${reportId}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', report.fileName || 'lab-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Mark as downloaded
      await api.post(`/lab-reports/${reportId}/mark-downloaded`);
      
      // Update local state
      setLabReports(labReports.map(r => 
        r.id === reportId ? { ...r, downloadedByDoctor: true } : r
      ));
      
      console.log('✅ Report downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading report:', error);
      alert(error.response?.data?.msg || 'Failed to download report. Please try again.');
    }
  };

  // Load dashboard data with mock data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userProfile || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log('🏥 Loading doctor dashboard...');
        
        // Mock comprehensive data for demo
        const mockPatients: Patient[] = [
          {
            id: 'PAT001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            age: 45,
            gender: 'male',
            phoneNumber: '+1234567890',
            allergies: ['Penicillin'],
            medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
            address: '123 Main St, Anytown, USA',
            profileComplete: true,
            cart: [],
            vitals: {
              bloodPressure: '120/80',
              heartRate: 75,
              temperature: 98.6,
              weight: 180,
              height: 72
            }
          },
          {
            id: 'PAT002',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            age: 32,
            gender: 'female',
            phoneNumber: '+1234567891',
            allergies: [],
            medicalHistory: ['Asthma'],
            address: '456 Oak Ave, Anytown, USA',
            profileComplete: true,
            cart: [],
            vitals: {
              bloodPressure: '115/75',
              heartRate: 70,
              temperature: 98.4,
              weight: 135,
              height: 65
            }
          },
          {
            id: 'PAT003',
            name: 'Robert Johnson',
            email: 'robert.j@example.com',
            age: 58,
            gender: 'male',
            phoneNumber: '+1234567892',
            allergies: ['Sulfa drugs'],
            medicalHistory: ['Heart Disease', 'High Cholesterol'],
            address: '789 Pine Ln, Anytown, USA',
            profileComplete: true,
            cart: [],
            vitals: {
              bloodPressure: '140/90',
              heartRate: 80,
              temperature: 98.5,
              weight: 200,
              height: 70
            }
          }
        ];

        const mockMedications: Medication[] = [
          { id: '1', name: 'Amoxicillin 500mg', type: 'antibiotic', category: 'Penicillins', dosage: '500mg', price: 25.99, stock: 100, manufacturer: 'PharmaCo', expiryDate: '2026-12-31', requiresPrescription: true, sideEffects: ['Nausea', 'Diarrhea'] },
          { id: '2', name: 'Ciprofloxacin 250mg', type: 'antibiotic', category: 'Quinolones', dosage: '250mg', price: 35.50, stock: 50, manufacturer: 'MediLabs', expiryDate: '2026-06-30', requiresPrescription: true, sideEffects: ['Dizziness', 'Headache'] },
          { id: '3', name: 'Azithromycin 250mg', type: 'antibiotic', category: 'Macrolides', dosage: '250mg', price: 30.00, stock: 75, manufacturer: 'HealthCorp', expiryDate: '2026-09-15', requiresPrescription: true, sideEffects: ['Stomach upset', 'Diarrhea'] },
          { id: '4', name: 'Paracetamol 500mg', type: 'general', category: 'Analgesic', dosage: '500mg', price: 10.00, stock: 200, manufacturer: 'HealthWell', expiryDate: '2027-08-15', requiresPrescription: false, sideEffects: ['Rare skin rashes'] },
          { id: '5', name: 'Ibuprofen 200mg', type: 'general', category: 'NSAID', dosage: '200mg', price: 12.50, stock: 150, manufacturer: 'PainFree', expiryDate: '2027-05-20', requiresPrescription: false, sideEffects: ['Stomach upset'] }
        ];

        // Fetch audit logs from backend
        let auditLogs: AuditLog[] = [];
        try {
          const auditResponse = await api.get('/audit-logs');
          auditLogs = auditResponse.data || [];
          console.log('✅ Audit logs loaded:', auditLogs.length);
        } catch (auditError) {
          console.log('No audit logs available yet:', auditError);
          auditLogs = [];
        }

        setDashboardData({
          patients: mockPatients,
          availableMedications: mockMedications,
          prescriptions: [],
          auditLogs: auditLogs,
          labResults: [],
          guidelines: [],
          notifications: [],
          performanceMetrics: null,
        });

        // Fetch lab reports assigned to this doctor (don't wait for it)
        console.log('📞 Calling fetchLabReports...');
        fetchLabReports().catch(err => {
          console.log('Lab reports fetch failed (non-critical):', err);
        });

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userProfile, user]);

  // Add comment to prevent duplicate functions - all lab report functions are defined above useEffect

  // Add comment to report
  const handleAddCommentToReport = async (reportId: string, comment: string) => {
    try {
      await api.post(`/lab-reports/${reportId}/add-comment`, { comment });
      
      // Update local state
      setLabReports(labReports.map(r => 
        r.id === reportId ? { ...r, doctorComments: comment } : r
      ));
      
      alert('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const { patients, prescriptions, labResults, auditLogs, guidelines, notifications, performanceMetrics, availableMedications } = dashboardData;
  
  // NOW we can have conditional returns
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    console.error('No user or profile found:', { user, userProfile });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
          <p className="text-lg text-gray-600">Unable to load doctor profile.</p>
          <p className="text-sm text-gray-500">Please try logging in again.</p>
          <button 
            onClick={() => window.location.href = '/login/doctor'} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Helper functions
  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientProfileModal(true);
  };

  const handlePrescribe = (patientId: string, medication: Medication) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setShowPrescriptionModal(true);
    }
  };

  const addMedicationToPrescription = (medication: Medication, quantity: number) => {
    if (quantity <= 0) return;

    // WHO Guidelines Validation for Antibiotics
    if (medication.type === 'antibiotic') {
      // Check if frequency and duration are provided
      if (!prescriptionForm.frequency || !prescriptionForm.duration) {
        alert('⚠️ Please enter frequency and duration before adding antibiotics.\n\nExample:\nFrequency: "3 times daily"\nDuration: "7 days"');
        return;
      }

      const validation = validateAntibioticDosage(
        medication.name,
        quantity,
        prescriptionForm.frequency,
        prescriptionForm.duration
      );

      // Show warnings if any exist
      if (validation.warnings.length > 0) {
        const warningMessages = validation.warnings.map(w => w.message).join('\n\n');
        
        // Check for critical warnings
        const hasCritical = validation.warnings.some(w => w.severity === 'critical');
        const hasWarning = validation.warnings.some(w => w.severity === 'warning');
        
        // For critical warnings, play alert sound and require confirmation
        if (hasCritical) {
          playAlertSound();
          
          const proceed = window.confirm(
            `🚨 WHO ANTIBIOTIC GUIDELINES - CRITICAL ALERT\n\n${warningMessages}\n\n` +
            `This prescription may pose a significant risk to patient safety.\n\n` +
            `Do you want to proceed anyway? This will be logged for review.`
          );

          if (!proceed) {
            alert('✓ Prescription cancelled. Please review dosage and try again.');
            return; // Block the medication from being added
          }
        } 
        // For warning level, show alert but allow to proceed
        else if (hasWarning) {
          const proceed = window.confirm(
            `⚠️ WHO ANTIBIOTIC GUIDELINES - WARNING\n\n${warningMessages}\n\n` +
            `Consider reviewing the dosage. Do you want to proceed?`
          );

          if (!proceed) {
            return; // Allow cancellation
          }
        }
        // For info level, just log
        else {
          console.log('WHO Guidelines Info:', warningMessages);
        }
      }
    }

    const prescriptionMed = {
      medicationId: medication.id,
      medicationName: medication.name,
      dosage: medication.dosage,
      quantity: quantity,
      instructions: `Take as prescribed by doctor`,
      isAntibiotic: medication.type === 'antibiotic',
      // Include full medication object for PDF generation
      medication: {
        id: medication.id,
        name: medication.name,
        dosage: medication.dosage,
        type: medication.type,
        price: medication.price
      }
    };

    setPrescriptionForm(prev => ({
      ...prev,
      medications: [...prev.medications, prescriptionMed]
    }));

    // Log audit event for medication addition
    if (selectedPatient) {
      logAuditEvent(
        'MEDICATION_ADDED',
        'Prescription',
        `MED-${medication.id}`,
        selectedPatient.name || 'Unknown Patient',
        `Added ${medication.name}`,
        {
          medicationName: medication.name,
          dosage: medication.dosage,
          frequency: prescriptionForm.frequency || 'Not set',
          duration: prescriptionForm.duration || 'Not set',
          diagnosis: prescriptionForm.diagnosis || 'N/A',
          symptoms: prescriptionForm.symptoms || 'N/A',
          route: prescriptionForm.route
        }
      );
    }

    // Show success message with WHO compliance info for antibiotics
    if (medication.type === 'antibiotic') {
      const guideline = getGuidelineInfo(medication.name);
      if (guideline) {
        alert(
          `✓ ${medication.name} added to prescription\n\n` +
          `WHO AWaRe Category: ${guideline.awaReCategory}\n` +
          `Recommended Daily: ${guideline.recommendedDosage}mg\n` +
          `Max Duration: ${guideline.maxDuration} days\n` +
          `Indications: ${guideline.indications.join(', ')}`
        );
      } else {
        alert(`✓ ${medication.name} added to prescription\n\nNote: No WHO guidelines available for this antibiotic.`);
      }
    }
  };

  const removeMedicationFromPrescription = (medicationId: string) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.medicationId !== medicationId)
    }));
  };

  // Enhanced Patient Tracking Handler Functions
  const handleAddNote = () => {
    if (!selectedPatient || !newNote.trim()) return;
    
    const note = {
      id: `NOTE-${Date.now()}`,
      patientId: selectedPatient.id,
      content: newNote,
      timestamp: new Date().toISOString(),
      doctor: doctor?.name || 'Unknown Doctor'
    };
    
    setPatientNotes(prev => ({
      ...prev,
      [selectedPatient.id]: [...(prev[selectedPatient.id] || []), note]
    }));
    
    // Log audit event for note added
    logAuditEvent(
      'PATIENT_NOTE_ADDED',
      'Patient Vitals',
      note.id,
      selectedPatient.name || 'Unknown Patient',
      `Doctor note added`,
      {
        diagnosis: newNote.substring(0, 100)
      }
    );
    
    setNewNote('');
    alert('Note added successfully!');
  };

  const handleRecordVitals = () => {
    if (!selectedPatient) return;
    
    const vitalsRecord = {
      id: `VITALS-${Date.now()}`,
      patientId: selectedPatient.id,
      ...newVitals,
      timestamp: new Date().toISOString(),
      recordedBy: doctor?.name || 'Unknown Doctor'
    };
    
    setPatientVisits(prev => ({
      ...prev,
      [selectedPatient.id]: [...(prev[selectedPatient.id] || []), vitalsRecord]
    }));
    
    // Log audit event for vitals recording
    logAuditEvent(
      'PATIENT_VITALS_RECORDED',
      'Patient Vitals',
      vitalsRecord.id,
      selectedPatient.name || 'Unknown Patient',
      'Patient vitals recorded',
      {
        diagnosis: `BP: ${newVitals.bloodPressure}, HR: ${newVitals.heartRate}`,
        symptoms: `Temp: ${newVitals.temperature}°C, Weight: ${newVitals.weight}kg, Height: ${newVitals.height}cm`
      }
    );
    
    setNewVitals({
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
      oxygenSaturation: '',
      respiratoryRate: ''
    });
    
    setShowVitalsModal(false);
    alert('Vitals recorded successfully!');
  };

  const handleScheduleAppointment = (appointmentData: any) => {
    if (!selectedPatient) return;
    
    const appointment = {
      id: `APPT-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: doctor?.id || 'unknown',
      doctorName: doctor?.name || 'Unknown Doctor',
      date: appointmentData.date,
      time: appointmentData.time,
      reason: appointmentData.reason,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    
    setAppointments(prev => [...prev, appointment]);
    setShowAppointmentModal(false);
    alert('Appointment scheduled successfully!');
  };

  const handleAddPatient = async () => {
    // Validate required fields
    if (!newPatientForm.name || !newPatientForm.email || !newPatientForm.phone) {
      alert('Please fill in all required fields: Name, Email, and Phone');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newPatientForm.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate phone format (basic validation)
    if (newPatientForm.phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      // Calculate age from date of birth if provided
      let calculatedAge = parseInt(newPatientForm.age) || 0;
      if (newPatientForm.dateOfBirth && !newPatientForm.age) {
        const birthDate = new Date(newPatientForm.dateOfBirth);
        const today = new Date();
        calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
      }

      // Prepare patient data for backend
      const patientData = {
        name: newPatientForm.name,
        email: newPatientForm.email,
        phone: newPatientForm.phone,
        age: calculatedAge,
        dateOfBirth: newPatientForm.dateOfBirth || undefined,
        gender: newPatientForm.gender,
        bloodType: newPatientForm.bloodType || undefined,
        address: newPatientForm.address || undefined,
        emergencyContact: newPatientForm.emergencyContact || undefined,
        emergencyPhone: newPatientForm.emergencyPhone || undefined,
        medicalHistory: newPatientForm.medicalHistory ? newPatientForm.medicalHistory.split(',').map(item => item.trim()) : [],
        allergies: newPatientForm.allergies ? newPatientForm.allergies.split(',').map(item => item.trim()) : [],
        currentMedications: newPatientForm.currentMedications || undefined,
        insuranceProvider: newPatientForm.insuranceProvider || undefined,
        insuranceNumber: newPatientForm.insuranceNumber || undefined
      };

      // Register patient via API
      const response = await api.post('/auth/register-patient', patientData);
      
      if (response.data) {
        // Create a new patient object for local state
        const newPatient: Patient = {
          id: response.data.patient?.id || `PAT-${Date.now()}`,
          name: newPatientForm.name,
          email: newPatientForm.email,
          age: calculatedAge,
          gender: newPatientForm.gender,
          phoneNumber: newPatientForm.phone,
          allergies: patientData.allergies,
          medicalHistory: patientData.medicalHistory,
          address: newPatientForm.address,
          profileComplete: true,
          cart: []
        };

        // Update dashboard data with new patient
        setDashboardData(prev => ({
          ...prev,
          patients: [...prev.patients, newPatient]
        }));

        // Log audit event for patient creation
        await logAuditEvent(
          'CREATE',
          'Patient Profile',
          newPatient.id,
          newPatient.name || 'Unknown Patient',
          `New patient profile created`,
          {
            diagnosis: `Age: ${calculatedAge}, Gender: ${newPatientForm.gender}`,
            symptoms: newPatientForm.medicalHistory || 'No medical history provided'
          }
        );

        // Reset form and close modal
        setNewPatientForm({
          name: '',
          email: '',
          phone: '',
          age: '',
          dateOfBirth: '',
          gender: 'male',
          bloodType: '',
          address: '',
          emergencyContact: '',
          emergencyPhone: '',
          medicalHistory: '',
          allergies: '',
          currentMedications: '',
          insuranceProvider: '',
          insuranceNumber: ''
        });
        setShowAddPatientModal(false);
        
        alert(`✅ Patient "${newPatient.name}" added successfully!\n\nYou can now view their profile and create prescriptions.`);
      }
    } catch (error: any) {
      console.error('Error adding patient:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to add patient';
      alert(`❌ Error: ${errorMessage}\n\nPlease try again or contact support.`);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPatients = () => {
    let filtered = filteredPatients;
    
    switch (patientFilter) {
      case 'critical':
        // Filter patients with critical vitals (high BP, etc.)
        filtered = filtered.filter(p => {
          if (!p.vitals) return false;
          const bpSystolic = parseInt(p.vitals.bloodPressure?.split('/')[0] || '0');
          return bpSystolic > 140 || (p.vitals.heartRate && p.vitals.heartRate > 100);
        });
        break;
      case 'follow-up':
        // Filter patients with appointments
        filtered = filtered.filter(p => 
          appointments.some(a => a.patientId === p.id && a.status === 'scheduled')
        );
        break;
      case 'recent':
        // Filter patients with recent visits
        filtered = filtered.filter(p => patientVisits[p.id]?.length > 0);
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const getPatientStatus = (patient: Patient): 'critical' | 'follow-up' | 'normal' => {
    if (patient.vitals) {
      const bpSystolic = parseInt(patient.vitals.bloodPressure?.split('/')[0] || '0');
      if (bpSystolic > 140 || (patient.vitals.heartRate && patient.vitals.heartRate > 100)) return 'critical';
    }
    
    const hasFollowUp = appointments.some(a => 
      a.patientId === patient.id && a.status === 'scheduled'
    );
    if (hasFollowUp) return 'follow-up';
    
    return 'normal';
  };

  const handleCaptureSignature = () => {
    setShowSignatureModal(true);
  };

  const handleSignatureSave = (signature: string) => {
    setDigitalSignature(signature);
    setShowSignatureModal(false);
  };

  const handleGeneratePDF = async () => {
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      // Create properly structured medications for PDF generation
      const structuredMedications: PrescribedMedication[] = prescriptionForm.medications.map(med => {
        const medication = availableMedications.find(m => m.id === med.medicationId);
        return {
          id: `PM-${Date.now()}-${med.medicationId}`,
          patient: selectedPatient,
          medication: medication!,
          dosage: med.dosage,
          frequency: prescriptionForm.frequency || 'As directed',
          duration: prescriptionForm.duration || '7 days',
          quantity: med.quantity,
          prescriptionDate: new Date().toISOString(),
          dispensed: false,
          route: prescriptionForm.route,
          indication: prescriptionForm.indication || prescriptionForm.diagnosis,
          isAntibiotic: med.isAntibiotic
        };
      });

      // Create a mock prescription object for PDF generation
      const mockPrescription: Prescription = {
        id: `RX-${Date.now()}`,
        patientId: selectedPatient.id,
        doctorId: doctor?.id || 'unknown',
        doctorName: doctor?.name || 'Unknown Doctor',
        medications: structuredMedications,
        diagnosis: prescriptionForm.diagnosis,
        symptoms: prescriptionForm.symptoms ? [prescriptionForm.symptoms] : [],
        notes: prescriptionForm.notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const signatureData = digitalSignature ? {
        doctorName: doctor?.name || 'Unknown Doctor',
        licenseNumber: doctor?.licenseNumber || 'N/A',
        signatureDate: new Date().toLocaleDateString(),
        digitalCertificate: digitalSignature
      } : undefined;

      await PrescriptionPDFGenerator.generatePrescriptionPDF(
        mockPrescription,
        selectedPatient,
        doctor!,
        signatureData
      );

      alert('Prescription PDF generated successfully!');
      setShowPrescriptionModal(false);
      setPrescriptionForm({
        diagnosis: '',
        symptoms: '',
        medications: [],
        notes: '',
        indication: '',
        route: 'Oral',
        frequency: '',
        duration: ''
      });
      setDigitalSignature(null);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const exportAuditLogCSV = () => {
    if (!auditLogs || auditLogs.length === 0) {
      alert('No audit logs to export');
      return;
    }

    const csvHeaders = ['Date', 'Time', 'Action', 'Patient', 'Doctor', 'Details'];
    const csvRows = auditLogs.map(log => {
      const eventDate = new Date(log.eventTime);
      const date = eventDate.toLocaleDateString();
      const time = eventDate.toLocaleTimeString();
      
      return [
        date,
        time,
        log.action.replace(/_/g, ' '),
        log.patientName || 'N/A',
        log.doctorName || 'N/A',
        `"${(log.details || 'No details').replace(/"/g, '""')}"` // Escape quotes in CSV
      ];
    });

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Audit Log Helper Function - Comprehensive logging for all doctor activities
  const logAuditEvent = async (
    action: 'PATIENT_SELECTED' | 'MEDICATION_ADDED' | 'PRESCRIPTION_SAVED' | 'PATIENT_VITALS_RECORDED' | 'PATIENT_NOTE_ADDED' | 'CREATE' | 'UPDATE' | 'REVIEW' | 'STOP' | 'OVERRIDE' | 'DELETE',
    entity: 'PRESCRIPTION' | 'ANTIBIOTIC' | 'Patient' | 'Patient Profile' | 'Patient Vitals' | 'Prescription',
    entityId: string,
    patientName: string,
    details: string,
    additionalData?: {
      medicationName?: string;
      dosage?: string;
      frequency?: string;
      duration?: string;
      diagnosis?: string;
      symptoms?: string;
      route?: 'Oral' | 'IV' | 'IM' | 'Topical' | 'Subcutaneous' | 'Inhalation';
    }
  ) => {
    try {
      const timestamp = new Date().toISOString();
      const entryHash = `${action}-${entityId}-${Date.now()}`;
      
      // Build detailed description
      let fullDetails = details;
      if (additionalData) {
        const parts = [];
        if (additionalData.medicationName) parts.push(`Medication: ${additionalData.medicationName}`);
        if (additionalData.dosage) parts.push(`Dosage: ${additionalData.dosage}`);
        if (additionalData.frequency) parts.push(`Frequency: ${additionalData.frequency}`);
        if (additionalData.duration) parts.push(`Duration: ${additionalData.duration}`);
        if (additionalData.diagnosis) parts.push(`Diagnosis: ${additionalData.diagnosis}`);
        if (additionalData.symptoms) parts.push(`Symptoms: ${additionalData.symptoms}`);
        
        if (parts.length > 0) {
          fullDetails = `${details} | ${parts.join(' | ')}`;
        }
      }
      
      const auditLog: AuditLog = {
        id: entryHash,
        eventTime: timestamp,
        doctorId: doctor?.id || 'unknown',
        doctorName: doctor?.name || 'Unknown Doctor',
        action: action as AuditLog['action'],
        entity: entity as AuditLog['entity'],
        entityId,
        details: fullDetails,
        entryHash,
        patientName,
        route: additionalData?.route || 'N/A'
      };

      // Send to backend
      const response = await api.post('/audit-logs', auditLog);
      console.log('✅ Audit logged successfully:', response.data);
      
      // Update local state immediately
      setDashboardData(prev => ({
        ...prev,
        auditLogs: [auditLog, ...prev.auditLogs].slice(0, 100) // Keep last 100 logs
      }));
      
      console.log('✅ Audit event recorded:', { 
        action, 
        entity, 
        patientName, 
        doctorName: doctor?.name,
        timestamp 
      });
    } catch (error) {
      console.error('❌ Failed to log audit event:', error);
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Patients</p>
          <p className="text-2xl font-bold">{patients.length}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-green-100 p-3 rounded-full mr-4">
          <Pill className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Prescriptions Today</p>
          <p className="text-2xl font-bold">{prescriptions.length}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-yellow-100 p-3 rounded-full mr-4">
          <ShieldCheck className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Compliance Rate</p>
          <p className="text-2xl font-bold">92%</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-red-100 p-3 rounded-full mr-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">Resistance Alerts</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div>
      {/* Header with Add Patient Button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Patients</h2>
        <button
          onClick={() => setShowAddPatientModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors font-medium shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Patient
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setPatientFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            patientFilter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          All Patients ({patients.length})
        </button>
        <button
          onClick={() => setPatientFilter('critical')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            patientFilter === 'critical' 
              ? 'bg-red-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <AlertTriangle className="h-4 w-4 inline mr-2" />
          Critical
        </button>
        <button
          onClick={() => setPatientFilter('follow-up')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            patientFilter === 'follow-up' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Calendar className="h-4 w-4 inline mr-2" />
          Follow-up
        </button>
        <button
          onClick={() => setPatientFilter('recent')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            patientFilter === 'recent' 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <History className="h-4 w-4 inline mr-2" />
          Recent Visits
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {getFilteredPatients().map(patient => {
          const status = getPatientStatus(patient);
          const notesCount = patientNotes[patient.id]?.length || 0;
          const visitsCount = patientVisits[patient.id]?.length || 0;
          
          return (
            <div 
              key={patient.id} 
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${
                status === 'critical' ? 'border-red-500' : 
                status === 'follow-up' ? 'border-yellow-500' : 
                'border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full mr-3 ${
                    status === 'critical' ? 'bg-red-100' : 
                    status === 'follow-up' ? 'bg-yellow-100' : 
                    'bg-blue-100'
                  }`}>
                    <User className={`h-6 w-6 ${
                      status === 'critical' ? 'text-red-600' : 
                      status === 'follow-up' ? 'text-yellow-600' : 
                      'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <p className="text-sm text-gray-500">{patient.age} years • {patient.gender}</p>
                  </div>
                </div>
                {status === 'critical' && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                    CRITICAL
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{patient.phoneNumber}</span>
                </div>
                {patient.vitals && (
                  <div className="flex items-center text-gray-600">
                    <Heart className="h-4 w-4 mr-2" />
                    <span>BP: {patient.vitals.bloodPressure} | HR: {patient.vitals.heartRate}</span>
                  </div>
                )}
                
                {/* Patient Stats */}
                <div className="flex items-center gap-4 pt-2 border-t mt-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <ClipboardList className="h-3 w-3 mr-1" />
                    {notesCount} notes
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Activity className="h-3 w-3 mr-1" />
                    {visitsCount} visits
                  </div>
                </div>
              </div>
              
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-red-600 mb-1">Allergies:</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.map((allergy, idx) => (
                      <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowPatientProfileModal(true);
                  }}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowPrescriptionModal(true);
                  }}
                  className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Prescribe
                </button>
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowPatientNotesModal(true);
                  }}
                  className="px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 flex items-center justify-center"
                >
                  <ClipboardList className="h-4 w-4 mr-1" />
                  Add Note
                </button>
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowVitalsModal(true);
                  }}
                  className="px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 flex items-center justify-center"
                >
                  <Activity className="h-4 w-4 mr-1" />
                  Vitals
                </button>
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowAppointmentModal(true);
                  }}
                  className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 flex items-center justify-center"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                </button>
                <button
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowVisitHistoryModal(true);
                  }}
                  className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 flex items-center justify-center"
                >
                  <History className="h-4 w-4 mr-1" />
                  History
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {getFilteredPatients().length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">No patients found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'patients':
        return renderPatients();
      case 'lab-reports':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                    <p className="text-3xl font-bold text-gray-900">{labReportsStats.total}</p>
                  </div>
                  <FlaskConical className="h-12 w-12 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Unread Reports</p>
                    <p className="text-3xl font-bold text-orange-600">{labReportsStats.unread}</p>
                  </div>
                  <Eye className="h-12 w-12 text-orange-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-600">{labReportsStats.pending}</p>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Lab Investigation Reports</h3>
                    <p className="text-sm text-gray-600 mt-1">Reports sent to you by lab staff</p>
                  </div>
                  <button 
                    onClick={fetchLabReports}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {labReports.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {labReports.map((report) => (
                        <tr key={report.id} className={!report.viewedByDoctor ? 'bg-blue-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {!report.viewedByDoctor && report.sentToDoctor && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <span className="mr-1">🔴</span> New
                              </span>
                            )}
                            {report.viewedByDoctor && !report.downloadedByDoctor && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Eye className="h-3 w-3 mr-1" /> Viewed
                              </span>
                            )}
                            {report.downloadedByDoctor && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" /> Downloaded
                              </span>
                            )}
                            {!report.sentToDoctor && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <Clock className="h-3 w-3 mr-1" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.patientName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.testName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(report.uploadDate).toLocaleDateString()} {new Date(report.uploadDate).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.uploadedByName || report.uploadedBy}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button 
                              onClick={() => handleViewReport(report.id)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </button>
                            {report.fileUrl && (
                              <button 
                                onClick={() => handleDownloadReport(report.id)}
                                className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                              >
                                <Download className="h-4 w-4 mr-1" /> Download
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-16">
                    <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">No lab reports assigned yet</p>
                    <p className="text-gray-500 text-sm mt-2">Lab staff will send investigation reports to you here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'antibiotic-tracking':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Antibiotic Usage Tracking</h3>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Compliance: 92%</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Monitor antibiotic prescriptions and track resistance patterns.</p>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Active Prescriptions</p>
                      <p className="text-2xl font-bold text-blue-900">8</p>
                    </div>
                    <Pill className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Completed This Month</p>
                      <p className="text-2xl font-bold text-green-900">24</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Follow-up Required</p>
                      <p className="text-2xl font-bold text-yellow-900">3</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Active Antibiotic Prescriptions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 mb-3">Active Antibiotic Prescriptions</h4>
                {prescriptions.length > 0 ? (
                  prescriptions.map(presc => (
                    <div key={presc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {patients.find(p => p.id === presc.patientId)?.name || 'Unknown Patient'}
                          </p>
                          <p className="text-sm text-gray-600">{presc.diagnosis}</p>
                          <div className="mt-2 space-y-1">
                            {presc.medications.filter(m => m.isAntibiotic).map((med, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs mr-2">
                                  Antibiotic
                                </span>
                                <span className="text-gray-800">{med.medication.name} - {med.dosage}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            presc.status === 'completed' ? 'bg-green-100 text-green-800' :
                            presc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            presc.status === 'dispensed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {presc.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(presc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Pill className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No active antibiotic prescriptions</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resistance Alerts */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                Resistance Alerts
              </h4>
              <p className="text-sm text-gray-600">No resistance patterns detected in your prescriptions.</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Analytics Dashboard</h3>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                  <p className="text-sm opacity-90">Total Prescriptions</p>
                  <p className="text-3xl font-bold mt-1">127</p>
                  <p className="text-xs mt-2 opacity-75">↑ 12% from last month</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
                  <p className="text-sm opacity-90">Avg Response Time</p>
                  <p className="text-3xl font-bold mt-1">4.2h</p>
                  <p className="text-xs mt-2 opacity-75">↓ 8% improvement</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                  <p className="text-sm opacity-90">Patient Satisfaction</p>
                  <p className="text-3xl font-bold mt-1">4.8</p>
                  <p className="text-xs mt-2 opacity-75">Out of 5.0 stars</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg text-white">
                  <p className="text-sm opacity-90">Antibiotic Usage</p>
                  <p className="text-3xl font-bold mt-1">18%</p>
                  <p className="text-xs mt-2 opacity-75">Within guidelines</p>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Prescription Trends
                  </h4>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p>Chart visualization coming soon</p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    Medication Categories
                  </h4>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p>Distribution chart coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'audit-log':
        return (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Daily Audit Log</h3>
                  <p className="text-sm text-gray-600 mt-2">Track all prescription activities and changes • Total Records: {auditLogs.length}</p>
                </div>
                <button 
                  onClick={exportAuditLogCSV}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors font-medium"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {auditLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Route</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {auditLogs.map((log, index) => {
                        const eventDate = new Date(log.eventTime);
                        const date = eventDate.toLocaleDateString();
                        const time = eventDate.toLocaleTimeString();
                        
                        return (
                          <tr key={log.id || index} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                                ${log.action === 'MEDICATION_ADDED' ? 'bg-green-100 text-green-800' : 
                                  log.action === 'PRESCRIPTION_SAVED' ? 'bg-purple-100 text-purple-800' : 
                                  log.action === 'PATIENT_VITALS_RECORDED' ? 'bg-yellow-100 text-yellow-800' : 
                                  log.action === 'PATIENT_NOTE_ADDED' ? 'bg-pink-100 text-pink-800' : 
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                {log.action.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium
                                ${log.route === 'IV' ? 'bg-red-100 text-red-800' : 
                                  log.route === 'IM' ? 'bg-orange-100 text-orange-800' : 
                                  log.route === 'Oral' ? 'bg-blue-100 text-blue-800' : 
                                  log.route === 'Topical' ? 'bg-green-100 text-green-800' : 
                                  log.route === 'Subcutaneous' ? 'bg-purple-100 text-purple-800' : 
                                  log.route === 'Inhalation' ? 'bg-teal-100 text-teal-800' : 
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                {log.route || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {log.patientName || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {log.doctorName || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate" title={log.details}>
                              {log.details || 'No details'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50">
                  <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">No audit logs available yet.</p>
                  <p className="text-gray-500 text-sm mt-2">Activities will be tracked and displayed here as doctors prescribe medications.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Performance Metrics</h3>
                  <p className="text-sm text-gray-600 mt-1">Track your performance and compliance</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>

              {/* Performance Score */}
              <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
                <p className="text-sm opacity-90">Overall Performance Score</p>
                <div className="flex items-baseline mt-2">
                  <p className="text-5xl font-bold">94</p>
                  <p className="text-2xl ml-2">/100</p>
                </div>
                <div className="mt-4 bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Prescription Accuracy</p>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">98%</p>
                  <div className="mt-2 flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+2% from last month</span>
                  </div>
                </div>

                <div className="border rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Antibiotic Stewardship</p>
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">92%</p>
                  <div className="mt-2 flex items-center text-xs text-blue-600">
                    <span>Guideline adherence</span>
                  </div>
                </div>

                <div className="border rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Patient Follow-ups</p>
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">87%</p>
                  <div className="mt-2 flex items-center text-xs text-gray-600">
                    <span>On-time completion rate</span>
                  </div>
                </div>

                <div className="border rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                    <Activity className="h-5 w-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">4.2h</p>
                  <div className="mt-2 flex items-center text-xs text-green-600">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    <span>Improved by 45min</span>
                  </div>
                </div>

                <div className="border rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Patient Satisfaction</p>
                    <Heart className="h-5 w-5 text-red-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">4.8</p>
                  <div className="mt-2 flex items-center text-xs text-yellow-600">
                    <span>⭐ Out of 5.0 stars</span>
                  </div>
                </div>

                <div className="border rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-600">Documentation Score</p>
                    <FileText className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">96%</p>
                  <div className="mt-2 flex items-center text-xs text-indigo-600">
                    <span>Complete & timely</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                Recent Achievements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                  <Award className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Antibiotic Guardian</p>
                    <p className="text-xs text-gray-600">90% stewardship compliance for 3 months</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <ShieldCheck className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Quality Champion</p>
                    <p className="text-xs text-gray-600">Zero prescription errors this quarter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'lumina-ai':
        return (
          <div className="w-full h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm">
            <LuminaAssistant 
              compact={false}
              patientInfo={selectedPatient ? {
                name: selectedPatient.name,
                age: selectedPatient.age,
                ageGroup: (selectedPatient.age ?? 0) > 65 ? 'elderly' : 'adult',
                allergies: selectedPatient.allergies
              } : undefined}
            />
          </div>
        );
      default:
        return renderOverview();
    }
  };

  // Simple dashboard render
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">AMS Dashboard</h2>
          <p className="text-sm text-gray-400">Dr. {doctor?.name || 'Unknown'}</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-left flex items-center px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <LayoutDashboard className="mr-3 h-5 w-5" /> Overview
          </button>
          <button onClick={() => setActiveTab('patients')} className={`w-full text-left flex items-center px-4 py-2 rounded-md ${activeTab === 'patients' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Users className="mr-3 h-5 w-5" /> Patients
          </button>
          <button onClick={() => setActiveTab('lab-reports')} className={`w-full text-left flex items-center px-4 py-2 rounded-md ${activeTab === 'lab-reports' ? 'bg-gray-700' : 'hover:bg-gray-700'} relative`}>
            <FlaskConical className="mr-3 h-5 w-5" /> Lab Reports
            {labReportsStats.unread > 0 && (
              <span className="absolute right-3 top-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {labReportsStats.unread}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('antibiotic-tracking')} className={`w-full text-left flex items-center px-4 py-2 rounded-md ${activeTab === 'antibiotic-tracking' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Pill className="mr-3 h-5 w-5" /> Antibiotic Tracking
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full text-left flex items-center px-4 py-2 rounded-md ${activeTab === 'analytics' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <BarChart className="mr-3 h-5 w-5" /> Analytics
          </button>
          <button onClick={() => setActiveTab('audit-log')} className={`w-full text-left flex items-center px-4 py-2 rounded-md ${activeTab === 'audit-log' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <FileText className="mr-3 h-5 w-5" /> Audit Log
          </button>
          <button onClick={() => setActiveTab('performance')} className={`w-full text-left flex items-center px-4 py-2 rounded-md ${activeTab === 'performance' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Award className="mr-3 h-5 w-5" /> Performance
          </button>
          <button onClick={() => setActiveTab('lumina-ai')} className={`w-full text-left flex items-center px-4 py-2 rounded-md ${activeTab === 'lumina-ai' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Lightbulb className="mr-3 h-5 w-5" /> Alt-X
          </button>
        </nav>
        <div className="px-6 py-4 border-t border-gray-700">
          <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'lumina-ai' ? 'Alt-X' : activeTab.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Notifications"
                >
                  <Bell className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{notifications.filter(n => !n.read).length}</span>
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-full ${
                                  notification.type === 'alert' ? 'bg-red-100' :
                                  notification.type === 'nudge' ? 'bg-yellow-100' :
                                  'bg-blue-100'
                                }`}>
                                  {notification.type === 'alert' ? <AlertTriangle className="h-5 w-5 text-red-600" /> :
                                   notification.type === 'nudge' ? <Lightbulb className="h-5 w-5 text-yellow-600" /> :
                                   <Bell className="h-5 w-5 text-blue-600" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900 capitalize">{notification.type}</p>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    {new Date(notification.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No notifications</p>
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Create Prescription for {selectedPatient.name}</h2>
              <button onClick={() => setShowPrescriptionModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Diagnosis and Symptoms */}
              <div>
                <div className="mb-4">
                  <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                  <input 
                    type="text" 
                    id="diagnosis" 
                    value={prescriptionForm.diagnosis} 
                    onChange={e => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                  <textarea 
                    id="symptoms" 
                    value={prescriptionForm.symptoms} 
                    onChange={e => setPrescriptionForm({...prescriptionForm, symptoms: e.target.value})} 
                    rows={3} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <input 
                      type="text" 
                      id="frequency" 
                      value={prescriptionForm.frequency} 
                      onChange={e => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})} 
                      placeholder="e.g., 3 times daily"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input 
                      type="text" 
                      id="duration" 
                      value={prescriptionForm.duration} 
                      onChange={e => setPrescriptionForm({...prescriptionForm, duration: e.target.value})} 
                      placeholder="e.g., 7 days"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
                    Administration Route <span className="text-red-500">*</span>
                  </label>
                  <select 
                    id="route" 
                    value={prescriptionForm.route} 
                    onChange={e => setPrescriptionForm({...prescriptionForm, route: e.target.value as 'Oral' | 'IV' | 'IM' | 'Topical'})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="Oral">💊 Oral (By Mouth)</option>
                    <option value="IV">💉 IV (Intravenous)</option>
                    <option value="IM">💉 IM (Intramuscular)</option>
                    <option value="Topical">🧴 Topical (Applied to Skin)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select how the medication should be administered
                  </p>
                </div>
              </div>

              {/* Medication Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Select Medications</h3>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2 bg-gray-50">
                  {availableMedications.map(med => (
                    <div key={med.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                      <div>
                        <p className="font-semibold">{med.name}</p>
                        {med.type === 'antibiotic' && <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Antibiotic</span>}
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="number" 
                          min="1"
                          placeholder="Qty"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                          onChange={(e) => setMedicationQuantities(prev => ({...prev, [med.id]: parseInt(e.target.value)}))}
                        />
                        <button 
                          onClick={() => addMedicationToPrescription(med, medicationQuantities[med.id] || 1)} 
                          className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Medications */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Prescribed Medications</h3>
              {prescriptionForm.medications.length > 0 ? (
                <ul className="border rounded-md divide-y">
                  {prescriptionForm.medications.map(med => (
                    <li key={med.medicationId} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{med.medicationName} <span className="text-sm text-gray-500">{med.dosage}</span></p>
                        <p className="text-sm text-gray-600">Quantity: {med.quantity}</p>
                      </div>
                      <button onClick={() => removeMedicationFromPrescription(med.medicationId)} className="text-red-500 hover:text-red-700">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-md">No medications added yet.</p>}
            </div>

            {/* Doctor's Notes */}
            <div className="mt-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Doctor's Notes (Optional)</label>
              <textarea 
                id="notes" 
                value={prescriptionForm.notes} 
                onChange={e => setPrescriptionForm({...prescriptionForm, notes: e.target.value})} 
                rows={3} 
                placeholder="Add any special instructions or notes for the patient..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleCaptureSignature}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  {digitalSignature ? 'Update Signature' : 'Add Signature'}
                </button>
                {digitalSignature && (
                  <span className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Signature captured
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowPrescriptionModal(false)} 
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-green-300 flex items-center"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate PDF
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    // Log audit event for prescription save with detailed information
                    if (selectedPatient) {
                      const medCount = prescriptionForm.medications.length;
                      const medDetails = prescriptionForm.medications
                        .map(m => `${m.medicationName} (${m.dosage})`)
                        .join(', ');
                      
                      logAuditEvent(
                        'PRESCRIPTION_SAVED',
                        'Prescription',
                        `PRES-${Date.now()}`,
                        selectedPatient.name || 'Unknown Patient',
                        `Prescription with ${medCount} medication(s) saved`,
                        {
                          diagnosis: prescriptionForm.diagnosis || 'N/A',
                          symptoms: prescriptionForm.symptoms || 'N/A',
                          medicationName: medDetails || 'None',
                          route: prescriptionForm.route
                        }
                      );
                    }
                    
                    alert('Prescription saved successfully!');
                    setShowPrescriptionModal(false);
                    setPrescriptionForm({
                      diagnosis: '',
                      symptoms: '',
                      medications: [],
                      notes: '',
                      indication: '',
                      route: 'Oral',
                      frequency: '',
                      duration: ''
                    });
                  }} 
                  disabled={false}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Save Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Profile Modal */}
      {showPatientProfileModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Patient Profile</h2>
              <button onClick={() => setShowPatientProfileModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-4 rounded-full mr-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{selectedPatient.name}</h3>
                  <p className="text-gray-600">{selectedPatient.age} years • {selectedPatient.gender}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Email</p>
                  <p className="text-gray-900">{selectedPatient.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Phone</p>
                  <p className="text-gray-900">{selectedPatient.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Age</p>
                  <p className="text-gray-900">{selectedPatient.age} years</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Gender</p>
                  <p className="text-gray-900 capitalize">{selectedPatient.gender}</p>
                </div>
              </div>

              {selectedPatient.vitals && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Latest Vitals</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Blood Pressure</p>
                      <p className="font-semibold">{selectedPatient.vitals.bloodPressure}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Heart Rate</p>
                      <p className="font-semibold">{selectedPatient.vitals.heartRate} bpm</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Weight</p>
                      <p className="font-semibold">{selectedPatient.vitals.weight} lbs</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((allergy, idx) => (
                      <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Medical History</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedPatient.medicalHistory.map((condition, idx) => (
                      <li key={idx} className="text-gray-900">{condition}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => {
                    setShowPatientProfileModal(false);
                    setShowPrescriptionModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Prescription
                </button>
                <button 
                  onClick={() => setShowPatientProfileModal(false)} 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital Signature Modal */}
      {showSignatureModal && doctor && (
        <DigitalSignatureCapture
          onSignatureCapture={handleSignatureSave}
          onClose={() => setShowSignatureModal(false)}
          doctorName={doctor.name}
          licenseNumber={doctor.licenseNumber}
        />
      )}

      {/* Patient Notes Modal */}
      {showPatientNotesModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Clinical Notes - {selectedPatient.name}</h2>
              <button onClick={() => setShowPatientNotesModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Add New Note */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add New Note</label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
                placeholder="Enter clinical observations, diagnosis updates, or treatment notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </button>
            </div>

            {/* Existing Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Previous Notes</h3>
              {patientNotes[selectedPatient.id]?.length > 0 ? (
                <div className="space-y-3">
                  {[...patientNotes[selectedPatient.id]].reverse().map(note => (
                    <div key={note.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-blue-600">{note.doctor}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(note.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-900">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No notes recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vitals Recording Modal */}
      {showVitalsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Record Vitals - {selectedPatient.name}</h2>
              <button onClick={() => setShowVitalsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                <input
                  type="text"
                  value={newVitals.bloodPressure}
                  onChange={(e) => setNewVitals({...newVitals, bloodPressure: e.target.value})}
                  placeholder="120/80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                <input
                  type="text"
                  value={newVitals.heartRate}
                  onChange={(e) => setNewVitals({...newVitals, heartRate: e.target.value})}
                  placeholder="75"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                <input
                  type="text"
                  value={newVitals.temperature}
                  onChange={(e) => setNewVitals({...newVitals, temperature: e.target.value})}
                  placeholder="98.6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                <input
                  type="text"
                  value={newVitals.weight}
                  onChange={(e) => setNewVitals({...newVitals, weight: e.target.value})}
                  placeholder="150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
                <input
                  type="text"
                  value={newVitals.height}
                  onChange={(e) => setNewVitals({...newVitals, height: e.target.value})}
                  placeholder="65"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
                <input
                  type="text"
                  value={newVitals.oxygenSaturation}
                  onChange={(e) => setNewVitals({...newVitals, oxygenSaturation: e.target.value})}
                  placeholder="98"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate</label>
                <input
                  type="text"
                  value={newVitals.respiratoryRate}
                  onChange={(e) => setNewVitals({...newVitals, respiratoryRate: e.target.value})}
                  placeholder="16"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowVitalsModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordVitals}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Vitals
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Scheduling Modal */}
      {showAppointmentModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Schedule Appointment</h2>
              <button onClick={() => setShowAppointmentModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <input
                  type="text"
                  value={selectedPatient.name}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="appointment-date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  id="appointment-time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  id="appointment-reason"
                  rows={3}
                  placeholder="Follow-up, check-up, lab results review, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const date = (document.getElementById('appointment-date') as HTMLInputElement).value;
                  const time = (document.getElementById('appointment-time') as HTMLInputElement).value;
                  const reason = (document.getElementById('appointment-reason') as HTMLTextAreaElement).value;
                  
                  if (date && time) {
                    handleScheduleAppointment({ date, time, reason });
                  } else {
                    alert('Please fill in date and time');
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visit History Modal */}
      {showVisitHistoryModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Visit History - {selectedPatient.name}</h2>
              <button onClick={() => setShowVisitHistoryModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Patient Timeline */}
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Upcoming Appointments
                </h3>
                {appointments.filter(a => a.patientId === selectedPatient.id).length > 0 ? (
                  <div className="space-y-2">
                    {appointments.filter(a => a.patientId === selectedPatient.id).map(apt => (
                      <div key={apt.id} className="border rounded-lg p-4 bg-blue-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{apt.reason || 'General Check-up'}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(apt.date).toLocaleDateString()} at {apt.time}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-4 bg-gray-50 rounded-lg text-center">
                    No upcoming appointments
                  </p>
                )}
              </div>

              {/* Visit Records */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
                  Vitals Records
                </h3>
                {patientVisits[selectedPatient.id]?.length > 0 ? (
                  <div className="space-y-3">
                    {[...patientVisits[selectedPatient.id]].reverse().map(visit => (
                      <div key={visit.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-medium text-green-600">{visit.recordedBy}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(visit.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          {visit.bloodPressure && (
                            <div>
                              <p className="text-gray-600">BP</p>
                              <p className="font-semibold">{visit.bloodPressure}</p>
                            </div>
                          )}
                          {visit.heartRate && (
                            <div>
                              <p className="text-gray-600">HR</p>
                              <p className="font-semibold">{visit.heartRate} bpm</p>
                            </div>
                          )}
                          {visit.temperature && (
                            <div>
                              <p className="text-gray-600">Temp</p>
                              <p className="font-semibold">{visit.temperature}°F</p>
                            </div>
                          )}
                          {visit.oxygenSaturation && (
                            <div>
                              <p className="text-gray-600">SpO2</p>
                              <p className="font-semibold">{visit.oxygenSaturation}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-4 bg-gray-50 rounded-lg text-center">
                    No vitals recorded yet
                  </p>
                )}
              </div>

              {/* Clinical Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-purple-600" />
                  Clinical Notes
                </h3>
                {patientNotes[selectedPatient.id]?.length > 0 ? (
                  <div className="space-y-2">
                    {[...patientNotes[selectedPatient.id]].reverse().slice(0, 5).map(note => (
                      <div key={note.id} className="border rounded-lg p-3 bg-purple-50">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium text-purple-600">{note.doctor}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(note.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">{note.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-4 bg-gray-50 rounded-lg text-center">
                    No clinical notes recorded
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Add New Patient</h2>
                <p className="text-sm text-gray-600 mt-1">Fill in the patient details to create a new profile</p>
              </div>
              <button 
                onClick={() => setShowAddPatientModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddPatient(); }} className="space-y-6">
              {/* Basic Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newPatientForm.name}
                      onChange={(e) => setNewPatientForm({...newPatientForm, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={newPatientForm.email}
                      onChange={(e) => setNewPatientForm({...newPatientForm, email: e.target.value})}
                      placeholder="john.doe@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={newPatientForm.phone}
                      onChange={(e) => setNewPatientForm({...newPatientForm, phone: e.target.value})}
                      placeholder="+1234567890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={newPatientForm.gender}
                      onChange={(e) => setNewPatientForm({...newPatientForm, gender: e.target.value as 'male' | 'female' | 'other'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={newPatientForm.dateOfBirth}
                      onChange={(e) => setNewPatientForm({...newPatientForm, dateOfBirth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={newPatientForm.age}
                      onChange={(e) => setNewPatientForm({...newPatientForm, age: e.target.value})}
                      placeholder="30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                    <select
                      value={newPatientForm.bloodType}
                      onChange={(e) => setNewPatientForm({...newPatientForm, bloodType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newPatientForm.address}
                      onChange={(e) => setNewPatientForm({...newPatientForm, address: e.target.value})}
                      placeholder="123 Main Street, City, State, ZIP"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-red-600" />
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={newPatientForm.emergencyContact}
                      onChange={(e) => setNewPatientForm({...newPatientForm, emergencyContact: e.target.value})}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={newPatientForm.emergencyPhone}
                      onChange={(e) => setNewPatientForm({...newPatientForm, emergencyPhone: e.target.value})}
                      placeholder="+1234567890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-600" />
                  Medical Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical History
                      <span className="text-gray-500 text-xs ml-2">(comma-separated)</span>
                    </label>
                    <textarea
                      value={newPatientForm.medicalHistory}
                      onChange={(e) => setNewPatientForm({...newPatientForm, medicalHistory: e.target.value})}
                      rows={3}
                      placeholder="Diabetes, Hypertension, Asthma"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies
                      <span className="text-gray-500 text-xs ml-2">(comma-separated)</span>
                    </label>
                    <textarea
                      value={newPatientForm.allergies}
                      onChange={(e) => setNewPatientForm({...newPatientForm, allergies: e.target.value})}
                      rows={2}
                      placeholder="Penicillin, Peanuts, Shellfish"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                    <textarea
                      value={newPatientForm.currentMedications}
                      onChange={(e) => setNewPatientForm({...newPatientForm, currentMedications: e.target.value})}
                      rows={2}
                      placeholder="Metformin 500mg, Lisinopril 10mg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
                  Insurance Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                    <input
                      type="text"
                      value={newPatientForm.insuranceProvider}
                      onChange={(e) => setNewPatientForm({...newPatientForm, insuranceProvider: e.target.value})}
                      placeholder="Blue Cross Blue Shield"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                    <input
                      type="text"
                      value={newPatientForm.insuranceNumber}
                      onChange={(e) => setNewPatientForm({...newPatientForm, insuranceNumber: e.target.value})}
                      placeholder="ABC123456789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 font-medium flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Adding Patient...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Patient
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
