'use client';

import { useEffect, useState } from 'react';

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

export default function EarningsSection() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await fetch('/api/admin/earnings');
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
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="text-center py-8 text-red-500">Failed to load earnings data</div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-light text-[#18181B] mb-6">Website Sales Earnings</h2>
      
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
    </div>
  );
}
