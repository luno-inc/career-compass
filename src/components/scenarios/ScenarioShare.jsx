'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, Check, MessageCircle, Copy, Compass, Facebook, Instagram } from 'lucide-react';
import QRCode from 'react-qr-code';
import { getShareOrigin } from '@/lib/share-origin';

const SHARE_HASHTAGS = '#CareerCompass #未来キャリア #キャリア診断';

/** API に送るシナリオ（クライアント専用 id 等を除く） */
function scenariosForSharePayload(scenarios) {
  return scenarios.map((s) => ({
    scenario_title: s.scenario_title,
    role_definition: s.role_definition,
    scenario_description: s.scenario_description,
    reasoning: s.reasoning,
    next_step_recommendation: s.next_step_recommendation,
    scenario_type: s.scenario_type,
  }));
}

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
  const [shareId, setShareId] = useState(null);
  /** idle | loading | ok | error */
  const [shareRegisterState, setShareRegisterState] = useState('idle');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [igStoryCopied, setIgStoryCopied] = useState(false);

  const titleForSns = scenarioTitle || scenarios[0]?.scenario_title || '';

  useEffect(() => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 14)
        : `r${Date.now().toString(36)}`;
    setShareRef(id);
  }, []);

  useEffect(() => {
    if (!scenarios?.length) return undefined;
    let cancelled = false;
    setShareRegisterState('loading');
    setShareId(null);

    const run = async () => {
      try {
        const res = await fetch('/api/shared-scenario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenarios: scenariosForSharePayload(scenarios) }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data?.ok && data?.id) {
          setShareId(data.id);
          setShareRegisterState('ok');
        } else {
          setShareRegisterState('error');
        }
      } catch {
        if (!cancelled) setShareRegisterState('error');
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [scenarios]);

  const origin = getShareOrigin();
  const deeplinkUrl =
    shareRegisterState === 'ok' && shareId
      ? shareRef
        ? `${origin}/?share=${encodeURIComponent(shareId)}&ref=${encodeURIComponent(shareRef)}`
        : `${origin}/?share=${encodeURIComponent(shareId)}`
      : '';
  const fallbackRefOnlyUrl = shareRef ? `${origin}/?ref=${encodeURIComponent(shareRef)}` : '';

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

  const openFacebook = useCallback(() => {
    const u = encodeURIComponent(deeplinkUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      '_blank',
      'noopener,noreferrer'
    );
  }, [deeplinkUrl]);

  /** ストーリーは Web API で直接開けないため、共有シート → 失敗時はコピー＋アプリのカメラ起動 */
  const openInstagramStory = useCallback(async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Career Compass',
          text: shareText,
          url: deeplinkUrl,
        });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setIgStoryCopied(true);
      setTimeout(() => setIgStoryCopied(false), 3500);
    } catch {
      setIgStoryCopied(false);
    }
    const mobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (mobile) {
      window.location.href = 'instagram://camera';
    }
  }, [shareText, deeplinkUrl]);

  const copyFriendLink = useCallback(async () => {
    const target = deeplinkUrl || fallbackRefOnlyUrl;
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(false);
    }
  }, [deeplinkUrl, fallbackRefOnlyUrl]);

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

  if (!shareRef || !scenarios?.length) {
    return null;
  }

  const linkReady = Boolean(deeplinkUrl);
  const shareUrlBlocked = shareRegisterState === 'error';
  const shareLoading =
    Boolean(scenarios?.length) && shareRegisterState !== 'ok' && shareRegisterState !== 'error';

  const actionBtnClass =
    'w-full min-h-12 sm:min-h-14 h-auto py-3 px-3 rounded-xl border-slate-200 text-slate-800 hover:bg-slate-50 gap-2 text-sm sm:text-[15px] font-medium leading-snug justify-center text-center';

  return (
    <section className="mt-12 sm:mt-20 pt-6 sm:pt-10 w-full min-w-0">
      <Card className="border border-slate-200/80 shadow-sm bg-white/95 rounded-2xl overflow-hidden w-full max-w-full min-w-0">
        <CardContent className="p-0 min-w-0">
          <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-3 sm:pb-4 text-center border-b border-slate-100">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">結果をシェア</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-snug max-w-xl mx-auto">
              共有用リンクでは、トップ画面（/?share=…）にこの結果を表示できます。サーバーに一時保存され、約30日で削除されます（環境により異なります）。
            </p>
          </div>

          {shareUrlBlocked && (
            <div className="mx-4 sm:mx-6 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs sm:text-sm text-amber-900">
              共有用リンクを作成できませんでした（ストレージ未設定など）。「リンクをコピー」はトップへの導線のみになります。管理者は Upstash Redis の環境変数を設定してください。
            </div>
          )}

          <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10 min-w-0">
            <div className="min-w-0">
              {/* モバイル: 縦並び / sm〜: 2列 / lg〜: 3列 */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
                <Button
                  type="button"
                  variant="outline"
                  className={actionBtnClass}
                  onClick={copyResultText}
                  disabled={!resultPlain}
                >
                  {copiedResult ? <Check className="w-5 h-5 shrink-0 text-green-600" /> : <Copy className="w-5 h-5 shrink-0" />}
                  <span>{copiedResult ? 'コピー済' : '結果の文面をコピー'}</span>
                </Button>
                <Button type="button" variant="outline" className={actionBtnClass} onClick={openX} disabled={!linkReady}>
                  <span className="font-bold text-base leading-none shrink-0">𝕏</span>
                  <span>X</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`${actionBtnClass} border-[#06C755]/40 text-[#06C755] hover:bg-green-50`}
                  onClick={openLine}
                  disabled={!linkReady}
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>LINE</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`${actionBtnClass} border-[#1877F2]/40 text-[#1877F2] hover:bg-blue-50/80`}
                  onClick={openFacebook}
                  disabled={!linkReady}
                >
                  <Facebook className="w-5 h-5 shrink-0" />
                  <span>Facebook</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`${actionBtnClass} border-pink-500/35 text-pink-600 hover:bg-pink-50/80`}
                  onClick={openInstagramStory}
                  disabled={!linkReady}
                  title="スマホでは共有シートからInstagramを選べます。表示されない場合は文面をコピーしてストーリーに貼り付けられます。"
                >
                  {igStoryCopied ? <Check className="w-5 h-5 shrink-0 text-green-600" /> : <Instagram className="w-5 h-5 shrink-0" />}
                  <span>{igStoryCopied ? '文面をコピー済' : 'ストーリーへ'}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={actionBtnClass}
                  onClick={copyFriendLink}
                  disabled={!deeplinkUrl && !fallbackRefOnlyUrl}
                >
                  {copiedLink ? <Check className="w-5 h-5 shrink-0 text-green-600" /> : <Link2 className="w-5 h-5 shrink-0" />}
                  <span>
                    {copiedLink ? 'コピー済' : shareUrlBlocked ? 'トップへのリンクをコピー' : 'リンクをコピー'}
                  </span>
                </Button>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex flex-col items-center min-w-0 w-full">
              <p className="mb-4 sm:mb-5 text-sm sm:text-base md:text-lg text-slate-700 text-center font-medium leading-snug px-1 max-w-md">
                カメラで読み取って、友だちにも診断してもらおう
              </p>
              <div className="bg-white p-3 sm:p-5 rounded-xl border border-slate-200 shadow-inner w-full max-w-[min(200px,calc(100vw-3rem))] mx-auto min-h-[120px] flex items-center justify-center">
                {shareLoading && (
                  <div className="text-sm text-slate-500 text-center px-2">共有用リンクを準備しています…</div>
                )}
                {!shareLoading && linkReady && (
                  <QRCode
                    value={deeplinkUrl}
                    size={200}
                    level="M"
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    viewBox="0 0 200 200"
                  />
                )}
                {!shareLoading && shareUrlBlocked && (
                  <div className="text-xs text-slate-500 text-center px-2">QR は共有リンク準備後に表示されます</div>
                )}
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
