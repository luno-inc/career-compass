'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SharedScenariosBlock from '@/components/home/SharedScenariosBlock';
import { isValidShareId } from '@/lib/shared-scenario-schema';

export default function HomeShareFromQuery() {
  const searchParams = useSearchParams();
  const [state, setState] = useState({ status: 'idle', scenarios: null, shareId: null });

  useEffect(() => {
    const id = searchParams.get('share');
    if (!isValidShareId(id)) {
      setState({ status: 'idle', scenarios: null, shareId: null });
      return undefined;
    }

    let cancelled = false;
    setState({ status: 'loading', scenarios: null, shareId: null });

    fetch(`/api/shared-scenario?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.ok && Array.isArray(data.scenarios) && data.scenarios.length > 0) {
          setState({
            status: 'ok',
            shareId: id,
            scenarios: data.scenarios.map((s, i) => ({ ...s, id: `home-share-${i}` })),
          });
        } else {
          setState({ status: 'error', scenarios: null, shareId: null });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', scenarios: null, shareId: null });
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  if (state.status === 'idle') return null;
  if (state.status === 'loading') {
    return (
      <div className="w-full mb-6 sm:mb-8 text-center text-sm text-slate-500">共有結果を読み込み中…</div>
    );
  }
  if (state.status === 'error') {
    return (
      <div className="w-full mb-6 sm:mb-8 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-center text-sm text-slate-600">
        共有の有効期限が切れたか、リンクが無効です。下からあなたの診断を始められます。
      </div>
    );
  }

  return (
    <SharedScenariosBlock
      scenarios={state.scenarios}
      shareId={state.shareId}
      heading="友だちがシェアしたシナリオ"
    />
  );
}
