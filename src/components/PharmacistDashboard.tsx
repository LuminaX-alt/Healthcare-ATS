import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Pharmacist, Order, Medication } from '../types';
import { 
  Package, 
  ShoppingCart, 
  Pill, 
  TrendingUp, 
  Search, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  LogOut,
  Truck,
  FileText,
  BarChart3
} from 'lucide-react';

const PharmacistDashboard: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const pharmacist = userProfile as Pharmacist;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      patientId: 'PAT001',
      patientName: 'John Doe',
      pharmacyId: pharmacist?.pharmacyId || '',
      items: [
        { medicationId: '1', medicationName: 'Amoxicillin 500mg', quantity: 21, price: 25.99, prescriptionId: 'P1', addedAt: '2025-10-11T08:00:00Z' },
        { medicationId: '3', medicationName: 'Paracetamol 500mg', quantity: 30, price: 10.00, addedAt: '2025-10-11T08:05:00Z' }
      ],
      totalAmount: 35.99,
      status: 'pending',
      paymentStatus: 'paid',
      createdAt: '2025-10-11T08:10:00Z',
      deliveryAddress: '123 Main St, Anytown, USA'
    },
    {
      id: 'ORD002',
      patientId: 'PAT002',
      patientName: 'Jane Smith',
      pharmacyId: pharmacist?.pharmacyId || '',
      items: [{ medicationId: '2', medicationName: 'Ciprofloxacin 250mg', quantity: 14, price: 35.50, prescriptionId: 'P2', addedAt: '2025-10-11T09:00:00Z' }],
      totalAmount: 35.50,
      status: 'preparing',
      paymentStatus: 'paid',
      createdAt: '2025-10-11T09:05:00Z',
      deliveryAddress: '456 Oak Ave, Anytown, USA'
    },
    {
      id: 'ORD003',
      patientId: 'PAT003',
      patientName: 'Peter Jones',
      pharmacyId: pharmacist?.pharmacyId || '',
      items: [{ medicationId: '4', medicationName: 'Ibuprofen 200mg', quantity: 50, price: 15.75, addedAt: '2025-10-10T14:00:00Z' }],
      totalAmount: 15.75,
      status: 'dispatched',
      paymentStatus: 'paid',
      createdAt: '2025-10-10T14:05:00Z',
      dispatchedAt: '2025-10-10T18:00:00Z',
      deliveryAddress: '789 Pine Ln, Anytown, USA'
    },
    {
      id: 'ORD004',
      patientId: 'PAT004',
      patientName: 'Mary Williams',
      pharmacyId: pharmacist?.pharmacyId || '',
      items: [{ medicationId: '1', medicationName: 'Amoxicillin 500mg', quantity: 14, price: 25.99, prescriptionId: 'P3', addedAt: '2025-10-09T11:00:00Z' }],
      totalAmount: 25.99,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: '2025-10-09T11:05:00Z',
      dispatchedAt: '2025-10-09T15:00:00Z',
      deliveredAt: '2025-10-10T10:00:00Z',
      deliveryAddress: '101 Maple Dr, Anytown, USA'
    }
  ]);

  const [inventory, setInventory] = useState<Medication[]>([
    { id: '1', name: 'Amoxicillin 500mg', type: 'antibiotic', category: 'Penicillins', dosage: '500mg', price: 25.99, stock: 85, manufacturer: 'PharmaCo', expiryDate: '2026-12-31', requiresPrescription: true, sideEffects: ['Nausea', 'Diarrhea'] },
    { id: '2', name: 'Ciprofloxacin 250mg', type: 'antibiotic', category: 'Quinolones', dosage: '250mg', price: 35.50, stock: 45, manufacturer: 'MediLabs', expiryDate: '2026-06-30', requiresPrescription: true, sideEffects: ['Dizziness', 'Headache'] },
    { id: '3', name: 'Paracetamol 500mg', type: 'general', category: 'Analgesic', dosage: '500mg', price: 10.00, stock: 150, manufacturer: 'HealthWell', expiryDate: '2027-08-15', requiresPrescription: false, sideEffects: ['Rare skin rashes'] },
    { id: '4', name: 'Ibuprofen 200mg', type: 'general', category: 'NSAID', dosage: '200mg', price: 15.75, stock: 25, manufacturer: 'PainFree', expiryDate: '2025-11-30', requiresPrescription: false, sideEffects: ['Stomach upset'] },
    { id: '5', name: 'Lisinopril 10mg', type: 'general', category: 'ACE Inhibitor', dosage: '10mg', price: 22.00, stock: 120, manufacturer: 'CardioCare', expiryDate: '2026-09-20', requiresPrescription: true, sideEffects: ['Cough', 'Dizziness'] },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInventory = inventory.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status };
        if (status === 'dispatched') updatedOrder.dispatchedAt = new Date().toISOString();
        if (status === 'delivered') updatedOrder.deliveredAt = new Date().toISOString();
        return updatedOrder;
      }
      return order;
    }));
  };

  const handleSaveInventory = (medication: Medication) => {
    if (editingMedication) {
      setInventory(inventory.map(m => m.id === medication.id ? medication : m));
    } else {
      setInventory([...inventory, { ...medication, id: `MED${Date.now()}` }]);
    }
    setShowInventoryModal(false);
    setEditingMedication(null);
  };

  const openInventoryModal = (medication: Medication | null = null) => {
    setEditingMedication(medication);
    setShowInventoryModal(true);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'dispatched': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => {
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const lowStockItems = inventory.filter(i => i.stock < 50).length;
    const totalSales = orders.reduce((sum, o) => o.paymentStatus === 'paid' ? sum + o.totalAmount : sum, 0);
    const recentOrders = orders.slice(0, 5);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPIs */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="bg-yellow-500 p-3 rounded-full text-white mr-4"><ShoppingCart size={24} /></div>
          <div>
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold">{pendingOrders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="bg-red-500 p-3 rounded-full text-white mr-4"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-2xl font-bold">{lowStockItems}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="bg-green-500 p-3 rounded-full text-white mr-4"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm text-gray-500">Total Sales (Today)</p>
            <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <div className="bg-blue-500 p-3 rounded-full text-white mr-4"><Pill size={24} /></div>
          <div>
            <p className="text-sm text-gray-500">Total Inventory Items</p>
            <p className="text-2xl font-bold">{inventory.length}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="md:col-span-2 lg:col-span-4 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Patient</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-mono text-blue-600">{order.id}</td>
                    <td className="py-2 px-4">{order.patientName}</td>
                    <td className="py-2 px-4">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Manage Orders</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-blue-600">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">${order.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 hover:text-indigo-900">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Inventory Management</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={() => openInventoryModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add Medication
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map(med => (
              <tr key={med.id} className={`${med.stock < 50 ? 'bg-red-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{med.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{med.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-bold ${med.stock < 50 ? 'text-red-600' : 'text-gray-800'}`}>{med.stock}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${med.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{med.expiryDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => openInventoryModal(med)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Sales Over Time</h3>
        {/* Placeholder for a chart */}
        <div className="h-64 bg-gray-100 flex items-center justify-center rounded">
          <BarChart3 className="text-gray-400" size={48} />
          <p className="text-gray-500 ml-4">Sales chart would be here</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Top Selling Medications</h3>
        {/* Placeholder for a list */}
        <ul className="space-y-2">
          <li className="flex justify-between"><span>Amoxicillin 500mg</span><span className="font-semibold">120 units</span></li>
          <li className="flex justify-between"><span>Paracetamol 500mg</span><span className="font-semibold">98 units</span></li>
          <li className="flex justify-between"><span>Ibuprofen 200mg</span><span className="font-semibold">75 units</span></li>
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    // Clear search term when switching tabs
    React.useEffect(() => {
      setSearchTerm('');
    }, [activeTab]);

    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'orders': return renderOrders();
      case 'inventory': return renderInventory();
      case 'analytics': return renderAnalytics();
      default: return <p>Select a tab</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white z-10">
        <div className="p-6">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full">
              <FileText className="h-8 w-8 text-blue-700" />
            </div>
            <div className="ml-4 overflow-hidden">
              <p className="font-semibold text-lg truncate">{pharmacist?.name || 'Pharmacist'}</p>
              <p className="text-sm text-blue-200 truncate">{pharmacist?.email}</p>
            </div>
          </div>
        </div>
        <nav className="mt-6">
          <a href="#" onClick={() => setActiveTab('overview')} className={`flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 ${activeTab === 'overview' && 'bg-blue-900'}`}>
            <Package className="h-5 w-5 mr-3" />
            Overview
          </a>
          <a href="#" onClick={() => setActiveTab('orders')} className={`flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 ${activeTab === 'orders' && 'bg-blue-900'}`}>
            <ShoppingCart className="h-5 w-5 mr-3" />
            Orders
          </a>
          <a href="#" onClick={() => setActiveTab('inventory')} className={`flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 ${activeTab === 'inventory' && 'bg-blue-900'}`}>
            <Pill className="h-5 w-5 mr-3" />
            Inventory
          </a>
          <a href="#" onClick={() => setActiveTab('analytics')} className={`flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 ${activeTab === 'analytics' && 'bg-blue-900'}`}>
            <TrendingUp className="h-5 w-5 mr-3" />
            Analytics
          </a>
        </nav>
        <div className="absolute bottom-0 w-full p-6">
          <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-100 rounded-lg hover:bg-blue-700">
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="ml-64 p-8">
        <h2 className="text-3xl font-bold mb-6 capitalize">{activeTab}</h2>
        {renderContent()}
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">Order Details - {selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-800">&times;</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><strong>Patient:</strong> {selectedOrder.patientName}</div>
              <div><strong>Address:</strong> {selectedOrder.deliveryAddress}</div>
              <div><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
              <div><strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}</div>
            </div>
            <h4 className="font-semibold mt-6 mb-2">Items</h4>
            <ul className="divide-y">
              {selectedOrder.items.map(item => (
                <li key={item.medicationId} className="py-2 flex justify-between">
                  <span>{item.medicationName} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Update Status</h4>
              <div className="flex space-x-2">
                {['pending', 'preparing', 'dispatched', 'delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, status as Order['status']);
                      setSelectedOrder({ ...selectedOrder, status: status as Order['status'] });
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${selectedOrder.status === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {showInventoryModal && (
        <InventoryForm
          medication={editingMedication}
          onSave={handleSaveInventory}
          onClose={() => {
            setShowInventoryModal(false);
            setEditingMedication(null);
          }}
        />
      )}
    </div>
  );
};

interface InventoryFormProps {
  medication: Medication | null;
  onSave: (medication: Medication) => void;
  onClose: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ medication, onSave, onClose }) => {
  const [formState, setFormState] = useState<Partial<Medication>>(
    medication || {
      name: '',
      type: 'general',
      category: '',
      dosage: '',
      price: 0,
      stock: 0,
      manufacturer: '',
      expiryDate: '',
      requiresPrescription: false,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // @ts-ignore
    const val = isCheckbox ? e.target.checked : type === 'number' ? parseFloat(value) : value;
    setFormState({ ...formState, [name]: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState as Medication);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <form onSubmit={handleSubmit}>
          <h3 className="text-2xl font-semibold mb-6">{medication ? 'Edit' : 'Add'} Medication</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="name" value={formState.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" required />
            <input name="category" value={formState.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded" />
            <input name="dosage" value={formState.dosage} onChange={handleChange} placeholder="Dosage" className="p-2 border rounded" />
            <input name="manufacturer" value={formState.manufacturer} onChange={handleChange} placeholder="Manufacturer" className="p-2 border rounded" />
            <input name="price" type="number" value={formState.price} onChange={handleChange} placeholder="Price" className="p-2 border rounded" required />
            <input name="stock" type="number" value={formState.stock} onChange={handleChange} placeholder="Stock" className="p-2 border rounded" required />
            <input name="expiryDate" type="date" value={formState.expiryDate} onChange={handleChange} placeholder="Expiry Date" className="p-2 border rounded" />
            <select name="type" value={formState.type} onChange={handleChange} className="p-2 border rounded">
              <option value="general">General</option>
              <option value="antibiotic">Antibiotic</option>
            </select>
            <div className="flex items-center">
              <input name="requiresPrescription" type="checkbox" checked={formState.requiresPrescription} onChange={handleChange} className="mr-2" />
              <label>Requires Prescription</label>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
