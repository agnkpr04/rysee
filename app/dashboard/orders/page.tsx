'use client';

import { useEffect, useState } from 'react';
import { TemplateOrder } from '@/lib/templates/types';
import { supabase } from '@/lib/supabase';

export default function OrdersDashboard() {
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
    const paymentProof = prompt('Enter payment proof URL:');
    if (!paymentProof) return;

    try {
      const response = await fetch(`/api/template-order/${orderId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentProof }),
      });

      if (response.ok) {
        alert('Payment verified! Download link generated.');
        fetchOrders();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Failed to verify payment');
    }
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.downloadCount}/3
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleVerifyPayment(order.id)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Verify Payment
                    </button>
                  )}
                  {order.status === 'verified' && (
                    <button
                      onClick={() => handleDownload(order.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Download
                    </button>
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
