const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/lab-reports');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `report-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDF files are allowed!'));
  }
});

// Lab Report Schema (in-memory for now, can be moved to models)
let labReports = [];

// ✅ ADD DEMO REPORTS FOR TESTING
const createDemoReports = () => {
  if (labReports.length === 0) {
    console.log('🔬 Creating demo lab reports...');
    
    const demoReports = [
      {
        id: 'REP-DEMO-001',
        patientId: 'PAT-001',
        patientName: 'John Doe',
        reportType: 'blood-test',
        testName: 'Complete Blood Count (CBC)',
        departmentId: 'dept-1',
        departmentName: 'Cardiology',
        assignedDoctorId: 'doctor-1',
        assignedDoctorName: 'Dr. Sarah Johnson',
        assignedDoctorEmail: 'doctor@hospital.com',  // ✅ MATCHES DEMO DOCTOR
        notes: 'Routine blood test - all parameters normal',
        fileUrl: null,
        fileName: 'CBC_Report_JohnDoe.pdf',
        fileSize: null,
        uploadDate: new Date().toISOString(),
        status: 'sent',
        uploadedBy: 'reports-staff',
        uploadedByName: 'Lab Assistant',
        sentToDoctor: true,
        sentDate: new Date().toISOString(),
        viewedByDoctor: false,
        downloadedByDoctor: false,
        doctorComments: null
      },
      {
        id: 'REP-DEMO-002',
        patientId: 'PAT-002',
        patientName: 'Jane Smith',
        reportType: 'x-ray',
        testName: 'Chest X-Ray',
        departmentId: 'dept-2',
        departmentName: 'Radiology',
        assignedDoctorId: 'doctor-1',
        assignedDoctorName: 'Dr. Sarah Johnson',
        assignedDoctorEmail: 'doctor@hospital.com',  // ✅ MATCHES DEMO DOCTOR
        notes: 'Chest X-Ray for respiratory symptoms',
        fileUrl: null,
        fileName: 'XRay_Chest_JaneSmith.pdf',
        fileSize: null,
        uploadDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: 'sent',
        uploadedBy: 'reports-staff',
        uploadedByName: 'Radiology Tech',
        sentToDoctor: true,
        sentDate: new Date(Date.now() - 86400000).toISOString(),
        viewedByDoctor: false,
        downloadedByDoctor: false,
        doctorComments: null
      },
      {
        id: 'REP-DEMO-003',
        patientId: 'PAT-003',
        patientName: 'Robert Johnson',
        reportType: 'ct-scan',
        testName: 'CT Scan - Head',
        departmentId: 'dept-2',
        departmentName: 'Radiology',
        assignedDoctorId: 'doctor-1',
        assignedDoctorName: 'Dr. Sarah Johnson',
        assignedDoctorEmail: 'doctor@hospital.com',  // ✅ MATCHES DEMO DOCTOR
        notes: 'CT Scan requested for headache investigation',
        fileUrl: null,
        fileName: 'CTScan_Head_RobertJohnson.pdf',
        fileSize: null,
        uploadDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: 'sent',
        uploadedBy: 'reports-staff',
        uploadedByName: 'Lab Assistant',
        sentToDoctor: true,
        sentDate: new Date(Date.now() - 172800000).toISOString(),
        viewedByDoctor: true,  // This one is already viewed
        viewedDate: new Date(Date.now() - 86400000).toISOString(),
        downloadedByDoctor: false,
        doctorComments: null
      }
    ];
    
    labReports = demoReports;
    console.log(`✅ Created ${labReports.length} demo lab reports`);
    console.log('📧 All assigned to: doctor@hospital.com');
  }
};

// Create demo reports on server start
createDemoReports();

