'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MasterTemplate } from '@/lib/templates/types';
import TemplateForm from '@/components/admin/TemplateForm';
import TierBadge from '@/components/TierBadge';

interface TemplateOrder {
  id: string;
  status: string;
  downloadUrl: string | null;
  paymentProof: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  paymentMethod: string | null;
  midtransOrderId: string | null;
  created_at: string;
  userId: string;
  userTemplate: {
    masterTemplate: {
      title: string;
      price: number;
    };
  };
  affiliate: {
    id: string;
    name: string | null;
    storeName: string | null;
    username: string | null;
    email: string;
    tier: 'free' | 'pro' | 'premium';
    commissionRate: number;
    commissionAmount: number;
  } | null;
}

interface EarningsData {
  totalSalesRevenue: number;
  totalUserCommissions: number;
  totalPendingWithdrawals: number;
  totalPaidWithdrawals: number;
  availableBalance: number;
  platformRevenue: number;
  totalSales: number;
  pendingWithdrawalCount: number;
}

type TabType = 'website' | 'orders' | 'earnings';

export default function TemplateSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('website');
  const [templates, setTemplates] = useState<MasterTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MasterTemplate | null>(null);

  // Orders state
  const [orders, setOrders] = useState<TemplateOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showManualOrderModal, setShowManualOrderModal] = useState(false);
  const [deliverOrderId, setDeliverOrderId] = useState<string | null>(null);
  const [deliveryUrl, setDeliveryUrl] = useState('');
  const [isDelivering, setIsDelivering] = useState(false);

  // Earnings state
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('admin_session='));
      if (!sessionCookie) {
        router.push('/admin/login');
        return;
      }
      await fetchTemplates();
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, filterStatus]);

  useEffect(() => {
    if (activeTab === 'earnings') {
      fetchEarnings();
    }
  }, [activeTab]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const url = filterStatus === 'all'
        ? '/api/admin/template-orders'
        : `/api/admin/template-orders?status=${filterStatus}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Error fetching orders:', response.status);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await fetch('/api/admin/template-earnings');
      if (response.ok) {
        const data = await response.json();
        setEarnings(data);
      } else {
        const error = await response.json();
        console.error('Error fetching template earnings:', error);
      }
    } catch (error) {
      console.error('Error fetching template earnings:', error);
    } finally {
      setEarningsLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowForm(false);
        fetchTemplates();
        alert('Template created successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const response = await fetch('/api/admin/templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setShowForm(false);
        setEditingTemplate(null);
        fetchTemplates();
        alert('Template updated successfully');
      } else {
        alert(responseData.error || 'Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/admin/templates?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTemplates();
        alert('Template deleted successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  const handleApprove = async (orderId: string) => {
    if (!confirm('Approve this order?')) return;

    try {
      const response = await fetch(`/api/admin/template-orders/${orderId}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Order approved!');
        fetchOrders();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to approve order');
      }
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Failed to approve order');
    }
  };

  const handleDeliver = async (orderId: string) => {
    if (!deliveryUrl.trim()) {
      alert('Masukkan link website yang sudah jadi');
      return;
    }

    try {
      setIsDelivering(true);
      const response = await fetch(`/api/admin/template-orders/${orderId}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryUrl: deliveryUrl.trim() }),
      });

      if (response.ok) {
        alert('Website berhasil dikirim ke customer dan komisi sudah dikreditkan!');
        setDeliverOrderId(null);
        setDeliveryUrl('');
        fetchOrders();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to deliver');
      }
    } catch (error) {
      console.error('Deliver error:', error);
      alert('Failed to deliver');
    } finally {
      setIsDelivering(false);
    }
  };

  const handleDecline = async (orderId: string) => {
    if (!confirm('Decline this order?')) return;

    try {
      const response = await fetch(`/api/admin/template-orders/${orderId}/decline`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Order declined!');
        fetchOrders();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to decline order');
      }
    } catch (error) {
      console.error('Error declining order:', error);
      alert('Failed to decline order');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-[#18181B]">Website</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('website')}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === 'website' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Website
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === 'orders' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === 'earnings' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Earnings
          </button>
        </div>
      </div>

      {activeTab === 'website' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                setEditingTemplate(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Add New Website
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingTemplate ? 'Edit Website' : 'Create New Website'}
              </h3>
              <TemplateForm
                template={editingTemplate || undefined}
                onSubmit={editingTemplate ? handleUpdate : handleCreate}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTemplate(null);
                }}
              />
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {template.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {template.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Rp {template.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          template.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {template.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingTemplate(template);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {templates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No websites found.
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-light text-[#18181B]">Website Orders</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowManualOrderModal(true)}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                + Manual Order
              </button>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterStatus === 'all' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending_verification')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterStatus === 'pending_verification' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('paid')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterStatus === 'paid' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilterStatus('verified')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setFilterStatus('declined')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filterStatus === 'declined' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Declined
              </button>
            </div>
          </div>

          {/* Manual Order Modal */}
          {showManualOrderModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Create Manual Order</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const masterTemplateId = formData.get('masterTemplateId') as string;
                  const customerName = formData.get('customerName') as string;
                  const customerEmail = formData.get('customerEmail') as string;
                  const customerPhone = formData.get('customerPhone') as string;
                  const affiliateId = formData.get('affiliateId') as string;
                  const notes = formData.get('notes') as string;

                  try {
                    const response = await fetch('/api/admin/template-orders/manual', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        masterTemplateId,
                        customerName,
                        customerEmail,
                        customerPhone,
                        affiliateId: affiliateId || null,
                        notes,
                      }),
                    });

                    if (response.ok) {
                      alert('Manual order created successfully');
                      setShowManualOrderModal(false);
                      fetchOrders();
                    } else {
                      const data = await response.json();
                      alert(data.error || 'Failed to create manual order');
                    }
                  } catch (error) {
                    console.error('Error creating manual order:', error);
                    alert('Failed to create manual order');
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website Template</label>
                      <select
                        name="masterTemplateId"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select template</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title} - Rp {t.price.toLocaleString('id-ID')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        name="customerName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                      <input
                        type="email"
                        name="customerEmail"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
                      <input
                        type="text"
                        name="customerPhone"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate ID (Optional)</label>
                      <input
                        type="text"
                        name="affiliateId"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter affiliate user ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                      <textarea
                        name="notes"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowManualOrderModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg hover:opacity-90"
                    >
                      Create Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Affiliate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.userTemplate.masterTemplate.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Rp {order.userTemplate.masterTemplate.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.affiliate ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {order.affiliate.storeName || order.affiliate.name || order.affiliate.username || '—'}
                              </span>
                              <TierBadge tier={order.affiliate.tier} size="xs" variant="solid" />
                            </div>
                            <span className="text-[10px] text-gray-500">{order.affiliate.email}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">No affiliate</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.affiliate ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              Rp {order.affiliate.commissionAmount.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {Math.round(order.affiliate.commissionRate * 100)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {order.customerName ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                            <span className="text-[10px] text-gray-500">{order.customerEmail}</span>
                            <span className="text-[10px] text-gray-500">{order.customerPhone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.paymentMethod?.startsWith('manual_') ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-orange-600 font-medium">Manual ({order.paymentMethod.replace('manual_', '').toUpperCase()})</span>
                            {order.paymentProof && (
                              <a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs">
                                View Proof
                              </a>
                            )}
                          </div>
                        ) : order.midtransOrderId ? (
                          <span className="text-xs text-purple-600">Midtrans</span>
                        ) : order.paymentProof ? (
                          <a
                            href={order.paymentProof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            View Proof
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'paid'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'pending_verification'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'pending_payment'
                              ? 'bg-orange-100 text-orange-800'
                              : order.status === 'declined' || order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status === 'paid' ? 'Paid - Perlu Dikerjakan' : order.status === 'pending_payment' ? 'Menunggu Pembayaran' : order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'pending_verification' && (
                          <>
                            <button
                              onClick={() => handleApprove(order.id)}
                              className="text-green-600 hover:text-green-800 mr-4"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecline(order.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {order.status === 'paid' && (
                          <>
                            {deliverOrderId === order.id ? (
                              <div className="flex flex-col gap-2 min-w-[250px]">
                                <input
                                  type="text"
                                  value={deliveryUrl}
                                  onChange={(e) => setDeliveryUrl(e.target.value)}
                                  placeholder="Link website yang sudah jadi"
                                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-full"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDeliver(order.id)}
                                    disabled={isDelivering}
                                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-700 disabled:opacity-50"
                                  >
                                    {isDelivering ? 'Mengirim...' : 'Kirim'}
                                  </button>
                                  <button
                                    onClick={() => { setDeliverOrderId(null); setDeliveryUrl(''); }}
                                    className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-300"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeliverOrderId(order.id)}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700"
                              >
                                Selesai & Kirim
                              </button>
                            )}
                          </>
                        )}
                        {order.status === 'verified' && order.downloadUrl && (
                          <a
                            href={order.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Lihat Hasil
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No orders found.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'earnings' && (
        <>
          {earningsLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : !earnings ? (
            <div className="text-center py-8 text-red-500">Failed to load earnings data</div>
          ) : (
            <>
              <h3 className="text-xl font-light text-[#18181B] mb-6">Website Sales Earnings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium mb-2 text-gray-600">
                    Total Sales Revenue
                  </h3>
                  <p className="text-3xl font-bold mb-2 text-blue-600">
                    Rp {earnings.totalSalesRevenue.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {earnings.totalSales} sales
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium mb-2 text-gray-600">
                    User Commissions (per-tier)
                  </h3>
                  <p className="text-3xl font-bold mb-2 text-purple-600">
                    Rp {earnings.totalUserCommissions.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Milik user
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium mb-2 text-gray-600">
                    Pending Withdrawals
                  </h3>
                  <p className="text-3xl font-bold mb-2 text-orange-600">
                    Rp {earnings.totalPendingWithdrawals.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {earnings.pendingWithdrawalCount} pending requests
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium mb-2 text-gray-600">
                    Available Balance
                  </h3>
                  <p className="text-3xl font-bold mb-2 text-green-600">
                    Rp {earnings.availableBalance.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Uang kamu (Platform)
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium mb-4 text-gray-600">
                    Platform Revenue
                  </h3>
                  <p className="text-4xl font-bold text-indigo-600">
                    Rp {earnings.platformRevenue.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Revenue setelah dikurangi user commissions
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium mb-4 text-gray-600">
                    Total Paid Withdrawals
                  </h3>
                  <p className="text-4xl font-bold text-gray-600">
                    Rp {earnings.totalPaidWithdrawals.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Sudah dibayar ke user
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-6">
                <h3 className="text-sm font-medium mb-2 text-blue-800">
                  Perhitungan Aman:
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Platform Revenue = Total Sales - User Commissions (tier-based: 15-80%)</li>
                  <li>• Available Balance = Platform Revenue - Pending Withdrawals - Paid Withdrawals</li>
                  <li>• Pending Withdrawals = Withdraw requests yang belum dibayar</li>
                  <li>• User Commissions = Milik user, bukan milik platform</li>
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
