'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function getDocumentsContext(): string {
  if (typeof window === 'undefined') return '';
  const savedDocuments = sessionStorage.getItem('careerCompassDocuments');
  if (!savedDocuments) return '';
  const documents = JSON.parse(savedDocuments);
  if (documents.length === 0) return '';
  const typeLabels: Record<string, string> = {
    diary: '日記・ジャーナル',
    sns: 'SNS投稿',
    resume: '自己紹介・履歴書',
    reflection: '振り返りメモ',
    other: 'その他資料'
  };
  const docTexts = documents
    .map((doc: { type?: string; title?: string; content?: string }) =>
      `【${typeLabels[doc.type] || 'その他'}】${doc.title || ''}\n${doc.content || '(ファイルアップロード済み)'}`
    )
    .join('\n\n');
  return `\n\n## ユーザーがアップロードした追加資料\n以下はユーザー自身について書かれた資料です。この情報も踏まえてシナリオを生成してください。\n\n${docTexts}`;
}

export default function GeneratingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const profileJson = sessionStorage.getItem('careerCompassProfile');
      const eventTextsJson = sessionStorage.getItem('careerCompassEventTexts');
      if (!profileJson || !eventTextsJson) {
        if (!cancelled) {
          setError('プロフィールまたはイベント情報が見つかりません。');
        }
        return;
      }
      const profile = JSON.parse(profileJson);
      const eventTexts: string[] = JSON.parse(eventTextsJson);
      const profileText = Object.entries(profile)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');
      const documentsContext = getDocumentsContext();

      try {
        const response = await fetch('/api/generate-scenarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileText, eventTexts, documentsContext })
        });
        const result = await response.json();

        if (cancelled) return;

        if (!response.ok || response.status !== 200) {
          sessionStorage.setItem('careerCompassGenerateError', JSON.stringify({
            error: `サーバーエラー（ステータス: ${response.status}）`,
            requestId: result?.requestId || 'N/A',
            technicalDetails: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
          }));
          router.push('/event-selection');
          return;
        }

        if (result.ok === false || result.error) {
          sessionStorage.setItem('careerCompassGenerateError', JSON.stringify({
            error: result.error || '不明なエラー',
            stage: result.stage || 'unknown',
            requestId: result.requestId || 'N/A',
            technicalDetails: JSON.stringify(result, null, 2),
            rawText: result.rawContent || JSON.stringify(result, null, 2),
            parsedCount: result.parsedCount,
            isParseError: result.errorType === 'PARSE_ERROR'
          }));
          router.push('/event-selection');
          return;
        }

        if (result.scenarios && result.scenarios.length > 0) {
          sessionStorage.removeItem('careerCompassGenerateError');
          sessionStorage.setItem('careerCompassScenarios', JSON.stringify(result));
          router.push('/scenarios');
        } else {
          sessionStorage.setItem('careerCompassGenerateError', JSON.stringify({
            error: 'シナリオが生成されませんでした',
            requestId: result.requestId || 'N/A',
            technicalDetails: JSON.stringify(result, null, 2)
          }));
          router.push('/event-selection');
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        sessionStorage.setItem('careerCompassGenerateError', JSON.stringify({
          error: message,
          requestId: 'N/A',
          technicalDetails: JSON.stringify(err, null, 2)
        }));
        router.push('/event-selection');
      }
    };

    run();
    return () => { cancelled = true; };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex items-center justify-center px-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col items-center justify-center px-4">
      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
      <h1 className="text-xl font-semibold text-slate-800 mb-2">シナリオを生成しています</h1>
      <p className="text-slate-600 text-center max-w-sm">1〜2分ほどお待ちください</p>
    </div>
  );
}
