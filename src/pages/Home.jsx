'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Sparkles, ChevronRight, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse" />
              <Compass className="w-20 h-20 text-indigo-600 relative" strokeWidth={1.5} />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Career Compass
          </h1>
          
          <p className="text-xl text-center text-slate-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            生成AIが描く、あなたの未来キャリア
          </p>
          
          <p className="text-center text-slate-500 max-w-2xl mx-auto mb-8">
            技術革新、気候変動、地政学的変動。予測不可能な未来に対して、<br />
            複数のシナリオを通じて、あなた自身の「次の一歩」を見つけましょう。
          </p>

          {/* プライバシー保護の説明 */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-800">
              <Shield className="w-4 h-4" />
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
    </div>
  );
}