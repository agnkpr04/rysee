'use client';

import { useEffect, useState } from 'react';
import { TemplateOrder } from '@/lib/templates/types';
import { supabase } from '@/lib/supabase';

export default function OrdersSection() {
  const [orders, setOrders] = useState<TemplateOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/template-order/my-orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    // Manual verification is now handled by admin
    // This button is kept for backward compatibility but will show a message
    alert('Payment verification is now handled by admin. Please wait for admin approval.');
  };

  const handleDownload = async (orderId: string) => {
    try {
      const response = await fetch(`/api/template-order/${orderId}/download`);
      if (response.ok) {
        const data = await response.json();
        window.open(data.downloadUrl, '_blank');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to download template');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
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
      <h2 className="text-2xl font-light text-[#18181B] mb-6">My Orders</h2>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Proof
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Download Count
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending_verification'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'pending'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status === 'pending_verification' ? 'Pending Verification' : order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.downloadUrl && order.status === 'pending_verification' ? (
                    <a
                      href={order.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Proof
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.downloadCount}/3
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.status === 'verified' && (
                    <button
                      onClick={() => handleDownload(order.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Download
                    </button>
                  )}
                  {order.status === 'declined' && (
                    <span className="text-red-600 text-sm">Order Declined</span>
                  )}
                  {order.status === 'pending_verification' && (
                    <span className="text-yellow-600 text-sm">Waiting for Admin Approval</span>
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
    </div>
  );
}
