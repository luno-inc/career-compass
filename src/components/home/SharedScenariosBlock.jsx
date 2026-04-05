'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ScenarioResultCard from '@/components/scenarios/ScenarioResultCard';
import HomeTopShareBar from '@/components/home/HomeTopShareBar';
import { Sparkles, ChevronRight } from 'lucide-react';

/**
 * 共有で受け取ったシナリオを読み取り専用で表示し、診断への CTA を出す。
 * @param {{ scenarios: object[], shareId?: string | null, heading?: string, className?: string }} props
 */
export default function SharedScenariosBlock({
  scenarios,
  shareId = null,
  heading = 'シェアされたキャリアシナリオ',
  className = '',
}) {
  if (!scenarios?.length) return null;

  return (
    <div
      className={`w-full rounded-2xl border border-indigo-200/80 bg-white/90 shadow-sm p-4 sm:p-6 mb-8 sm:mb-10 ${className}`}
    >
      <p className="text-center text-sm sm:text-base font-semibold text-indigo-900 mb-1">{heading}</p>
      <p className="text-center text-xs sm:text-sm text-slate-600 mb-6 sm:mb-8">
        あなた専用のシナリオも、同じ診断で生成できます。
      </p>
      <div className="space-y-6 sm:space-y-8">
        {scenarios.map((s, i) => (
          <div
            key={s.id || `shared-${i}`}
            className="rounded-xl border border-slate-100 bg-slate-50/50 overflow-hidden"
          >
            <ScenarioResultCard scenario={s} index={i} compact />
          </div>
        ))}
      </div>

      {shareId ? <HomeTopShareBar shareId={shareId} scenarios={scenarios} /> : null}

      <div className="flex justify-center mt-8 sm:mt-10">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-lg"
        >
          <Link href="/profile">
            <Sparkles className="w-5 h-5 mr-2" />
            あなたも診断してみる
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
