import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createVerificationCode, saveVerificationCode } from '@/lib/email-verification';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: '有効なメールアドレスを入力してください。' }, { status: 400 });
    }

    const code = createVerificationCode();
    await saveVerificationCode(email, code);

    const resendKey = process.env.RESEND_API_KEY;
    const from = process.env.BILLING_EMAIL_FROM || 'Career Compass <no-reply@example.com>';

    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from,
        to: email,
        subject: 'Career Compass 認証コード',
        text: `認証コード: ${code}\n有効期限は10分です。`,
      });
      return NextResponse.json({ ok: true });
    }

    // 開発環境フォールバック（メール送信基盤が未設定の場合）
    return NextResponse.json({ ok: true, devCode: code });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

