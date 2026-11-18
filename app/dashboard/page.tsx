"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Crown, Package, LogOut, BarChart3, Trophy, Globe,
  BookOpen, Search, Bell, Mail, PanelLeftClose, PanelLeft, ExternalLink,
  MoreHorizontal, Activity,
} from 'lucide-react';
import OverviewSection from './Overview/OverviewSection';
import AdminSection from './Admins/AdminSection';
import MembershipSection from './Membership/MembershipSection';
import ProductSection from './Products/ProductSection';
import AnalyticsSection from './Analytics/AnalyticsSection';
import ReferralSection from './Referral/ReferralSection';
import TemplateSection from './Templates/TemplateSection';
import DigitalProductSection from './DigitalProducts/DigitalProductSection';

type Section = 'overview' | 'products' | 'admins' | 'membership' | 'analytics' | 'referral' | 'website' | 'digital-products';

interface NavItem {
  id: Section;
  label: string;
  icon: typeof Package;
  description: string;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Menu',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: "Here's what's happening on your platform today." },
      { id: 'products', label: 'Products', icon: Package, description: 'Manage master products in the catalog.' },
      { id: 'digital-products', label: 'Digital Products', icon: BookOpen, description: 'Manage digital product catalog.' },
      { id: 'website', label: 'Website', icon: Globe, description: 'Manage website templates.' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Deep dive into platform metrics.' },
      { id: 'referral', label: 'Referral', icon: Trophy, description: 'Review referral activity and payouts.' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'admins', label: 'Admins', icon: Users, description: 'Manage admin access.' },
      { id: 'membership', label: 'Membership', icon: Crown, description: 'Manage membership plans and subscriptions.' },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeItem = allItems.find((i) => i.id === activeSection);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('[DashboardPage] handleLogout called');

    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      console.log('[DashboardPage] Logout API called');
    } catch (err) {
      console.error('[DashboardPage] Logout API error:', err);
    }

    console.log('[DashboardPage] Redirecting to login');
    window.location.replace('/admin/login');
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveSection(item.id)}
        title={!isSidebarOpen ? item.label : undefined}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm ${
          isActive
            ? 'bg-gray-100 text-gray-900 font-semibold'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
        } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
      >
        <Icon
          className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-orange-500' : ''}`}
          strokeWidth={isActive ? 2 : 1.7}
        />
        {isSidebarOpen && <span className="truncate">{item.label}</span>}
        {isSidebarOpen && isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex ${isSidebarOpen ? 'w-[260px]' : 'w-[76px]'} bg-white border-r border-gray-100 transition-all duration-300 flex-col sticky top-0 h-screen`}>
        {/* Logo */}
        <div className={`px-5 pt-6 pb-5 ${!isSidebarOpen ? 'px-0 flex justify-center' : ''}`}>
          {isSidebarOpen ? (
            <div className="flex items-end gap-2.5 min-w-0">
              <img src="/images/2.png" alt="Rysee" className="h-7 w-auto" />
              <span className="text-[10px] font-medium text-gray-400 pb-0.5">Admin</span>
            </div>
          ) : (
            <div className="w-9 h-9 overflow-hidden flex-shrink-0">
              <img src="/images/2.png" alt="Rysee" className="h-9 w-auto max-w-none" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto space-y-5 ${isSidebarOpen ? 'px-3.5' : 'px-3'}`}>
          {navGroups.map((group) => (
            <div key={group.label}>
              {isSidebarOpen && (
                <p className="px-3.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                  {group.label}
                </p>
              )}
              {!isSidebarOpen && <div className="mx-2 mb-2 border-t border-gray-100" />}
              <div className="space-y-1">
                {group.items.map(renderNavItem)}
              </div>
            </div>
          ))}
        </nav>

        {/* Status card */}
        {isSidebarOpen ? (
          <div className="mx-3.5 mb-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                <Activity className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-xs font-semibold text-gray-900">System Status</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-gray-500">
              All services are running smoothly.
            </p>
            <button
              onClick={() => setActiveSection('analytics')}
              className="mt-3 w-full bg-gray-900 text-white text-xs font-medium py-2 rounded-xl hover:bg-gray-800 transition-colors"
            >
              View Analytics
            </button>
          </div>
        ) : (
          <div className="mx-3 mb-3 flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center" title="All systems operational">
              <Activity className="w-4 h-4 text-green-500" />
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className={`border-t border-gray-100 py-2 space-y-1 ${isSidebarOpen ? 'px-3.5' : 'px-3'}`}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
            title={!isSidebarOpen ? 'View Storefront' : undefined}
          >
            <ExternalLink className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.7} />
            {isSidebarOpen && <span>View Storefront</span>}
          </a>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
            title={!isSidebarOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.7} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Admin profile */}
        <div className={`border-t border-gray-100 p-3.5 ${!isSidebarOpen ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF8A3D] to-[#F97316] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            {isSidebarOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">Administrator</p>
                  <p className="text-[10px] text-gray-400">Super Admin</p>
                </div>
                <MoreHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#F5F6F8]/85 backdrop-blur-md px-4 md:px-7 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2 bg-white border border-gray-100 hover:bg-gray-50 rounded-xl transition-colors flex-shrink-0"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-[18px] h-[18px] text-gray-500" strokeWidth={1.7} />
              ) : (
                <PanelLeft className="w-[18px] h-[18px] text-gray-500" strokeWidth={1.7} />
              )}
            </button>
            <div className="min-w-0">
              <h2 className="text-base md:text-lg font-semibold tracking-tight text-gray-900 truncate">
                Welcome Back, Admin!
              </h2>
              <p className="text-[11px] md:text-xs text-gray-400 truncate">
                {activeItem?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3.5 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.7} />
              <input
                type="text"
                placeholder="Search for Products, Users etc..."
                className="bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </div>
            <button className="p-2.5 bg-white border border-gray-100 hover:bg-gray-50 rounded-xl transition-colors">
              <Mail className="w-[18px] h-[18px] text-gray-500" strokeWidth={1.7} />
            </button>
            <button className="relative p-2.5 bg-white border border-gray-100 hover:bg-gray-50 rounded-xl transition-colors">
              <Bell className="w-[18px] h-[18px] text-gray-500" strokeWidth={1.7} />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-4 md:px-7 py-5 overflow-auto">
          {activeSection === 'overview' && <OverviewSection onNavigate={(s) => setActiveSection(s as Section)} />}
          {activeSection === 'products' && <ProductSection />}
          {activeSection === 'digital-products' && <DigitalProductSection />}
          {activeSection === 'analytics' && <AnalyticsSection />}
          {activeSection === 'referral' && <ReferralSection />}
          {activeSection === 'website' && <TemplateSection />}
          {activeSection === 'admins' && <AdminSection />}
          {activeSection === 'membership' && <MembershipSection />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <div className="flex items-center gap-1 px-3 py-2.5 overflow-x-auto">
          {allItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="flex flex-col items-center gap-1 px-2.5 py-1 flex-shrink-0"
                title={item.label}
              >
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? 'bg-orange-500 shadow-[0_4px_10px_rgba(249,115,22,0.35)]' : ''
                }`}>
                  <Icon
                    className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-gray-400'}`}
                    strokeWidth={1.7}
                  />
                </div>
                <span className={`text-[9px] font-medium ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-2.5 py-1 flex-shrink-0"
            title="Logout"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-xl">
              <LogOut className="w-[18px] h-[18px] text-gray-400" strokeWidth={1.7} />
            </div>
            <span className="text-[9px] font-medium text-gray-400">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
