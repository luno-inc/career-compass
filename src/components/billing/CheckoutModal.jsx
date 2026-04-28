import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function CheckoutModal({ open, onOpenChange, email, planType }) {
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) return;
    // #region agent log
    fetch('http://127.0.0.1:7858/ingest/0acef3a6-66c7-448d-b8c5-c3e8284eee63',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b57eb6'},body:JSON.stringify({sessionId:'b57eb6',location:'src/components/billing/CheckoutModal.jsx:open',message:'Checkout modal opened',data:{planType,emailPresent:!!email},timestamp:Date.now(),runId:'run2',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
  }, [open, planType, email]);
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  const keyMissing = !publishableKey;
  const keyInvalidFormat = !!publishableKey && !(publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'));

  const stripePromise = useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    // #region agent log
    fetch('http://127.0.0.1:7858/ingest/0acef3a6-66c7-448d-b8c5-c3e8284eee63',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b57eb6'},body:JSON.stringify({sessionId:'b57eb6',location:'src/components/billing/CheckoutModal.jsx:useMemo',message:'Publishable key shape check',data:{exists:!!pk,prefix:pk?pk.slice(0,8):null,isModern:!!(pk&&(pk.startsWith('pk_test_')||pk.startsWith('pk_live_')))},timestamp:Date.now(),runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    if (!pk) return null;
    if (!(pk.startsWith('pk_test_') || pk.startsWith('pk_live_'))) return null;
    return loadStripe(pk);
  }, []);

  const fetchClientSecret = useCallback(async () => {
    setError('');
    const res = await fetch('/api/billing/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planType, email }),
    });
    const data = await res.json();
    // #region agent log
    fetch('http://127.0.0.1:7858/ingest/0acef3a6-66c7-448d-b8c5-c3e8284eee63',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b57eb6'},body:JSON.stringify({sessionId:'b57eb6',location:'src/components/billing/CheckoutModal.jsx:fetchClientSecret',message:'Checkout session response',data:{status:res.status,ok:res.ok,hasClientSecret:!!data?.clientSecret,hasSessionId:!!data?.sessionId},timestamp:Date.now(),runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    if (!res.ok || !data?.clientSecret) {
      const msg = data?.error || 'チェックアウトの初期化に失敗しました。';
      setError(msg);
      throw new Error(msg);
    }
    return data.clientSecret;
  }, [email, planType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>お支払い</DialogTitle>
          <DialogDescription>
            {planType === 'subscription' ? '月額プラン' : '買い切りプラン'}の決済を行います。
          </DialogDescription>
        </DialogHeader>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!stripePromise ? (
          <p className="text-sm text-red-600">
            {keyMissing
              ? 'Stripe公開キーが未設定です。Vercelの NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY を設定してください。'
              : keyInvalidFormat
              ? 'Stripe公開キーの形式が不正です。pk_test_ または pk_live_ で始まるキーに更新してください。'
              : 'Stripe初期化に失敗しました。公開キーを再発行して更新してください。'}
          </p>
        ) : (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}

