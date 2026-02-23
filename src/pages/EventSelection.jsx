'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Shuffle, Sparkles } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { EXTERNAL_EVENTS } from '../components/scenarios/externalEvents';
import EventCard from '../components/scenarios/EventCard';

const TIMEFRAME_LABELS = {
  short: '5〜10年後（2030〜2035年）',
  medium: '15〜25年後（2040〜2050年）',
  long: '25〜50年後（2050〜2075年）'
};

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
      } catch (_) {}
      sessionStorage.removeItem('careerCompassGenerateError');
    }
  }, [router]);

  const shuffleEvents = () => {
    setEvents(generateRandomEvents(2));
  };

  const handleGenerateClick = () => {
    if (generating) return;
    setTestError(null);
    const eventTexts = events.map(e => e.text);
    sessionStorage.setItem('careerCompassEventTexts', JSON.stringify(eventTexts));
    setGenerating(true);
    router.push('/event-selection/generating');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4">
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
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-700 gap-2"
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
    </div>
  );
}