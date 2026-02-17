import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Download } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function ResearchDocumentation() {
  const router = useRouter();

  const handleDownload = () => {
    const content = document.getElementById('research-content').innerText;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'キャリアシナリオ質問項目の理論的根拠.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(createPageUrl('Home'))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Button>
          <Button onClick={handleDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            テキストでダウンロード
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            質問項目の理論的根拠
          </h1>
          <p className="text-slate-600">
            Career Compass システムで使用する質問項目の設計根拠と測定概念
          </p>
        </div>

        <div id="research-content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">研究背景と測定概念</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mt-4 mb-2">1. 測定対象とする5つの心理指標</h3>
              <p>本システムは、以下の5つの心理指標を向上させることを目的としています：</p>
              <ul className="space-y-2">
                <li><strong>未来自己連続性（Future Self-Continuity）</strong>：将来の自分を現在の延長として認識する能力（Hershfield et al., 2011）</li>
                <li><strong>キャリアアダプタビリティ（Career Adaptability）</strong>：変化に柔軟に対応する力（Savickas & Porfeli, 2012）</li>
                <li><strong>未来時間展望（Future Time Perspective）</strong>：長期的視点で現在の行動を考える傾向（Zimbardo & Boyd, 1999）</li>
                <li><strong>不確実性耐性（Tolerance for Uncertainty）</strong>：不透明な状況でも思考・行動できる力（Dugas et al., 2004）</li>
                <li><strong>行動意図（Behavioral Intention）</strong>：具体的な次の一歩を踏み出す意欲（Ajzen, 1991）</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">セクション1：基本情報（4項目）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900">Q1. 年齢</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>発達段階の把握<br/>
                  <strong>理論的根拠：</strong>Super（1980）のライフ・スパン理論に基づき、年齢はキャリア発達段階を規定する重要な要因。年齢によって直面する課題や意思決定の文脈が異なる。<br/>
                  <strong>使用目的：</strong>シナリオ生成時の時間軸設定、現実的な制約条件の考慮
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q2. 現在の立場</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>キャリアステージ、社会的役割<br/>
                  <strong>理論的根拠：</strong>Levinson（1978）の成人発達理論。現在の社会的役割は、利用可能なリソース、時間的制約、意思決定の自由度を規定する。<br/>
                  <strong>使用目的：</strong>実行可能なアクション提案の現実性担保、制約条件の把握
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q3. 専攻分野・専門領域</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>知的資本、専門性の方向性<br/>
                  <strong>理論的根拠：</strong>Holland（1997）の職業選択理論。専攻は興味・能力・価値観の結晶化された表現であり、将来のキャリアパスに影響を与える。<br/>
                  <strong>使用目的：</strong>ユーザーの知識基盤の把握、業界・職種との適合性判断
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q4. 志望業界・関わりたい分野（複数選択可）</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>キャリア志向性、興味領域<br/>
                  <strong>理論的根拠：</strong>Schein（1978）のキャリア・アンカー理論。志望業界は個人の価値観・動機・能力の統合的表現。<br/>
                  <strong>使用目的：</strong>シナリオの業界文脈設定、外生イベントの影響度評価
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">セクション2：価値観・自己理解（4項目）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900">Q5. 大切にしている価値観（3つ）</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>コア・バリュー、意思決定の基準<br/>
                  <strong>理論的根拠：</strong>Schwartz（1992）の価値観理論。価値観は行動選択の指針となり、キャリア満足度に影響を与える（Judge & Bretz, 1992）。<br/>
                  <strong>心理指標への寄与：</strong>キャリアアダプタビリティ↑（価値観が明確な人ほど変化に対応しやすい）<br/>
                  <strong>使用目的：</strong>シナリオでの意思決定の一貫性担保、トレードオフの提示
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q6. 成功の定義</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>主観的キャリア成功の基準<br/>
                  <strong>理論的根拠：</strong>Hall（2002）のプロティアン・キャリア理論。成功の定義は個人が設定するものであり、外的基準（年収・地位）か内的基準（満足・成長）かで異なる（Arthur et al., 2005）。<br/>
                  <strong>心理指標への寄与：</strong>未来時間展望↑（長期的目標が明確化）<br/>
                  <strong>使用目的：</strong>シナリオの評価軸設定、満足度の判断基準
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q7. 一番打ち込んだこと</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>コミットメント、動機づけの源泉<br/>
                  <strong>理論的根拠：</strong>Deci & Ryan（2000）の自己決定理論。過去の没頭体験は内発的動機の指標であり、将来の行動予測因子となる。<br/>
                  <strong>心理指標への寄与：</strong>未来自己連続性↑（過去の経験と未来を接続）<br/>
                  <strong>使用目的：</strong>強み・興味の推定、シナリオでの活躍場面の設計
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q8. 最も影響を受けた人物</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>ロールモデル、社会的学習<br/>
                  <strong>理論的根拠：</strong>Bandura（1977）の社会的学習理論。ロールモデルは行動パターン・価値観の形成に影響を与える（Gibson, 2004）。<br/>
                  <strong>心理指標への寄与：</strong>キャリアアダプタビリティ↑（他者の経験から学ぶ力）<br/>
                  <strong>使用目的：</strong>価値観形成の背景理解、シナリオでの人間関係設計
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">セクション3：強み・課題認識（4項目）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900">Q9. 得意なこと</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>自己効力感、強みの認識<br/>
                  <strong>理論的根拠：</strong>Bandura（1997）の自己効力感理論。自己効力感はパフォーマンスと目標達成に正の影響を与える。<br/>
                  <strong>心理指標への寄与：</strong>行動意図↑（強みの認識が行動を促進）<br/>
                  <strong>使用目的：</strong>シナリオでの成功要因の設定、機会の提示
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q10. 苦手なこと・避けたい役割</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>弱み・制約の認識、回避動機<br/>
                  <strong>理論的根拠：</strong>Higgins（1997）の制御焦点理論。回避すべきものを認識することで、現実的なキャリア選択が可能になる。<br/>
                  <strong>心理指標への寄与：</strong>不確実性耐性↑（リスクの具体化）<br/>
                  <strong>使用目的：</strong>シナリオでの障壁・リスクの設定
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q11. 最もつらかった経験と学び</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>レジリエンス、意味づけ<br/>
                  <strong>理論的根拠：</strong>McAdams（2001）のナラティブ・アイデンティティ理論。困難からの学びは自己理解と成長の源泉となる（Tedeschi & Calhoun, 2004）。<br/>
                  <strong>心理指標への寄与：</strong>キャリアアダプタビリティ↑、不確実性耐性↑<br/>
                  <strong>使用目的：</strong>リスクシナリオでの対処能力の評価
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q12. 誇らしい実績</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>達成経験、自己肯定感<br/>
                  <strong>理論的根拠：</strong>成功体験は自己効力感の最も強力な源泉（Bandura, 1997）。過去の成功は将来の挑戦意欲に影響する。<br/>
                  <strong>心理指標への寄与：</strong>行動意図↑、未来自己連続性↑<br/>
                  <strong>使用目的：</strong>強みの裏付け、挑戦型シナリオの根拠
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">セクション4：過去から現在への連続性（2項目）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900">Q13. 過去（高校生の頃など）の夢や価値観</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>時間的アイデンティティ、過去の志向性<br/>
                  <strong>理論的根拠：</strong>Erikson（1968）のアイデンティティ理論。過去の自己との対話は現在の自己理解を深める。<br/>
                  <strong>心理指標への寄与：</strong>未来自己連続性↑↑（最重要項目）<br/>
                  <strong>使用目的：</strong>過去→現在→未来の連続性を明示、ナラティブ構築
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q14. 価値観の変化</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>発達的変化、適応的学習<br/>
                  <strong>理論的根拠：</strong>Baltes（1987）の生涯発達理論。価値観の変化は適応と成長の証であり、将来の変化への耐性を予測する。<br/>
                  <strong>心理指標への寄与：</strong>未来自己連続性↑、キャリアアダプタビリティ↑<br/>
                  <strong>使用目的：</strong>変化への柔軟性評価、成長の軌跡の可視化
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">セクション5：現在の状態（5項目）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900">Q15. 手放したくないもの</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>コア・ニーズ、制約条件<br/>
                  <strong>理論的根拠：</strong>Maslow（1954）の欲求階層理論。守りたいものは意思決定の境界条件を規定する。<br/>
                  <strong>心理指標への寄与：</strong>キャリアアダプタビリティ↑（価値観が明確）<br/>
                  <strong>使用目的：</strong>トレードオフの設定、生活満足度の評価軸
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q16. 将来への不安・懸念</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>予期不安、リスク認知<br/>
                  <strong>理論的根拠：</strong>不安は行動を阻害する要因だが、適切に扱えば準備行動を促進する（Lazarus & Folkman, 1984）。<br/>
                  <strong>心理指標への寄与：</strong>不確実性耐性↑（不安の可視化と対処）<br/>
                  <strong>使用目的：</strong>リスクシナリオの設計、対処策の提示
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q17. 家族状況</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>社会的文脈、ケア責任<br/>
                  <strong>理論的根拠：</strong>家族構成はキャリア選択の実質的制約となる（Greenhaus & Beutell, 1985）。<br/>
                  <strong>使用目的：</strong>移動可能性の評価、生活コストの算出
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q18. 現在の働き方</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>時間的リソース、経済的自立度<br/>
                  <strong>理論的根拠：</strong>現在の働き方は利用可能な時間・エネルギーを規定し、次のアクション実行可能性に影響する。<br/>
                  <strong>心理指標への寄与：</strong>行動意図↑（実行可能性の担保）<br/>
                  <strong>使用目的：</strong>Next Stepの実行可能性判断
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q19. 勤務地・居住地の希望</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>地理的制約、場所への愛着<br/>
                  <strong>理論的根拠：</strong>地理的移動はキャリア選択の重要な決定要因（Brett & Reilly, 1988）。<br/>
                  <strong>使用目的：</strong>シナリオの地理的文脈設定、移動コストの評価
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">セクション6：未来展望（3項目）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900">Q20. 働く意味・目的</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>ワーク・オリエンテーション、労働観<br/>
                  <strong>理論的根拠：</strong>Wrzesniewski et al.（1997）のJob/Career/Calling理論。働く意味は職業満足度とエンゲージメントに影響する。<br/>
                  <strong>心理指標への寄与：</strong>未来時間展望↑、キャリアアダプタビリティ↑<br/>
                  <strong>使用目的：</strong>シナリオの意味づけ、満足度の評価
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q21. 今後10年で挑戦したい領域</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>成長目標、探索志向<br/>
                  <strong>理論的根拠：</strong>Dweck（2006）の成長マインドセット理論。挑戦意欲は学習と発達の原動力となる。<br/>
                  <strong>心理指標への寄与：</strong>未来時間展望↑、行動意図↑<br/>
                  <strong>使用目的：</strong>挑戦型シナリオの設計、成長機会の提示
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">Q22. 不確実性への態度</h4>
                <p className="text-sm text-slate-700">
                  <strong>測定概念：</strong>リスク志向性、不確実性耐性<br/>
                  <strong>理論的根拠：</strong>不確実性への態度はキャリア選択のリスクテイキングを規定する（Lent et al., 1994）。<br/>
                  <strong>心理指標への寄与：</strong>不確実性耐性↑（自己認識の向上）<br/>
                  <strong>使用目的：</strong>シナリオタイプの重み付け、リスク提示の調整
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">質問設計の統合的理論的基盤</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mt-4 mb-2">1. ナラティブ・アプローチ（McAdams, 2001）</h3>
              <p>
                質問全体は、ユーザーの人生物語（life story）を構築するために設計されています。
                過去（Q13-14）→現在（Q1-12, Q15-19）→未来（Q20-22）という時間軸に沿って質問を配置することで、
                一貫したナラティブを生成し、未来自己連続性を高めます。
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">2. 自己決定理論（Deci & Ryan, 2000）</h3>
              <p>
                価値観（Q5-6）、興味（Q7）、強み（Q9）などの質問は、内発的動機づけの3つの基本的欲求
                （自律性・有能感・関係性）を測定し、持続的な行動変容を促進します。
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">3. キャリア構築理論（Savickas, 2013）</h3>
              <p>
                キャリアは個人が自ら構築するものであるという前提に立ち、ユーザーの主体的な意味づけ（Q6, Q11, Q14, Q20）を
                重視しています。これにより、キャリアアダプタビリティが向上します。
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">4. 社会認知的キャリア理論（Lent et al., 1994）</h3>
              <p>
                自己効力感（Q9, Q12）、結果期待（Q6, Q21）、目標（Q21）、障壁（Q10, Q16）といった要素を統合的に測定し、
                現実的なキャリア選択を支援します。
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">測定精度向上のための工夫</h3>
              <ul className="space-y-2">
                <li><strong>自由記述形式の採用：</strong>選択肢では捉えられない個別性を重視</li>
                <li><strong>文脈情報の収集：</strong>単なる事実ではなく、意味づけや感情を含む記述を促す質問文</li>
                <li><strong>過去-現在-未来の統合：</strong>時間的連続性を意識した質問配置</li>
                <li><strong>ポジティブ・ネガティブの両面測定：</strong>強みと弱み、成功と失敗を両方聴取</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">参考文献</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none text-sm">
              <ul className="space-y-1">
                <li>Ajzen, I. (1991). The theory of planned behavior. <em>Organizational Behavior and Human Decision Processes</em>, 50(2), 179-211.</li>
                <li>Arthur, M. B., Khapova, S. N., & Wilderom, C. P. (2005). Career success in a boundaryless career world. <em>Journal of Organizational Behavior</em>, 26(2), 177-202.</li>
                <li>Baltes, P. B. (1987). Theoretical propositions of life-span developmental psychology. <em>Developmental Psychology</em>, 23(5), 611-626.</li>
                <li>Bandura, A. (1977). Social learning theory. Prentice Hall.</li>
                <li>Bandura, A. (1997). Self-efficacy: The exercise of control. Freeman.</li>
                <li>Brett, J. M., & Reilly, A. H. (1988). On the road again: Predicting the job transfer decision. <em>Journal of Applied Psychology</em>, 73(4), 614-620.</li>
                <li>Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits. <em>Psychological Inquiry</em>, 11(4), 227-268.</li>
                <li>Dugas, M. J., Buhr, K., & Ladouceur, R. (2004). The role of intolerance of uncertainty in etiology and maintenance. <em>In R. G. Heimberg et al. (Eds.), Generalized anxiety disorder</em> (pp. 143-163). Guilford Press.</li>
                <li>Dweck, C. S. (2006). Mindset: The new psychology of success. Random House.</li>
                <li>Erikson, E. H. (1968). Identity: Youth and crisis. Norton.</li>
                <li>Gibson, D. E. (2004). Role models in career development. <em>Journal of Vocational Behavior</em>, 65(1), 134-156.</li>
                <li>Greenhaus, J. H., & Beutell, N. J. (1985). Sources of conflict between work and family roles. <em>Academy of Management Review</em>, 10(1), 76-88.</li>
                <li>Hall, D. T. (2002). Careers in and out of organizations. Sage.</li>
                <li>Hershfield, H. E., Cohen, T. R., & Thompson, L. (2011). Short horizons and tempting situations. <em>Personality and Social Psychology Bulletin</em>, 38(1), 57-70.</li>
                <li>Higgins, E. T. (1997). Beyond pleasure and pain. <em>American Psychologist</em>, 52(12), 1280-1300.</li>
                <li>Holland, J. L. (1997). Making vocational choices (3rd ed.). Psychological Assessment Resources.</li>
                <li>Judge, T. A., & Bretz, R. D. (1992). Effects of work values on job choice decisions. <em>Journal of Applied Psychology</em>, 77(3), 261-271.</li>
                <li>Lazarus, R. S., & Folkman, S. (1984). Stress, appraisal, and coping. Springer.</li>
                <li>Lent, R. W., Brown, S. D., & Hackett, G. (1994). Toward a unifying social cognitive theory of career and academic interest. <em>Journal of Vocational Behavior</em>, 45(1), 79-122.</li>
                <li>Levinson, D. J. (1978). The seasons of a man's life. Knopf.</li>
                <li>Maslow, A. H. (1954). Motivation and personality. Harper & Row.</li>
                <li>McAdams, D. P. (2001). The psychology of life stories. <em>Review of General Psychology</em>, 5(2), 100-122.</li>
                <li>Savickas, M. L. (2013). Career construction theory and practice. In R. W. Lent & S. D. Brown (Eds.), <em>Career development and counseling</em> (2nd ed., pp. 147-183). Wiley.</li>
                <li>Savickas, M. L., & Porfeli, E. J. (2012). Career Adapt-Abilities Scale. <em>Journal of Vocational Behavior</em>, 80(3), 661-673.</li>
                <li>Schein, E. H. (1978). Career dynamics: Matching individual and organizational needs. Addison-Wesley.</li>
                <li>Schwartz, S. H. (1992). Universals in the content and structure of values. <em>Advances in Experimental Social Psychology</em>, 25, 1-65.</li>
                <li>Super, D. E. (1980). A life-span, life-space approach to career development. <em>Journal of Vocational Behavior</em>, 16(3), 282-298.</li>
                <li>Tedeschi, R. G., & Calhoun, L. G. (2004). Posttraumatic growth. <em>Psychological Inquiry</em>, 15(1), 1-18.</li>
                <li>Wrzesniewski, A., McCauley, C., Rozin, P., & Schwartz, B. (1997). Jobs, careers, and callings. <em>Journal of Research in Personality</em>, 31(1), 21-33.</li>
                <li>Zimbardo, P. G., & Boyd, J. N. (1999). Putting time in perspective. <em>American Psychologist</em>, 54(12), 1271-1288.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}