'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Sparkles, ChevronRight, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col">
      {/* メイン：中央配置 */}
      <div className="relative flex-1 flex flex-col justify-center overflow-hidden min-h-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10 pointer-events-none" />
        <div
          className="relative max-w-5xl mx-auto px-6 w-full"
          style={{ paddingTop: 'clamp(1.5rem, 6vh, 3rem)', paddingBottom: 'clamp(1.5rem, 4vh, 2rem)' }}
        >
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse" />
              <Compass className="w-20 h-20 text-indigo-600 relative" strokeWidth={1.5} />
            </div>
          </div>

          <p className="text-xl text-center text-slate-600 mb-4 max-w-3xl mx-auto leading-relaxed font-medium">
            生成AIが描く、あなたの未来キャリア
          </p>

          <p className="text-center text-slate-500 max-w-2xl mx-auto mb-8 text-sm md:text-base">
            技術革新、気候変動、地政学的変動。予測不可能な未来に対して、
            <br className="hidden sm:block" />
            複数のシナリオを通じて、あなた自身の「次の一歩」を見つけましょう。
          </p>

          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-800">
              <Shield className="w-4 h-4 shrink-0" />
              <span>入力データは保存されません。セッション終了後に自動削除されます。</span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              <Link href="/profile">
                <Sparkles className="w-5 h-5 mr-2" />
                診断を開始する
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ロゴ風ブランド（画面最下部・16Personalities のフッターロゴに近い役割） */}
      <footer className="shrink-0 py-6 px-6 border-t border-indigo-100/60 bg-gradient-to-t from-indigo-50/80 to-transparent">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-1">
          <p
            className="text-lg sm:text-xl font-semibold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            style={{ letterSpacing: '-0.02em' }}
          >
            Career Compass
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400 tracking-widest uppercase">
            Future Career Scenario
          </p>
        </div>
      </footer>
    </div>
  );
}
