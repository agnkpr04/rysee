import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

// Email retry mechanism with exponential backoff
async function sendEmailWithRetry(
  emailFn: () => Promise<void>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await emailFn();
      return; // Success, exit retry loop
    } catch (error) {
      console.error(`[Email Retry] Attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt === maxRetries) {
        console.error('[Email Retry] All retry attempts exhausted');
        throw error; // Re-throw after final attempt
      }
      
      // Exponential backoff: delay = baseDelay * 2^(attempt-1)
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`[Email Retry] Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function sendMembershipRequestNotification(
  userEmail: string,
  userName: string | null,
  plan: string,
  paymentMethod: string,
  amount: number
) {
  await sendEmailWithRetry(async () => {
    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: userEmail,
      subject: '📋 Permintaan Upgrade Membership Anda - Rysee',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B5CF6;">Permintaan Upgrade Membership Anda</h2>
          <p>Halo ${userName || userEmail}, terima kasih telah request upgrade membership:</p>
          <ul>
            <li><strong>Plan:</strong> ${plan}</li>
            <li><strong>Metode Pembayaran:</strong> ${paymentMethod.toUpperCase()}</li>
            <li><strong>Jumlah:</strong> Rp ${amount.toLocaleString('id-ID')}</li>
            <li><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</li>
          </ul>
          <p>Silakan selesaikan pembayaran sesuai metode yang dipilih. Membership akan aktif dalam maksimal 1x24 jam setelah pembayaran dikonfirmasi.</p>
          <p style="color: #A1A1AA; font-size: 12px;">Email ini dikirim otomatis oleh Rysee Platform</p>
        </div>
      `,
    });
    console.log('[Email] Membership request notification sent to:', userEmail);
  });
}

export async function sendMembershipUpgradeNotification(userEmail: string, userName: string | null) {
  await sendEmailWithRetry(async () => {
    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: userEmail,
      subject: '🎉 Membership Anda Telah Aktif - Rysee',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B5CF6;">Selamat! Membership Anda Telah Aktif</h2>
          <p>Halo ${userName || userEmail}, membership Premium Anda telah berhasil diaktifkan.</p>
          <ul>
            <li><strong>Nama:</strong> ${userName || 'N/A'}</li>
            <li><strong>Email:</strong> ${userEmail}</li>
            <li><strong>Waktu Aktivasi:</strong> ${new Date().toLocaleString('id-ID')}</li>
          </ul>
          <p>Sekarang Anda bisa menikmati semua benefit Premium:</p>
          <ul>
            <li>✓ Komisi produk digital 80%</li>
            <li>✓ Komisi template 35%</li>
            <li>✓ Refer Premium: Rp 50K (85%)</li>
            <li>✓ Badge & Frame Premium eksklusif</li>
            <li>✓ Kustomisasi warna toko</li>
            <li>✓ Gradient frames & profile frame Elite</li>
          </ul>
          <p style="color: #A1A1AA; font-size: 12px;">Email ini dikirim otomatis oleh Rysee Platform</p>
        </div>
      `,
    });
    console.log('[Email] Membership upgrade notification sent to:', userEmail);
  });
}

/**
 * Notify buyer that their order has been approved with download link.
 * Used for both template orders and digital product orders.
 */
