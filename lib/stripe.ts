import Stripe from 'stripe';

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeSingleton) return stripeSingleton;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  stripeSingleton = new Stripe(key, { apiVersion: '2025-03-31.basil' });
  return stripeSingleton;
}

