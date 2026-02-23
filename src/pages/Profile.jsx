'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles, Save, Users, Trash2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import QuestionSection from '../components/profile/QuestionSection';
import DocumentUpload from '../components/profile/DocumentUpload';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SAMPLE_DATA = {
  student: {
    age: '21〜25歳',
    work_or_student: '学生',
    education: '大学卒業',
    company: '',
    grade: '大学3年',
    major: '経済学・経営学',
    industry: ['IT・ソフトウェア', 'コンサルティング', '金融・保険'],
    core_values: '挑戦、成長、自由。新しいことに挑戦し続けることで成長し、自分らしく生きたい。',
    success_definition: '自分の能力を最大限に発揮して、社会に価値を提供しながら、経済的にも精神的にも豊かな生活を送ること。',
    most_dedicated: '大学のビジネスコンテストで企画立案から実行まで半年間チームをリードした経験。徹夜で議論を重ね、優勝できたときの達成感は忘れられない。',
    influential_people: '高校時代の恩師。「失敗を恐れるな、挑戦しないことが最大の失敗だ」という言葉が今でも心に残っている。',
    strengths: '人の話を聞いて本質を見抜くこと、論理的に物事を整理して説明すること、新しいアイデアを生み出すこと。',
    weaknesses: '細かい事務作業や単調な繰り返し作業。締め切りギリギリまで手をつけられないこともある。',
    difficult_experience: '受験に失敗して第一志望に入れなかったこと。でもそこから「結果より過程が大切」と学び、今は目の前のことに全力で取り組めるようになった。',
    proud_achievements: 'ビジネスコンテスト優勝、TOEICスコア850点達成、長期インターンで新規事業の立ち上げに関わったこと。',
    past_dreams: '中学生の頃は漠然と「起業家になりたい」と思っていた。高校では「世界を変えるような仕事がしたい」と考えていた。',
    value_evolution: '昔は「有名になりたい」「お金持ちになりたい」という気持ちが強かったが、今は「社会に価値を提供すること」「自分らしく生きること」を重視するようになった。',
    what_to_keep: '友人との関係、自由な時間、挑戦し続ける姿勢。これらは絶対に失いたくない。',
    future_concerns: '就職後に自分の能力が通用するか不安。また、AIの発展で自分の仕事がなくなるのではないかという懸念もある。',
    living_situation: '一人暮らし',
    work_situation: '学生（週3日以上アルバイト）',
    location_preference: '都市部に移りたい',
    work_purpose: '自分の能力を活かして社会に貢献し、成長し続けること。働くことで得た経験や知識を次の挑戦に活かしたい。',
    future_challenges: 'グローバルに活躍できる人材になりたい。海外での勤務経験や、新規事業の立ち上げにも挑戦したい。',
    uncertainty_attitude: 'ある程度の挑戦はしたい'
  },
  professor: {
    age: '46〜50歳',
    work_or_student: '社会人',
    company: '〇〇大学 社会学部 教授（博士課程修了後、同大学で教員として勤務）',
    education: '博士課程修了',
    grade: '教員・研究者',
    major: '社会学・社会福祉学',
    industry: ['教育・研究', '公務員・非営利', 'コンサルティング'],
    core_values: '探究心、教育、社会貢献。学問を通じて次世代を育て、社会の課題解決に貢献したい。',
    success_definition: '自分の研究が社会に影響を与え、教え子たちが各分野で活躍すること。研究者として認められつつ、人間としても尊敬される存在になること。',
    most_dedicated: '博士論文の執筆と、その後の学術書の出版。5年かけて完成させた研究が評価され、学会賞を受賞できたことは人生の転機だった。',
    influential_people: '大学院時代の指導教員。厳しくも温かい指導で、研究者としての姿勢を学んだ。「研究は社会のためにある」という信念を受け継いでいる。',
    strengths: '複雑な社会現象を理論的に分析すること、学生の可能性を引き出すこと、長期的な視点で物事を考えること。',
    weaknesses: '事務作業や会議の多さに疲弊すること、新しいテクノロジーへの適応に時間がかかること。',
    difficult_experience: '若手の頃、研究費が取れず研究が停滞した時期。アルバイトをしながら研究を続け、諦めずに申請し続けた結果、ようやく大型予算を獲得できた。',
    proud_achievements: '学術書の出版、学会賞の受賞、教え子が各分野で活躍していること、大学の研究センター設立に貢献したこと。',
    past_dreams: '学生時代は「社会を変える研究者になりたい」と漠然と思っていた。20代は「有名な研究者になりたい」という野心もあった。',
    value_evolution: '昔は「自分の業績」を重視していたが、年齢を重ねるにつれて「次世代への貢献」「社会への還元」を大切にするようになった。',
    what_to_keep: '研究の自由、学生との対話、家族との時間。これらは何があっても守りたい。',
    future_concerns: '大学の予算削減、研究環境の悪化、定年後のキャリア。また、AIやデジタル化に教育現場がどう適応していくか不安もある。',
    living_situation: '配偶者・子供と同居',
    work_situation: 'フルタイム勤務',
    location_preference: '現在の地域に留まりたい',
    work_purpose: '学問を通じて社会に貢献し、次世代を育てること。研究で得た知見を社会に還元し、より良い未来を創ることが使命だと考えている。',
    future_challenges: '定年後も研究を続けたい。また、これまでの研究成果を一般向けの本にまとめ、社会に広く発信したい。',
    uncertainty_attitude: '状況次第で柔軟に対応したい'
  }
};

