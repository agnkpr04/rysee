"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, Package, MousePointer2, Wallet, RefreshCw, ChevronRight, ChevronDown,
  Store, TrendingUp, ArrowUpRight, Trophy, BookOpen, Crown, BarChart3,
} from 'lucide-react';

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

interface EarningsData {
  totalSalesRevenue: number;
  platformRevenue: number;
  totalSales: number;
  totalTemplateSales: number;
  totalDigitalSales: number;
}

interface OrderLike {
  created_at?: string;
  createdAt?: string;
}

const fmtCompactIDR = (v: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(v || 0);

const DOT_COLORS = ['#F97316', '#3B82F6', '#A855F7', '#EC4899', '#10B981'];

function buildDailySeries(orders: OrderLike[], days = 30) {
  const buckets = new Array(days).fill(0) as number[];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const o of orders) {
    const raw = o.created_at || o.createdAt;
    if (!raw) continue;
    const d = new Date(raw);
    if (isNaN(d.getTime())) continue;
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = Math.floor((today.getTime() - dayStart.getTime()) / 86400000);
    if (diff >= 0 && diff < days) buckets[days - 1 - diff]++;
  }
  return buckets;
}

function MiniBars({ color = '#F97316' }: { color?: string }) {
  const heights = [10, 16, 8, 20, 14, 26];
  return (
    <div className="flex items-end gap-[3px] h-7">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-[5px] rounded-sm"
          style={{ height: `${h}px`, backgroundColor: i === heights.length - 1 ? color : '#FED7AA' }}
        />
      ))}
    </div>
  );
}

