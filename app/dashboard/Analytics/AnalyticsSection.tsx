"use client";

import { useState, useEffect } from 'react';
import { Users, Package, Store, MousePointer2, TrendingUp, BarChart3, Crown } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalProducts: number;
  totalUserProducts: number;
  totalStores: number;
  totalClicks: number;
  activeUsers: number;
  topUsers: Array<{
    id: string;
    name: string;
    storeName: string | null;
    productCount: number;
    clickCount: number;
  }>;
  clicksLast7Days: number;
  clicksLast30Days: number;
}

export default function AnalyticsSection() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Failed to load analytics data
      </div>
    );
  }

  const metrics = [
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Products', value: analytics.totalProducts, icon: Package, color: 'bg-green-500' },
    { label: 'Total Stores', value: analytics.totalStores, icon: Store, color: 'bg-purple-500' },
    { label: 'Total Clicks', value: analytics.totalClicks, icon: MousePointer2, color: 'bg-orange-500' },
    { label: 'Active Users (30d)', value: analytics.activeUsers, icon: TrendingUp, color: 'bg-pink-500' },
    { label: 'Products in Stores', value: analytics.totalUserProducts, icon: BarChart3, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
        <p className="text-gray-600 mt-1">Overview of platform performance and activity</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Clicks Trend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Clicks Trend</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Last 7 Days</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.clicksLast7Days.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Last 30 Days</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.clicksLast30Days.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Top Performing Users */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Store</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Products</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topUsers.map((user, index) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                    {index === 1 && <span className="text-gray-400 font-bold">2</span>}
                    {index === 2 && <span className="text-orange-400 font-bold">3</span>}
                    {index > 2 && <span className="text-gray-400">{index + 1}</span>}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.storeName || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{user.productCount}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{user.clickCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
