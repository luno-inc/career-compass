import { NextRequest, NextResponse } from 'next/server';
import { createSharedScenario, getSharedScenarioById } from '@/lib/shared-scenario-store';
import { isValidShareId } from '@/lib/shared-scenario-schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createSharedScenario(body);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true, id: result.id });
  } catch {
    return NextResponse.json({ ok: false, error: 'リクエストの解析に失敗しました。' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!isValidShareId(id)) {
    return NextResponse.json({ ok: false, error: '無効な ID です。' }, { status: 400 });
  }

  const data = await getSharedScenarioById(id);
  if (!data) {
    return NextResponse.json({ ok: false, error: '共有が見つからないか、期限切れです。' }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    scenarios: data.scenarios,
    createdAt: data.createdAt,
  });
}
