import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function PresentationMaterial() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // スライド1: タイトル
    {
      title: 'Career Compass',
      subtitle: '未来適応的キャリア形成支援システム',
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Career Compass
            </h1>
            <p className="text-2xl text-slate-600 mb-2">
              生成AIが描く、あなたの未来キャリア
            </p>
            <p className="text-xl text-slate-500">
              未来適応的キャリア形成支援システム
            </p>
          </div>
          <div className="text-center text-slate-600 mt-12">
            <p className="text-lg">2025年度 卒業研究発表</p>
          </div>
        </div>
      )
    },

    // スライド2: 研究背景
    {
      title: '研究背景',
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-6">
            <h3 className="text-xl font-bold text-red-800 mb-3">現代のキャリア形成における課題</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>VUCA時代（変動性・不確実性・複雑性・曖昧性）における不安</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>従来のキャリアパスの崩壊と「正解」の不在</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>長期的視点の欠如と目先の意思決定への偏り</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-3">従来のキャリア支援の限界</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>現在の適性診断に偏重（未来への接続が弱い）</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>単一の「最適解」を提示する志向性</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>外生的な環境変化を考慮していない</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // スライド3: 研究目的
    {
      title: '研究目的',
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4 text-center">
              未来シナリオ生成による心理指標の向上
            </h3>
            <p className="text-lg text-slate-700 text-center leading-relaxed">
              生成AIを用いて個人化された未来キャリアシナリオを提示することで、<br/>
              以下の5つの心理指標を向上させる
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-5 border-2 border-slate-200">
              <h4 className="font-bold text-indigo-600 mb-2">1. 未来自己連続性</h4>
              <p className="text-sm text-slate-600">将来の自分を現在の延長として認識する能力</p>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-slate-200">
              <h4 className="font-bold text-indigo-600 mb-2">2. キャリアアダプタビリティ</h4>
              <p className="text-sm text-slate-600">変化に柔軟に対応する力</p>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-slate-200">
              <h4 className="font-bold text-indigo-600 mb-2">3. 未来時間展望</h4>
              <p className="text-sm text-slate-600">長期的視点で現在の行動を考える傾向</p>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-slate-200">
              <h4 className="font-bold text-indigo-600 mb-2">4. 不確実性耐性</h4>
              <p className="text-sm text-slate-600">不透明な状況でも思考・行動できる力</p>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-slate-200 col-span-2">
              <h4 className="font-bold text-indigo-600 mb-2">5. 行動意図</h4>
              <p className="text-sm text-slate-600">具体的な次の一歩を踏み出す意欲</p>
            </div>
          </div>
        </div>
      )
    },

    // スライド4: システム概要
    {
      title: 'システム概要',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6 border border-indigo-300">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 text-center">
              3ステップのワークフロー
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div className="flex-1 bg-white rounded-lg p-5 border-2 border-indigo-200">
                <h4 className="text-lg font-bold text-slate-900 mb-2">プロフィール入力（22項目）</h4>
                <p className="text-slate-600">価値観、強み、過去の経験、将来への不安などを詳細に入力</p>
                <p className="text-sm text-slate-500 mt-2">※ データはブラウザに一時保存（サーバー保存なし）</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div className="flex-1 bg-white rounded-lg p-5 border-2 border-purple-200">
                <h4 className="text-lg font-bold text-slate-900 mb-2">外生イベント選択</h4>
                <p className="text-slate-600">AI・気候変動・地政学など、未来に影響を与える3つのイベントをランダム抽出</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-pink-600 text-white flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div className="flex-1 bg-white rounded-lg p-5 border-2 border-pink-200">
                <h4 className="text-lg font-bold text-slate-900 mb-2">シナリオ生成・提示</h4>
                <p className="text-slate-600">3タイプのシナリオ（現実的・挑戦的・リスク対応型）を生成し、具体的な行動提案を提示</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // スライド5: 質問設計の理論的基盤
    {
      title: '質問設計の理論的基盤（22項目）',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">基本情報（4項目）</h4>
              <p className="text-sm text-slate-600">年齢・立場・専攻・志望業界</p>
              <p className="text-xs text-slate-500 mt-1">→ 発達段階・制約条件の把握</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-900 mb-2">価値観・自己理解（4項目）</h4>
              <p className="text-sm text-slate-600">価値観、成功の定義、打ち込んだこと、影響を受けた人物</p>
              <p className="text-xs text-slate-500 mt-1">→ 内発的動機の測定</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">強み・課題認識（4項目）</h4>
              <p className="text-sm text-slate-600">得意なこと、苦手なこと、つらかった経験、誇らしい実績</p>
              <p className="text-xs text-slate-500 mt-1">→ 自己効力感・レジリエンスの測定</p>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-bold text-amber-900 mb-2">過去→現在の連続性（2項目）</h4>
              <p className="text-sm text-slate-600">過去の夢、価値観の変化</p>
              <p className="text-xs text-slate-500 mt-1">→ <strong>未来自己連続性向上の最重要項目</strong></p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-bold text-red-900 mb-2">現在の状態（5項目）</h4>
              <p className="text-sm text-slate-600">手放したくないもの、不安、家族・働き方・勤務地</p>
              <p className="text-xs text-slate-500 mt-1">→ 実行可能性を担保する制約の把握</p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h4 className="font-bold text-indigo-900 mb-2">未来展望（3項目）</h4>
              <p className="text-sm text-slate-600">働く意味、挑戦したい領域、不確実性への態度</p>
              <p className="text-xs text-slate-500 mt-1">→ 未来時間展望・行動意図の測定</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg p-4 border-2 border-slate-300">
            <h4 className="font-bold text-slate-900 mb-2 text-center">統合的理論的基盤</h4>
            <div className="grid grid-cols-4 gap-2 text-xs text-slate-700">
              <div className="text-center">ナラティブ・アプローチ</div>
              <div className="text-center">自己決定理論</div>
              <div className="text-center">キャリア構築理論</div>
              <div className="text-center">社会認知的キャリア理論</div>
            </div>
          </div>
        </div>
      )
    },

    // スライド6: シナリオ生成プロンプトの設計
    {
      title: 'シナリオ生成プロンプトの設計',
      content: (
        <div className="space-y-5">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
            <h3 className="font-bold text-amber-900 mb-2">設計方針</h3>
            <p className="text-slate-700">抽象的・一般論的なシナリオを排除し、<strong>「このユーザー固有の」</strong>シナリオを生成</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
              <h4 className="font-bold text-indigo-900 mb-2">STEP 0: 入力解釈（必須）</h4>
              <p className="text-sm text-slate-600">興味・強み・価値観・不安を事前に抽出</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">STEP 1: 役割定義（必須）</h4>
              <p className="text-sm text-slate-600">「このシナリオでのあなたの役割」を1文で明示</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
              <h4 className="font-bold text-green-900 mb-2">STEP 2: 構造化（9項目）</h4>
              <p className="text-sm text-slate-600">役割→背景→実際の行動→連続性→根拠→機会→リスク→経済面→人間関係</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">STEP 3: Next Step厳格化</h4>
              <p className="text-sm text-slate-600">1週間以内・30〜60分・成否判断可能・制約考慮</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-red-200">
              <h4 className="font-bold text-red-900 mb-2">STEP 4: Evidence必須化</h4>
              <p className="text-sm text-slate-600">ユーザー入力を『』で引用し、1対1対応を明示（最低5つ）</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">STEP 5: 品質チェック</h4>
              <p className="text-sm text-slate-600">6項目の再生成基準を設定</p>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-300">
            <h4 className="font-bold text-red-900 mb-2">禁止事項</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• 抽象表現（「成長する」「スキルアップ」など）の使用禁止</li>
              <li>• テンプレート職種（IT・コンサル・金融）の理由なき使用禁止</li>
              <li>• 外生イベントを単なる背景説明として使用禁止（制約・分岐条件として使用）</li>
            </ul>
          </div>
        </div>
      )
    },

    // スライド7: 生成される3タイプのシナリオ
    {
      title: '生成される3タイプのシナリオ',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🛡️</div>
              <h3 className="text-xl font-bold text-blue-900">シナリオ1: 現実的・堅実型</h3>
            </div>
            <p className="text-slate-700 mb-2">現在の延長線上で着実に成長した場合</p>
            <div className="bg-white rounded p-3 text-sm text-slate-600">
              <strong>positivity_score:</strong> +20〜+50<br/>
              <strong>特徴:</strong> リスク最小化、安定志向、現実的な成長
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-5 border-2 border-purple-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🚀</div>
              <h3 className="text-xl font-bold text-purple-900">シナリオ2: 成長志向・挑戦型</h3>
            </div>
            <p className="text-slate-700 mb-2">大胆な挑戦をし、新しい領域に踏み出した場合</p>
            <div className="bg-white rounded p-3 text-sm text-slate-600">
              <strong>positivity_score:</strong> +40〜+80<br/>
              <strong>特徴:</strong> 高リスク・高リターン、大きな成長、新領域への挑戦
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-5 border-2 border-orange-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">⚠️</div>
              <h3 className="text-xl font-bold text-orange-900">シナリオ3: リスク対応型</h3>
            </div>
            <p className="text-slate-700 mb-2">外生イベントの悪影響を強く受け、困難に直面した場合</p>
            <div className="bg-white rounded p-3 text-sm text-slate-600">
              <strong>positivity_score:</strong> -40〜+20<br/>
              <strong>特徴:</strong> 準備不足の結末、厳しい現実、不確実性への対処が必要
            </div>
          </div>
        </div>
      )
    },

    // スライド8: システムの特徴
    {
      title: 'システムの特徴と新規性',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-5 border-2 border-green-300">
              <h3 className="text-lg font-bold text-green-900 mb-3">✓ 個別化されたシナリオ</h3>
              <p className="text-slate-700">22項目の詳細な入力から、テンプレートではない「あなた固有の」未来を生成</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-300">
              <h3 className="text-lg font-bold text-blue-900 mb-3">✓ 複数未来の提示</h3>
              <p className="text-slate-700">単一の「正解」ではなく、3つの異なる可能性を提示し、柔軟な思考を促進</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-5 border-2 border-purple-300">
              <h3 className="text-lg font-bold text-purple-900 mb-3">✓ 外生イベントの統合</h3>
              <p className="text-slate-700">個人の努力だけでなく、社会変化の影響を明示的に考慮</p>
            </div>

            <div className="bg-amber-50 rounded-lg p-5 border-2 border-amber-300">
              <h3 className="text-lg font-bold text-amber-900 mb-3">✓ 過去→現在→未来の連続性</h3>
              <p className="text-slate-700">未来の自分を「他人」ではなく「自分の延長」として認識できる設計</p>
            </div>

            <div className="bg-red-50 rounded-lg p-5 border-2 border-red-300">
              <h3 className="text-lg font-bold text-red-900 mb-3">✓ 具体的な行動提案</h3>
              <p className="text-slate-700">1週間以内に実行可能な「次の一歩」を明示し、行動意図を高める</p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-5 border-2 border-indigo-300">
              <h3 className="text-lg font-bold text-indigo-900 mb-3">✓ Evidenceの明示</h3>
              <p className="text-slate-700">「なぜこのシナリオなのか」をユーザー入力との対応で明確化</p>
            </div>
          </div>
        </div>
      )
    },

    // スライド9: 期待される効果
    {
      title: '期待される効果',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-300">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 text-center">
              5つの心理指標の向上
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded bg-indigo-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-1">未来自己連続性 ↑</h4>
                <p className="text-sm text-slate-600">過去→現在→未来のナラティブ構築により、将来の自分を身近に感じられる</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded bg-purple-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-1">キャリアアダプタビリティ ↑</h4>
                <p className="text-sm text-slate-600">複数シナリオの提示により、変化への柔軟な対応力が向上</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded bg-pink-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-1">未来時間展望 ↑</h4>
                <p className="text-sm text-slate-600">長期的な視点で現在の行動を考える習慣が形成される</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded bg-orange-600 text-white flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-1">不確実性耐性 ↑</h4>
                <p className="text-sm text-slate-600">リスクシナリオの提示により、不安が具体化され、対処可能なものとして認識される</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded bg-green-600 text-white flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-1">行動意図 ↑</h4>
                <p className="text-sm text-slate-600">具体的で実行可能な「次の一歩」により、即座の行動が促進される</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // スライド10: 今後の課題
    {
      title: '今後の課題と展望',
      content: (
        <div className="space-y-6">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-5">
            <h3 className="text-xl font-bold text-amber-900 mb-3">研究課題</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span><strong>効果検証：</strong>5つの心理指標が実際に向上するかの定量的評価（前後比較実験）</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span><strong>長期追跡：</strong>システム利用後の行動変容・キャリア選択への影響</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span><strong>プロンプト最適化：</strong>より個別化・具体化されたシナリオ生成のための改善</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5">
            <h3 className="text-xl font-bold text-blue-900 mb-3">システム改善の方向性</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>シナリオの対話的な深掘り機能（チャットボット統合）</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>経時的なプロフィール更新と再シナリオ生成</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>他ユーザーとの匿名シナリオ共有・コミュニティ形成</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-5">
            <h3 className="text-xl font-bold text-green-900 mb-3">社会実装に向けて</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>大学キャリアセンター・企業人事部門での試験導入</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>プライバシー保護とデータ活用のバランス</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // スライド11: まとめ
    {
      title: 'まとめ',
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-8 border-2 border-indigo-300">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4 text-center">
              Career Compass の貢献
            </h3>
            <ul className="space-y-3 text-lg text-slate-700">
              <li className="flex items-start">
                <span className="mr-2 text-indigo-600">✓</span>
                <span>生成AIを用いた個別化キャリアシナリオ生成システムの構築</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-indigo-600">✓</span>
                <span>未来適応的キャリア形成に必要な5つの心理指標向上への寄与</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-indigo-600">✓</span>
                <span>過去→現在→未来の連続性を重視した質問設計（22項目）</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-indigo-600">✓</span>
                <span>抽象的でない、ユーザー固有の具体的なシナリオ提示</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-xl text-slate-600">
              VUCA時代において、若者が不確実な未来に対して<br/>
              主体的にキャリアを構築するための新たなツール
            </p>
          </div>
        </div>
      )
    },

    // スライド12: 参考文献
    {
      title: '主要参考文献',
      content: (
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-700">
                Bandura, A. (1997). <em>Self-efficacy: The exercise of control</em>. Freeman.
              </p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-700">
                Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits. <em>Psychological Inquiry</em>, 11(4), 227-268.
              </p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-700">
                Hershfield, H. E., et al. (2011). Short horizons and tempting situations. <em>Personality and Social Psychology Bulletin</em>, 38(1), 57-70.
              </p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-700">
                McAdams, D. P. (2001). The psychology of life stories. <em>Review of General Psychology</em>, 5(2), 100-122.
              </p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-700">
                Savickas, M. L. (2013). Career construction theory and practice. In R. W. Lent & S. D. Brown (Eds.), <em>Career development and counseling</em> (2nd ed., pp. 147-183). Wiley.
              </p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-700">
                Savickas, M. L., & Porfeli, E. J. (2012). Career Adapt-Abilities Scale. <em>Journal of Vocational Behavior</em>, 80(3), 661-673.
              </p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-700">
                Zimbardo, P. G., & Boyd, J. N. (1999). Putting time in perspective. <em>American Psychologist</em>, 54(12), 1271-1288.
              </p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-700">
                Dweck, C. S. (2006). <em>Mindset: The new psychology of success</em>. Random House.
              </p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-700">
                Hall, D. T. (2002). <em>Careers in and out of organizations</em>. Sage.
              </p>
            </div>
            <div className="bg-slate-50 rounded p-3">
              <p className="text-xs text-slate-700">
                Lent, R. W., Brown, S. D., & Hackett, G. (1994). Toward a unifying social cognitive theory of career. <em>Journal of Vocational Behavior</em>, 45(1), 79-122.
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">※ その他多数の参考文献は配布資料を参照</p>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(createPageUrl('Home'))}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Button>
          <div className="text-white text-sm">
            スライド {currentSlide + 1} / {slides.length}
          </div>
        </div>

        {/* スライド本体 */}
        <Card className="shadow-2xl bg-white min-h-[600px]">
          <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-3xl text-slate-900">
              {slides[currentSlide].title}
            </CardTitle>
            {slides[currentSlide].subtitle && (
              <p className="text-lg text-slate-600 mt-2">
                {slides[currentSlide].subtitle}
              </p>
            )}
          </CardHeader>
          <CardContent className="p-8 min-h-[500px]">
            {slides[currentSlide].content}
          </CardContent>
        </Card>

        {/* ナビゲーション */}
        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            variant="outline"
            size="lg"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            前のスライド
          </Button>

          {/* スライドインジケーター */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            variant="outline"
            size="lg"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            次のスライド
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* フルスクリーンヒント */}
        <p className="text-center text-white/60 text-sm mt-4">
          💡 ヒント: F11キーでフルスクリーン表示ができます
        </p>
      </div>
    </div>
  );
}