export async function sendOrderApprovalNotification(
  buyerEmail: string,
  buyerName: string | null,
  productTitle: string,
  productType: 'template' | 'digital-product',
  downloadUrl: string,
  downloadExpireAt: Date | null,
  orderAmount: number
) {
  await sendEmailWithRetry(async () => {
    const productLabel = productType === 'template' ? 'Website Template' : 'Digital Product';
    const expireText = downloadExpireAt
      ? `Link berlaku sampai <strong>${downloadExpireAt.toLocaleString('id-ID')}</strong>`
      : 'Link berlaku selamanya';

    // Different text for template vs digital product
    const downloadText = productType === 'template'
      ? 'Website template Anda sudah siap! Klik tombol di bawah untuk download file ZIP berisi source code website:'
      : 'Klik tombol di bawah untuk download file:';
    const buttonText = productType === 'template' ? '📥 Download ZIP Template' : '📥 Download Sekarang';
    const tipsText = productType === 'template'
      ? '<strong>Tips:</strong> File ZIP berisi source code website yang bisa Anda deploy ke hosting Anda sendiri. Simpan file ini di tempat aman. Jika ada kendala, balas email ini atau hubungi admin.'
      : '<strong>Tips:</strong> Simpan link ini di tempat aman atau download segera. Jika ada kendala, balas email ini atau hubungi admin.';

    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: buyerEmail,
      subject: `✅ Order Disetujui - ${productTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #8B5CF6, #D946EF, #EC4899); padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Pembayaran Diterima!</h1>
          </div>

          <p>Halo <strong>${buyerName || 'Customer'}</strong>,</p>

          <p>Pembayaran kamu sudah kami verifikasi. Berikut detail pesanan:</p>

          <div style="background: #F9F9FB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 6px 0;"><strong>Produk:</strong> ${productTitle}</li>
              <li style="padding: 6px 0;"><strong>Jenis:</strong> ${productLabel}</li>
              <li style="padding: 6px 0;"><strong>Total Bayar:</strong> Rp ${orderAmount.toLocaleString('id-ID')}</li>
              <li style="padding: 6px 0;"><strong>Tanggal Approval:</strong> ${new Date().toLocaleString('id-ID')}</li>
            </ul>
          </div>

          <div style="background: white; border: 2px solid #8B5CF6; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="margin: 0 0 12px 0; color: #18181B; font-weight: 600;">${downloadText}</p>
            <a href="${downloadUrl}"
               style="display: inline-block; background: linear-gradient(to right, #8B5CF6, #D946EF); color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600;">
              ${buttonText}
            </a>
            <p style="margin: 12px 0 0 0; font-size: 12px; color: #A1A1AA;">${expireText}</p>
          </div>

          <p style="font-size: 13px; color: #71717A;">
            ${tipsText}
          </p>

          <hr style="border: none; border-top: 1px solid #E4E4E7; margin: 24px 0;" />

          <p style="color: #A1A1AA; font-size: 12px; text-align: center;">
            Terima kasih sudah berbelanja di Rysee Platform<br/>
            Email ini dikirim otomatis. Jangan reply ke alamat ini untuk pertanyaan.
          </p>
        </div>
      `,
    });
    console.log('[Email] Order approval notification sent to', buyerEmail);
  });
}

export async function sendManualOrderNotification(
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  productTitle: string,
  productType: 'template' | 'digital-product',
  paymentMethod: string,
  amount: number
) {
  if (!ADMIN_EMAIL) {
    console.warn('[Email] ADMIN_EMAIL not configured, skipping admin notification');
    return;
  }
  await sendEmailWithRetry(async () => {
    const productLabel = productType === 'template' ? 'Website Template' : 'Digital Product';
    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: ADMIN_EMAIL,
      subject: `🛒 Order Manual Baru - ${productTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B5CF6;">Order Manual Baru Masuk!</h2>
          <p>Ada customer yang melakukan pembelian via transfer manual:</p>
          <ul>
            <li><strong>Produk:</strong> ${productTitle}</li>
            <li><strong>Jenis:</strong> ${productLabel}</li>
            <li><strong>Nama:</strong> ${customerName}</li>
            <li><strong>Email:</strong> ${customerEmail}</li>
            <li><strong>WhatsApp:</strong> ${customerPhone}</li>
            <li><strong>Metode:</strong> ${paymentMethod.toUpperCase()}</li>
            <li><strong>Jumlah:</strong> Rp ${amount.toLocaleString('id-ID')}</li>
            <li><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</li>
          </ul>
          <p><strong>Segera cek bukti transfer dan approve di admin dashboard.</strong></p>
          <p style="color: #A1A1AA; font-size: 12px;">Email ini dikirim otomatis oleh Rysee Platform</p>
        </div>
      `,
    });
    console.log('[Email] Manual order notification sent');
  });
}

