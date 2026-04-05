/** 共有リンクのオリジン（NEXT_PUBLIC_SITE_URL 優先） */
export function getShareOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://career-compass-six-jet.vercel.app'
  ).replace(/\/$/, '');
}
