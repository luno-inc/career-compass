import React, { useCallback, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function CheckoutModal({ open, onOpenChange, email, planType }) {
  const [error, setError] = useState('');
  const stripePromise = useMemo(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk) return null;
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
          <p className="text-sm text-red-600">Stripe公開キーが未設定です。</p>
        ) : (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}