const SECTIONS = [
  {
    id: 'basic',
    title: '基本情報',
    description: 'あなた自身について',
    iconType: 'user'
  },
  {
    id: 'values',
    title: '価値観・自己理解',
    description: 'あなたの価値観と経験',
    iconType: 'heart'
  },
  {
    id: 'strengths',
    title: '強み・課題認識',
    description: '得意なこと・苦手なこと',
    iconType: 'zap'
  },
  {
    id: 'continuity',
    title: '過去から現在へ',
    description: '価値観の変化と連続性',
    iconType: 'history'
  },
  {
    id: 'present',
    title: '現在の状態',
    description: '今のあなたと制約',
    iconType: 'compass'
  },
  {
    id: 'future',
    title: '未来展望',
    description: 'これからの未来について',
    iconType: 'trending'
  }
];

const SECTION_ICONS = {
  user: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  ),
  heart: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  milestone: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  zap: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  history: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  compass: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  trending: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
};

export default function Profile() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [profile, setProfile] = useState({});
  const [documents, setDocuments] = useState([]);

  // 起動時に一時保存データを読み込み
  useEffect(() => {
    const savedProfile = sessionStorage.getItem('careerCompassProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    const savedDocuments = sessionStorage.getItem('careerCompassDocuments');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
  }, []);

  // プロフィール変更時に自動保存
  useEffect(() => {
    if (Object.keys(profile).length > 0) {
      sessionStorage.setItem('careerCompassProfile', JSON.stringify(profile));
    }
  }, [profile]);

  // ドキュメント変更時に自動保存
  useEffect(() => {
    sessionStorage.setItem('careerCompassDocuments', JSON.stringify(documents));
  }, [documents]);

  const handleSave = () => {
    sessionStorage.setItem('careerCompassProfile', JSON.stringify(profile));
    toast.success('一時保存しました');
  };

  const loadSampleData = (type) => {
    setProfile(SAMPLE_DATA[type]);
    sessionStorage.setItem('careerCompassProfile', JSON.stringify(SAMPLE_DATA[type]));
    toast.success(`${type === 'student' ? '大学生' : '教授'}のサンプルデータを読み込みました`);
  };

  const clearData = () => {
    setProfile({});
    setDocuments([]);
    sessionStorage.removeItem('careerCompassProfile');
    sessionStorage.removeItem('careerCompassDocuments');
    setCurrentSection(0);
    toast.success('すべてのデータをクリアしました');
  };

  const handleNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // セッションストレージに一時保存してEventSelectionに遷移
      sessionStorage.setItem('careerCompassProfile', JSON.stringify(profile));
      router.push('/event-selection');
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-900">
              プロフィール入力
            </h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Users className="w-4 h-4" />
                  サンプルデータ
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => loadSampleData('student')}>
                  大学生のサンプル
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => loadSampleData('professor')}>
                  教授のサンプル
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={clearData}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  データをクリア
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-sm text-slate-500 mb-4">
            ※ 入力内容はサーバーに保存されません。ブラウザを閉じるとデータは削除されます。
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>セクション {currentSection + 1} / {SECTIONS.length}</span>
              <span>{Math.round(progress)}% 完了</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
          {SECTIONS.map((section, index) => {
            const IconComponent = SECTION_ICONS[section.iconType];
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`group relative p-3 rounded-xl text-center transition-all duration-200 ${
                  index === currentSection
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                    : index < currentSection
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600 border border-slate-100'
                }`}
              >
                <div className="flex flex-col items-center">
                  <IconComponent className={`w-5 h-5 mb-1.5 ${
                    index === currentSection ? 'text-white' : index < currentSection ? 'text-slate-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <div className="text-[10px] font-medium leading-tight">{section.title.split('・')[0]}</div>
                </div>
                {index < currentSection && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Current Section */}
        <Card className="shadow-xl border-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                {(() => {
                  const IconComponent = SECTION_ICONS[SECTIONS[currentSection].iconType];
                  return <IconComponent className="w-6 h-6 text-white" />;
                })()}
              </div>
              <div>
                <CardTitle className="text-2xl text-slate-900">{SECTIONS[currentSection].title}</CardTitle>
                <CardDescription className="text-base text-slate-500">
                  {SECTIONS[currentSection].description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <QuestionSection
                              sectionId={SECTIONS[currentSection].id}
                              profile={profile}
                              setProfile={setProfile}
                            />

                            {/* 最後のセクションで追加資料アップロードを表示 */}
                            {currentSection === SECTIONS.length - 1 && (
                              <div className="mt-8 pt-8 border-t border-indigo-100">
                                <DocumentUpload 
                                  documents={documents} 
                                  setDocuments={setDocuments} 
                                />
                              </div>
                            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
            className="border-indigo-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            前へ
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              className="border-indigo-200"
            >
              <Save className="w-4 h-4 mr-2" />
              一時保存
            </Button>

            <Button
              onClick={handleNext}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
            {currentSection === SECTIONS.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                完了して次へ
              </>
            ) : (
              <>
                次へ
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}