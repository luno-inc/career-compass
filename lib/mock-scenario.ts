type MockScenarioInput = {
  profileText: string;
  eventTexts: string[];
  email?: string;
};

function extractFirstLine(text: string, fallback: string) {
  const first = text
    .split('\n')
    .map((v) => v.trim())
    .find(Boolean);
  return first || fallback;
}

export function buildMockScenario(input: MockScenarioInput) {
  const firstEvent = extractFirstLine(input.eventTexts[0] || '', '外部環境の変化');
  const secondEvent = extractFirstLine(input.eventTexts[1] || '', 'もう1つの外部要因');
  const profileHeadline = extractFirstLine(input.profileText || '', 'プロフィール情報');

  return {
    scenario_type: 'realistic',
    scenario_title: 'テストモード: 課金不要で閲覧できる仮シナリオ',
    role_definition: '環境変化に合わせて、既存スキルを活かしながら役割を再定義する。',
    scenario_description: `このシナリオはホワイトリスト対象ユーザー向けの仮データです。現在の入力（${profileHeadline}）を起点に、外部環境として「${firstEvent}」と「${secondEvent}」を前提にしています。ここでは、キャリア選択の幅を試せるよう既存UIと同じ構造で表示しています。実際の本番生成では、同様の入力からClaudeが詳細な因果関係を含むシナリオを返します。`,
    reasoning:
      '課金/生成フローの接続確認を目的に、同一UIで閲覧できるサンプルを返却しています。外部環境の変化とプロフィール要素の整合性を保つ形で内容を構成しています。',
    evidence: [firstEvent, secondEvent],
    next_step_recommendation: 'この結果ページで表示確認後、通常アカウントで本番生成フローも確認してください。',
    key_opportunities: ['入力〜結果表示の動線検証', 'イベント反映の見え方確認'],
    required_skills: ['仮説思考', '環境変化の読み取り'],
    action_plan: ['外生イベントの再抽選を実施', 'プロフィール入力を変更して再実行', '通常アカウントと比較確認'],
    probability_level: 'medium',
    positivity_score: 35,
    change_magnitude: 55,
    source: 'mock-bypass',
    bypass_email: input.email || '',
  };
}

