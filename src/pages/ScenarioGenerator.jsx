'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, RotateCcw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ScenarioGenerator() {
  const [userSummary, setUserSummary] = useState('');
  const [futureDrivers, setFutureDrivers] = useState(['']);
  const [constraints, setConstraints] = useState('');
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState(null);
  const [error, setError] = useState(null);

  const addDriver = () => {
    setFutureDrivers([...futureDrivers, '']);
  };

  const updateDriver = (index, value) => {
    const newDrivers = [...futureDrivers];
    newDrivers[index] = value;
    setFutureDrivers(newDrivers);
  };

  const removeDriver = (index) => {
    setFutureDrivers(futureDrivers.filter((_, i) => i !== index));
  };

  const generateScenarios = async () => {
    if (!userSummary.trim()) {
      toast.error('ユーザー情報を入力してください');
      return;
    }

    const validDrivers = futureDrivers.filter(d => d.trim());
    if (validDrivers.length === 0) {
      toast.error('最低1つの外生イベントを入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileText: userSummary,
          eventTexts: validDrivers,
          documentsContext: constraints.trim() || undefined
        })
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'シナリオ生成に失敗しました');
      }

      if (result.scenarios) {
        setScenarios(result.scenarios);
        toast.success('シナリオを生成しました');
      } else {
        throw new Error('シナリオが生成されませんでした');
      }
    } catch (err) {
      setError(err?.message ?? String(err));
      toast.error('生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setError(null);
    generateScenarios();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          キャリアシナリオ生成
        </h1>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ユーザー情報</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={userSummary}
                  onChange={(e) => setUserSummary(e.target.value)}
                  placeholder="あなたの経歴、価値観、目標などを入力してください..."
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>外生イベント</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {futureDrivers.map((driver, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={driver}
                      onChange={(e) => updateDriver(index, e.target.value)}
                      placeholder={`イベント ${index + 1}`}
                      className="min-h-[80px]"
                    />
                    {futureDrivers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDriver(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button onClick={addDriver} variant="outline" className="w-full">
                  + イベントを追加
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>制約条件（任意）</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="時間的制約、地理的制約など..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Button
              onClick={generateScenarios}
              disabled={loading}
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  シナリオを生成
                </>
              )}
            </Button>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-800 mb-3">{error}</p>
                  <Button onClick={retry} variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    再試行
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {scenarios ? (
              scenarios.map((scenario, index) => (
                <Card key={index} className="border-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      {scenario.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 mb-1">役割</h4>
                      <p className="text-sm text-slate-600">{scenario.role}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 mb-1">背景</h4>
                      <p className="text-sm text-slate-600">{scenario.background}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 mb-1">実際の行動</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {scenario.actions.map((action, i) => (
                          <li key={i}>• {action}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 mb-1">機会</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        {scenario.opportunities.map((opp, i) => (
                          <li key={i}>✓ {opp}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 mb-1">リスク</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        {scenario.risks.map((risk, i) => (
                          <li key={i}>⚠ {risk}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm text-indigo-900 mb-1">次の一歩</h4>
                      <p className="text-sm text-indigo-800">{scenario.nextStep}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 mb-1">根拠</h4>
                      <ul className="text-xs text-slate-500 space-y-1">
                        {scenario.evidence.map((ev, i) => (
                          <li key={i}>→ {ev}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-slate-200">
                <CardContent className="pt-6 text-center text-slate-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>左側のフォームを入力して<br />「シナリオを生成」を押してください</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}