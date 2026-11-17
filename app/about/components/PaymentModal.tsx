"use client";

import { useState } from 'react';
import { X, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PAYMENT_ACCOUNTS, getPaymentMode } from '@/lib/membership-config';

const accentGradient = "from-[#8B5CF6] via-[#D946EF] to-[#EC4899]";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: string;
  planName: string;
  price: number;
}

export default function PaymentModal({ isOpen, onClose, plan, planName, price }: PaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMode] = useState(getPaymentMode());
  const [activeMethod, setActiveMethod] = useState<'manual' | 'midtrans'>(() => {
    const mode = getPaymentMode();
    return mode === 'midtrans' ? 'midtrans' : 'manual';
  });
  const [selectedAccount, setSelectedAccount] = useState<string>('bca');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [payerName, setPayerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [manualSuccess, setManualSuccess] = useState(false);

  // === MIDTRANS PAYMENT (preserved, untouched logic) ===
  const handleMidtransPayment = async () => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        alert('Please login to proceed with payment');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/midtrans/create-membership-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plan,
          planName,
          price,
        }),
      });

      const responseText = await response.text();
      console.log('[Midtrans Membership] Response status:', response.status);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('[Midtrans Membership] Failed to parse response:', e);
        alert('Failed to create transaction: Invalid response from server');
        setIsSubmitting(false);
        return;
      }

      if (response.ok && data.token) {
        const script = document.createElement('script');
        script.src = 'https://app.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
        script.onload = () => {
          // @ts-ignore
          window.snap.pay(data.token, {
            onSuccess: (result: any) => {
              console.log('Payment success:', result);
              setShowSuccess(true);
              setTimeout(() => {
                setShowSuccess(false);
                onClose();
                window.location.reload();
              }, 3000);
            },
            onPending: (result: any) => {
              console.log('Payment pending:', result);
              alert('Pembayaran pending. Silakan selesaikan pembayaran Anda.');
              setIsSubmitting(false);
            },
            onError: (result: any) => {
              console.log('Payment error:', result);
              alert('Pembayaran gagal. Silakan coba lagi.');
              setIsSubmitting(false);
            },
            onClose: () => {
              console.log('Payment popup closed');
              setIsSubmitting(false);
            },
          });
        };
        document.body.appendChild(script);
      } else {
        alert(data.error || 'Failed to create transaction');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Midtrans payment error:', error);
      alert('Failed to create transaction');
      setIsSubmitting(false);
    }
  };

  // === MANUAL PAYMENT ===
  const handleManualPayment = async () => {
    if (!payerName.trim()) {
      alert('Silakan isi nama pengirim');
      return;
    }
    if (!whatsapp.trim()) {
      alert('Silakan isi nomor WhatsApp');
      return;
    }
    if (!proofFile) {
      alert('Silakan upload bukti transfer');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        alert('Please login to proceed with payment');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('plan', plan);
      formData.append('paymentMethod', selectedAccount);
      formData.append('payerName', payerName);
      formData.append('whatsapp', whatsapp);
      formData.append('proof', proofFile);

      const response = await fetch('/api/membership/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setManualSuccess(true);
      } else {
        alert(data.error || 'Gagal mengirim pembayaran. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Manual payment error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-md border border-gray-50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`p-1.5 md:p-2 bg-gradient-to-r ${accentGradient} rounded-lg`}>
              <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-sm md:text-lg font-medium text-[#18181B]">Upgrade to {planName}</h2>
              <p className="text-xs md:text-sm text-[#A1A1AA] font-light">Rp {price.toLocaleString('id-ID')} sekali bayar</p>
            </div>
          </div>
          <button
            onClick={() => { onClose(); setManualSuccess(false); }}
            className="p-1.5 md:p-2 text-[#A1A1AA] hover:text-[#18181B] hover:bg-gray-50 rounded-lg transition"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Manual Payment Success */}
        {manualSuccess ? (
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pembayaran Diterima!</h3>
            <p className="text-sm text-gray-600 mb-2">Pembayaran Anda sedang diverifikasi admin.</p>
            <p className="text-xs text-gray-500 mb-6">Membership akan aktif dalam maksimal 1x24 jam setelah verifikasi.</p>
            <button
              onClick={() => { onClose(); setManualSuccess(false); }}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all"
            >
              Tutup
            </button>
          </div>
        ) : (
          <>
            {/* Content */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-5">
              {/* Method Toggle - only show if mode is 'both' */}
              {paymentMode === 'both' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMethod('manual')}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      activeMethod === 'manual'
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs font-medium block">Transfer Manual</span>
                    <span className="text-[10px] text-gray-500">BCA / DANA / OVO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMethod('midtrans')}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      activeMethod === 'midtrans'
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs font-medium block">Otomatis</span>
                    <span className="text-[10px] text-gray-500">Midtrans Gateway</span>
                  </button>
                </div>
              )}

              {/* === MANUAL PAYMENT UI === */}
              {activeMethod === 'manual' && (
                <>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-xs font-semibold text-purple-900 mb-3">Transfer ke:</p>
                    <div className="space-y-2">
                      {PAYMENT_ACCOUNTS.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => setSelectedAccount(acc.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                            selectedAccount === acc.id
                              ? 'border-[#8B5CF6] bg-white shadow-sm'
                              : 'border-gray-200 bg-white/50 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{acc.icon}</span>
                            <span className="text-xs font-medium text-gray-800">{acc.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-mono font-semibold text-gray-900">{acc.accountNumber}</p>
                            <p className="text-[10px] text-gray-500">a/n {acc.accountName}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-purple-200">
                      <span className="text-xs text-purple-800">Total Transfer</span>
                      <span className="text-sm font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
                        Rp {price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Nama Pengirim *</label>
                      <input
                        type="text"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        placeholder="Nama sesuai rekening"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">No. WhatsApp *</label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Bukti Transfer *</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#8B5CF6]/10 file:text-[#8B5CF6]"
                      />
                      {proofFile && (
                        <p className="text-[10px] text-green-600 mt-1">✓ {proofFile.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="text-[10px] space-y-1 text-gray-600">
                      <p>1. Transfer sesuai nominal ke rekening di atas</p>
                      <p>2. Upload bukti transfer</p>
                      <p>3. Admin akan verifikasi & aktivasi membership (maks 1x24 jam)</p>
                    </div>
                  </div>
                </>
              )}

              {/* === MIDTRANS PAYMENT UI (existing, preserved) === */}
              {activeMethod === 'midtrans' && (
                <>
                  <div className="bg-gradient-to-r from-[#8B5CF6]/5 via-[#D946EF]/5 to-[#FBBF24]/5 rounded-xl p-4 md:p-6 border border-[#8B5CF6]/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 bg-gradient-to-r ${accentGradient} rounded-lg`}>
                        <CreditCard className="w-5 h-5 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#18181B]">Pembayaran Aman & Cepat</h3>
                        <p className="text-xs text-[#A1A1AA]">Bayar dengan berbagai metode pembayaran</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-[#A1A1AA]">
                      <p>• BCA, BNI, BRI, Mandiri</p>
                      <p>• GoPay, OVO, Dana, ShopeePay</p>
                      <p>• QRIS, Kartu Kredit</p>
                    </div>
                  </div>

                  <div className="bg-[#F9F9FB] rounded-xl p-4 flex items-center justify-between">
                    <span className="text-xs md:text-sm text-[#A1A1AA]">Total Pembayaran</span>
                    <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
                      Rp {price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="text-[10px] md:text-xs text-[#A1A1AA] space-y-0.5">
                    <p>1. Klik &quot;Bayar Sekarang&quot; untuk membuka halaman pembayaran Midtrans</p>
                    <p>2. Pilih metode pembayaran yang Anda inginkan</p>
                    <p>3. Selesaikan pembayaran</p>
                    <p>4. Membership akan aktif otomatis setelah pembayaran berhasil</p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-50 flex gap-2 md:gap-3">
              <button
                onClick={() => { onClose(); setManualSuccess(false); }}
                className="flex-1 px-3 md:px-4 py-2 border border-gray-50 rounded-lg hover:bg-gray-50 transition font-light text-xs md:text-sm"
              >
                Batal
              </button>
              {activeMethod === 'manual' ? (
                <button
                  onClick={handleManualPayment}
                  disabled={isSubmitting}
                  className={`flex-1 px-3 md:px-4 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-lg hover:opacity-90 transition font-light text-xs md:text-sm disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </span>
                  ) : (
                    'Kirim Pembayaran'
                  )}
                </button>
              ) : (
                <button
                  onClick={handleMidtransPayment}
                  disabled={isSubmitting || showSuccess}
                  className={`flex-1 px-3 md:px-4 py-2 bg-gradient-to-r ${accentGradient} text-white rounded-lg hover:opacity-90 transition font-light text-xs md:text-sm disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses...
                    </span>
                  ) : showSuccess ? (
                    'Membership Aktif!'
                  ) : (
                    'Bayar Sekarang'
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
