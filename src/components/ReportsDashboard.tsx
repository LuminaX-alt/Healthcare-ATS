import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Upload, 
  Download, 
  Send, 
  Users, 
  Activity, 
  LogOut,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Stethoscope,
  FileCheck,
  History
} from 'lucide-react';
import api from '../api';

interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  reportType: string;
  testName: string;
  uploadDate: string;
  status: 'pending' | 'completed' | 'sent';
  uploadedBy: string;
  assignedDoctor: string;
  departmentId: string;
  fileUrl?: string;
  vitals?: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
    height: string;
    oxygenSaturation: string;
  };
  results?: any;
}

interface Department {
  id: string;
  name: string;
  doctors: { id: string; name: string; email: string; }[];
}

interface ReportsStaff {
  id: string;
  name: string;
  email: string;
  role: 'lab-assistant' | 'lab-technician' | 'radiologist';
}

const ReportsDashboard: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const staff = userProfile as any;

  const [activeTab, setActiveTab] = useState<'upload' | 'reports' | 'vitals' | 'audit-log'>('upload');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'sent'>('all');
  
  // Upload Report State
  const [uploadForm, setUploadForm] = useState({
    patientId: '',
    patientName: '',
    reportType: 'blood-test',
    testName: '',
    departmentId: '',
    assignedDoctor: '',
    notes: '',
    file: null as File | null
  });

  // Vitals Form State
  const [vitalsForm, setVitalsForm] = useState({
    patientId: '',
    patientName: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: '',
    respiratoryRate: ''
  });

  // Data State
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'dept-1',
      name: 'Cardiology',
      doctors: [
        { id: 'doc-1', name: 'Dr. Sarah Johnson', email: 'doctor@hospital.com' },
        { id: 'doc-2', name: 'Dr. Michael Chen', email: 'michael@hospital.com' }
      ]
    },
    {
      id: 'dept-2',
      name: 'Radiology',
      doctors: [
        { id: 'doc-3', name: 'Dr. Emily Davis', email: 'emily@hospital.com' }
      ]
    },
    {
      id: 'dept-3',
      name: 'Pathology',
      doctors: [
        { id: 'doc-4', name: 'Dr. James Wilson', email: 'james@hospital.com' }
      ]
    },
    {
      id: 'dept-4',
      name: 'General Medicine',
      doctors: []
    },
    {
      id: 'dept-5',
      name: 'Pediatrics',
      doctors: []
    },
    {
      id: 'dept-6',
      name: 'Orthopedics',
      doctors: []
    },
    {
      id: 'dept-7',
      name: 'Neurology',
      doctors: []
    },
    {
      id: 'dept-8',
      name: 'Dermatology',
      doctors: []
    },
    {
      id: 'dept-9',
      name: 'Ophthalmology',
      doctors: []
    },
    {
      id: 'dept-10',
      name: 'ENT (Ear, Nose & Throat)',
      doctors: []
    },
    {
      id: 'dept-11',
      name: 'Gastroenterology',
      doctors: []
    },
    {
      id: 'dept-12',
      name: 'Nephrology',
      doctors: []
    },
    {
      id: 'dept-13',
      name: 'Pulmonology',
      doctors: []
    },
    {
      id: 'dept-14',
      name: 'Endocrinology',
      doctors: []
    },
    {
      id: 'dept-15',
      name: 'Oncology',
      doctors: []
    },
    {
      id: 'dept-16',
      name: 'Gynecology & Obstetrics',
      doctors: []
    },
    {
      id: 'dept-17',
      name: 'Urology',
      doctors: []
    },
    {
      id: 'dept-18',
      name: 'Psychiatry',
      doctors: []
    },
    {
      id: 'dept-19',
      name: 'Anesthesiology',
      doctors: []
    },
    {
      id: 'dept-20',
      name: 'Emergency Medicine',
      doctors: []
    },
    {
      id: 'dept-21',
      name: 'Surgery',
      doctors: []
    },
    {
      id: 'dept-22',
      name: 'Intensive Care Unit (ICU)',
      doctors: []
    },
    {
      id: 'dept-23',
      name: 'Physical Therapy',
      doctors: []
    },
    {
      id: 'dept-24',
      name: 'Hematology',
      doctors: []
    },
    {
      id: 'dept-25',
      name: 'Rheumatology',
      doctors: []
    },
    {
      id: 'dept-26',
      name: 'Infectious Diseases',
      doctors: []
    },
    {
      id: 'dept-27',
      name: 'Clinical Laboratory',
      doctors: []
    },
    {
      id: 'dept-28',
      name: 'Nuclear Medicine',
      doctors: []
    },
    {
      id: 'dept-29',
      name: 'Plastic Surgery',
      doctors: []
    },
    {
      id: 'dept-30',
      name: 'Dental',
      doctors: []
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Fetch reports and doctors on mount
  useEffect(() => {
    fetchLabReports();
    fetchAuditLogs();
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      const doctors = response.data;

      console.log('📋 Fetched doctors from API:', doctors.length);

      // Group doctors by department - with comprehensive hospital departments
      const departmentMap: { [key: string]: Department } = {
        'Cardiology': { id: 'dept-1', name: 'Cardiology', doctors: [] },
        'Radiology': { id: 'dept-2', name: 'Radiology', doctors: [] },
        'Pathology': { id: 'dept-3', name: 'Pathology', doctors: [] },
        'General Medicine': { id: 'dept-4', name: 'General Medicine', doctors: [] },
        'Pediatrics': { id: 'dept-5', name: 'Pediatrics', doctors: [] },
        'Orthopedics': { id: 'dept-6', name: 'Orthopedics', doctors: [] },
        'Neurology': { id: 'dept-7', name: 'Neurology', doctors: [] },
        'Dermatology': { id: 'dept-8', name: 'Dermatology', doctors: [] },
        'Ophthalmology': { id: 'dept-9', name: 'Ophthalmology', doctors: [] },
        'ENT (Ear, Nose & Throat)': { id: 'dept-10', name: 'ENT (Ear, Nose & Throat)', doctors: [] },
        'Gastroenterology': { id: 'dept-11', name: 'Gastroenterology', doctors: [] },
        'Nephrology': { id: 'dept-12', name: 'Nephrology', doctors: [] },
        'Pulmonology': { id: 'dept-13', name: 'Pulmonology', doctors: [] },
        'Endocrinology': { id: 'dept-14', name: 'Endocrinology', doctors: [] },
        'Oncology': { id: 'dept-15', name: 'Oncology', doctors: [] },
        'Gynecology & Obstetrics': { id: 'dept-16', name: 'Gynecology & Obstetrics', doctors: [] },
        'Urology': { id: 'dept-17', name: 'Urology', doctors: [] },
        'Psychiatry': { id: 'dept-18', name: 'Psychiatry', doctors: [] },
        'Anesthesiology': { id: 'dept-19', name: 'Anesthesiology', doctors: [] },
        'Emergency Medicine': { id: 'dept-20', name: 'Emergency Medicine', doctors: [] },
        'Surgery': { id: 'dept-21', name: 'Surgery', doctors: [] },
        'Intensive Care Unit (ICU)': { id: 'dept-22', name: 'Intensive Care Unit (ICU)', doctors: [] },
        'Physical Therapy': { id: 'dept-23', name: 'Physical Therapy', doctors: [] },
        'Hematology': { id: 'dept-24', name: 'Hematology', doctors: [] },
        'Rheumatology': { id: 'dept-25', name: 'Rheumatology', doctors: [] },
        'Infectious Diseases': { id: 'dept-26', name: 'Infectious Diseases', doctors: [] },
        'Clinical Laboratory': { id: 'dept-27', name: 'Clinical Laboratory', doctors: [] },
        'Nuclear Medicine': { id: 'dept-28', name: 'Nuclear Medicine', doctors: [] },
        'Plastic Surgery': { id: 'dept-29', name: 'Plastic Surgery', doctors: [] },
        'Dental': { id: 'dept-30', name: 'Dental', doctors: [] },
        'Other': { id: 'dept-31', name: 'Other', doctors: [] }
      };

      doctors.forEach((doc: any) => {
        // FIX: Use department first (set by backend), then fall back to specialty
        const dept = doc.department || doc.specialization || doc.specialty || 'Other';
        
        console.log(`👨‍⚕️ Doctor: ${doc.name} → Department: ${dept}`);
        
        if (departmentMap[dept]) {
          departmentMap[dept].doctors.push({
            id: doc._id,
            name: doc.name,
            email: doc.email || `${doc.name.toLowerCase().replace(' ', '')}@hospital.com`
          });
        } else {
          // If department not in map, add to "Other"
          console.warn(`⚠️  Unknown department "${dept}" for ${doc.name}, adding to Other`);
          departmentMap['Other'].doctors.push({
            id: doc._id,
            name: doc.name,
            email: doc.email || `${doc.name.toLowerCase().replace(' ', '')}@hospital.com`
          });
        }
      });

      // Count total doctors across all departments
      const totalDoctors = Object.values(departmentMap).reduce((sum, dept) => sum + dept.doctors.length, 0);
      console.log(`✅ Grouped ${totalDoctors} doctors into departments`);

      // Update departments - keep all departments even if they have no doctors
      setDepartments(Object.values(departmentMap));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Keep default departments if API fails
    }
  };

  const fetchLabReports = async () => {
    try {
      const response = await api.get('/lab-reports');
      if (response.data.success) {
        setLabReports(response.data.reports);
      }
    } catch (error) {
      console.error('Error fetching lab reports:', error);
      // Show demo data on error
      setLabReports([
        {
          id: 'REP-001',
          patientId: 'PAT-001',
          patientName: 'John Doe',
          reportType: 'blood-test',
          testName: 'Complete Blood Count (CBC)',
          uploadDate: new Date().toISOString(),
          status: 'completed',
          uploadedBy: staff?.name || 'Lab Assistant',
          assignedDoctor: 'Dr. Sarah Johnson',
          departmentId: 'dept-1',
          vitals: {
            bloodPressure: '120/80',
            heartRate: '72',
            temperature: '98.6',
            weight: '70',
            height: '175',
            oxygenSaturation: '98'
          }
        }
      ]);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      // In production, fetch from API
      // const response = await api.get('/reports/audit-logs');
      // setAuditLogs(response.data);
      
      // Demo data
      setAuditLogs([
        {
          id: 'AUDIT-001',
          timestamp: new Date().toISOString(),
          action: 'REPORT_UPLOADED',
          staffName: staff?.name || 'Lab Assistant',
          patientName: 'John Doe',
          reportType: 'Blood Test',
          assignedDoctor: 'Dr. Sarah Johnson',
          details: 'CBC report uploaded successfully'
        }
      ]);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, file: e.target.files[0] });
    }
  };

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('patientId', uploadForm.patientId);
      formData.append('patientName', uploadForm.patientName);
      formData.append('reportType', uploadForm.reportType);
      formData.append('testName', uploadForm.testName);
      
      // Find department and doctor details
      const department = departments.find(d => d.id === uploadForm.departmentId);
      const doctor = department?.doctors.find(d => d.name === uploadForm.assignedDoctor);
      
      if (department) {
        formData.append('departmentId', department.id);
        formData.append('departmentName', department.name);
      }
      
      if (doctor) {
        formData.append('assignedDoctorId', doctor.id);
        formData.append('assignedDoctorName', doctor.name);
        formData.append('assignedDoctorEmail', doctor.email);
      }
      
      formData.append('notes', uploadForm.notes);
      
      if (uploadForm.file) {
        formData.append('file', uploadForm.file);
      }

      // Send to backend API
      const response = await api.post('/lab-reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Add to local state
        setLabReports([response.data.report, ...labReports]);

        // Log to audit
        const auditEntry = {
          id: `AUDIT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'REPORT_UPLOADED',
          staffName: staff?.name || 'Lab Assistant',
          patientName: uploadForm.patientName,
          reportType: uploadForm.testName,
          assignedDoctor: uploadForm.assignedDoctor,
          details: `${uploadForm.testName} uploaded and automatically sent to ${uploadForm.assignedDoctor}`
        };

        setAuditLogs([auditEntry, ...auditLogs]);
        await saveAuditToCSV(auditEntry);

        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);

        // Show success alert with doctor name
        alert(`✅ SUCCESS!\n\nReport uploaded and automatically sent to ${uploadForm.assignedDoctor}!\n\nThe doctor will be notified immediately.`);

        // Reset form
        setUploadForm({
          patientId: '',
          patientName: '',
          reportType: 'blood-test',
          testName: '',
          departmentId: '',
          assignedDoctor: '',
          notes: '',
          file: null
        });
      }
    } catch (error: any) {
      console.error('Error uploading report:', error);
      alert(error.response?.data?.msg || 'Failed to upload report. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecordVitals = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // In production, send to backend
      // await api.post('/reports/vitals', vitalsForm);

      const auditEntry = {
        id: `AUDIT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'VITALS_RECORDED',
        staffName: staff?.name || 'Lab Assistant',
        patientName: vitalsForm.patientName,
        reportType: 'Patient Vitals',
        assignedDoctor: 'N/A',
        details: `Vitals recorded: BP ${vitalsForm.bloodPressure}, HR ${vitalsForm.heartRate}, Temp ${vitalsForm.temperature}°F`
      };

      setAuditLogs([auditEntry, ...auditLogs]);
      await saveAuditToCSV(auditEntry);

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // Reset form
      setVitalsForm({
        patientId: '',
        patientName: '',
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: '',
        oxygenSaturation: '',
        respiratoryRate: ''
      });

      alert('Vitals recorded successfully!');
    } catch (error) {
      console.error('Error recording vitals:', error);
      alert('Failed to record vitals. Please try again.');
    }
  };

  const handleSendToDoctor = async (reportId: string) => {
    try {
      const report = labReports.find(r => r.id === reportId);
      if (!report) return;

      // Send via API
      const response = await api.post(`/lab-reports/${reportId}/send-to-doctor`);

      if (response.data.success) {
        // Update report status locally
        setLabReports(labReports.map(r => 
          r.id === reportId ? { ...r, status: 'sent' as const } : r
        ));

        // Log to audit
        const auditEntry = {
          id: `AUDIT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'REPORT_SENT_TO_DOCTOR',
          staffName: staff?.name || 'Lab Assistant',
          patientName: report.patientName,
          reportType: report.testName,
          assignedDoctor: report.assignedDoctor,
          details: `Report sent to ${report.assignedDoctor}`
        };

        setAuditLogs([auditEntry, ...auditLogs]);
        await saveAuditToCSV(auditEntry);

        alert(response.data.message || `Report sent to ${report.assignedDoctor} successfully!`);
      }
    } catch (error: any) {
      console.error('Error sending report:', error);
      alert(error.response?.data?.msg || 'Failed to send report. Please try again.');
    }
  };

  const saveAuditToCSV = async (auditEntry: any) => {
    try {
      // In production, save to backend
      // await api.post('/reports/audit-csv', auditEntry);
      
      console.log('Audit entry saved to CSV:', auditEntry);
    } catch (error) {
      console.error('Error saving audit to CSV:', error);
    }
  };

  const downloadAuditCSV = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Staff Name', 'Patient Name', 'Report Type', 'Assigned Doctor', 'Details'],
      ...auditLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.action,
        log.staffName,
        log.patientName,
        log.reportType,
        log.assignedDoctor,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reports_audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredReports = labReports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderUploadTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Upload className="mr-3 h-7 w-7 text-blue-600" />
        Upload Lab Report
      </h2>

      {showSuccessMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">Report uploaded and logged successfully!</span>
        </div>
      )}

      <form onSubmit={handleUploadReport} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient ID*
            </label>
            <input
              type="text"
              value={uploadForm.patientId}
              onChange={(e) => setUploadForm({ ...uploadForm, patientId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="PAT-001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name*
            </label>
            <input
              type="text"
              value={uploadForm.patientName}
              onChange={(e) => setUploadForm({ ...uploadForm, patientName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type*
            </label>
            <select
              value={uploadForm.reportType}
              onChange={(e) => setUploadForm({ ...uploadForm, reportType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="blood-test">Blood Test</option>
              <option value="x-ray">X-Ray</option>
              <option value="ct-scan">CT Scan</option>
              <option value="mri">MRI</option>
              <option value="ultrasound">Ultrasound</option>
              <option value="urine-test">Urine Test</option>
              <option value="pathology">Pathology Report</option>
              <option value="microbiology">Microbiology/Culture</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Name*
            </label>
            <input
              type="text"
              value={uploadForm.testName}
              onChange={(e) => setUploadForm({ ...uploadForm, testName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Complete Blood Count (CBC)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department*
            </label>
            <select
              value={uploadForm.departmentId}
              onChange={(e) => {
                console.log('Department selected:', e.target.value);
                const selectedDept = departments.find(d => d.id === e.target.value);
                console.log('Department doctors:', selectedDept?.doctors);
                setUploadForm({ ...uploadForm, departmentId: e.target.value, assignedDoctor: '' });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {departments.length} departments available
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Doctor* <span className="text-green-600 text-xs">(Report will be sent automatically)</span>
            </label>
            <select
              value={uploadForm.assignedDoctor}
              onChange={(e) => {
                console.log('Doctor selected:', e.target.value);
                setUploadForm({ ...uploadForm, assignedDoctor: e.target.value });
              }}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                !uploadForm.departmentId ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'
              }`}
              required
              disabled={!uploadForm.departmentId}
            >
              <option value="">
                {!uploadForm.departmentId ? 'First select a department' : 'Select Doctor'}
              </option>
              {uploadForm.departmentId && departments
                .find(d => d.id === uploadForm.departmentId)?.doctors
                ?.map(doc => (
                  <option key={doc.id} value={doc.name}>{doc.name} - {doc.email}</option>
                ))
              }
              {uploadForm.departmentId && departments.find(d => d.id === uploadForm.departmentId)?.doctors?.length === 0 && (
                <option value="" disabled>No doctors in this department</option>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {!uploadForm.departmentId && '⚠️ Please select a department first'}
              {uploadForm.departmentId && departments.find(d => d.id === uploadForm.departmentId)?.doctors && 
                `✅ ${departments.find(d => d.id === uploadForm.departmentId)?.doctors?.length || 0} doctor(s) available`}
              {uploadForm.departmentId && !uploadForm.assignedDoctor && ' - The selected doctor will receive this report immediately'}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Report File* (PDF, JPEG, PNG)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={uploadForm.notes}
            onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Additional notes or observations..."
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 disabled:bg-gray-400 flex items-center justify-center shadow-lg"
        >
          {isUploading ? (
            <>
              <Clock className="animate-spin h-5 w-5 mr-2" />
              Uploading & Sending to Doctor...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Upload & Send to Doctor Automatically
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-500 mt-2">
          ⚡ Reports are automatically sent to doctors upon upload - No additional action required!
        </p>
      </form>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by patient name or test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="sent">Sent to Doctor</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReports.map(report => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{report.patientName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{report.testName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{report.assignedDoctor}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(report.uploadDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    report.status === 'sent' ? 'bg-green-100 text-green-800' :
                    report.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status === 'sent' ? '✅ SENT TO DOCTOR' : report.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    className="text-green-600 hover:text-green-800"
                    title="View Report"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    title="Download PDF"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVitalsTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Activity className="mr-3 h-7 w-7 text-red-600" />
        Record Patient Vitals
      </h2>

      <form onSubmit={handleRecordVitals} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient ID*
            </label>
            <input
              type="text"
              value={vitalsForm.patientId}
              onChange={(e) => setVitalsForm({ ...vitalsForm, patientId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="PAT-001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name*
            </label>
            <input
              type="text"
              value={vitalsForm.patientName}
              onChange={(e) => setVitalsForm({ ...vitalsForm, patientName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Pressure* (mmHg)
            </label>
            <input
              type="text"
              value={vitalsForm.bloodPressure}
              onChange={(e) => setVitalsForm({ ...vitalsForm, bloodPressure: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="120/80"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heart Rate* (bpm)
            </label>
            <input
              type="number"
              value={vitalsForm.heartRate}
              onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="72"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature* (°F)
            </label>
            <input
              type="number"
              step="0.1"
              value={vitalsForm.temperature}
              onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="98.6"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={vitalsForm.weight}
              onChange={(e) => setVitalsForm({ ...vitalsForm, weight: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="70"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={vitalsForm.height}
              onChange={(e) => setVitalsForm({ ...vitalsForm, height: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="175"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oxygen Saturation (%)
            </label>
            <input
              type="number"
              value={vitalsForm.oxygenSaturation}
              onChange={(e) => setVitalsForm({ ...vitalsForm, oxygenSaturation: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="98"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Respiratory Rate (breaths/min)
            </label>
            <input
              type="number"
              value={vitalsForm.respiratoryRate}
              onChange={(e) => setVitalsForm({ ...vitalsForm, respiratoryRate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="16"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center"
        >
          <Activity className="h-5 w-5 mr-2" />
          Record Vitals
        </button>
      </form>
    </div>
  );

  const renderAuditLogTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <History className="mr-2 h-6 w-6 text-purple-600" />
          Reports Audit Log
        </h2>
        <button
          onClick={downloadAuditCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Download className="h-5 w-5 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    log.action === 'REPORT_UPLOADED' ? 'bg-blue-100 text-blue-800' :
                    log.action === 'VITALS_RECORDED' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {log.action.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{log.staffName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{log.patientName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{log.reportType}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{log.assignedDoctor}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center">
            <FileText className="h-8 w-8 mr-3" />
            <div>
              <h2 className="font-bold text-lg">Reports Portal</h2>
              <p className="text-sm text-gray-400">{staff?.name || 'Lab Staff'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`w-full text-left flex items-center px-4 py-2 rounded-md ${
              activeTab === 'upload' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <Upload className="mr-3 h-5 w-5" />
            Upload Report
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left flex items-center px-4 py-2 rounded-md ${
              activeTab === 'reports' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <FileCheck className="mr-3 h-5 w-5" />
            All Reports
          </button>

          <button
            onClick={() => setActiveTab('vitals')}
            className={`w-full text-left flex items-center px-4 py-2 rounded-md ${
              activeTab === 'vitals' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <Activity className="mr-3 h-5 w-5" />
            Record Vitals
          </button>

          <button
            onClick={() => setActiveTab('audit-log')}
            className={`w-full text-left flex items-center px-4 py-2 rounded-md ${
              activeTab === 'audit-log' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <History className="mr-3 h-5 w-5" />
            Audit Log
          </button>
        </nav>

        <div className="px-6 py-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {activeTab === 'upload' && 'Upload Lab Report'}
          {activeTab === 'reports' && 'All Lab Reports'}
          {activeTab === 'vitals' && 'Record Patient Vitals'}
          {activeTab === 'audit-log' && 'Audit Log'}
        </h1>

        {activeTab === 'upload' && renderUploadTab()}
        {activeTab === 'reports' && renderReportsTab()}
        {activeTab === 'vitals' && renderVitalsTab()}
        {activeTab === 'audit-log' && renderAuditLogTab()}
      </div>
    </div>
  );
};

export default ReportsDashboard;
