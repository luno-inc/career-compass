import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  console.log(`[${requestId}] Request started`);

  try {
    console.log(`[${requestId}] Step 1: Parsing request body`);
    const { profileText, eventTexts, documentsContext } = await request.json();
    console.log(`[${requestId}] Received params:`, {
      profileText: profileText?.substring(0, 50),
      eventTexts,
      documentsContext: documentsContext?.substring(0, 50),
    });

    if (!profileText || !eventTexts || !Array.isArray(eventTexts)) {
      console.log(`[${requestId}] Error: Invalid parameters`);
      return NextResponse.json(
        {
          requestId,
          ok: false,
          stage: 'validation',
          error: 'Invalid parameters: profileText and eventTexts are required',
        },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] Step 2: Checking API key`);
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      console.log(`[${requestId}] Error: ANTHROPIC_API_KEY not configured`);
      const isVercel = !!process.env.VERCEL;
      const errorMessage = isVercel
        ? 'APIキーが設定されていません。Vercel の Project Settings → Environment Variables に ANTHROPIC_API_KEY を追加し、再デプロイしてください。'
        : 'APIキーが設定されていません。.env.local に ANTHROPIC_API_KEY を追加し、開発サーバーを再起動してください。';
      return NextResponse.json(
        {
          requestId,
          ok: false,
          stage: 'config',
          error: errorMessage,
        },
        { status: 200 }
      );
    }
    console.log(`[${requestId}] API key found`);

    const prompt = `
    あなたは「未来キャリアシナリオ」を生成する専門家である。

    【シナリオの目的】
    このシナリオの目的は、単にポジティブ/ネガティブな未来を提示することではない。

    読み手が
    「こんな未来は想像していなかったが、この論理なら確かに起こり得る」
    と驚きと納得を同時に感じること
    を最優先とする。

    具体的には：
    1. ユーザーのキャリアの幅を広げること
    2. 「考えていなかったが、確かにあり得る未来」に気づかせること
    3. 適切な危機感と、次の判断余地を同時に提示すること

    単なるネガティブな未来描写や、理想的な成功物語のどちらでもなく、
    「外部環境の変化によって新たな選択肢が現実的になる過程」を描くことである。

    ## 【ユーザープロフィール】
    ${profileText}
    ${documentsContext || ''}

    **重要：大学・企業の背景も文脈として考慮すること**
    ユーザーの出身大学や勤務企業が記載されている場合、それらを文脈の一つとして考慮する。
    ただし、「〇〇大学だから無理」「△△企業出身では通用しない」のような学歴差別的な表現は厳禁。
    構造的な制約を描く場合も、個人の能力や可能性を否定せず、環境や選択肢の変化として中立的に表現すること。

    ## 【外生イベント（Future Drivers）】
    ${eventTexts.map((event: string, i: number) => `${i + 1}. ${event}`).join('\n')}

    ⸻

    【本シナリオ生成の思想】

    以下を必ず満たすこと。
    - シナリオは **「今のユーザーが視野に入れていない選択肢」** を扱うこと
    - シナリオは「意外だが、構造的には十分にあり得る未来」でなければならない
    - 単なる悲観・破滅・理想的な成功物語は禁止。現実的な可能性と課題の両面を描くこと
    - "なぜそれが起きるのか"の手順（因果の連鎖）を必ず明示すること
    - 「新たな可能性」と「構造的な制約」の両方を含めること

    ⸻

    【STEP 0：ユーザー入力の解釈（必須）】

    シナリオ生成前に、以下を必ず出力する。

    【あなたの入力から読み取れること】
    - ユーザーが大切にしている価値観（3点以内）
    - ユーザーが「自分はやらない」と思っていそうな選択
    - ユーザーが恐れている未来・避けたい状況
    - ユーザーが前提として信じている世界観（暗黙の思い込み）

    ※この解釈が浅い場合、シナリオ生成を行ってはならない

    ⸻

    【STEP 1：シナリオの基本構造（最重要）】

    **1つのシナリオ**を生成すること。

    以下のいずれかの方向性で、ユーザーにとって「考えていなかったが、確かにあり得る」未来を1つ描くこと。
    - 経済合理性と社会的必要性が高い選択肢（安定重視）
    - 本人の価値観を重視した選択（価値観優先）
    - 外部環境の変化に適応した新しい役割（適応・転換）

    **【禁止事項】**
    - 単なる理想的な成功物語
    - 単なるネガティブな破滅物語
    - 根拠のない楽観や悲観

    必ず以下の構造を持つこと。

    ① 新たな視点（冒頭で明示）
    例：
    - 「自由を重視してきたあなたが、構造の中で新たな自由を見出す未来」
    - 「挑戦を大切にしてきたあなたにとって、安定の中に潜む別の挑戦」
    - 「今は視野に入れていない選択肢が、環境変化により現実的になる未来」

    ② 外部環境の変化（Future Drivers）
    - Future Drivers は 必ず制約として使うこと
    - 以下のような使い方をすること：
    - この変化が起きたため、〇〇という選択肢は成立しなくなる
    - この政策・技術・社会変化によって、新しい役割が生まれる
    - 逆に、これまで成立していた職業・働き方が消滅する

    ※1シナリオにつき最大2つまで

    ⸻

    【STEP 2：「ありえない」が「現実」になる手順】

    各シナリオでは、必ず以下の3段階を描写すること：

    ① 環境変化による選択肢の変容（200文字）
    - 具体的に：従来の選択肢A、B、Cがどう変化したか
    - 例：新卒採用減少 → 新しい雇用形態の出現 → 職域の再定義
    - 「消滅」ではなく「変化」として描く

    ② 価値観の再解釈と適応（150文字）
    - 最初の戸惑いや違和感を明示
    - 何を手放し、何を再発見するのか
    - 例：「挑戦の意味を問い直す」「自由の形が変わる」

    ③ 新たな可能性と課題（100文字）
    - この選択によって得られる新しい視点
    - 同時に直面する現実的な課題
    - トレードオフを明確にする

    ⸻

    【STEP 3：シナリオのトーン】

    以下を厳守する。

    **必須要件：**
    - Future Drivers は、「選択肢の変容や新たな可能性を生む条件」として使用すること
    - 「なぜこの道が現実的になるのか」を、制度・市場・年齢・収入・資格などの構造的理由で説明すること
    - 価値観の再解釈や優先順位の変化が1箇所はっきり描写されていること
    - トレードオフ（何を得て、何を手放すのか）を明確にすること
    - 読後に「考えていなかったが、確かにあり得る」と感じさせることを最優先すること

    **禁止事項：**
    - 単なる理想的な成功物語
    - 単なるネガティブな破滅物語
    - 根拠のない楽観や悲観

    **読後にユーザーが感じるべき感情（最重要）：**
    - 「こんな未来は想像していなかった」という驚き
    - 「この論理なら確かに起こり得る」という納得
    - 視野の広がり
    - 新たな気づき
    - 「これも選択肢なのか」という発見
    - 適切な危機感と判断余地の両方
    
    ※驚きと納得が同時にあることが最も重要

    ⸻

    【STEP 4：Next Step（重要）】

    Next Step は **「この職業が本当に現実か確かめる行動」** にすること。

    必ず以下を満たす。
    - 1週間以内
    - 30分以内
    - Yes / No で完了判定できる
    - 訪問や取材ではなく、ネット検索・資料確認レベル

    例：
    - 「〇〇会社の採用ページで△△職種があるか確認」
    - 「国交省のガイドラインを30分読む」
    - 「Indeed で□□の求人数を調べる」

    ⸻

    【出力形式】

    以下の形式で、前置き説明やコードブロック（\`\`\`）なしで出力してください：

    【USER_INTERPRETATION】
    価値観：
    - 価値観1
    - 価値観2
    - 価値観3
    排除している選択：（1文）
    恐れている未来：（1文）
    暗黙の思い込み：（1文）

    【SCENARIO_1】
    新たな視点：（1文）
    この人生を成立させた外部要因：
    - Driver 1：（具体的な変化・法制度・技術変化として）
    - Driver 2：（具体的な変化・法制度・技術変化として）
    役割：（1文）

    本文：（500〜600文字）

    【重要：出力形式の厳守】
    - ①②③などの番号付き構造、見出し、箇条書き、Markdown記法（**, ##, ---, 等）を一切使わないこと
    - 「本文：」の直後から、改行を含む自然な地の文として1つの連続したテキストを書くこと
    - 段落タイトルや見出し風の行を作らず、普通の文章として記述すること
    - 必ず300文字以上の連続した文章にすること
    - 強調記号や装飾は使用しないこと

    内容の構造（番号や見出しを付けず地の文で描く）：
    - 環境変化により従来の選択肢がどう変容したか（200文字程度）
    - 価値観の再解釈と適応、戸惑いや発見（150文字程度）
    - 新たな可能性と課題、トレードオフ（100文字程度）

    なぜこの道が現実的か：（150〜200文字。因果の連鎖を明示）
    NextStep：（この選択肢の実在性を確認する行動・30分以内・ネット検索レベル）
    `;

    console.log(`[${requestId}] Step 3: Calling Claude API with retry logic`);

    let response: Response;
    const maxRetries = 2;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const waitTime = attempt === 1 ? 500 : 1500;
          console.log(`[${requestId}] Retry attempt ${attempt}, waiting ${waitTime}ms`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }

        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5',
            max_tokens: 8000,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (response.ok || (response.status >= 400 && response.status < 500)) {
          break;
        }

        console.log(`[${requestId}] Attempt ${attempt + 1} failed with status ${response.status}`);

        if (attempt === maxRetries) {
          const errorText = await response.text();
          console.log(`[${requestId}] Claude API error after all retries:`, errorText);
          return NextResponse.json(
            {
              requestId,
              ok: false,
              stage: 'claude_api_retry',
              error: `Claude API error after ${maxRetries + 1} attempts: ${errorText}`,
              statusCode: response.status,
            },
            { status: 500 }
          );
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.log(`[${requestId}] Attempt ${attempt + 1} failed with error:`, message);

        if (attempt === maxRetries) {
          return NextResponse.json(
            {
              requestId,
              ok: false,
              stage: 'network_error',
              error: `Network error after ${maxRetries + 1} attempts: ${message}`,
            },
            { status: 500 }
          );
        }
      }
    }

    console.log(`[${requestId}] Step 4: Checking Claude API response status:`, response!.status);
    if (!response!.ok) {
      const errorText = await response!.text();
      console.log(`[${requestId}] Claude API error:`, errorText);
      const is401 = response!.status === 401;
      return NextResponse.json(
        {
          requestId,
          ok: false,
          stage: 'claude_api',
          error: is401
            ? 'APIキーが無効です。.env.local の ANTHROPIC_API_KEY に余分な空白・改行がないか確認し、Anthropicコンソールでキーが有効か確認してください。'
            : `Claude API error: ${errorText}`,
          statusCode: response!.status,
        },
        { status: is401 ? 200 : 500 }
      );
    }

    console.log(`[${requestId}] Step 5: Parsing Claude API response`);
    const data = (await response!.json()) as { content: Array<{ text: string }> };
    console.log(`[${requestId}] Claude response received, content length:`, data.content?.[0]?.text?.length);
    let content = data.content[0].text;

    console.log(`[${requestId}] Step 6: Parsing plain text response with robust regex`);

    let scenarioBlocks: string[] = [];
    let parseAttempts = 0;
    const maxParseAttempts = 2;

    while (parseAttempts < maxParseAttempts && scenarioBlocks.length < 1) {
      parseAttempts++;

      if (parseAttempts > 1) {
        console.log(`[${requestId}] Parse attempt ${parseAttempts}: retrying scenario generation`);

        const retryResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5',
            max_tokens: 8000,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (!retryResponse.ok) {
          console.log(`[${requestId}] Retry generation failed with status:`, retryResponse.status);
          break;
        }

        const retryData = (await retryResponse.json()) as { content: Array<{ text: string }> };
        content = retryData.content[0].text;
      }

      const parts = content.split(/【SCENARIO[ _]?([0-9０-９]+)】/);
      scenarioBlocks = [];

      for (let i = 1; i < parts.length; i += 2) {
        if (parts[i + 1]) {
          scenarioBlocks.push(parts[i + 1].trim());
        }
      }

      console.log(`[${requestId}] Parse attempt ${parseAttempts}: parsed ${scenarioBlocks.length} scenarios`);
    }

    if (scenarioBlocks.length < 1) {
      console.log(`[${requestId}] Warning: No scenario block parsed`);
      return NextResponse.json(
        {
          requestId,
          ok: false,
          stage: 'parsing',
          error: `パース失敗：シナリオを検出できませんでした`,
          errorType: 'PARSE_ERROR',
          parsedCount: scenarioBlocks.length,
          rawContent: content,
          hint: 'Claudeの出力形式を確認してください',
        },
        { status: 200 }
      );
    }

    type ScenarioRecord = {
      scenario_type: string;
      scenario_title: string;
      role_definition: string;
      scenario_description: string;
      reasoning: string;
      evidence: string[];
      next_step_recommendation: string;
      key_opportunities: string[];
      required_skills: string[];
      action_plan: string[];
      probability_level: string;
      positivity_score: number;
      change_magnitude: number;
    };

    const scenarios: ScenarioRecord[] = scenarioBlocks.map((block, index) => {
      const lines = block.split('\n');
      const scenario: ScenarioRecord = {
        scenario_type: 'realistic',
        scenario_title: '',
        role_definition: '',
        scenario_description: '',
        reasoning: '',
        evidence: [],
        next_step_recommendation: '',
        key_opportunities: [],
        required_skills: [],
        action_plan: [],
        probability_level: 'medium',
        positivity_score: 0,
        change_magnitude: 50,
      };

      let currentField = '';
      let currentText = '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const cleanTrimmed = trimmed
          .replace(/^[#\s]+/, '')
          .replace(/^\*\*/, '')
          .replace(/\*\*[:：]?$/, '')
          .replace(/[:：]\s*\*\*$/, '')
          .trim();

        if (/^新たな視点\s*[:：]/.test(cleanTrimmed)) {
          const value = cleanTrimmed.replace(/^新たな視点\s*[:：]/, '').trim();
          if (value) {
            scenario.scenario_title = value;
            currentField = '';
          } else {
            currentField = 'title';
            currentText = '';
          }
        } else if (/^この人生を成立させた外部要因\s*[:：]/.test(cleanTrimmed)) {
          if (currentField === 'title' && currentText) {
            scenario.scenario_title = currentText.trim();
          }
          currentField = 'evidence';
          currentText = '';
        } else if (/^役割\s*[:：]/.test(cleanTrimmed)) {
          if (currentField === 'title' && currentText) {
            scenario.scenario_title = currentText.trim();
          } else if (currentField === 'evidence' && currentText) {
            scenario.evidence.push(currentText.trim());
          }
          const value = cleanTrimmed.replace(/^役割\s*[:：]/, '').trim();
          if (value) {
            scenario.role_definition = value;
            currentField = '';
          } else {
            currentField = 'role';
            currentText = '';
          }
        } else if (/^本文\s*[:：]/.test(cleanTrimmed)) {
          if (currentField === 'role' && currentText) {
            scenario.role_definition = currentText.trim();
          }
          const value = cleanTrimmed.replace(/^本文\s*[:：]/, '').trim();
          currentField = 'description';
          currentText = value;
        } else if (/^なぜこの道が現実的か\s*[:：]/.test(cleanTrimmed)) {
          if (currentField === 'description' && currentText) {
            scenario.scenario_description = currentText.trim();
          }
          const value = cleanTrimmed.replace(/^なぜこの道が現実的か\s*[:：]/, '').trim();
          currentField = 'reasoning';
          currentText = value;
        } else if (/^Next\s*Step\s*[:：]/i.test(cleanTrimmed) || /^NextStep\s*[:：]/i.test(cleanTrimmed)) {
          if (currentField === 'description' && currentText) {
            scenario.scenario_description = currentText.trim();
          } else if (currentField === 'reasoning' && currentText) {
            scenario.reasoning = currentText.trim();
          }
          const value = cleanTrimmed
            .replace(/^Next\s*Step\s*[:：]/i, '')
            .replace(/^NextStep\s*[:：]/i, '')
            .trim();
          if (value) {
            scenario.next_step_recommendation = value;
          } else {
            currentField = 'nextstep';
            currentText = '';
          }
        } else if (/^[•\-]\s+/.test(trimmed) && currentField === 'evidence') {
          scenario.evidence.push(trimmed.replace(/^[•\-]\s+/, '').trim());
        } else if (currentField === 'title' || currentField === 'role' || currentField === 'nextstep') {
          currentText += (currentText ? ' ' : '') + trimmed;
        } else if (
          currentField &&
          !/^[-—⸻=]+$/.test(trimmed) &&
          !/^[①②③]/.test(trimmed) &&
          !/^#{1,3}\s*【/.test(trimmed)
        ) {
          currentText += (currentText ? ' ' : '') + trimmed;
        }
      }

      if (currentField === 'title' && currentText) scenario.scenario_title = currentText.trim();
      if (currentField === 'role' && currentText) scenario.role_definition = currentText.trim();
      if (currentField === 'description' && currentText) scenario.scenario_description = currentText.trim();
      if (currentField === 'reasoning' && currentText) scenario.reasoning = currentText.trim();
      if (currentField === 'nextstep' && currentText) scenario.next_step_recommendation = currentText.trim();

      if (scenario.scenario_type === 'realistic') scenario.positivity_score = 35;
      if (scenario.scenario_type === 'growth') {
        scenario.positivity_score = 60;
        scenario.change_magnitude = 80;
      }
      if (scenario.scenario_type === 'risk') {
        scenario.positivity_score = -10;
        scenario.change_magnitude = 70;
      }

      return scenario;
    });

    console.log(`[${requestId}] Parsed scenario field lengths:`);
    scenarios.slice(0, 1).forEach((s, i) => {
      console.log(
        `  Scenario ${i + 1}: title=${s.scenario_title?.length || 0}, desc=${s.scenario_description?.length || 0}, reasoning=${s.reasoning?.length || 0}, next=${s.next_step_recommendation?.length || 0}`
      );
    });

    const essentialOk = scenarios.slice(0, 1).every(
      (s) =>
        s.scenario_title &&
        s.scenario_title.length > 0 &&
        s.scenario_description &&
        s.scenario_description.length > 50
    );

    if (!essentialOk) {
      const emptyFields = scenarios.slice(0, 1).map((s, i) => {
        const missing: string[] = [];
        if (!s.scenario_title || s.scenario_title.length === 0) missing.push('title');
        if (!s.scenario_description || s.scenario_description.length < 50) missing.push('description');
        return `Scenario ${i + 1}: ${missing.join(', ') || 'OK'}`;
      });

      return NextResponse.json(
        {
          requestId,
          ok: false,
          stage: 'parsing',
          errorType: 'PARSE_EMPTY_FIELDS',
          error: 'シナリオの主要項目が空でした',
          emptyFields,
          rawContent: content,
        },
        { status: 200 }
      );
    }

    const result = {
      requestId,
      ok: true,
      scenarios: scenarios.slice(0, 1),
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error(`[${requestId}] Function error:`, err);
    return NextResponse.json(
      {
        requestId,
        ok: false,
        stage: 'unexpected_error',
        error: message,
        stack,
        details: String(err),
      },
      { status: 500 }
    );
  }
}
