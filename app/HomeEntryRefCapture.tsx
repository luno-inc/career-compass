'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/** QR・共有リンクの ?ref= で流入したとき、任意の計測用に保持（トップはそのまま表示） */
export default function HomeEntryRefCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref && ref.length <= 64 && /^[a-zA-Z0-9_-]+$/.test(ref)) {
      try {
        sessionStorage.setItem('careerCompassEntryRef', ref);
      } catch {
        /* ignore */
      }
    }
  }, [searchParams]);

  return null;
}
