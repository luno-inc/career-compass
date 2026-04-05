import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import HomeEntryRefCapture from '../../HomeEntryRefCapture';
import SharedScenariosBlock from '@/components/home/SharedScenariosBlock';
import { isValidShareId } from '@/lib/shared-scenario-schema';
import { getSharedScenarioById } from '@/lib/shared-scenario-store';

function siteBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isValidShareId(id)) {
    return { title: '共有 | Career Compass' };
  }

  const data = await getSharedScenarioById(id);
  const rawTitle = data?.scenarios?.[0]?.scenario_title?.trim() || '';
  const title =
    rawTitle.length > 0
      ? rawTitle.length > 64
        ? `${rawTitle.slice(0, 64)}…`
        : rawTitle
      : 'キャリアシナリオの共有';
  const description =
    '友だちがシェアした未来キャリアシナリオです。Career Compass であなた専用のシナリオも生成できます。';
  const base = siteBaseUrl();
  const canonical = `${base}/share/${id}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Career Compass`,
      description,
      url: canonical,
      siteName: 'Career Compass',
      locale: 'ja_JP',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Career Compass`,
      description,
    },
  };
}

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidShareId(id)) notFound();

  const data = await getSharedScenarioById(id);
  if (!data) notFound();

  const scenarios = data.scenarios.map((s, i) => ({ ...s, id: `path-share-${i}` }));

  return (
    <>
      <Suspense fallback={null}>
        <HomeEntryRefCapture />
      </Suspense>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col">
        <div className="relative flex-1 flex flex-col justify-center overflow-hidden min-h-0 py-8 sm:py-10">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10 pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 w-full min-w-0">
            <p className="text-center text-sm text-slate-500 mb-6">
              <Link href="/" className="text-indigo-600 hover:underline">
                Career Compass トップへ
              </Link>
            </p>
            <SharedScenariosBlock
              scenarios={scenarios}
              shareId={id}
              heading="シェアされたキャリアシナリオ"
            />
          </div>
        </div>
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
    </>
  );
}