// @route   POST /api/lab-reports/upload
// @desc    Upload a new lab report
// @access  Private (Reports Staff only)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'reports') {
      return res.status(403).json({ msg: 'Access denied. Reports staff only.' });
    }

    const {
      patientId,
      patientName,
      reportType,
      testName,
      departmentId,
      departmentName,
      assignedDoctorId,
      assignedDoctorName,
      assignedDoctorEmail,
      notes
    } = req.body;

    const newReport = {
      id: `REP-${Date.now()}`,
      patientId,
      patientName,
      reportType,
      testName,
      departmentId,
      departmentName,
      assignedDoctorId,
      assignedDoctorName,
      assignedDoctorEmail,
      notes,
      fileUrl: req.file ? `/uploads/lab-reports/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
      fileSize: req.file ? req.file.size : null,
      uploadDate: new Date().toISOString(),
      status: 'sent',  // ✅ AUTOMATICALLY SENT
      uploadedBy: req.user.id,
      uploadedByName: req.user.name || 'Lab Staff',
      sentToDoctor: true,  // ✅ AUTOMATICALLY SENT TO DOCTOR
      sentDate: new Date().toISOString(),  // ✅ SENT TIMESTAMP
      viewedByDoctor: false,
      downloadedByDoctor: false,
      doctorComments: null
    };

    labReports.push(newReport);

    res.json({
      success: true,
      message: `Lab report uploaded and sent to ${assignedDoctorName} successfully!`,
      report: newReport
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ msg: 'Server error during file upload' });
  }
});

// @route   GET /api/lab-reports
// @desc    Get all lab reports (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('📊 Fetching lab reports for user:', req.user.email, 'Role:', req.user.role);
    console.log('📋 Total reports in system:', labReports.length);
    
    let filteredReports = labReports;

    if (req.user.role === 'doctor') {
      // Doctors see only reports assigned to them
      filteredReports = labReports.filter(
        report => report.assignedDoctorEmail === req.user.email
      );
      console.log('👨‍⚕️ Doctor reports filtered:', filteredReports.length);
      console.log('📧 Doctor email:', req.user.email);
      console.log('📋 All report emails:', labReports.map(r => r.assignedDoctorEmail));
    } else if (req.user.role === 'reports') {
      // Reports staff see all reports
      filteredReports = labReports;
      console.log('🔬 Reports staff sees all:', filteredReports.length);
    } else {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json({
      success: true,
      reports: filteredReports,
      count: filteredReports.length
    });
  } catch (error) {
    console.error('Fetch reports error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/lab-reports/:id
// @desc    Get a specific lab report
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const report = labReports.find(r => r.id === req.params.id);

    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    // Authorization check
    if (req.user.role === 'doctor' && report.assignedDoctorEmail !== req.user.email) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Fetch report error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/lab-reports/:id/send-to-doctor
// @desc    Mark report as sent to doctor (creates notification)
// @access  Private (Reports Staff only)
router.post('/:id/send-to-doctor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'reports') {
      return res.status(403).json({ msg: 'Access denied. Reports staff only.' });
    }

    const report = labReports.find(r => r.id === req.params.id);

    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    // Update report status
    report.status = 'sent';
    report.sentToDoctor = true;
    report.sentDate = new Date().toISOString();

    res.json({
      success: true,
      message: `Report sent to ${report.assignedDoctorName}`,
      report
    });
  } catch (error) {
    console.error('Send report error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/lab-reports/:id/mark-viewed
// @desc    Mark report as viewed by doctor
// @access  Private (Doctor only)
router.post('/:id/mark-viewed', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ msg: 'Access denied. Doctors only.' });
    }

    const report = labReports.find(r => r.id === req.params.id);

    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    if (report.assignedDoctorEmail !== req.user.email) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    report.viewedByDoctor = true;
    report.viewedDate = new Date().toISOString();

    res.json({
      success: true,
      message: 'Report marked as viewed',
      report
    });
  } catch (error) {
    console.error('Mark viewed error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/lab-reports/:id/mark-downloaded
// @desc    Mark report as downloaded by doctor
// @access  Private (Doctor only)
router.post('/:id/mark-downloaded', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ msg: 'Access denied. Doctors only.' });
    }

    const report = labReports.find(r => r.id === req.params.id);

    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    if (report.assignedDoctorEmail !== req.user.email) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    report.downloadedByDoctor = true;
    report.downloadDate = new Date().toISOString();

    res.json({
      success: true,
      message: 'Report marked as downloaded',
      report
    });
  } catch (error) {
    console.error('Mark downloaded error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/lab-reports/:id/add-comment
// @desc    Add doctor's comment to a report
// @access  Private (Doctor only)
router.post('/:id/add-comment', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ msg: 'Access denied. Doctors only.' });
    }

    const report = labReports.find(r => r.id === req.params.id);

    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    if (report.assignedDoctorEmail !== req.user.email) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { comment } = req.body;

    report.doctorComments = comment;
    report.commentDate = new Date().toISOString();

    res.json({
      success: true,
      message: 'Comment added successfully',
      report
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/lab-reports/stats/overview
// @desc    Get lab reports statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    let filteredReports = labReports;

    if (req.user.role === 'doctor') {
      filteredReports = labReports.filter(
        report => report.assignedDoctorEmail === req.user.email
      );
    }

    const stats = {
      total: filteredReports.length,
      pending: filteredReports.filter(r => r.status === 'pending').length,
      sent: filteredReports.filter(r => r.status === 'sent').length,
      viewed: filteredReports.filter(r => r.viewedByDoctor).length,
      downloaded: filteredReports.filter(r => r.downloadedByDoctor).length,
      unread: filteredReports.filter(r => r.sentToDoctor && !r.viewedByDoctor).length
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/lab-reports/download/:id
// @desc    Download a lab report file
// @access  Private
router.get('/download/:id', auth, async (req, res) => {
  try {
    const report = labReports.find(r => r.id === req.params.id);

    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    // Authorization check
    if (req.user.role === 'doctor' && report.assignedDoctorEmail !== req.user.email) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    if (!report.fileUrl) {
      return res.status(404).json({ msg: 'No file attached to this report' });
    }

    const filePath = path.join(__dirname, '..', report.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: 'File not found on server' });
    }

    // Mark as downloaded if doctor
    if (req.user.role === 'doctor') {
      report.downloadedByDoctor = true;
      report.downloadDate = new Date().toISOString();
    }

    res.download(filePath, report.fileName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
