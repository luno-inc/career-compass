'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, Shuffle, Sparkles } from 'lucide-react';
import { EXTERNAL_EVENTS } from '../components/scenarios/externalEvents';
import EventCard from '../components/scenarios/EventCard';
import UsageBadge from '@/src/components/billing/UsageBadge';
import PricingCard from '@/src/components/billing/PricingCard';
import CheckoutModal from '@/src/components/billing/CheckoutModal';
import { buildMockScenario } from '@/lib/mock-scenario';

const BYPASS_EMAILS = ['info@luno-jp.com', 'atsuki20150047@gmail.com', 'kent20210325@keio.jp'];
const normalizeEmail = (email = '') => email.trim().toLowerCase();

function generateRandomEvents(count = 2) {
  const categories = Object.keys(EXTERNAL_EVENTS);
  const timeframes = ['short', 'medium', 'long'];
  const shuffledTimeframes = [...timeframes].sort(() => 0.5 - Math.random());
  
  const events = [];
  const usedCategories = new Set();
  
  for (let i = 0; i < count; i++) {
    const timeframe = shuffledTimeframes[i];
    
    // カテゴリをシャッフルして未使用のものを優先
    const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
    let selectedCategory = null;
    
    for (const cat of shuffledCategories) {
      if (!usedCategories.has(cat) && EXTERNAL_EVENTS[cat]?.[timeframe]?.length > 0) {
        selectedCategory = cat;
        break;
      }
    }
    
    // 未使用がなければランダムに選択
    if (!selectedCategory) {
      for (const cat of shuffledCategories) {
        if (EXTERNAL_EVENTS[cat]?.[timeframe]?.length > 0) {
          selectedCategory = cat;
          break;
        }
      }
    }
    
    if (selectedCategory) {
      usedCategories.add(selectedCategory);
      const categoryEvents = EXTERNAL_EVENTS[selectedCategory][timeframe];
      const randomEvent = categoryEvents[Math.floor(Math.random() * categoryEvents.length)];
      
      events.push({
        id: `event-${i}`,
        category: selectedCategory,
        timeframe: timeframe,
        text: randomEvent,
        probability: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
      });
    }
  }
  
  return events;
}

