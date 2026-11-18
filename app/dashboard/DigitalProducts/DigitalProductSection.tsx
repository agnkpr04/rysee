'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DigitalProductForm from '@/components/admin/DigitalProductForm';
import TierBadge from '@/components/TierBadge';

interface DigitalProductOrder {
  id: string;
  status: string;
  downloadUrl: string | null;
  paymentProof: string | null;
  paymentMethod: string | null;
  created_at: string;
  userId: string;
  userDigitalProduct: {
    masterDigitalProduct: {
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

interface MasterDigitalProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail: string;
  previewUrl: string | null;
  previewImages: string[];
  downloadUrl: string;
  category: string;
  subCategory: string | null;
  productType: string | null;
  contentCategory: string | null;
  features: string[];
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

type TabType = 'digital-products' | 'orders' | 'earnings';

export default function DigitalProductSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('digital-products');
  const [digitalProducts, setDigitalProducts] = useState<MasterDigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDigitalProduct, setEditingDigitalProduct] = useState<MasterDigitalProduct | null>(null);

  // Orders state
  const [orders, setOrders] = useState<DigitalProductOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
      await fetchDigitalProducts();
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

  const fetchDigitalProducts = async () => {
    try {
      const response = await fetch('/api/admin/digital-products');
      const data = await response.json();
      setDigitalProducts(data.digitalProducts || []);
    } catch (error) {
      console.error('Error fetching digital products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const url = filterStatus === 'all'
        ? '/api/admin/digital-product-orders'
        : `/api/admin/digital-product-orders?status=${filterStatus}`;

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
      const response = await fetch('/api/admin/digital-product-earnings');
      if (response.ok) {
        const data = await response.json();
        setEarnings(data);
      } else {
        const error = await response.json();
        console.error('Error fetching earnings:', error);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setEarningsLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      const response = await fetch('/api/admin/digital-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowForm(false);
        fetchDigitalProducts();
        alert('Digital product created successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create digital product');
      }
    } catch (error) {
      console.error('Error creating digital product:', error);
      alert('Failed to create digital product');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const response = await fetch('/api/admin/digital-products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingDigitalProduct(null);
        fetchDigitalProducts();
        alert('Digital product updated successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update digital product');
      }
    } catch (error) {
      console.error('Error updating digital product:', error);
      alert('Failed to update digital product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this digital product?')) return;

    try {
      const response = await fetch(`/api/admin/digital-products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDigitalProducts();
        alert('Digital product deleted successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete digital product');
      }
    } catch (error) {
      console.error('Error deleting digital product:', error);
      alert('Failed to delete digital product');
    }
  };

  const handleApprove = async (orderId: string) => {
    if (!confirm('Approve this order?')) return;

    try {
      const response = await fetch(`/api/admin/digital-product-orders/${orderId}/approve`, {
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

  const handleDecline = async (orderId: string) => {
    if (!confirm('Decline this order?')) return;

    try {
      const response = await fetch(`/api/admin/digital-product-orders/${orderId}/decline`, {
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
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('digital-products')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'digital-products'
              ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Digital Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'orders'
              ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'earnings'
              ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Earnings
        </button>
      </div>

      {activeTab === 'digital-products' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light text-[#18181B]">Digital Products</h2>
            <button
              onClick={() => {
                setEditingDigitalProduct(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Add New Digital Product
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingDigitalProduct ? 'Edit Digital Product' : 'Create New Digital Product'}
              </h3>
              <DigitalProductForm
                ebook={editingDigitalProduct || undefined}
                onSubmit={editingDigitalProduct ? handleUpdate : handleCreate}
                onCancel={() => {
                  setShowForm(false);
                  setEditingDigitalProduct(null);
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
                    Product Type
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
                {digitalProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        {product.productType || 'ebook'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Rp {product.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingDigitalProduct(product);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {digitalProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No digital products found.
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light text-[#18181B]">Digital Product Orders</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'all'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending_verification')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'pending_verification'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('verified')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'verified'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setFilterStatus('declined')}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === 'declined'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Declined
              </button>
            </div>
          </div>

          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading orders...</div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Digital Product
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
                      Payment Proof
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                        {order.userDigitalProduct.masterDigitalProduct.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Rp {order.userDigitalProduct.masterDigitalProduct.price.toLocaleString('id-ID')}
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
                          <span className="text-gray-400 text-xs">No proof</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending_verification'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
          <div className="mb-6">
            <h2 className="text-2xl font-light text-[#18181B]">Digital Product Earnings</h2>
          </div>

          {earningsLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading earnings...</div>
            </div>
          ) : earnings ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Sales Revenue</h3>
                <p className="text-2xl font-bold text-[#18181B]">
                  Rp {earnings.totalSalesRevenue.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total User Commissions</h3>
                <p className="text-2xl font-bold text-[#8B5CF6]">
                  Rp {earnings.totalUserCommissions.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Platform Revenue</h3>
                <p className="text-2xl font-bold text-[#D946EF]">
                  Rp {earnings.platformRevenue.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Available Balance</h3>
                <p className="text-2xl font-bold text-[#10B981]">
                  Rp {earnings.availableBalance.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Sales</h3>
                <p className="text-2xl font-bold text-[#18181B]">
                  {earnings.totalSales}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Withdrawals</h3>
                <p className="text-2xl font-bold text-[#F59E0B]">
                  Rp {earnings.totalPendingWithdrawals.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No earnings data available.
            </div>
          )}
        </>
      )}
    </div>
  );
}
