import React from 'react';
import { Patient, Prescription, Medication, Doctor } from '../types';
import { FileDown, User, Loader2 } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  prescriptions: Prescription[];
  doctor: Doctor;
  availableMedications: Medication[];
  onSelect: (patient: Patient) => void;
  onDownloadSummary: (patient: Patient) => void;
  isGeneratingSummary: boolean;
  onPrescribe: (patientId: string, medication: Medication) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onSelect,
  onDownloadSummary,
  isGeneratingSummary,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{patient.name}</h3>
            <p className="text-sm text-gray-500">
              {patient.age} years old, {patient.gender}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Recent Vitals</h4>
          {patient.vitals ? (
            <div className="text-xs text-gray-600 grid grid-cols-2 gap-1">
              <p>BP: {patient.vitals.bloodPressure}</p>
              <p>HR: {patient.vitals.heartRate} bpm</p>
              <p>Temp: {patient.vitals.temperature}°C</p>
              <p>RR: {patient.vitals.respiratoryRate} bpm</p>
            </div>
          ) : (
            <p className="text-xs text-gray-500">No vitals recorded.</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => onSelect(patient)}
          className="text-sm text-blue-600 hover:underline"
        >
          View Profile
        </button>
        <button
          onClick={() => onDownloadSummary(patient)}
          disabled={isGeneratingSummary}
          className="flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 disabled:opacity-50"
        >
          {isGeneratingSummary ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <FileDown className="h-4 w-4 mr-2" />
          )}
          Summary
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
