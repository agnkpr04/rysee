"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Crown, Calendar, User as UserIcon, Search, Filter, Check, X, Clock, Eye, Download } from 'lucide-react';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";
const textGradient = {
  background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

interface Subscription {
  id: string;
  userId: string;
  status: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

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
  approvedAt: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: string;
  description: string | null;
  proofUrl: string | null;
  proofFilename: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
}

export default function MembershipSection() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [withdrawRequests, setWithdrawRequests] = useState<any[]>([]);

  const [subscriptionForm, setSubscriptionForm] = useState({
    userId: '',
    plan: 'premium',
  });

  const [paymentForm, setPaymentForm] = useState({
    userId: '',
    amount: 35000,
    method: 'manual',
    description: '',
  });

  console.log('[MembershipSection] Component rendered, isLoading:', isLoading);

  useEffect(() => {
    const checkSession = async () => {
      const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('admin_session='));
      if (!sessionCookie) {
        router.push('/admin/login');
        return;
      }

      // Fetch subscriptions, payments, and referral data in parallel
      await Promise.all([fetchSubscriptions(), fetchPayments(), fetchReferrals()]);
      setIsLoading(false);
    };

    checkSession();
  }, [router]);

  const fetchSubscriptions = async () => {
    try {
      console.log('[MembershipSection] Fetching subscriptions...');
      const res = await fetch('/api/membership/subscriptions');
      console.log('[MembershipSection] Subscriptions response status:', res.status);
      if (res.status === 401 || res.status === 403) {
        console.log('[MembershipSection] Unauthorized, redirecting to login');
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      console.log('[MembershipSection] Subscriptions data:', data);
      setSubscriptions(data.subscriptions || []);
    } catch (err) {
      console.error('[MembershipSection] Failed to fetch subscriptions:', err);
      alert('[MembershipSection] Failed to fetch subscriptions: ' + (err as Error).message);
    }
  };

  const fetchPayments = async () => {
    try {
      console.log('[MembershipSection] Fetching payments...');
      const res = await fetch('/api/membership/payments');
      console.log('[MembershipSection] Payments response status:', res.status);
      
      if (res.status === 401 || res.status === 403) {
        console.log('[MembershipSection] Unauthorized, redirecting to login');
        router.push('/admin/login');
        return;
      }
      
      const data = await res.json();
      console.log('[MembershipSection] Payments data:', data);
      console.log('[MembershipSection] Payments array length:', data.payments?.length);
      console.log('[MembershipSection] Payment status filter:', paymentStatusFilter);
      
      setPayments(data.payments || []);
    } catch (err) {
      console.error('[MembershipSection] Failed to fetch payments:', err);
      alert('[MembershipSection] Failed to fetch payments: ' + (err as Error).message);
    }
  };

  const fetchReferrals = async () => {
    try {
      const res = await fetch('/api/admin/referral/list');
      if (res.ok) {
        const data = await res.json();
        setReferrals(data.referrals || []);
        setWithdrawRequests(data.withdrawRequests || []);
      }
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
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

  const handleAddPayment = async () => {
    if (!paymentForm.userId) {
      alert('User ID is required');
      return;
    }

    try {
      const res = await fetch('/api/membership/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm),
      });

      if (res.ok) {
        setIsPaymentModalOpen(false);
        setPaymentForm({ userId: '', amount: 35000, method: 'manual', description: '' });
        fetchPayments();
        alert('Payment recorded successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to record payment');
      }
    } catch (err) {
      console.error('Failed to record payment:', err);
      alert('Failed to record payment');
    }
  };

  const handleDeactivateSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to deactivate this subscription?')) return;

    try {
      const res = await fetch(`/api/membership/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchSubscriptions();
        alert('Subscription deactivated successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to deactivate subscription');
      }
    } catch (err) {
      console.error('Failed to deactivate subscription:', err);
      alert('Failed to deactivate subscription');
    }
  };

  const handleApprovePayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to approve this payment and activate the subscription?')) return;

    try {
      const res = await fetch(`/api/membership/payments/${paymentId}/approve`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchPayments();
        fetchSubscriptions();
        alert('Payment approved and subscription activated!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to approve payment');
      }
    } catch (err) {
      console.error('Failed to approve payment:', err);
      alert('Failed to approve payment');
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to reject this payment?')) return;

    try {
      const res = await fetch(`/api/membership/payments/${paymentId}/reject`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchPayments();
        alert('Payment rejected!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to reject payment');
      }
    } catch (err) {
      console.error('Failed to reject payment:', err);
      alert('Failed to reject payment');
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const getPlanBadge = (plan: string) => {
    const styles = {
      free: 'bg-gray-100 text-gray-800',
      premium: 'bg-purple-100 text-purple-800',
    };
    return styles[plan as keyof typeof styles] || styles.free;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-gradient-to-r ${accentGradient} opacity-10 rounded-xl`}>
              <Crown className="w-6 h-6 text-[#8B5CF6]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm text-[#A1A1AA] font-light">total subscriptions</p>
              <p className="text-2xl font-light" style={textGradient}>{subscriptions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-gradient-to-r ${accentGradient} opacity-10 rounded-xl`}>
              <Check className="w-6 h-6 text-[#D946EF]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm text-[#A1A1AA] font-light">active</p>
              <p className="text-2xl font-light" style={textGradient}>{subscriptions.filter(s => s.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-gradient-to-r ${accentGradient} opacity-10 rounded-xl`}>
              <X className="w-6 h-6 text-[#EC4899]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm text-[#A1A1AA] font-light">expired</p>
              <p className="text-2xl font-light" style={textGradient}>{subscriptions.filter(s => s.status === 'expired').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-gradient-to-r ${accentGradient} opacity-10 rounded-xl`}>
              <Clock className="w-6 h-6 text-[#8B5CF6]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm text-[#A1A1AA] font-light">total payments</p>
              <p className="text-2xl font-light" style={textGradient}>{payments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-50">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-6">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`text-sm font-medium ${activeTab === 'subscriptions' ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'}`}
          >
            Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`text-sm font-medium ${activeTab === 'payments' ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'}`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`text-sm font-medium ${activeTab === 'referrals' ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'}`}
          >
            Referrals
          </button>
        </div>

        {activeTab === 'subscriptions' && (
          <>
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-light text-[#18181B]">Subscriptions</h2>
              <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent outline-none text-sm font-light"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent outline-none text-sm font-light"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-[#A1A1AA] font-light">Loading...</div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="p-8 text-center text-[#A1A1AA] font-light">No subscriptions found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredSubscriptions.map((sub) => (
              <div key={sub.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F9F9FB] rounded-full flex items-center justify-center border border-gray-50">
                    <UserIcon className="w-5 h-5 text-[#A1A1AA]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#18181B]">{sub.user?.name || sub.user?.email || sub.userId}</h3>
                    <p className="text-sm text-[#A1A1AA] font-light">{sub.user?.email || sub.userId}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-light ${getPlanBadge(sub.plan)}`}>
                        {sub.plan}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-light ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-[#A1A1AA] font-light flex items-center gap-1">
                      <Calendar className="w-3 h-3" strokeWidth={1.5} />
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {sub.status === 'active' && (
                    <button
                      onClick={() => handleDeactivateSubscription(sub.id)}
                      className="p-2 text-[#A1A1AA] hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Deactivate"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {activeTab === 'payments' && (
          <>
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-light text-[#18181B]">Recent Payments</h2>
              <div className="flex items-center gap-3">
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent outline-none text-sm font-light"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-lg hover:opacity-90 transition font-light text-sm`}
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  Add Payment
                </button>
              </div>
            </div>

            {payments.length === 0 ? (
              <div className="p-8 text-center text-[#A1A1AA] font-light">No payments found</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {payments.filter(payment => paymentStatusFilter === 'all' || payment.status === paymentStatusFilter).map((payment) => (
                  <div key={payment.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium text-[#18181B]">Rp {payment.amount.toLocaleString('id-ID')}</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-light ${
                            payment.status === 'success' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                          <span className="text-xs text-[#A1A1AA] font-light">{payment.method}</span>
                        </div>
                        <p className="text-sm text-[#A1A1AA] font-light mb-1">{payment.description || 'No description'}</p>
                        <p className="text-xs text-[#A1A1AA] font-light mb-1">Nama: {payment.payerName || payment.user?.name || '-'}</p>
                        <p className="text-xs text-[#A1A1AA] font-light mb-1">Email: {payment.user?.email || '-'}</p>
                        <p className="text-xs text-[#A1A1AA] font-light mb-1">WhatsApp: {payment.whatsapp || '-'}</p>
                        <p className="text-xs text-[#A1A1AA] font-light mt-1">
                          {new Date(payment.createdAt).toLocaleString()}
                        </p>
                        {payment.proofUrl && (
                          <div className="mt-2">
                            <button
                              onClick={() => {
                                setSelectedPayment(payment);
                                setIsProofModalOpen(true);
                              }}
                              className="flex items-center gap-1 text-xs text-[#8B5CF6] hover:text-[#D946EF] transition"
                            >
                              <Eye className="w-3 h-3" strokeWidth={1.5} />
                              View Proof
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprovePayment(payment.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={() => handleRejectPayment(payment.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Reject"
                            >
                              <X className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'referrals' && (
          <>
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-light text-[#18181B]">Referral Management</h2>
            </div>
            <div className="px-6 py-4">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#18181B] mb-3">Withdraw Requests</h3>
                {withdrawRequests.length === 0 ? (
                  <p className="text-sm text-[#A1A1AA] font-light">No withdraw requests</p>
                ) : (
                  <div className="space-y-3">
                    {withdrawRequests.map((wr: any) => (
                      <div key={wr.id} className="bg-[#F9F9FB] rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#18181B]">Rp {wr.amount.toLocaleString('id-ID')}</p>
                          <p className="text-xs text-[#A1A1AA] font-light">{wr.user?.email}</p>
                          <p className="text-xs text-[#A1A1AA] font-light">{wr.accountName} - {wr.bankName} - {wr.accountNumber}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {wr.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveWithdraw(wr.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => handleRejectWithdraw(wr.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Reject"
                              >
                                <X className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            </>
                          )}
                          <span className={`px-2 py-0.5 rounded text-xs font-light ${
                            wr.status === 'approved' ? 'bg-green-100 text-green-800' :
                            wr.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {wr.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#18181B] mb-3">All Referrals</h3>
                {referrals.length === 0 ? (
                  <p className="text-sm text-[#A1A1AA] font-light">No referrals</p>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((ref: any) => (
                      <div key={ref.id} className="bg-[#F9F9FB] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-[#18181B]">{ref.referrer?.email}</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-light ${
                            ref.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ref.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#A1A1AA] font-light">Referred: {ref.referred?.email}</p>
                        <p className="text-xs text-[#A1A1AA] font-light">Earnings: Rp {ref.earnings?.reduce((sum: number, e: any) => sum + e.amount, 0).toLocaleString('id-ID')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-6 border border-gray-50">
            <h2 className="text-xl font-light text-[#18181B] mb-4">Record Payment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#18181B] mb-1">User ID</label>
                <input
                  type="text"
                  value={paymentForm.userId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, userId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent outline-none font-light"
                  placeholder="Enter user ID from Supabase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#18181B] mb-1">Amount (Rp)</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value === '' ? 0 : parseInt(value);
                    setPaymentForm({ ...paymentForm, amount: isNaN(numValue) ? 0 : numValue });
                  }}
                  className="w-full px-4 py-2 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent outline-none font-light"
                  placeholder="35000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#18181B] mb-1">Method</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent outline-none font-light"
                >
                  <option value="manual">Manual (WhatsApp/Transfer)</option>
                  <option value="midtrans">Midtrans</option>
                  <option value="xendit">Xendit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#18181B] mb-1">Description</label>
                <textarea
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-50 rounded-lg focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent outline-none font-light"
                  placeholder="Payment description"
                  rows={2}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-50 rounded-lg hover:bg-gray-50 transition font-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayment}
                  className={`flex-1 px-4 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-lg hover:opacity-90 transition font-light`}
                >
                  Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proof View Modal */}
      {isProofModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-sm w-full max-w-2xl p-6 border border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-light text-[#18181B]">Proof of Transfer</h2>
              <button
                onClick={() => {
                  setIsProofModalOpen(false);
                  setSelectedPayment(null);
                }}
                className="p-2 text-[#A1A1AA] hover:text-[#18181B] hover:bg-gray-50 rounded-lg transition"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-[#F9F9FB] rounded-xl p-4">
                <p className="text-sm text-[#A1A1AA] font-light">Amount: <span className="text-[#18181B] font-medium">Rp {selectedPayment.amount.toLocaleString('id-ID')}</span></p>
                <p className="text-sm text-[#A1A1AA] font-light">Method: <span className="text-[#18181B] font-medium">{selectedPayment.method}</span></p>
                <p className="text-sm text-[#A1A1AA] font-light">Filename: <span className="text-[#18181B] font-medium">{selectedPayment.proofFilename || 'N/A'}</span></p>
              </div>
              {selectedPayment.proofUrl && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {selectedPayment.proofUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={selectedPayment.proofUrl}
                      alt="Proof of transfer"
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  ) : (
                    <div className="p-8 text-center">
                      <Download className="w-12 h-12 mx-auto text-[#8B5CF6] mb-4" strokeWidth={1.5} />
                      <p className="text-sm text-[#A1A1AA] font-light mb-4">This file cannot be previewed</p>
                      <a
                        href={selectedPayment.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-lg hover:opacity-90 transition font-light text-sm`}
                      >
                        <Download className="w-4 h-4" strokeWidth={1.5} />
                        Download File
                      </a>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsProofModalOpen(false);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-50 rounded-lg hover:bg-gray-50 transition font-light"
                >
                  Close
                </button>
                {selectedPayment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprovePayment(selectedPayment.id);
                        setIsProofModalOpen(false);
                        setSelectedPayment(null);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-light"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleRejectPayment(selectedPayment.id);
                        setIsProofModalOpen(false);
                        setSelectedPayment(null);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-light"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
