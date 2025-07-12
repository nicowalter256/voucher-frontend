import React, { useState, useEffect } from 'react';
import { Plus, Search, Copy, CheckCircle, XCircle, Clock, DollarSign, Users, Loader2, RefreshCw, CreditCard, Receipt, LayoutDashboard } from 'lucide-react';
import { authenticatedFetch } from './utils/api';
import { API_ENDPOINTS } from './config';
import PaymentForm from './components/PaymentForm';
import PaymentsView from './components/PaymentsView';

const VoucherManager = ({ user, onLogout, onViewChange }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingVoucher, setCreatingVoucher] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentsView, setShowPaymentsView] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({ total: 0, active: 0, used: 0, revenue: 0 });
  const [newVoucher, setNewVoucher] = useState({ 
    amountMb: 500, 
    expiresDays: 3, 
    phone: '', 
    package_type: 'standard',
    expiration_date: ''
  });

  // Generate random voucher code
  const generateVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Load vouchers from API
  const loadVouchers = async () => {
    setLoading(true);
    try {
      const vouchers = await authenticatedFetch(API_ENDPOINTS.VOUCHERS);
      
      // Transform the API response to match our UI expectations
      const transformedVouchers = vouchers.map(voucher => ({
        id: voucher.id,
        code: voucher.code,
        package_type: voucher.package_type,
        status: voucher.used ? 'used' : (new Date(voucher.expiration_date) < new Date() ? 'expired' : 'active'),
        created_at: voucher.created_at,
        expiration_date: voucher.expiration_date,
        used_by: voucher.used_by,
        used: voucher.used
      }));
      
      setVouchers(transformedVouchers);
      
      // Calculate stats from the vouchers
      const total = transformedVouchers.length;
      const active = transformedVouchers.filter(v => v.status === 'active').length;
      const used = transformedVouchers.filter(v => v.status === 'used').length;
      const expired = transformedVouchers.filter(v => v.status === 'expired').length;
      
      // Calculate revenue based on package types (mock calculation)
      const revenue = transformedVouchers.reduce((total, voucher) => {
        const packagePrices = { standard: 1000, premium: 2000, basic: 500 };
        return total + (packagePrices[voucher.package_type] || 1000);
      }, 0);
      
      setStats({ total, active, used, expired, revenue });
      
    } catch (error) {
      console.error('Error loading vouchers:', error);
      if (window.showToast) {
        window.showToast('Failed to load vouchers: ' + error.message, 'error');
      }
      
      // Set empty state on error
      setVouchers([]);
      setStats({ total: 0, active: 0, used: 0, expired: 0, revenue: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Create new voucher
  const createVoucher = async () => {
    setCreatingVoucher(true);
    try {
      // Set expiration date if not provided
      const voucherData = {
        ...newVoucher,
        expiration_date: newVoucher.expiration_date || new Date(Date.now() + newVoucher.expiresDays * 24 * 60 * 60 * 1000).toISOString()
      };

      const data = await authenticatedFetch('/vouchers/generate', {
        method: 'POST',
        body: JSON.stringify(voucherData)
      });

      // Add the new voucher to the list
      const newVoucher = data.voucher || { 
        ...voucherData, 
        id: Date.now(), 
        code: generateVoucherCode(),
        status: 'active', 
        created_at: new Date().toISOString(),
        used: false,
        used_by: null
      };
      
      setVouchers(prev => [newVoucher, ...prev]);
      
      // Reload vouchers to get updated stats
      loadVouchers();
      setShowCreateModal(false);
      setNewVoucher({ 
        amountMb: 500, 
        expiresDays: 3, 
        phone: '', 
        package_type: 'standard',
        expiration_date: ''
      });
      
      // Show success toast
      if (window.showToast) {
        window.showToast('Voucher generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error creating voucher:', error);
      
      // Show error toast
      if (window.showToast) {
        window.showToast(`Failed to create voucher: ${error.message}`, 'error');
      }
    } finally {
      setCreatingVoucher(false);
    }
  };

  // Copy voucher code to clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    if (window.showToast) {
      window.showToast('Voucher code copied to clipboard!', 'success');
    }
  };

  // Initiate payment for a voucher
  const initiatePayment = async (paymentData) => {
    setProcessingPayment(true);
    try {
      const response = await authenticatedFetch('/payments/init', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });

      if (window.showToast) {
        window.showToast('Payment initiated successfully!', 'success');
      }
      
      // Close modal and refresh vouchers
      setShowPaymentModal(false);
      setSelectedVoucher(null);
      loadVouchers();
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      if (window.showToast) {
        window.showToast(`Failed to initiate payment: ${error.message}`, 'error');
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle payment modal open
  const openPaymentModal = (voucher) => {
    setSelectedVoucher(voucher);
    setShowPaymentModal(true);
  };

  // Navigate to main dashboard
  const navigateToDashboard = () => {
    if (onViewChange) {
      onViewChange('dashboard');
    }
  };

  // Filter vouchers
  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.package_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (voucher.used_by && voucher.used_by.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || voucher.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    loadVouchers();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'used': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'expired': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Voucher Management</h2>
            <p className="text-gray-600">Generate and manage internet vouchers</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadVouchers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Voucher
            </button>
            <button
              onClick={() => setShowPaymentsView(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Receipt className="w-4 h-4" />
              View Payments
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vouchers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Used</p>
                <p className="text-2xl font-bold text-red-600">{stats.used}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.expired || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div 
            onClick={navigateToDashboard}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-lg shadow-sm border cursor-pointer hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm opacity-90">Main Dashboard</p>
                <p className="text-lg font-bold">System Overview</p>
              </div>
              <LayoutDashboard className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search vouchers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="used">Used</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vouchers Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voucher Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Used By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Loading vouchers...
                    </td>
                  </tr>
                ) : filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No vouchers found
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{voucher.code}</span>
                          <button
                            onClick={() => copyToClipboard(voucher.code)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="capitalize">{voucher.package_type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(voucher.expiration_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                          {getStatusIcon(voucher.status)}
                          {voucher.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voucher.used_by || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(voucher.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {voucher.status === 'active' && (
                            <button
                              onClick={() => openPaymentModal(voucher)}
                              className="text-green-600 hover:text-green-900"
                              title="Initiate Payment"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            className="text-blue-600 hover:text-blue-900" 
                            title="View Details"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Voucher Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Generate New Voucher</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Amount (MB)
                  </label>
                  <input
                    type="number"
                    value={newVoucher.amountMb}
                    onChange={(e) => setNewVoucher(prev => ({ ...prev, amountMb: parseInt(e.target.value) }))}
                    placeholder="500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expires In (Days)
                  </label>
                  <input
                    type="number"
                    value={newVoucher.expiresDays}
                    onChange={(e) => setNewVoucher(prev => ({ ...prev, expiresDays: parseInt(e.target.value) }))}
                    placeholder="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newVoucher.phone}
                    onChange={(e) => setNewVoucher(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0770000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Type
                  </label>
                  <select
                    value={newVoucher.package_type}
                    onChange={(e) => setNewVoucher(prev => ({ ...prev, package_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="basic">Basic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newVoucher.expiration_date}
                    onChange={(e) => setNewVoucher(prev => ({ ...prev, expiration_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to use expiresDays calculation</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={createVoucher}
                  disabled={creatingVoucher}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creatingVoucher ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Voucher'
                  )}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={creatingVoucher}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedVoucher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Initiate Payment</h3>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Voucher: <span className="font-mono font-medium">{selectedVoucher.code}</span></p>
                <p className="text-sm text-gray-600">Package: <span className="capitalize">{selectedVoucher.package_type}</span></p>
              </div>
              
              <PaymentForm 
                voucher={selectedVoucher}
                onSubmit={initiatePayment}
                onCancel={() => {
                  setShowPaymentModal(false);
                  setSelectedVoucher(null);
                }}
                processing={processingPayment}
              />
            </div>
          </div>
        )}

        {/* Payments View Modal */}
        {showPaymentsView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">My Payments</h3>
                <button
                  onClick={() => setShowPaymentsView(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <PaymentsView onClose={() => setShowPaymentsView(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherManager; 