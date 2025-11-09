import React, { useState } from 'react';
import { Patient, Prescription, LabResult, Medication, Doctor } from '../types';
import { X, Download, Pill, FlaskConical, Stethoscope } from 'lucide-react';

interface PatientProfileProps {
  patient: Patient;
  onClose: () => void;
  prescriptions: Prescription[];
  labResults: LabResult[];
  onPrescribe: (medication: Medication) => void;
  availableMedications: Medication[];
  doctor: Doctor;
  onDeEscalate: (prescriptionId: string, medicationId: string) => void;
  onStopMedication: (prescriptionId: string, medicationId: string) => void;
  onReviewMedication: (prescriptionId: string, medicationId: string) => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  onClose,
  prescriptions,
  labResults,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderOverview = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Patient Details</h3>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Gender:</strong> {patient.gender}</p>
      <p><strong>Email:</strong> {patient.email}</p>
      <h4 className="text-lg font-semibold mt-4">Medical History</h4>
      <ul>
        {patient.medicalHistory.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
      <h4 className="text-lg font-semibold mt-4">Allergies</h4>
      <ul>
        {patient.allergies.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>
  );

  const renderPrescriptions = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Prescriptions</h3>
      {prescriptions.map(p => (
        <div key={p.id} className="mb-4 p-4 border rounded-lg">
          <p><strong>Date:</strong> {new Date(p.createdAt).toLocaleDateString()}</p>
          <p><strong>Diagnosis:</strong> {p.diagnosis}</p>
          <p><strong>Doctor:</strong> {p.doctorName}</p>
          <ul className="mt-2">
            {p.medications.map(med => (
              <li key={med.id} className="flex items-center">
                <Pill className="h-4 w-4 mr-2" /> {med.medication.name} - {med.dosage}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderLabResults = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Lab Results</h3>
      {labResults.map(lr => (
        <div key={lr.id} className="mb-4 p-4 border rounded-lg">
          <p><strong>Date:</strong> {new Date(lr.collectedAt).toLocaleDateString()}</p>
          <p><strong>Culture Type:</strong> {lr.cultureType}</p>
          <p><strong>Organism:</strong> {lr.organism}</p>
          <h5 className="font-semibold mt-2">Sensitivity:</h5>
          <ul>
            {lr.sensitivity.map(s => (
              <li key={s.antibiotic}>{s.antibiotic}: {s.result}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold">Patient Profile: {patient.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          <div className="flex border-b mb-4">
            <button onClick={() => setActiveTab('overview')} className={`py-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab('prescriptions')} className={`py-2 px-4 ${activeTab === 'prescriptions' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}>
              Prescriptions
            </button>
            <button onClick={() => setActiveTab('lab_results')} className={`py-2 px-4 ${activeTab === 'lab_results' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}>
              Lab Results
            </button>
          </div>

          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'prescriptions' && renderPrescriptions()}
            {activeTab === 'lab_results' && renderLabResults()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
