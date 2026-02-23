import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, TrendingUp, AlertTriangle, Lightbulb, Target, Sparkles, FileText, BookOpen } from 'lucide-react';

export default function ScenarioDetail({ scenario, index }) {
  const probabilityConfig = {
    high: { label: '高', color: 'bg-green-100 text-green-800 border-green-200' },
    medium: { label: '中', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    low: { label: '低', color: 'bg-red-100 text-red-800 border-red-200' }
  };

  const scenarioTypeConfig = {
    realistic: { label: '現実的・堅実型', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🛡️' },
    growth: { label: '成長志向・挑戦型', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🚀' },
    risk: { label: 'リスク対応型', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '⚠️' }
  };

  return (
    <Card className="shadow-xl border-indigo-100 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sm opacity-80">シナリオ {index + 1}</div>
              {scenario.scenario_type && scenarioTypeConfig[scenario.scenario_type] && (
                <Badge className={`${scenarioTypeConfig[scenario.scenario_type].color} border`}>
                  {scenarioTypeConfig[scenario.scenario_type].icon} {scenarioTypeConfig[scenario.scenario_type].label}
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{scenario.scenario_title}</h2>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{scenario.timeline}</span>
            </div>
          </div>
          <Badge className={`${probabilityConfig[scenario.probability_level]?.color || 'bg-gray-100'} border`}>
            実現可能性: {probabilityConfig[scenario.probability_level]?.label || scenario.probability_level}
          </Badge>
        </div>
      </div>

      {/* タブコンテンツ */}
      <CardContent className="p-0">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
            <TabsTrigger value="overview" className="gap-2">
              <BookOpen className="w-4 h-4" />
              概要
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2">
              <Target className="w-4 h-4" />
              機会とリスク
            </TabsTrigger>
            <TabsTrigger value="action" className="gap-2">
              <Sparkles className="w-4 h-4" />
              アクション
            </TabsTrigger>
            <TabsTrigger value="evidence" className="gap-2">
              <FileText className="w-4 h-4" />
              根拠
            </TabsTrigger>
          </TabsList>

          {/* 概要タブ */}
          <TabsContent value="overview" className="p-6 space-y-6">
            {scenario.role_definition && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border-2 border-indigo-200">
                <h3 className="text-sm font-semibold mb-2 text-indigo-600">
                  このシナリオでのあなたの役割
                </h3>
                <p className="text-base font-medium text-slate-800">
                  {scenario.role_definition}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-900">
                シナリオの詳細
              </h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {scenario.scenario_description}
                </p>
              </div>
            </div>

            {scenario.reasoning && (
              <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-200">
                <h4 className="font-semibold mb-3 text-indigo-900 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  なぜあなたにこのシナリオが当てはまるのか？
                </h4>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {scenario.reasoning}
                </p>
              </div>
            )}

            {/* 外生イベント */}
            {scenario.external_events && scenario.external_events.length > 0 ? (
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <h4 className="font-semibold mb-3 text-slate-800">考慮した外生イベント</h4>
                <ul className="space-y-2">
                  {scenario.external_events.map((event, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-700">
                      <span className="text-slate-400 mr-2 mt-1">•</span>
                      <span>{event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>根拠情報がありません</p>
              </div>
            )}
          </TabsContent>

          {/* 機会とリスクタブ */}
          <TabsContent value="analysis" className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 機会 */}
              <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                <h3 className="font-semibold mb-4 flex items-center text-green-900">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  主要な機会
                </h3>
                <ul className="space-y-3">
                  {scenario.key_opportunities?.map((opp, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-700">
                      <span className="text-green-600 mr-2 mt-0.5 font-bold">✓</span>
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* リスク */}
              <div className="bg-orange-50 rounded-lg p-5 border border-orange-200">
                <h3 className="font-semibold mb-4 flex items-center text-orange-900">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  主要なリスク
                </h3>
                <ul className="space-y-3">
                  {scenario.key_risks?.map((risk, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-700">
                      <span className="text-orange-600 mr-2 mt-0.5 font-bold">!</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 必要なスキル */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <h3 className="font-semibold mb-4 flex items-center text-blue-900">
                <Lightbulb className="w-5 h-5 mr-2" />
                このシナリオで必要になるスキル
              </h3>
              <div className="flex flex-wrap gap-2">
                {scenario.required_skills?.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* アクションタブ */}
          <TabsContent value="action" className="p-6 space-y-6">
            {/* 次の一歩 */}
            {scenario.next_step_recommendation && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-300">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-green-900">
                  <Sparkles className="w-5 h-5 mr-2" />
                  今すぐ始められる「次の一歩」
                </h3>
                <p className="text-slate-700 leading-relaxed text-base mb-4 whitespace-pre-wrap">
                  {scenario.next_step_recommendation}
                </p>
                <p className="text-sm text-slate-500 italic">
                  ※ 最終的な行動はあなた自身が決めてください。このシナリオはあなたの思考を深めるための参考情報です。
                </p>
              </div>
            )}

            {/* アクションプラン */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center text-indigo-900">
                <Target className="w-5 h-5 mr-2" />
                具体的なアクションプラン
              </h3>
              <div className="space-y-4">
                {scenario.action_plan?.map((action, i) => (
                  <div key={i} className="bg-white rounded-lg border-2 border-slate-200 p-5 hover:border-indigo-300 transition-colors">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 text-base">{action.step}</h4>
                          <Badge variant="outline" className="text-xs bg-slate-50">
                            {action.timeframe}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 根拠タブ */}
          <TabsContent value="evidence" className="p-6">
            {scenario.evidence && scenario.evidence.length > 0 ? (
              <div className="bg-amber-50 rounded-lg p-5 border-2 border-amber-200">
                <h3 className="font-semibold mb-4 flex items-center text-amber-900">
                  <FileText className="w-5 h-5 mr-2" />
                  あなたの回答を根拠にした分析
                </h3>
                <ul className="space-y-4">
                  {scenario.evidence.map((ev, i) => (
                    <li key={i} className="flex items-start bg-white rounded-lg p-4 border border-amber-200">
                      <span className="text-amber-600 font-bold mr-3 flex-shrink-0 text-lg">{i + 1}.</span>
                      <span className="text-slate-700 leading-relaxed">{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>根拠情報がありません</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}