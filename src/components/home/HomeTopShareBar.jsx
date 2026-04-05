'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link2, Check, MessageCircle, Copy, Facebook, Instagram } from 'lucide-react';
import {
  buildResultPlainText,
  buildSharePostText,
} from '@/components/scenarios/ScenarioShare';
import { getShareOrigin } from '@/lib/share-origin';

/**
 * トップ（/?share=）で共有シナリオを見ているときの再共有用。QR は出さない。
 */
export default function HomeTopShareBar({ shareId, scenarios = [] }) {
  const [shareRef, setShareRef] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [igStoryCopied, setIgStoryCopied] = useState(false);

  useEffect(() => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 14)
        : `r${Date.now().toString(36)}`;
    setShareRef(id);
  }, []);

  const origin = getShareOrigin();
  const deeplinkUrl =
    shareId && shareRef
      ? `${origin}/?share=${encodeURIComponent(shareId)}&ref=${encodeURIComponent(shareRef)}`
      : '';

  const titleForSns = scenarios[0]?.scenario_title || '';
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
    if (!deeplinkUrl) return;
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

  if (!shareId) return null;

  const linkReady = Boolean(deeplinkUrl);
  const actionBtnClass =
    'w-full min-h-12 sm:min-h-14 h-auto py-3 px-3 rounded-xl border-slate-200 text-slate-800 hover:bg-slate-50 gap-2 text-sm sm:text-[15px] font-medium leading-snug justify-center text-center';

  return (
    <div className="mt-8 pt-6 border-t border-slate-200 min-w-0">
      <h3 className="text-center text-base sm:text-lg font-semibold text-slate-900 mb-1">
        この結果をシェア
      </h3>
      <p className="text-center text-xs text-slate-500 mb-4 max-w-lg mx-auto leading-snug">
        トップ画面の同じ表示へのリンクがコピー・SNS投稿に使われます（QRコードはありません）。
      </p>
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
        <Button type="button" variant="outline" className={actionBtnClass} onClick={copyFriendLink} disabled={!linkReady}>
          {copiedLink ? <Check className="w-5 h-5 shrink-0 text-green-600" /> : <Link2 className="w-5 h-5 shrink-0" />}
          <span>{copiedLink ? 'コピー済' : 'リンクをコピー'}</span>
        </Button>
      </div>
    </div>
  );
}
