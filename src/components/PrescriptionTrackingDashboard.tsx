import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Pill,
  Calendar,
  AlertCircle,
  User,
  FileText,
  BarChart3,
  PieChart
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

interface TrackingRecord {
  _id: string;
  medication: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  };
  status: string;
  adherence: {
    totalDoses: number;
    takenDoses: number;
    missedDoses: number;
    adherenceRate: number;
  };
  timeline: Array<{
    date: string;
    status: string;
    event: string;
    notes: string;
    reportedBy: string;
  }>;
  alerts: Array<{
    type: string;
    severity: string;
    message: string;
    createdAt: string;
    resolved: boolean;
  }>;
  sideEffects: Array<{
    reportedDate: string;
    severity: string;
    description: string;
    action: string;
  }>;
  patient?: {
    name: string;
    email: string;
  };
  doctor?: {
    name: string;
    specialty: string;
  };
}

interface Alert {
  type: string;
  severity: string;
  message: string;
  createdAt: string;
  resolved: boolean;
  medication: {
    name: string;
  };
  patient: {
    name: string;
    email: string;
  };
  trackingId: string;
}

const PrescriptionTrackingDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'prescriptions' | 'alerts' | 'analytics'>('overview');
  const [trackingRecords, setTrackingRecords] = useState<TrackingRecord[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState<TrackingRecord | null>(null);

  useEffect(() => {
    fetchTrackingData();
    fetchAlerts();
    fetchAnalytics();
  }, [user?.id]);

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (user?.role === 'patient') {
        endpoint = `/tracking/patient/${userProfile?.id}`;
      } else if (user?.role === 'doctor') {
        endpoint = `/tracking/doctor/${userProfile?.id}`;
      } else {
        // Admin or other roles can see all
        endpoint = '/tracking/analytics/adherence';
      }
      
      const { data } = await api.get(endpoint);
      setTrackingRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const { data } = await api.get('/tracking/alerts/active');
      setActiveAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/tracking/analytics/adherence');
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const recordDose = async (trackingId: string, taken: boolean) => {
    try {
      await api.put(`/tracking/${trackingId}/dose`, { taken });
      fetchTrackingData();
      alert(taken ? 'Dose recorded successfully!' : 'Missed dose recorded');
    } catch (error) {
      console.error('Error recording dose:', error);
      alert('Failed to record dose');
    }
  };

  const reportSideEffect = async (trackingId: string) => {
    const severity = prompt('Severity (mild/moderate/severe):');
    const description = prompt('Describe the side effect:');
    
    if (severity && description) {
      try {
        await api.post(`/tracking/${trackingId}/side-effect`, {
          severity,
          description
        });
        fetchTrackingData();
        fetchAlerts();
        alert('Side effect reported successfully');
      } catch (error) {
        console.error('Error reporting side effect:', error);
        alert('Failed to report side effect');
      }
    }
  };

  const resolveAlert = async (trackingId: string, alertIndex: number) => {
    try {
      await api.put(`/tracking/alert/${trackingId}/${alertIndex}/resolve`, {
        resolvedBy: user?.email
      });
      fetchAlerts();
      alert('Alert resolved');
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('Failed to resolve alert');
    }
  };

  const getAdherenceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-100';
    if (rate >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Prescriptions</p>
              <p className="text-2xl font-bold">{trackingRecords.filter(r => r.status === 'in-progress').length}</p>
            </div>
            <Pill className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Adherence</p>
              <p className="text-2xl font-bold">{analytics?.avgAdherence?.toFixed(1) || 0}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-red-600">{activeAlerts.length}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold">{trackingRecords.filter(r => r.status === 'completed').length}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="mr-2" /> Recent Activity
        </h3>
        <div className="space-y-4">
          {trackingRecords.slice(0, 5).map((record) => (
            <div key={record._id} className="flex items-start border-b pb-4 last:border-0">
              <div className="flex-1">
                <p className="font-medium">{record.medication.name}</p>
                <p className="text-sm text-gray-600">{record.medication.dosage} - {record.medication.frequency}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAdherenceColor(record.adherence?.adherenceRate || 0)}`}>
                    {record.adherence?.adherenceRate || 0}% Adherence
                  </span>
                  <span className="text-xs text-gray-500">
                    {record.adherence?.takenDoses || 0}/{record.adherence?.totalDoses || 0} doses taken
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTracking(record)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medication</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adherence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trackingRecords.map((record) => (
              <tr key={record._id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{record.medication.name}</div>
                    {user?.role === 'doctor' && record.patient && (
                      <div className="text-sm text-gray-500">{record.patient.name}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {record.medication.dosage}<br/>
                  <span className="text-gray-500">{record.medication.frequency}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getAdherenceColor(record.adherence?.adherenceRate || 0)}`}>
                      {record.adherence?.adherenceRate || 0}%
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {record.adherence?.takenDoses || 0}/{record.adherence?.totalDoses || 0} doses
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.status === 'completed' ? 'bg-green-100 text-green-600' :
                    record.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {user?.role === 'patient' && record.status === 'in-progress' && (
                      <>
                        <button
                          onClick={() => recordDose(record._id, true)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          ✓ Taken
                        </button>
                        <button
                          onClick={() => recordDose(record._id, false)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ✗ Missed
                        </button>
                        <button
                          onClick={() => reportSideEffect(record._id)}
                          className="text-orange-600 hover:text-orange-800 text-sm"
                        >
                          Report Issue
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedTracking(record)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4">
      {activeAlerts.map((alert, index) => (
        <div key={index} className={`p-4 rounded-lg border-l-4 ${
          alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
          alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
          alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
          'border-blue-500 bg-blue-50'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <AlertTriangle className={`h-5 w-5 mr-2 ${
                  alert.severity === 'critical' ? 'text-red-600' :
                  alert.severity === 'high' ? 'text-orange-600' :
                  alert.severity === 'medium' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {alert.type.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="mt-2 font-medium">{alert.message}</p>
              <div className="mt-2 text-sm text-gray-600">
                <p>Medication: {alert.medication.name}</p>
                <p>Patient: {alert.patient.name} ({alert.patient.email})</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(alert.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {user?.role === 'doctor' && (
              <button
                onClick={() => {
                  const alertIndex = trackingRecords
                    .find(r => r._id === alert.trackingId)
                    ?.alerts.findIndex(a => a.message === alert.message);
                  if (alertIndex !== undefined && alertIndex !== -1) {
                    resolveAlert(alert.trackingId, alertIndex);
                  }
                }}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Resolve
              </button>
            )}
          </div>
        </div>
      ))}
      {activeAlerts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <p>No active alerts</p>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Average Adherence Rate</h4>
          <p className="text-3xl font-bold text-blue-600">{analytics?.avgAdherence?.toFixed(1) || 0}%</p>
          <p className="text-sm text-gray-500 mt-2">Across all prescriptions</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">High Adherence</h4>
          <p className="text-3xl font-bold text-green-600">{analytics?.highAdherence || 0}</p>
          <p className="text-sm text-gray-500 mt-2">≥80% adherence rate</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Low Adherence</h4>
          <p className="text-3xl font-bold text-red-600">{analytics?.lowAdherence || 0}</p>
          <p className="text-sm text-gray-500 mt-2">&lt;50% adherence rate</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Side Effects Summary</h3>
        <div className="space-y-2">
          {trackingRecords
            .flatMap(r => r.sideEffects || [])
            .slice(0, 10)
            .map((effect, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{effect.description}</p>
                  <p className="text-sm text-gray-600">Severity: {effect.severity}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(effect.reportedDate).toLocaleDateString()}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Detail Modal
  const renderDetailModal = () => {
    if (!selectedTracking) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedTracking.medication.name}</h2>
                <p className="text-gray-600">{selectedTracking.medication.dosage} - {selectedTracking.medication.frequency}</p>
              </div>
              <button
                onClick={() => setSelectedTracking(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Adherence */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Adherence</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${selectedTracking.adherence?.adherenceRate || 0}%` }}
                  ></div>
                </div>
                <span className="font-bold">{selectedTracking.adherence?.adherenceRate || 0}%</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Taken: {selectedTracking.adherence?.takenDoses || 0} | 
                Missed: {selectedTracking.adherence?.missedDoses || 0} | 
                Total: {selectedTracking.adherence?.totalDoses || 0}
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Timeline</h3>
              <div className="space-y-3">
                {selectedTracking.timeline?.slice().reverse().map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.event.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{event.notes}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.date).toLocaleString()} • {event.reportedBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Effects */}
            {selectedTracking.sideEffects && selectedTracking.sideEffects.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Side Effects</h3>
                <div className="space-y-2">
                  {selectedTracking.sideEffects.map((effect, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                      <div className="flex justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          effect.severity === 'severe' ? 'bg-red-200 text-red-800' :
                          effect.severity === 'moderate' ? 'bg-orange-200 text-orange-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {effect.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(effect.reportedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2 font-medium">{effect.description}</p>
                      <p className="text-sm text-gray-600 mt-1">Action: {effect.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts */}
            {selectedTracking.alerts && selectedTracking.alerts.filter(a => !a.resolved).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Active Alerts</h3>
                <div className="space-y-2">
                  {selectedTracking.alerts
                    .filter(a => !a.resolved)
                    .map((alert, index) => (
                      <div key={index} className={`p-3 rounded border-l-4 ${
                        alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                        alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                        'border-yellow-500 bg-yellow-50'
                      }`}>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Prescription Tracking</h1>
          <p className="text-gray-600">Monitor medication adherence and outcomes</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="inline mr-2 h-5 w-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'prescriptions'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Pill className="inline mr-2 h-5 w-5" />
              Prescriptions
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'alerts'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AlertTriangle className="inline mr-2 h-5 w-5" />
              Alerts {activeAlerts.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs">
                  {activeAlerts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="inline mr-2 h-5 w-5" />
              Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'prescriptions' && renderPrescriptions()}
          {activeTab === 'alerts' && renderAlerts()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>

        {renderDetailModal()}
      </div>
    </div>
  );
};

export default PrescriptionTrackingDashboard;
