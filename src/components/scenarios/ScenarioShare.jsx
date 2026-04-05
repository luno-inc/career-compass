'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, Check, MessageCircle, Copy, Compass } from 'lucide-react';
import QRCode from 'react-qr-code';

const SHARE_HASHTAGS = '#CareerCompass #未来キャリア #キャリア診断';

/** 共有URLのオリジン（QR・X・LINE・リンクコピー）。環境変数があればそちらを優先 */
const SHARE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://career-compass-six-jet.vercel.app'
).replace(/\/$/, '');

const MAX_TITLE_LINE = 56;

function truncateTitle(title) {
  if (!title || typeof title !== 'string') return '';
  const t = title.trim();
  if (t.length <= MAX_TITLE_LINE) return t;
  return `${t.slice(0, MAX_TITLE_LINE)}…`;
}

/** 結果画面の表示内容に近いプレーンテキスト（コピー用） */
export function buildResultPlainText(scenarios) {
  if (!Array.isArray(scenarios) || scenarios.length === 0) return '';
  const lines = ['── Career Compass · キャリアシナリオ結果 ──', ''];
  scenarios.forEach((s, i) => {
    if (scenarios.length > 1) {
      lines.push(`【シナリオ ${i + 1}】`, '');
    }
    if (s.scenario_title) lines.push(`■ ${s.scenario_title}`, '');
    if (s.role_definition) {
      lines.push('【このシナリオでのあなたの役割】', s.role_definition, '');
    }
    if (s.scenario_description) {
      lines.push('【シナリオの詳細】', s.scenario_description, '');
    }
    if (s.reasoning) {
      lines.push('【なぜあなたに当てはまるか】', s.reasoning, '');
    }
    if (s.next_step_recommendation) {
      lines.push('【次の一歩】', s.next_step_recommendation, '');
    }
    if (i < scenarios.length - 1) lines.push('──────────', '');
  });
  lines.push('（Career Compass で生成）');
  return lines.join('\n').trim();
}

/** X投稿用：改行区切りで1タップ投稿 */
export function buildSharePostText(scenarioTitle, deeplinkUrl) {
  const short = truncateTitle(scenarioTitle);
  if (short) {
    return `私の未来キャリアシナリオは「${short}」です。\nあなたも生成してみませんか？\n\n${deeplinkUrl}\n\n${SHARE_HASHTAGS}`;
  }
  return `Career Compass で「自分専用」の未来キャリアシナリオを試しました。\nあなたも生成してみませんか？\n\n${deeplinkUrl}\n\n${SHARE_HASHTAGS}`;
}

export default function ScenarioShare({ scenarios = [], scenarioTitle }) {
  const [shareRef, setShareRef] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const titleForSns = scenarioTitle || scenarios[0]?.scenario_title || '';

  useEffect(() => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 14)
        : `r${Date.now().toString(36)}`;
    setShareRef(id);
  }, []);

  const deeplinkUrl = shareRef ? `${SHARE_ORIGIN}/?ref=${encodeURIComponent(shareRef)}` : '';
  const shareText = deeplinkUrl ? buildSharePostText(titleForSns, deeplinkUrl) : '';
  const resultPlain = buildResultPlainText(scenarios);

  const openX = useCallback(() => {
    const params = new URLSearchParams({ text: shareText });
    window.open(`https://twitter.com/intent/tweet?${params.toString()}`, '_blank', 'noopener,noreferrer');
  }, [shareText]);

  const openLine = useCallback(() => {
    window.open(
      `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }, [shareText]);

  const copyFriendLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(deeplinkUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(false);
    }
  }, [deeplinkUrl]);

  const copyResultText = useCallback(async () => {
    if (!resultPlain) return;
    try {
      await navigator.clipboard.writeText(resultPlain);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2500);
    } catch {
      setCopiedResult(false);
    }
  }, [resultPlain]);

  if (!shareRef || !deeplinkUrl) {
    return null;
  }

  const actionBtnClass =
    'flex-1 min-w-0 h-14 px-2 sm:px-3 rounded-xl border-slate-200 text-slate-800 hover:bg-slate-50 gap-2 text-sm sm:text-[15px] font-medium leading-tight whitespace-normal';

  return (
    <section className="mt-20 pt-10 w-full">
      <Card className="border border-slate-200/80 shadow-sm bg-white/95 rounded-2xl overflow-hidden w-full">
        <CardContent className="p-0">
          <div className="px-6 pt-8 pb-4 text-center border-b border-slate-100">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">結果をシェア</h2>
          </div>

          <div className="px-6 py-8 space-y-10">
            <div>
              <div className="flex flex-row gap-2 w-full overflow-x-auto pb-1 sm:overflow-visible sm:pb-0 [-webkit-overflow-scrolling:touch]">
                <Button
                  type="button"
                  variant="outline"
                  className={`${actionBtnClass} shrink-0 sm:shrink sm:min-w-0`}
                  onClick={copyResultText}
                  disabled={!resultPlain}
                >
                  {copiedResult ? <Check className="w-5 h-5 shrink-0 text-green-600" /> : <Copy className="w-5 h-5 shrink-0" />}
                  <span className="text-center">{copiedResult ? 'コピー済' : '結果の文面をコピー'}</span>
                </Button>
                <Button type="button" variant="outline" className={`${actionBtnClass} shrink-0 sm:shrink sm:min-w-0`} onClick={openX}>
                  <span className="font-bold text-base leading-none shrink-0">𝕏</span>
                  <span>X</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`${actionBtnClass} shrink-0 sm:shrink sm:min-w-0 border-[#06C755]/40 text-[#06C755] hover:bg-green-50`}
                  onClick={openLine}
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>LINE</span>
                </Button>
                <Button type="button" variant="outline" className={`${actionBtnClass} shrink-0 sm:shrink sm:min-w-0`} onClick={copyFriendLink}>
                  {copiedLink ? <Check className="w-5 h-5 shrink-0 text-green-600" /> : <Link2 className="w-5 h-5 shrink-0" />}
                  <span className="text-center">{copiedLink ? 'コピー済' : 'リンクをコピー'}</span>
                </Button>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex flex-col items-center">
              <p className="mb-5 text-base sm:text-lg text-slate-700 text-center font-medium leading-snug px-2">
                カメラで読み取って、友だちにも診断してもらおう
              </p>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-inner">
                <QRCode value={deeplinkUrl} size={200} level="M" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TOP と同系のロゴ + 著作権 */}
      <footer className="mt-10 pt-8 pb-2 border-t border-indigo-100/60 flex flex-col items-center gap-2">
        <div className="relative mb-1">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-lg opacity-25 scale-150" />
          <Compass className="w-9 h-9 text-indigo-600 relative" strokeWidth={1.5} />
        </div>
        <p
          className="text-lg sm:text-xl font-semibold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          style={{ letterSpacing: '-0.02em' }}
        >
          Career Compass
        </p>
        <p className="text-[11px] sm:text-xs text-slate-400 tracking-widest uppercase">
          Future Career Scenario
        </p>
        <p className="text-[10px] text-slate-400 mt-3 tracking-wide">
          @Career Compass, all rights reserved.
        </p>
      </footer>
    </section>
  );
}
