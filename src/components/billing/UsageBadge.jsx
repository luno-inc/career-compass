import React from 'react';

export default function UsageBadge({ authenticated, billing }) {
  if (!authenticated) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        メール認証を行うと購入状態を復元できます
      </div>
    );
  }

  if (!billing) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
        利用状態を読み込み中...
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-800">
      <div>残回数: サブスク {billing.monthlyRemaining}回 / 買い切り {billing.oneTimeCredits}回</div>
      <div className="text-xs text-indigo-600">
        月額プラン: {billing.subscriptionStatus === 'active' ? '有効' : '未加入'}
      </div>
    </div>
  );
}

