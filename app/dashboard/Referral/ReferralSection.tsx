"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Users, Wallet, Check, X, Search, Calendar, ArrowUpRight, Package, FileText, Plus, Edit, Trash2 } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referralCode: string;
  status: string;
  createdAt: string;
  referrer: {
    id: string;
    email: string;
    name: string | null;
    earnings: number;
  };
  referred: {
    id: string;
    email: string;
    name: string | null;
  };
  earnings: Array<{
    id: string;
    amount: number;
    status: string;
  }>;
}

interface WithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface ContentAsset {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  googleDriveLink: string | null;
  isActive: boolean;
  order: number;
}

interface Copywriting {
  id: string;
  title: string;
  content: string;
  category: string | null;
  isActive: boolean;
  order: number;
}

interface Caption {
  id: string;
  title: string | null;
  content: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

export default function ReferralSection() {
  const router = useRouter();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>([]);
  const [copywritings, setCopywritings] = useState<Copywriting[]>([]);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [summary, setSummary] = useState<{
    totalReferrals: number;
    completedReferrals: number;
    totalEarnings: number;
    paidEarnings: number;
    pendingEarnings: number;
  }>({
    totalReferrals: 0,
    completedReferrals: 0,
    totalEarnings: 0,
    paidEarnings: 0,
    pendingEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'referrals' | 'assets' | 'copywriting' | 'caption'>('referrals');
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isCopywritingModalOpen, setIsCopywritingModalOpen] = useState(false);
  const [isCaptionModalOpen, setIsCaptionModalOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('admin_session='));
      if (!sessionCookie) {
        router.push('/admin/login');
        return;
      }

      await Promise.all([fetchReferrals(), fetchContentAssets(), fetchCopywritings(), fetchCaptions()]);
      setIsLoading(false);
    };

    checkSession();
  }, [router]);

  const fetchReferrals = async () => {
    try {
      const res = await fetch('/api/admin/referral/list');
      if (res.ok) {
        const data = await res.json();
        setReferrals(data.referrals || []);
        setWithdrawRequests(data.withdrawRequests || []);
        setSummary(data.summary || {
          totalReferrals: 0,
          completedReferrals: 0,
          totalEarnings: 0,
          paidEarnings: 0,
          pendingEarnings: 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    }
  };

  const fetchContentAssets = async () => {
    try {
      const res = await fetch('/api/admin/content-assets');
      if (res.ok) {
        const data = await res.json();
        setContentAssets(data.contentAssets || []);
      }
    } catch (err) {
      console.error('Failed to fetch content assets:', err);
    }
  };

  const fetchCopywritings = async () => {
    try {
      const res = await fetch('/api/admin/copywriting');
      if (res.ok) {
        const data = await res.json();
        setCopywritings(data.copywriting || []);
      }
    } catch (err) {
      console.error('Failed to fetch copywriting:', err);
    }
  };

  const fetchCaptions = async () => {
    try {
      const res = await fetch('/api/admin/caption');
      if (res.ok) {
        const data = await res.json();
        setCaptions(data.captions || []);
      }
    } catch (err) {
      console.error('Failed to fetch captions:', err);
    }
  };

  const handleApproveWithdraw = async (withdrawRequestId: string) => {
    if (!confirm('Are you sure you want to approve this withdraw request?')) return;

    try {
      const res = await fetch('/api/admin/referral/withdraw-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawRequestId }),
      });

      if (res.ok) {
        fetchReferrals();
        alert('Withdraw request approved!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to approve withdraw');
      }
    } catch (err) {
      console.error('Failed to approve withdraw:', err);
      alert('Failed to approve withdraw');
    }
  };

  const handleRejectWithdraw = async (withdrawRequestId: string) => {
    if (!confirm('Are you sure you want to reject this withdraw request?')) return;

    try {
      const res = await fetch('/api/admin/referral/withdraw-reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawRequestId }),
      });

      if (res.ok) {
        fetchReferrals();
        alert('Withdraw request rejected!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to reject withdraw');
      }
    } catch (err) {
      console.error('Failed to reject withdraw:', err);
      alert('Failed to reject withdraw');
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const res = await fetch(`/api/admin/content-assets/${assetId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchContentAssets();
        alert('Asset deleted successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete asset');
      }
    } catch (err) {
      console.error('Failed to delete asset:', err);
      alert('Failed to delete asset');
    }
  };

  const handleDeleteCopywriting = async (copywritingId: string) => {
    if (!confirm('Are you sure you want to delete this copywriting?')) return;

    try {
      const res = await fetch(`/api/admin/copywriting/${copywritingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCopywritings();
        alert('Copywriting deleted successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete copywriting');
      }
    } catch (err) {
      console.error('Failed to delete copywriting:', err);
      alert('Failed to delete copywriting');
    }
  };

  const handleDeleteCaption = async (captionId: string) => {
    if (!confirm('Are you sure you want to delete this caption?')) return;

    try {
      const res = await fetch(`/api/admin/caption/${captionId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCaptions();
        alert('Caption deleted successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete caption');
      }
    } catch (err) {
      console.error('Failed to delete caption:', err);
      alert('Failed to delete caption');
    }
  };

  const filteredReferrals = referrals.filter(referral =>
    referral.referrer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referral.referred.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referral.referralCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Use summary stats from API instead of manual calculation
  const totalReferrals = summary.totalReferrals;
  const totalEarnings = summary.totalEarnings;
  const paidEarnings = summary.paidEarnings;
  const pendingEarnings = summary.pendingEarnings;
  const pendingWithdrawals = withdrawRequests.filter(w => w.status === 'pending').length;
  const totalWithdrawn = withdrawRequests.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0);
  const pendingBalance = pendingEarnings - totalWithdrawn;
  
  // Calculate total revenue based on completed referrals (35000 per referral)
  const totalRevenue = summary.completedReferrals * 35000;
  // Admin profit: 10000 per completed referral (35000 - 25000 commission)
  const adminNetProfit = summary.completedReferrals * 10000;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="bg-white rounded-2xl border border-gray-50 p-2 inline-flex gap-2">
        <button
          onClick={() => setActiveSubTab('referrals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeSubTab === 'referrals'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
              : 'text-[#A1A1AA] hover:bg-gray-50'
          }`}
        >
          <Trophy className="w-4 h-4" strokeWidth={1.5} />
          Referrals
        </button>
        <button
          onClick={() => setActiveSubTab('assets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeSubTab === 'assets'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
              : 'text-[#A1A1AA] hover:bg-gray-50'
          }`}
        >
          <Package className="w-4 h-4" strokeWidth={1.5} />
          Content Assets
        </button>
        <button
          onClick={() => setActiveSubTab('copywriting')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeSubTab === 'copywriting'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
              : 'text-[#A1A1AA] hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" strokeWidth={1.5} />
          Copywriting
        </button>
        <button
          onClick={() => setActiveSubTab('caption')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeSubTab === 'caption'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white'
              : 'text-[#A1A1AA] hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" strokeWidth={1.5} />
          Caption
        </button>
      </div>

      {activeSubTab === 'referrals' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-3xl font-light text-[#18181B]">{totalReferrals}</span>
              </div>
              <p className="text-sm font-light text-[#A1A1AA]">Total Referrals</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#D946EF] to-[#EC4899] rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-3xl font-light text-[#18181B]">
                  Rp {(totalRevenue / 1000).toFixed(0)}k
                </span>
              </div>
              <p className="text-sm font-light text-[#A1A1AA]">Total Revenue</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#EC4899] to-[#F97316] rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-3xl font-light text-[#18181B]">
                  Rp {(adminNetProfit / 1000).toFixed(0)}k
                </span>
              </div>
              <p className="text-sm font-light text-[#A1A1AA]">Admin Net Profit</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-3xl font-light text-[#18181B]">
                  Rp {(totalEarnings / 1000).toFixed(0)}k
                </span>
              </div>
              <p className="text-sm font-light text-[#A1A1AA]">Commission Paid to Users</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-3xl font-light text-[#18181B]">
                  Rp {(totalWithdrawn / 1000).toFixed(0)}k
                </span>
              </div>
              <p className="text-sm font-light text-[#A1A1AA]">Total Withdrawn</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <span className="text-3xl font-light text-[#18181B]">
                  Rp {(pendingBalance / 1000).toFixed(0)}k
                </span>
              </div>
              <p className="text-sm font-light text-[#A1A1AA]">Pending Balance</p>
            </div>
          </div>

          {/* Referrals Table */}
          <div className="bg-white rounded-2xl border border-gray-50 shadow-sm">
            <div className="p-6 border-b border-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-[#18181B]">Referral List</h3>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 transform -translate-y-1/2" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Search referrals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[#F9F9FB] border border-gray-50 rounded-xl text-sm outline-none focus:border-[#8B5CF6] transition-all w-64"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9F9FB]">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">Referrer</th>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">Referred</th>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">Code</th>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredReferrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-light text-[#18181B]">{referral.referrer.name || referral.referrer.email}</p>
                          <p className="text-xs text-[#A1A1AA]">{referral.referrer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-light text-[#18181B]">{referral.referred.name || referral.referred.email}</p>
                          <p className="text-xs text-[#A1A1AA]">{referral.referred.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-[#F9F9FB] px-2 py-1 rounded text-[#8B5CF6]">
                          {referral.referralCode}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-light ${
                          referral.status === 'active'
                            ? 'bg-green-50 text-green-600'
                            : referral.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-gray-50 text-gray-600'
                        }`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-light text-[#A1A1AA]">
                          {new Date(referral.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Withdraw Requests */}
          <div className="bg-white rounded-2xl border border-gray-50 shadow-sm">
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-lg font-light text-[#18181B]">Withdrawal Requests</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9F9FB]">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">Bank Details</th>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-light text-[#A1A1AA] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {withdrawRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-light text-[#18181B]">{request.user.name || request.user.email}</p>
                          <p className="text-xs text-[#A1A1AA]">{request.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-light text-[#18181B]">
                          Rp {(request.amount / 1000).toFixed(0)}k
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-light text-[#18181B]">{request.accountName || '-'}</p>
                          <p className="text-xs text-[#A1A1AA]">{request.bankName} - {request.accountNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-light ${
                          request.status === 'approved'
                            ? 'bg-green-50 text-green-600'
                            : request.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-light text-[#A1A1AA]">
                          {new Date(request.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {request.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveWithdraw(request.id)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={() => handleRejectWithdraw(request.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'assets' && (
        <div className="bg-white rounded-2xl border border-gray-50 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-light text-[#18181B]">Content Assets</h3>
            <button onClick={() => setIsAssetModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-xl text-sm font-medium">
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              Add Asset
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentAssets.map((asset) => (
              <div key={asset.id} className="border border-gray-50 rounded-xl overflow-hidden">
                {asset.thumbnail && (
                  <div className="w-full h-32 bg-gray-100 relative">
                    <img
                      src={asset.thumbnail}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[#18181B]">{asset.title}</h4>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-3 h-3 text-[#A1A1AA]" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  {asset.description && <p className="text-xs text-[#A1A1AA] mb-2">{asset.description}</p>}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${asset.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                      {asset.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {asset.googleDriveLink && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 text-[#8B5CF6] font-medium">
                        Google Drive
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {contentAssets.length === 0 && (
              <div className="col-span-full text-center py-12 text-[#A1A1AA]">
                No content assets found
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'copywriting' && (
        <div className="bg-white rounded-2xl border border-gray-50 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-light text-[#18181B]">Copywriting</h3>
            <button onClick={() => setIsCopywritingModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-xl text-sm font-medium">
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              Add Copywriting
            </button>
          </div>
          <div className="space-y-4">
            {copywritings.map((copy) => (
              <div key={copy.id} className="border border-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-[#18181B]">{copy.title}</h4>
                    {copy.category && <span className="text-xs text-[#8B5CF6]">{copy.category}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-3 h-3 text-[#A1A1AA]" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleDeleteCopywriting(copy.id)}
                      className="p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[#A1A1AA] line-clamp-2">{copy.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${copy.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                    {copy.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
            {copywritings.length === 0 && (
              <div className="text-center py-12 text-[#A1A1AA]">
                No copywriting found
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'caption' && (
        <div className="bg-white rounded-2xl border border-gray-50 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-light text-[#18181B]">Caption</h3>
            <button onClick={() => setIsCaptionModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-xl text-sm font-medium">
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              Add Caption
            </button>
          </div>
          <div className="space-y-4">
            {captions.map((caption) => (
              <div key={caption.id} className="border border-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    {caption.title && <h4 className="font-medium text-[#18181B]">{caption.title}</h4>}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      caption.category === 'referral' ? 'bg-purple-50 text-purple-600' :
                      caption.category === 'komisi-digital' ? 'bg-pink-50 text-pink-600' :
                      'bg-indigo-50 text-indigo-600'
                    }`}>
                      {caption.category === 'referral' ? 'Referral Content' :
                       caption.category === 'komisi-digital' ? 'Komisi Produk Digital' :
                       'Referral + Komisi'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteCaption(caption.id)}
                      className="p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[#A1A1AA] line-clamp-2">{caption.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${caption.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                    {caption.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
            {captions.length === 0 && (
              <div className="text-center py-12 text-[#A1A1AA]">
                No captions found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-light text-[#18181B] mb-4">Add Content Asset</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              
              const title = (form.querySelector('[name="title"]') as HTMLInputElement).value;
              const description = (form.querySelector('[name="description"]') as HTMLTextAreaElement).value;
              const googleDriveLink = (form.querySelector('[name="googleDriveLink"]') as HTMLInputElement).value;
              const thumbnailFile = (form.querySelector('[name="thumbnail"]') as HTMLInputElement).files?.[0];
              
              // Create FormData to handle file upload
              const formData = new FormData();
              formData.append('title', title);
              formData.append('description', description);
              formData.append('googleDriveLink', googleDriveLink);
              if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile);
              }
              
              try {
                const res = await fetch('/api/admin/content-assets', {
                  method: 'POST',
                  body: formData,
                });
                const data = await res.json();
                if (res.ok) {
                  setIsAssetModalOpen(false);
                  fetchContentAssets();
                  alert('Asset added successfully!');
                } else {
                  console.error('Failed to add asset:', data);
                  alert('Failed to add asset: ' + (data.error || 'Unknown error'));
                }
              } catch (err) {
                console.error('Failed to add asset:', err);
                alert('Failed to add asset');
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Title</label>
                  <input name="title" type="text" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]" />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Description</label>
                  <textarea name="description" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Google Drive Link</label>
                  <input
                    name="googleDriveLink"
                    type="url"
                    required
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]"
                  />
                  <p className="text-xs text-[#A1A1AA] mt-1">Link ke folder atau file Google Drive</p>
                </div>
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Thumbnail</label>
                  <input
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]"
                  />
                  <p className="text-xs text-[#A1A1AA] mt-1">Upload gambar thumbnail (opsional)</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsAssetModalOpen(false)} className="px-4 py-2 text-sm text-[#A1A1AA] hover:text-[#18181B]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg text-sm">Add Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Caption Modal */}
      {isCaptionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-light text-[#18181B] mb-4">Add Caption</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              try {
                const res = await fetch('/api/admin/caption', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    title: formData.get('title'),
                    content: formData.get('content'),
                    category: formData.get('category'),
                  }),
                });
                const data = await res.json();
                if (res.ok) {
                  setIsCaptionModalOpen(false);
                  fetchCaptions();
                  alert('Caption added successfully!');
                } else {
                  alert('Failed to add caption: ' + (data.error || 'Unknown error'));
                }
              } catch (err) {
                alert('Failed to add caption');
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Title (opsional)</label>
                  <input name="title" type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]" placeholder="Judul caption..." />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Kategori</label>
                  <select name="category" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]">
                    <option value="">Pilih kategori...</option>
                    <option value="referral">Referral Content</option>
                    <option value="komisi-digital">Komisi Produk Digital</option>
                    <option value="referral-komisi">Referral + Komisi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Content Caption</label>
                  <textarea name="content" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]" rows={8} placeholder="Masukkan isi caption..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsCaptionModalOpen(false)} className="px-4 py-2 text-sm text-[#A1A1AA] hover:text-[#18181B]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg text-sm">Add Caption</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Copywriting Modal */}
      {isCopywritingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-light text-[#18181B] mb-4">Add Copywriting</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              try {
                const res = await fetch('/api/admin/copywriting', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    content: formData.get('content'),
                  }),
                });
                const data = await res.json();
                if (res.ok) {
                  setIsCopywritingModalOpen(false);
                  fetchCopywritings();
                  alert('Copywriting added successfully!');
                } else {
                  console.error('Failed to add copywriting:', data);
                  alert('Failed to add copywriting: ' + (data.error || 'Unknown error'));
                }
              } catch (err) {
                console.error('Failed to add copywriting:', err);
                alert('Failed to add copywriting');
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-[#A1A1AA] mb-1">Content</label>
                  <textarea name="content" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8B5CF6]" rows={8} placeholder="Masukkan konten copywriting..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsCopywritingModalOpen(false)} className="px-4 py-2 text-sm text-[#A1A1AA] hover:text-[#18181B]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-lg text-sm">Add Copywriting</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
