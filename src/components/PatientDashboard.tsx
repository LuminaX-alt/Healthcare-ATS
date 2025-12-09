import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Patient, CartItem, Order, Prescription } from '../types';
import { 
  ShoppingCart, 
  FileText, 
  Truck, 
  User, 
  Heart,
  AlertTriangle,
  LogOut,
  Plus,
  Minus,
  X,
  CreditCard,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  Activity,
  FileClock,
  Pill,
  UserCheck,
  Stethoscope,
  Calendar,
  TrendingUp,
  Droplet,
  Thermometer,
  Wind,
  Scale,
  Clipboard,
  Shield,
  Upload,
  Download,
  Bell,
  MessageSquare,
  Video,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import api from '../api';
import AvailableDoctors from './AvailableDoctors';
import useSocket from '../hooks/useSocket';

interface DashboardStats {
  upcomingAppointments: number;
  activePrescriptions: number;
  completedAppointments: number;
  totalAppointments: number;
  totalPrescriptions: number;
  lastVisit: string | null;
  profileComplete: boolean;
}

interface Appointment {
  _id: string;
  doctor: {
    name: string;
    specialty: string;
  };
  appointmentDate: string;
  reason: string;
  symptoms?: string;
  status: string;
  type: string;
}

interface VitalsData {
  height?: number;
  weight?: number;
  bloodPressure?: string;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
  bmi?: number;
  lastUpdated?: string; // ISO string
}

const PatientDashboard: React.FC = () => {
  const { user, userProfile, logout, updateProfile } = useAuth();
  const patient = userProfile as Patient;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'vitals' | 'prescriptions' | 'cart' | 'orders' | 'profile' | 'doctors' | 'medical-records'>('overview');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vitalsData, setVitalsData] = useState<VitalsData>({});
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    age: patient?.age || 0,
    gender: patient?.gender || 'other',
    bloodType: patient?.bloodType || '',
    address: patient?.address || '',
    phone: patient?.phone || '',
    allergies: patient?.allergies?.join(', ') || '',
    medicalHistory: patient?.medicalHistory?.join(', ') || '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insurancePolicyNumber: ''
  });

  // Initialize socket and subscribe to patient room
  const socketRef = useSocket(patient?.id);

  useEffect(() => {
    const fetchCart = async () => {
      if (patient?.id) {
        try {
          const { data } = await api.get(`/patient/${patient.id}/cart`);
          setCart(data as CartItem[]);
        } catch (error) {
          console.error("Failed to fetch cart", error);
        }
      }
    };
    fetchCart();
    
    // Fetch dashboard stats
    const fetchDashboardStats = async () => {
      if (patient?.id) {
        try {
          const { data } = await api.get(`/patients/${patient.id}/dashboard-stats`);
          setDashboardStats(data);
        } catch (error) {
          console.error("Failed to fetch dashboard stats", error);
        }
      }
    };
    fetchDashboardStats();
    
    // Fetch appointments
    const fetchAppointments = async () => {
      if (patient?.id) {
        try {
          const { data } = await api.get(`/patients/${patient.id}/appointments`);
          setAppointments(data);
        } catch (error) {
          console.error("Failed to fetch appointments", error);
        }
      }
    };
    fetchAppointments();
    
    // Set vitals data from patient
    if (patient?.vitals) {
      // Normalize lastUpdated to ISO string
      const normalized = {
        ...patient.vitals,
        lastUpdated: patient.vitals.lastUpdated ? (typeof patient.vitals.lastUpdated === 'string' ? patient.vitals.lastUpdated : new Date(patient.vitals.lastUpdated).toISOString()) : undefined
      } as VitalsData;
      setVitalsData(normalized);
    }
    
    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardStats();
      fetchAppointments();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [patient?.id]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onVitals = (payload: any) => {
      if (payload?.vitals) {
        setVitalsData(payload.vitals);
      }
    };

    const onTimeline = (payload: any) => {
      if (payload?.timeline) {
        // Update local timeline by refetching patient or merging
        // For simplicity, update patient.timeline in-place if available
        // (In real app, you'd refetch patient data)
        if (patient && payload.timeline) {
          (patient as any).timeline = payload.timeline;
        }
      }
    };

    const onAppointment = (payload: any) => {
      if (payload?.appointment) {
        setAppointments((prev: Appointment[]) => [payload.appointment, ...prev]);
      }
    };

    socket.on('patientVitalsUpdated', onVitals);
    socket.on('patientTimelineUpdated', onTimeline);
    socket.on('patientAppointmentCreated', onAppointment);

    return () => {
      socket.off('patientVitalsUpdated', onVitals);
      socket.off('patientTimelineUpdated', onTimeline);
      socket.off('patientAppointmentCreated', onAppointment);
    };
  }, [socketRef, patient?.id]);

  const prescriptions = patient?.prescriptions || [];
  const orders = patient?.orders || [];
  const vitals = patient?.vitals;
  const timeline = patient?.timeline || [];

  const addToCart = async (medicationId: string, medicationName: string, price: number, prescriptionId?: string) => {
    const newItem: CartItem = {
      medicationId,
      medicationName,
      quantity: 1,
      price,
      prescriptionId,
      addedAt: new Date().toISOString()
    };

    try {
      await api.post('/patient/cart/add', { patientId: patient.id, items: [newItem] });
      setCart((prevCart: CartItem[]) => [...prevCart, newItem]);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const updateCartItemQuantity = (medicationId: string, change: number) => {
    const updatedCart = cart.map((item: CartItem) => {
      if (item.medicationId === medicationId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];
    setCart(updatedCart);
    // Here you might want to debounce and send updates to the backend
  };

  const removeFromCart = async (medicationId: string) => {
    try {
      await api.post('/patient/cart/remove', { patientId: patient.id, medicationId });
      setCart(prevCart => prevCart.filter(item => item.medicationId !== medicationId));
    } catch (error) {
      console.error("Failed to remove from cart", error);
    }
  };

  const handleCheckout = () => {
    window.location.href = 'https://buy.stripe.com/test_14AfZi7W4aQLfx5gcS08g00';
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPatient: Patient = {
      ...patient,
      name: profileData.name,
      email: profileData.email,
      age: profileData.age,
      gender: profileData.gender as 'male' | 'female' | 'other',
      address: profileData.address,
      allergies: profileData.allergies.split(',').map(s => s.trim()),
      medicalHistory: profileData.medicalHistory.split(',').map(s => s.trim()),
      profileComplete: true
    };
    updateProfile(updatedPatient);
    alert('Profile updated successfully!');
  };
  
  const handleVitalsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put(`/patients/${patient.id}/vitals`, vitalsData);
      if (data.success) {
        setVitalsData(data.vitals);
        alert('Vitals updated successfully!');
      }
    } catch (error) {
      console.error("Failed to update vitals", error);
      alert('Failed to update vitals. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderDashboardStats = () => {
    if (!dashboardStats) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Upcoming Appointments</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboardStats.upcomingAppointments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <Pill className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Prescriptions</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboardStats.activePrescriptions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completed Visits</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboardStats.completedAppointments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Health Score</h3>
              <p className="text-2xl font-semibold text-gray-900">{dashboardStats.profileComplete ? '85%' : '45%'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 flex items-center"><FileClock className="mr-2" /> Medical Timeline</h3>
        <div className="space-y-4">
          {timeline.map((event: any, index: number) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                {/* This needs to be fixed to render actual icons if they are strings */}
                <Pill/>
              </div>
              <div>
                <p className="font-semibold">{event.title} <span className="text-sm font-normal text-gray-500">- {event.date}</span></p>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 flex items-center"><Activity className="mr-2" /> Vitals</h3>
          {vitals ? (
            <div className="space-y-2 text-gray-700">
              <p><strong>Blood Pressure:</strong> {vitals.bloodPressure}</p>
              <p><strong>Heart Rate:</strong> {vitals.heartRate}</p>
              <p><strong>Temperature:</strong> {vitals.temperature}</p>
              <p><strong>Respiratory Rate:</strong> {vitals.respiratoryRate}</p>
              <p className="text-sm text-gray-500 mt-2">Last updated: {vitals.lastUpdated}</p>
            </div>
          ) : <p>No vitals recorded.</p>}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 flex items-center"><AlertTriangle className="mr-2" /> Allergies</h3>
          <ul className="list-disc list-inside text-red-600">
            {patient?.allergies?.map((allergy: string, i: number) => <li key={i}>{allergy}</li>)}
            {patient?.allergies?.length === 0 && <li>No known allergies.</li>}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prescriptions.map((p: any) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.doctorName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.diagnosis}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {p.medications.map((m: any) => m.medication.name).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    p.status === 'completed' ? 'bg-green-100 text-green-800' :
                    p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {p.status === 'pending' && p.medications.every((m: any) => !cart.some(ci => ci.medicationId === m.medication.id)) &&
                    <button onClick={() => addToCart(p.medications[0].medication.id, p.medications[0].medication.name, p.medications[0].medication.price, p.id)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                      Add to Cart
                    </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCart = () => {
    if (!cart || cart.length === 0) {
      return (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Browse your prescriptions to add medications.</p>
        </div>
      );
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
      <div>
        <h3 className="text-2xl font-bold mb-6">Your Shopping Cart</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {cart.map((item: CartItem) => (
              <li key={item.medicationId} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-indigo-600 truncate">{item.medicationName}</p>
                    <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => updateCartItemQuantity(item.medicationId, -1)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                      <Minus size={16} />
                    </button>
                    <span className="mx-4 font-medium">{item.quantity}</span>
                    <button onClick={() => updateCartItemQuantity(item.medicationId, 1)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.medicationId)} className="ml-6 text-red-500 hover:text-red-700">
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 text-right">
          <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
          <button 
            onClick={handleCheckout}
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CreditCard className="mr-3" />
            Proceed to Checkout
          </button>
        </div>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">${order.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items.map((item: CartItem) => `${item.medicationName} (x${item.quantity})`).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white p-8 rounded-lg shadow max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6">My Profile</h3>
      <form onSubmit={handleProfileUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input type="number" id="age" value={profileData.age} onChange={e => setProfileData({...profileData, age: parseInt(e.target.value)})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select id="gender" value={profileData.gender} onChange={e => setProfileData({...profileData, gender: e.target.value as 'male' | 'female' | 'other'})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" id="address" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies (comma-separated)</label>
            <input type="text" id="allergies" value={profileData.allergies} onChange={e => setProfileData({...profileData, allergies: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">Medical History (comma-separated)</label>
            <textarea id="medicalHistory" value={profileData.medicalHistory} onChange={e => setProfileData({...profileData, medicalHistory: e.target.value})} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
        </div>
        <div className="mt-6 text-right">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'doctors':
        return <AvailableDoctors />;
      case 'prescriptions':
        return renderPrescriptions();
      case 'cart':
        return renderCart();
      case 'orders':
        return renderOrders();
      case 'profile':
        return renderProfile();
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-indigo-600">Patient Portal</h2>
          <p className="text-sm text-gray-500">{patient?.name}</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <a href="#" onClick={() => setActiveTab('overview')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}><Activity className="mr-3" /> Overview</a>
          <a href="#" onClick={() => setActiveTab('doctors')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'doctors' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}><Stethoscope className="mr-3" /> Available Doctors</a>
          <a href="#" onClick={() => setActiveTab('prescriptions')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'prescriptions' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}><FileText className="mr-3" /> Prescriptions</a>
          <a href="#" onClick={() => setActiveTab('cart')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'cart' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <ShoppingCart className="mr-3" /> 
            Cart
            {cart.length > 0 && <span className="ml-auto bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{cart.length}</span>}
          </a>
          <a href="#" onClick={() => setActiveTab('orders')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}><Truck className="mr-3" /> Orders</a>
          <a href="#" onClick={() => setActiveTab('profile')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}><User className="mr-3" /> Profile</a>
        </nav>
        <div className="px-6 py-4 border-t">
          <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default PatientDashboard;