export async function sendWithdrawalRequestNotification(
  userEmail: string,
  userName: string | null,
  amount: number,
  bankName: string,
  accountNumber: string,
  accountName: string
) {
  if (!ADMIN_EMAIL) {
    console.warn('[Email] ADMIN_EMAIL not configured, skipping admin notification');
    return;
  }
  await sendEmailWithRetry(async () => {
    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: ADMIN_EMAIL,
      subject: '💰 Request Penarikan Saldo Baru - Rysee',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B5CF6;">Request Penarikan Saldo Baru</h2>
          <p>Ada user yang request penarikan saldo:</p>
          <ul>
            <li><strong>Nama:</strong> ${userName || 'N/A'}</li>
            <li><strong>Email:</strong> ${userEmail}</li>
            <li><strong>Jumlah:</strong> Rp ${amount.toLocaleString('id-ID')}</li>
            <li><strong>Metode:</strong> ${bankName}</li>
            <li><strong>No. Rekening:</strong> ${accountNumber}</li>
            <li><strong>A/N:</strong> ${accountName}</li>
            <li><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</li>
          </ul>
          <p>Segera approve atau reject di admin dashboard.</p>
          <p style="color: #A1A1AA; font-size: 12px;">Email ini dikirim otomatis oleh Rysee Platform</p>
        </div>
      `,
    });
    console.log('[Email] Withdrawal request notification sent');
  });
}

export async function sendWithdrawalStatusNotification(
  userEmail: string,
  userName: string | null,
  amount: number,
  status: 'approved' | 'rejected',
  bankName: string,
  accountNumber: string,
  accountName: string
) {
  await sendEmailWithRetry(async () => {
    const isApproved = status === 'approved';
    const subject = isApproved
      ? '✅ Withdrawal Disetujui - Rysee'
      : '❌ Withdrawal Ditolak - Rysee';
    const title = isApproved
      ? 'Withdrawal Disetujui!'
      : 'Withdrawal Ditolak';
    const message = isApproved
      ? `Penarikan saldo kamu sebesar <strong>Rp ${amount.toLocaleString('id-ID')}</strong> telah <strong>disetujui</strong>. Dana akan ditransfer ke rekening kamu.`
      : `Penarikan saldo kamu sebesar <strong>Rp ${amount.toLocaleString('id-ID')}</strong> <strong>ditolak</strong>. Silakan hubungi admin jika ada pertanyaan.`;
    const actionColor = isApproved ? '#22c55e' : '#ef4444';

    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: userEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: ${actionColor}; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">${title}</h1>
          </div>

          <p>Halo <strong>${userName || 'Member'}</strong>,</p>

          <p>${message}</p>

          <div style="background: #F9F9FB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 6px 0;"><strong>Jumlah:</strong> Rp ${amount.toLocaleString('id-ID')}</li>
              <li style="padding: 6px 0;"><strong>Status:</strong> ${isApproved ? 'Disetujui' : 'Ditolak'}</li>
              <li style="padding: 6px 0;"><strong>Bank:</strong> ${bankName}</li>
              <li style="padding: 6px 0;"><strong>No. Rekening:</strong> ${accountNumber}</li>
              <li style="padding: 6px 0;"><strong>A/N:</strong> ${accountName}</li>
              <li style="padding: 6px 0;"><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</li>
            </ul>
          </div>

          <p style="font-size: 13px; color: #71717A;">
            ${isApproved
              ? 'Jika dana belum masuk dalam 1x24 jam, silakan hubungi admin.'
              : 'Periksa kembali data rekening kamu atau hubungi admin untuk informasi lebih lanjut.'}
          </p>

          <hr style="border: none; border-top: 1px solid #E4E4E7; margin: 24px 0;" />

          <p style="color: #A1A1AA; font-size: 12px; text-align: center;">
            Terima kasih sudah menggunakan Rysee Platform<br/>
            Email ini dikirim otomatis. Jangan reply ke alamat ini untuk pertanyaan.
          </p>
        </div>
      `,
    });
    console.log('[Email] Withdrawal status notification sent to', userEmail);
  });
}

