import nodemailer from 'nodemailer';

/** Messages sent while no mail provider is configured (local development only). */
export const devOutbox: { to: string; subject: string; text: string }[] = [];

async function sendViaGmail(user: string, pass: string, to: string, subject: string, text: string) {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass: pass.replace(/\s+/g, '') },
  });
  try {
    await transport.sendMail({ from: `MÖB Admin <${user}>`, to, subject, text });
  } catch {
    throw new Error('MAIL_FAILED:smtp');
  }
}

async function sendViaResend(key: string, from: string, to: string, subject: string, text: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) throw new Error(`MAIL_FAILED:${res.status}`);
}

/**
 * Gmail SMTP (GMAIL_USER + GMAIL_APP_PASSWORD) is used when configured, otherwise Resend
 * (RESEND_API_KEY + MAIL_FROM). Gmail needs no domain and can reach any recipient.
 */
export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) return sendViaGmail(gmailUser, gmailPass, to, subject, text);

  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (key && from) return sendViaResend(key, from, to, subject, text);

  if (process.env.VERCEL) throw new Error('MAIL_NOT_CONFIGURED');
  devOutbox.push({ to, subject, text });
  console.log(`[dev mail] to=${to} subject="${subject}"\n${text}`);
}

export function codeMail(code: string, purpose: 'login' | 'setup') {
  const minutes = 10;
  const subject =
    purpose === 'login'
      ? 'MÖB Admin - Verification code / Doğrulama kodu / رمز التحقق'
      : 'MÖB Admin - Password setup code / Şifre belirleme kodu / رمز تعيين كلمة المرور';
  const text = [
    `Your code: ${code} (valid for ${minutes} minutes)`,
    `Kodunuz: ${code} (${minutes} dakika geçerli)`,
    `رمزك: ${code} (صالح لمدة ${minutes} دقائق)`,
    '',
    'If you did not request this, ignore this email. / Bu işlemi siz yapmadıysanız bu e-postayı yok sayın. / إذا لم تطلب ذلك فتجاهل هذه الرسالة.',
  ].join('\n');
  return { subject, text };
}

export function inviteMail(url: string, invitedBy: string) {
  const subject = 'MÖB Admin - You have been added as administrator / Yönetici olarak eklendiniz / تمت إضافتك مشرفاً';
  const text = [
    `${invitedBy} added you as an administrator. Open ${url}, choose "First time / forgot password" and set your password.`,
    `${invitedBy} sizi yönetici olarak ekledi. ${url} adresini açın, "İlk giriş / şifremi unuttum" seçeneğiyle şifrenizi belirleyin.`,
    `قام ${invitedBy} بإضافتك مشرفاً. افتح ${url} واختر "أول مرة / نسيت كلمة المرور" لتعيين كلمة المرور.`,
  ].join('\n\n');
  return { subject, text };
}