export default function EventSelection() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [events, setEvents] = useState(() => generateRandomEvents(2));
  const [testError, setTestError] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [billing, setBilling] = useState(null);
  const [bypass, setBypass] = useState(false);
  const [devCode, setDevCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState('one_time');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState('email');

  const refreshBilling = async () => {
    const authRes = await fetch('/api/auth/me');
    const authJson = await authRes.json();
    const billingRes = await fetch('/api/billing/status');
    const billingJson = await billingRes.json();
    setAuthenticated(!!authJson?.authenticated);
    setAuthEmail(authJson?.email || authEmail);
    setBilling(billingJson?.billing || null);
    setBypass(!!billingJson?.bypass);
  };

  useEffect(() => {
    const savedProfile = sessionStorage.getItem('careerCompassProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      router.push('/profile');
    }
    const errJson = sessionStorage.getItem('careerCompassGenerateError');
    if (errJson) {
      try {
        setTestError(JSON.parse(errJson));
      } catch {}
      sessionStorage.removeItem('careerCompassGenerateError');
    }
    refreshBilling().catch(() => {});
  }, [router]);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('checkout') === 'success') {
      refreshBilling().catch(() => {});
      setCheckoutOpen(false);
    }
  }, []);

  const shuffleEvents = () => {
    setEvents(generateRandomEvents(2));
  };

  const handleGenerateClick = () => {
    if (generating) return;
    setTestError(null);
    const remaining = (billing?.monthlyRemaining || 0) + (billing?.oneTimeCredits || 0);
    if (!authenticated) {
      setAuthStep('email');
      setAuthModalOpen(true);
      return;
    }
    if (!bypass && remaining <= 0) {
      setTestError({ error: '利用可能回数がありません。下のプランから購入してください。' });
      return;
    }
    const eventTexts = events.map(e => e.text);
    sessionStorage.setItem('careerCompassEventTexts', JSON.stringify(eventTexts));
    setGenerating(true);
    router.push('/event-selection/generating');
  };

  const sendCode = async () => {
    setSendingCode(true);
    setDevCode('');
    try {
      const normalized = normalizeEmail(authEmail);
      if (BYPASS_EMAILS.includes(normalized)) {
        const profileText = profile
          ? Object.entries(profile)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('\n')
          : '';
        const eventTexts = events.map((e) => e.text);
        const mock = buildMockScenario({ profileText, eventTexts, email: normalized });
        sessionStorage.setItem(
          'careerCompassScenarios',
          JSON.stringify({
            ok: true,
            mock: true,
            bypass: true,
            scenarios: [mock],
          })
        );
        setAuthenticated(true);
        setBypass(true);
        setAuthModalOpen(false);
        router.push('/scenarios');
        return;
      }
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        setTestError({ error: data.error || '認証コード送信に失敗しました。' });
        return;
      }
      if (data.devCode) setDevCode(data.devCode);
      setAuthStep('code');
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async () => {
    setVerifyingCode(true);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, code: authCode }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        setTestError({ error: data.error || '認証に失敗しました。' });
        return;
      }
      setAuthCode('');
      setDevCode('');
      await refreshBilling();
      setAuthModalOpen(false);
      setTestError({ error: '認証が完了しました。購入情報を確認してからシナリオ生成してください。' });
    } finally {
      setVerifyingCode(false);
    }
  };

  const openCheckout = (planType) => {
    if (!authenticated) {
      setTestError({ error: '購入前にメール認証を完了してください。' });
      return;
    }
    setCheckoutPlan(planType);
    setCheckoutOpen(true);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/profile')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          プロフィールに戻る
        </Button>

        {/* ヘッダー */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            外生イベントルーレット
          </h1>
          <p className="text-slate-600 text-lg mb-2">
            あなたのキャリアに影響を与える可能性がある外生イベントを{events.length}つ、ランダムに抽出しました。
          </p>
          <p className="text-slate-600 text-lg mb-2">
            気に入らない組み合わせの場合は、「再抽選」ボタンで別のイベントを選び直すことができます。
          </p>
          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-2">
            ※ イベントは学術機関やコンサルティングファームの予測レポート（World Economic Forum、McKinsey、OECD等）に基づいて作成されています
          </p>
          <p className="text-slate-600 text-lg">
            これらのイベントをもとに、1つのシナリオを生成します。
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-800">利用状況</h2>
          {bypass ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              テストモード: このアカウントは課金不要でシナリオ生成できます。
            </div>
          ) : null}
          <UsageBadge authenticated={authenticated} billing={billing} />
          {!authenticated ? (
            <p className="text-sm text-slate-600">
              「シナリオを生成」を押すとメール認証モーダルが開きます。認証後に購入情報と課金導線が表示されます。
            </p>
          ) : null}
        </div>

        {!bypass && authenticated ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">プラン購入</h2>
            <PricingCard
              onBuyOneTime={() => openCheckout('one_time')}
              onSubscribe={() => openCheckout('subscription')}
              disabled={!authenticated}
            />
          </div>
        ) : null}

        {/* イベント一覧ヘッダー */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <div>
                <h2 className="text-xl font-bold text-indigo-600">
                  選択された{events.length}つのイベント
                </h2>
                <p className="text-sm text-slate-500">
                  カテゴリーバランスよく抽選されています
                </p>
              </div>
            </div>
            <Button
              onClick={shuffleEvents}
              variant="outline"
              className="border-slate-200 hover:bg-slate-50 gap-2"
            >
              <Shuffle className="w-4 h-4" />
              再抽選
            </Button>
          </div>

          {/* イベントカードグリッド */}
          <div className="grid md:grid-cols-2 gap-4">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>

        {/* 生成ボタン */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => router.push('/profile')}
            className="border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>

          <Button
            onClick={handleGenerateClick}
            disabled={generating}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-10"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            シナリオを生成
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {testError && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <h3 className="text-lg font-bold text-red-700 mb-3">✗ エラーが発生しました</h3>
            <p className="text-red-600 mb-3 text-base whitespace-pre-line">{testError.error}</p>
            
            {testError.requestId && testError.requestId !== 'N/A' && (
              <p className="text-xs text-slate-500 mb-3">リクエストID: {testError.requestId}</p>
            )}
            
            {testError.isParseError && testError.parsedCount !== undefined && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-amber-800 mb-2">
                  ⚠️ パース結果: {testError.parsedCount}個のシナリオが検出されました（1個必要）
                </p>
                <details>
                  <summary className="cursor-pointer text-xs text-amber-700 hover:text-amber-900">
                    Claudeの生出力を表示
                  </summary>
                  <pre className="mt-2 bg-white rounded p-2 text-xs overflow-auto max-h-96 text-slate-800 border border-amber-200">
                    {testError.rawText}
                  </pre>
                </details>
              </div>
            )}
            
            {testError.technicalDetails && !testError.isParseError && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-800 mb-2">
                  技術的な詳細を表示
                </summary>
                <div className="bg-red-50 rounded-lg p-3 text-xs text-red-700 mb-2">
                  {testError.technicalDetails}
                </div>
                <pre className="bg-red-50 rounded-lg p-4 text-xs overflow-auto max-h-64 text-red-800">
                  {testError.rawText}
                </pre>
              </details>
            )}
            
            <Button
              onClick={handleGenerateClick}
              disabled={generating}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              再試行
            </Button>
          </div>
        )}
      </div>
      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        email={authEmail}
        planType={checkoutPlan}
      />
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>メール認証</DialogTitle>
            <DialogDescription>
              {authStep === 'email'
                ? 'メールアドレスを入力してください。'
                : '6桁の認証コードを入力してください。'}
            </DialogDescription>
          </DialogHeader>
          {authStep === 'email' ? (
            <Input
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="メールアドレス"
            />
          ) : (
            <div className="space-y-2">
              <Input
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="6桁コード"
              />
              {devCode ? <p className="text-xs text-amber-700">開発用コード: {devCode}</p> : null}
            </div>
          )}
          <DialogFooter>
            {authStep === 'email' ? (
              <Button onClick={sendCode} disabled={sendingCode || !authEmail}>
                {sendingCode ? '送信中...' : 'コード送信'}
              </Button>
            ) : (
              <Button onClick={verifyCode} disabled={verifyingCode || !authCode}>
                {verifyingCode ? '認証中...' : '認証する'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}