export default function OverviewSection({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [salesSeries, setSalesSeries] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [analyticsRes, earningsRes, templateRes, digitalRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/earnings'),
        fetch('/api/admin/template-orders?status=verified'),
        fetch('/api/admin/digital-product-orders?status=verified'),
      ]);

      if (analyticsRes.ok) {
        setAnalytics(await analyticsRes.json());
      } else {
        setHasError(true);
      }
      if (earningsRes.ok) {
        setEarnings(await earningsRes.json());
      }

      const orders: OrderLike[] = [];
      if (templateRes.ok) {
        const data = await templateRes.json();
        const list = Array.isArray(data) ? data : data?.orders;
        if (Array.isArray(list)) orders.push(...list);
      }
      if (digitalRes.ok) {
        const data = await digitalRes.json();
        const list = Array.isArray(data) ? data : data?.orders;
        if (Array.isArray(list)) orders.push(...list);
      }
      setSalesSeries(buildDailySeries(orders));
    } catch (err) {
      console.error('Failed to load overview:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const donut = useMemo(() => {
    if (!analytics) return null;
    const seg = [
      { label: 'Last 7 days', value: analytics.clicksLast7Days, color: '#F97316' },
      { label: '8–30 days', value: Math.max(analytics.clicksLast30Days - analytics.clicksLast7Days, 0), color: '#3B82F6' },
      { label: 'Older', value: Math.max(analytics.totalClicks - analytics.clicksLast30Days, 0), color: '#A855F7' },
    ];
    const total = seg.reduce((s, x) => s + x.value, 0) || 1;
    const R = 52;
    const C = 2 * Math.PI * R;
    let offset = 0;
    const arcs = seg.map((s) => {
      const frac = s.value / total;
      const arc = { ...s, dash: frac * C, offset };
      offset += frac * C;
      return arc;
    });
    return { arcs, total, R, C };
  }, [analytics]);

  const chart = useMemo(() => {
    const W = 600, H = 170, PAD = 8;
    const days = salesSeries.length || 30;
    const max = Math.max(...salesSeries, 1);
    const stepX = (W - PAD * 2) / (days - 1);
    const pts = salesSeries.map((v, i) => [
      PAD + i * stepX,
      H - PAD - 14 - (v / max) * (H - PAD * 2 - 26),
    ]);
    if (!pts.length) return null;
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area = `${line} L${(W - PAD).toFixed(1)},${H} L${PAD},${H} Z`;
    const last = pts[pts.length - 1];
    return { W, H, line, area, max, last };
  }, [salesSeries]);

  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (hasError && !analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
        <p className="text-sm">Failed to load overview data</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Users',
      value: analytics?.totalUsers ?? 0,
      chip: `${analytics?.activeUsers ?? 0} active`,
      icon: Users,
      iconBg: 'bg-orange-50 text-orange-500',
    },
    {
      label: 'Total Products',
      value: analytics?.totalProducts ?? 0,
      chip: `${analytics?.totalUserProducts ?? 0} in stores`,
      icon: Package,
      iconBg: 'bg-blue-50 text-blue-500',
    },
    {
      label: 'Total Clicks',
      value: analytics?.totalClicks ?? 0,
      chip: `+${(analytics?.clicksLast7Days ?? 0).toLocaleString()} / 7d`,
      icon: MousePointer2,
      iconBg: 'bg-purple-50 text-purple-500',
    },
    {
      label: 'Platform Revenue',
      value: earnings ? fmtCompactIDR(earnings.platformRevenue) : '—',
      chip: `${earnings?.totalSales ?? 0} sales`,
      icon: Wallet,
      iconBg: 'bg-pink-50 text-pink-500',
    },
  ];

  const quickActions = [
    { id: 'products', label: 'Manage Products', icon: Package, bg: 'bg-orange-50 text-orange-500' },
    { id: 'digital-products', label: 'Digital Products', icon: BookOpen, bg: 'bg-blue-50 text-blue-500' },
    { id: 'referral', label: 'Referral & Payouts', icon: Trophy, bg: 'bg-purple-50 text-purple-500' },
    { id: 'membership', label: 'Membership Plans', icon: Crown, bg: 'bg-pink-50 text-pink-500' },
  ];

  return (
    <div className="space-y-5">
      {/* Highlights header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Highlights</h3>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                    <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                  </div>
                  <span className="text-xs font-medium text-gray-500">{card.label}</span>
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-green-50 text-green-600 whitespace-nowrap">
                  {card.chip}
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-2">
                <span className="text-[28px] leading-none font-semibold text-gray-900 tracking-tight">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </span>
                <MiniBars />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales chart + traffic donut */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales Overview */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Sales Overview</h4>
              <p className="text-xs text-gray-400 mt-0.5">Verified orders in the last 30 days.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                Templates + Digital <ChevronDown className="w-3 h-3" />
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                Last 30 Days
              </span>
            </div>
          </div>

          <div className="mt-4">
            {chart ? (
              <div className="relative">
                <svg
                  viewBox={`0 0 ${chart.W} ${chart.H}`}
                  className="w-full h-44"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="salesArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75].map((f) => (
                    <line
                      key={f}
                      x1="8"
                      x2={chart.W - 8}
                      y1={chart.H * f}
                      y2={chart.H * f}
                      stroke="#F3F4F6"
                      strokeWidth="1"
                      strokeDasharray="3 4"
                    />
                  ))}
                  <path d={chart.area} fill="url(#salesArea)" />
                  <path d={chart.line} fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                  <circle cx={chart.last[0]} cy={chart.last[1]} r="4" fill="#F97316" stroke="#fff" strokeWidth="2" />
                </svg>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                  {[1, 5, 10, 15, 20, 25, 30].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center text-sm text-gray-400">
                No sales data yet
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-gray-50 px-3.5 py-2.5">
              <p className="text-[11px] text-gray-400">Total Orders</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{(earnings?.totalSales ?? 0).toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-gray-50 px-3.5 py-2.5">
              <p className="text-[11px] text-gray-400">Sales Revenue</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{earnings ? fmtCompactIDR(earnings.totalSalesRevenue) : '—'}</p>
            </div>
            <div className="rounded-xl bg-gray-50 px-3.5 py-2.5">
              <p className="text-[11px] text-gray-400">Best Day</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{Math.max(...salesSeries, 0)} orders</p>
            </div>
          </div>
        </div>

        {/* Traffic Split donut */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Traffic Split</h4>
            <MousePointer2 className="w-4 h-4 text-gray-300" />
          </div>

          {donut && (
            <>
              <div className="relative w-40 h-40 mx-auto mt-5">
                <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r={donut.R} fill="none" stroke="#F3F4F6" strokeWidth="16" />
                  {donut.arcs.map((a) => (
                    <circle
                      key={a.label}
                      cx="64"
                      cy="64"
                      r={donut.R}
                      fill="none"
                      stroke={a.color}
                      strokeWidth="16"
                      strokeDasharray={`${Math.max(a.dash - 1.5, 0)} ${donut.C}`}
                      strokeDashoffset={-a.offset}
                      strokeLinecap="butt"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-gray-400">Total Clicks</span>
                  <span className="text-2xl font-semibold text-gray-900 leading-tight">
                    {donut.total > 1 ? donut.total.toLocaleString() : 0}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {donut.arcs.map((a) => (
                  <div key={a.label} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                    <span className="text-gray-500 flex-1">{a.label}</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round((a.value / (donut.total || 1)) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top users table + quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top users */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Top Performing Affiliates</h4>
              <p className="text-xs text-gray-400 mt-0.5">Ranked by products & clicks.</p>
            </div>
            <button
              onClick={() => onNavigate?.('analytics')}
              className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 pr-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Rank</th>
                  <th className="text-left py-2.5 pr-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Affiliate</th>
                  <th className="text-left py-2.5 pr-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Store</th>
                  <th className="text-right py-2.5 pr-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Products</th>
                  <th className="text-right py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {(analytics?.topUsers ?? []).slice(0, 6).map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 pr-4 w-12">
                      {index === 0 ? (
                        <Crown className="w-4 h-4 text-amber-500" />
                      ) : (
                        <span className="text-xs font-semibold text-gray-400">{index + 1}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: DOT_COLORS[index % DOT_COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[160px]">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-sm text-gray-500">{user.storeName || '—'}</span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className="text-sm font-medium text-gray-900">{user.productCount}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                        <TrendingUp className="w-3 h-3" /> {user.clickCount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!analytics || analytics.topUsers.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-gray-400">
                      No affiliate data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] flex flex-col">
          <h4 className="text-sm font-semibold text-gray-900">Quick Actions</h4>
          <p className="text-xs text-gray-400 mt-0.5">Jump straight into a task.</p>

          <div className="mt-4 space-y-1.5 flex-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => onNavigate?.(action.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${action.bg}`}>
                    <Icon className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 flex-1">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate?.('analytics')}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <BarChart3 className="w-4 h-4" /> Open Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
