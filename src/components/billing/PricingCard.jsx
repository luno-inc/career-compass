import React from 'react';
import { Button } from '@/components/ui/button';

export default function PricingCard({ onBuyOneTime, onSubscribe, disabled }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-slate-200 p-4 bg-white">
        <div className="text-sm text-slate-500 mb-1">買い切り</div>
        <div className="text-2xl font-bold text-slate-900 mb-1">¥100</div>
        <div className="text-sm text-slate-600 mb-3">シナリオ生成 1回分</div>
        <Button onClick={onBuyOneTime} disabled={disabled} className="w-full">
          1回分を購入
        </Button>
      </div>
      <div className="rounded-xl border border-indigo-200 p-4 bg-indigo-50">
        <div className="text-sm text-indigo-600 mb-1">サブスクリプション</div>
        <div className="text-2xl font-bold text-indigo-900 mb-1">¥1,000 / 月</div>
        <div className="text-sm text-indigo-700 mb-3">月50回までシナリオ生成</div>
        <Button onClick={onSubscribe} disabled={disabled} className="w-full bg-indigo-600 hover:bg-indigo-700">
          月額プランを開始
        </Button>
      </div>
    </div>
  );
}

