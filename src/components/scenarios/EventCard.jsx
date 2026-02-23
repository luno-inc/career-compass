import React from 'react';
import { Badge } from '@/components/ui/badge';

const CATEGORY_COLORS = {
  "気候・環境": { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  "エネルギー・資源": { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  "人口・都市・移動": { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  "経済・金融": { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  "技術・AI・デジタル": { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  "健康・医療・食": { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  "社会構造・働き方": { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
  "政治・ガバナンス・安全保障": { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  "文化・価値観・教育": { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  "宇宙・フロンティア・ハイリスク技術": { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' }
};

const TIMEFRAME_LABELS = {
  short: '2030年代',
  medium: '2040年代',
  long: '2050年以降'
};

export default function EventCard({ event, index }) {
  const colors = CATEGORY_COLORS[event.category] || CATEGORY_COLORS["気候・環境"];
  const text = event.text;
  const firstPeriod = text.indexOf('。');
  const title = firstPeriod > 0 && firstPeriod < 80 ? text.slice(0, firstPeriod) : text.slice(0, 60) + (text.length > 60 ? '...' : '');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center font-bold text-sm`}>
          {index + 1}
        </div>
        <Badge variant="outline" className={`${colors.bg} ${colors.text} ${colors.border} border`}>
          {event.category}
        </Badge>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500">
        {TIMEFRAME_LABELS[event.timeframe]}
      </p>
    </div>
  );
}