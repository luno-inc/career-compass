import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, RefreshCw, Home, Target } from 'lucide-react';
import { createPageUrl } from '@/utils';
import ScenarioResultCard from '../components/scenarios/ScenarioResultCard';

export default function Scenarios() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmNavigate, setShowConfirmNavigate] = useState(false);

  useEffect(() => {
    // セッションストレージからシナリオを読み込み
    const savedData = sessionStorage.getItem('careerCompassScenarios');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // IDを付与
      const scenariosWithId = parsed.scenarios.map((s, index) => ({
        ...s,
        id: `scenario-${index}`
      }));
      setScenarios(scenariosWithId);
    } else {
      router.push(createPageUrl('Profile'));
    }
    setLoading(false);
  }, [router]);

  const handleStartOver = () => {
    sessionStorage.removeItem('careerCompassProfile');
    sessionStorage.removeItem('careerCompassScenarios');
    router.push(createPageUrl('Home'));
  };

  const handleConfirmNavigateToEventSelection = () => {
    setShowConfirmNavigate(false);
    router.push('/event-selection');
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push('/event-selection')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              イベント選択に戻る
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              あなたのキャリアシナリオ
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              ※ このデータはブラウザを閉じると削除されます。必要に応じてスクリーンショットを保存してください。
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowConfirmNavigate(true)}
              variant="outline"
              className="border-indigo-200 hover:bg-indigo-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              別のシナリオを生成
            </Button>
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="border-slate-200 hover:bg-slate-50"
            >
              <Home className="w-4 h-4 mr-2" />
              最初からやり直す
            </Button>
          </div>
        </div>

        {scenarios.length === 0 ? (
          <Card className="shadow-lg text-center p-12">
            <CardContent>
              <div className="text-slate-400 mb-4">
                <Target className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">シナリオがありません</h3>
              <p className="text-slate-600 mb-6">
                外生イベントを選択して、未来のキャリアシナリオを生成しましょう
              </p>
              <Button
                onClick={() => router.push(createPageUrl('Profile'))}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                診断を開始する
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-20">
            {scenarios.map((scenario, index) => (
              <ScenarioResultCard key={scenario.id} scenario={scenario} index={index} />
            ))}
          </div>
        )}

        <AlertDialog open={showConfirmNavigate} onOpenChange={setShowConfirmNavigate}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当に遷移しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                遷移すると、現在のシナリオのデータは削除されます。必要に応じてスクリーンショットを保存してからお進みください。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmNavigateToEventSelection}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                はい、遷移する
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}