export async function sendMembershipActivationNotification(
  userEmail: string,
  userName: string | null,
  plan: string,
  amount: number
) {
  await sendEmailWithRetry(async () => {
    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: userEmail,
      subject: `🎉 Membership ${plan.charAt(0).toUpperCase() + plan.slice(1)} Aktif! - Rysee`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #8B5CF6, #D946EF, #EC4899); padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Membership Aktif!</h1>
          </div>

          <p>Halo <strong>${userName || 'Member'}</strong>,</p>

          <p>Selamat! Membership ${plan.charAt(0).toUpperCase() + plan.slice(1)} kamu sudah aktif. Pembayaran Rp ${amount.toLocaleString('id-ID')} telah berhasil diverifikasi.</p>

          <div style="background: #F9F9FB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 6px 0;"><strong>Plan:</strong> ${plan.charAt(0).toUpperCase() + plan.slice(1)}</li>
              <li style="padding: 6px 0;"><strong>Total Bayar:</strong> Rp ${amount.toLocaleString('id-ID')}</li>
              <li style="padding: 6px 0;"><strong>Tanggal Aktivasi:</strong> ${new Date().toLocaleString('id-ID')}</li>
            </ul>
          </div>

          <p style="font-size: 13px; color: #71717A;">
            Sekarang kamu bisa menikmati semua benefit membership ${plan.charAt(0).toUpperCase() + plan.slice(1)}:
          </p>

          <ul style="font-size: 13px; color: #71717A; margin: 16px 0;">
            ${plan === 'premium' ? `
              <li>✓ Komisi produk digital 80%</li>
              <li>✓ Komisi template 35%</li>
              <li>✓ Refer Pro: Rp 15K</li>
              <li>✓ Refer Premium: Rp 25K</li>
            ` : `
              <li>✓ Komisi produk digital 40%</li>
              <li>✓ Komisi template 30%</li>
              <li>✓ Refer Pro: Rp 20K</li>
              <li>✓ Refer Premium: Rp 40K</li>
            `}
          </ul>

          <hr style="border: none; border-top: 1px solid #E4E4E7; margin: 24px 0;" />

          <p style="color: #A1A1AA; font-size: 12px; text-align: center;">
            Terima kasih sudah bergabung dengan Rysee Platform<br/>
            Email ini dikirim otomatis. Jangan reply ke alamat ini untuk pertanyaan.
          </p>
        </div>
      `,
    });
    console.log('[Email] Membership activation notification sent to', userEmail);
  });
}

export async function sendOrderDeclineNotification(
  buyerEmail: string,
  buyerName: string | null,
  productTitle: string,
  productType: 'template' | 'digital-product',
  orderAmount: number
) {
  await sendEmailWithRetry(async () => {
    const productLabel = productType === 'template' ? 'Website Template' : 'Digital Product';
    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: buyerEmail,
      subject: `❌ Order Ditolak - ${productTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ef4444; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">❌ Order Ditolak</h1>
          </div>

          <p>Halo <strong>${buyerName || 'Customer'}</strong>,</p>

          <p>Maaf, pembayaran untuk pesanan kamu <strong>tidak dapat diverifikasi</strong>. Berikut detail pesanan:</p>

          <div style="background: #F9F9FB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 6px 0;"><strong>Produk:</strong> ${productTitle}</li>
              <li style="padding: 6px 0;"><strong>Jenis:</strong> ${productLabel}</li>
              <li style="padding: 6px 0;"><strong>Total Bayar:</strong> Rp ${orderAmount.toLocaleString('id-ID')}</li>
              <li style="padding: 6px 0;"><strong>Tanggal Penolakan:</strong> ${new Date().toLocaleString('id-ID')}</li>
            </ul>
          </div>

          <p style="font-size: 13px; color: #71717A;">
            <strong>Alasan penolakan:</strong> Bukti pembayaran tidak valid atau tidak sesuai. Silakan hubungi admin untuk informasi lebih lanjut atau coba upload ulang bukti pembayaran yang valid.
          </p>

          <hr style="border: none; border-top: 1px solid #E4E4E7; margin: 24px 0;" />

          <p style="color: #A1A1AA; font-size: 12px; text-align: center;">
            Terima kasih sudah berbelanja di Rysee Platform<br/>
            Email ini dikirim otomatis. Jangan reply ke alamat ini untuk pertanyaan.
          </p>
        </div>
      `,
    });
    console.log('[Email] Order decline notification sent to', buyerEmail);
  });
}

export async function sendAdminOrderNotification(
  affiliateEmail: string,
  affiliateName: string | null,
  customerName: string,
  customerEmail: string,
  productTitle: string,
  productType: 'template' | 'digital-product',
  orderAmount: number
) {
  if (!ADMIN_EMAIL) {
    console.warn('[Email] ADMIN_EMAIL not configured, skipping admin notification');
    return;
  }
  await sendEmailWithRetry(async () => {
    const productLabel = productType === 'template' ? 'Website Template' : 'Digital Product';
    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: ADMIN_EMAIL,
      subject: `🛒 Order Baru - ${productTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B5CF6;">Order Baru Masuk!</h2>
          <p>Ada customer yang melakukan pembelian produk:</p>

          <div style="background: #F9F9FB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 6px 0;"><strong>Produk:</strong> ${productTitle}</li>
              <li style="padding: 6px 0;"><strong>Jenis:</strong> ${productLabel}</li>
              <li style="padding: 6px 0;"><strong>Nama Customer:</strong> ${customerName}</li>
              <li style="padding: 6px 0;"><strong>Email Customer:</strong> ${customerEmail}</li>
              <li style="padding: 6px 0;"><strong>Affiliate (Pemilik Toko):</strong> ${affiliateName || affiliateEmail}</li>
              <li style="padding: 6px 0;"><strong>Email Affiliate:</strong> ${affiliateEmail}</li>
              <li style="padding: 6px 0;"><strong>Total Bayar:</strong> Rp ${orderAmount.toLocaleString('id-ID')}</li>
              <li style="padding: 6px 0;"><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</li>
            </ul>
          </div>

          <p><strong>Segera cek bukti transfer dan approve di admin dashboard.</strong></p>
          <p style="color: #A1A1AA; font-size: 12px;">Email ini dikirim otomatis oleh Rysee Platform</p>
        </div>
      `,
    });
    console.log('[Email] Admin order notification sent');
  });
}

export async function sendAffiliateOrderNotification(
  affiliateEmail: string,
  affiliateName: string | null,
  customerName: string,
  customerEmail: string,
  productTitle: string,
  productType: 'template' | 'digital-product',
  orderAmount: number
) {
  await sendEmailWithRetry(async () => {
    const productLabel = productType === 'template' ? 'Website Template' : 'Digital Product';
    const actionText = productType === 'template'
      ? 'Segera siapkan dan kirim website ke customer setelah pembayaran dikonfirmasi.'
      : 'Produk akan otomatis dikirim ke customer setelah pembayaran dikonfirmasi.';

    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: affiliateEmail,
      subject: `🎉 Order Baru di Toko Anda - ${productTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B5CF6;">Selamat! Ada Order Baru di Toko Anda</h2>
          <p>Halo ${affiliateName || affiliateEmail}, ada customer yang membeli produk Anda:</p>

          <div style="background: #F9F9FB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 6px 0;"><strong>Produk:</strong> ${productTitle}</li>
              <li style="padding: 6px 0;"><strong>Jenis:</strong> ${productLabel}</li>
              <li style="padding: 6px 0;"><strong>Nama Customer:</strong> ${customerName}</li>
              <li style="padding: 6px 0;"><strong>Email Customer:</strong> ${customerEmail}</li>
              <li style="padding: 6px 0;"><strong>Total Bayar:</strong> Rp ${orderAmount.toLocaleString('id-ID')}</li>
              <li style="padding: 6px 0;"><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</li>
            </ul>
          </div>

          <p><strong>${actionText}</strong></p>
          <p>Komisi akan ditambahkan ke saldo Anda setelah pembayaran dikonfirmasi.</p>
          <p style="color: #A1A1AA; font-size: 12px;">Email ini dikirim otomatis oleh Rysee Platform</p>
        </div>
      `,
    });
    console.log('[Email] Affiliate order notification sent to:', affiliateEmail);
  });
}

export async function sendAdminMembershipNotification(
  userEmail: string,
  userName: string | null,
  plan: string,
  amount: number,
  paymentMethod: string
) {
  await sendEmailWithRetry(async () => {
    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: userEmail,
      subject: `👑 Membership Upgrade Berhasil - ${plan.toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B5CF6;">Membership Upgrade Berhasil!</h2>
          <p>Halo ${userName || userEmail}, Anda telah berhasil upgrade membership via Midtrans:</p>

          <div style="background: #F9F9FB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 6px 0;"><strong>Plan:</strong> ${plan.toUpperCase()}</li>
              <li style="padding: 6px 0;"><strong>Amount:</strong> Rp ${amount.toLocaleString('id-ID')}</li>
              <li style="padding: 6px 0;"><strong>Payment Method:</strong> ${paymentMethod}</li>
              <li style="padding: 6px 0;"><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</li>
            </ul>
          </div>

          <p><strong>Membership sudah otomatis aktif. Anda dapat langsung mengakses fitur premium.</strong></p>
          <p style="color: #A1A1AA; font-size: 12px;">Email ini dikirim otomatis oleh Rysee Platform</p>
        </div>
      `,
    });
    console.log('[Email] Membership notification sent to:', userEmail);
  });
}

export async function sendReferralCommissionNotification(
  referrerEmail: string,
  referrerName: string | null,
  referredName: string | null,
  referredEmail: string,
  commissionAmount: number,
  plan: string
) {
  await sendEmailWithRetry(async () => {
    await resend.emails.send({
      from: 'Rysee <noreply@rysee.my.id>',
      to: referrerEmail,
      subject: `🎉 Komisi Referral Masuk - Rp ${commissionAmount.toLocaleString('id-ID')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B5CF6;">Selamat! Komisi Referral Masuk</h2>
          <p>Halo ${referrerName || referrerEmail}, referral Anda telah berhasil upgrade membership!</p>

          <div style="background: #F9F9FB; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 6px 0;"><strong>Nama Referral:</strong> ${referredName || referredEmail}</li>
              <li style="padding: 6px 0;"><strong>Email Referral:</strong> ${referredEmail}</li>
              <li style="padding: 6px 0;"><strong>Plan:</strong> ${plan.toUpperCase()}</li>
              <li style="padding: 6px 0;"><strong>Komisi:</strong> Rp ${commissionAmount.toLocaleString('id-ID')}</li>
              <li style="padding: 6px 0;"><strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}</li>
            </ul>
          </div>

          <p><strong>Komisi telah ditambahkan ke saldo Anda. Terus ajak teman untuk upgrade dan dapatkan komisi lebih banyak!</strong></p>
          <p style="color: #A1A1AA; font-size: 12px;">Email ini dikirim otomatis oleh Rysee Platform</p>
        </div>
      `,
    });
    console.log('[Email] Referral commission notification sent to:', referrerEmail);
  });
}

