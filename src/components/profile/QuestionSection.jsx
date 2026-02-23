import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const MAJOR_SUGGESTIONS = [
  '文学', '言語学', '哲学', '歴史学', '文化人類学', '宗教学', '法学', '政治学', '国際関係', '公共政策',
  '経済学', '経営学', '会計学', 'ファイナンス', 'マーケティング', '社会学', '社会福祉学', '教育学', '心理学',
  '数学', '統計学', '物理学', '化学', '生物学', '地球科学', '天文学', '機械工学', '電気電子工学', '情報工学',
  '制御工学', '材料工学', '化学工学', '航空宇宙工学', '建築学', '土木工学', 'ロボティクス', 'AI・機械学習',
  'データサイエンス', 'ソフトウェア工学', 'サイバーセキュリティ', 'IoT', '半導体工学', 'エネルギー工学', '環境工学',
  'バイオ工学', '医用工学', '医学', '歯学', '薬学', '看護学', '保健学', 'リハビリテーション学', '公衆衛生学',
  '農学', '食品科学', '応用生物学', 'バイオテクノロジー', '森林科学', '水産学', '情報システム', 'UI/UX', 'HCI',
  'プロダクト開発', 'Web開発', 'モバイル開発', 'ゲーム開発', 'XR・メタバース', 'デジタルマーケティング', '起業',
  '新規事業開発', 'ベンチャーキャピタル', 'コンサルティング', '不動産学', '商学', '事業開発', 'プロジェクトマネジメント',
  'デザイン経営', '美術', 'デザイン', '建築デザイン', '映像制作', '音楽', 'メディアアート', '体育', 'スポーツ科学',
  'トレーナー学', '健康科学', '学際領域', '未定', '特になし'
];

const QUESTIONS = {
  basic: [
    {
      id: 'age',
      label: '年齢を教えてください',
      type: 'select',
      options: ['20歳以下', '21〜25歳', '26〜30歳', '31〜35歳', '36〜40歳', '41〜45歳', '46〜50歳', '51〜55歳', '56〜60歳', '60歳以上']
    },
    {
      id: 'work_or_student',
      label: '社会人か学生か教えてください',
      type: 'select',
      options: ['社会人', '学生']
    },
    {
      id: 'company',
      label: '勤務先の企業名や経歴を教えてください',
      type: 'textarea',
      placeholder: '例：株式会社○○（営業5年）、〇〇大学 社会学部 教授 など',
      showIf: { id: 'work_or_student', value: '社会人' }
    },
    {
      id: 'education',
      label: '最終学歴を教えてください',
      type: 'select',
      options: ['高校卒業', '専門学校卒業', '短期大学卒業', '大学卒業', '修士課程修了', '博士課程修了', 'その他']
    },
    {
      id: 'grade',
      label: '現在の立場を教えてください',
      type: 'select',
      optionsWhenKey: 'work_or_student',
      optionsWhen: {
        社会人: ['企業勤務（正社員）', '企業勤務（非正規）', '自営業・フリーランス', '公務員', '教員・研究者', '求職中', 'その他'],
        学生: ['大学1年', '大学2年', '大学3年', '大学4年', '修士1年', '修士2年', '博士課程', 'その他']
      }
    },
    {
      id: 'major',
      label: '専攻分野・専門領域を教えてください',
      type: 'suggest',
      placeholder: '入力すると候補が表示されます。該当がなければそのまま入力してください',
      suggestions: MAJOR_SUGGESTIONS
    },
    {
      id: 'industry',
      label: '志望業界・現在/今後関わりたい分野を選んでください（複数選択可）',
      type: 'multiselect',
      options: ['IT・ソフトウェア', '製造・メーカー', '金融・保険', 'コンサルティング', '商社・流通', 'サービス・小売', '広告・メディア', '医療・福祉', '教育・研究', '公務員・非営利', 'インフラ・エネルギー', 'クリエイティブ', '農業・食品', '不動産・建設', 'その他', 'まだ未定']
    }
  ],
  values: [
    { id: 'core_values', label: 'あなたが大切にしている価値観を3つ挙げてください', type: 'textarea', placeholder: '例：挑戦、安定、家族、創造性、自由など' },
    { id: 'most_dedicated', label: 'これまで一番打ち込んだことは何ですか？', type: 'textarea', placeholder: '例：部活・研究・アルバイト・趣味、仕事でのプロジェクト、資格取得、副業、地域活動・ボランティアなど、具体的に教えてください' },
    { id: 'influential_people', label: '最も影響を受けた人物は誰ですか？その理由も教えてください', type: 'textarea', placeholder: '例：両親、恩師、友人、著名人など、理由も含めて記述してください' }
  ],
  strengths: [
    { id: 'strengths', label: '人より得意だと思うことは何ですか？', type: 'textarea', placeholder: '例：人の話を聞くこと、論理的思考、プレゼン、細かい作業など' },
    { id: 'weaknesses', label: '苦手で避けたい作業・役割は何ですか？', type: 'textarea', placeholder: '例：細かい事務作業、人前で話すこと、締め切りに追われる仕事など' },
    { id: 'difficult_experience', label: '人生で最もつらかった経験と、そこから学んだことは何ですか？', type: 'textarea', placeholder: 'つらかった出来事とそこから得た学びを教えてください' }
  ],
  continuity: [
    { id: 'past_dreams', label: '過去（高校生の頃など）の自分が持っていた夢や価値観は何でしたか？', type: 'textarea', placeholder: '当時どんな将来を思い描いていましたか？' },
    { id: 'value_evolution', label: 'それは今のあなたにどう受け継がれている、または変化しましたか？', type: 'textarea', placeholder: '過去の夢や価値観が今どうなっているか教えてください' }
  ],
  present: [
    { id: 'what_to_keep', label: '今の生活で「手放したくないもの」は何ですか？', type: 'textarea', placeholder: '大切にしていること、維持したいことを教えてください' },
    { id: 'future_concerns', label: '将来への不安や懸念を具体的に教えてください', type: 'textarea', placeholder: '経済面、キャリア、人間関係など、率直に教えてください' },
    { 
      id: 'location_preference', 
      label: '将来の勤務地・居住地についての希望を教えてください', 
      type: 'select', 
      options: ['現在の地域に留まりたい', '都市部に移りたい', '地方に移りたい', '海外で働きたい', '場所にこだわらない', 'まだ決めていない']
    }
  ],
  future: [
    { id: 'future_challenges', label: '今後10年で挑戦したい領域はありますか？', type: 'textarea', placeholder: '興味のある分野、挑戦したいテーマを教えてください' },
    { 
      id: 'uncertainty_attitude', 
      label: '不確実な未来に対してどう向き合いたいですか？', 
      type: 'select', 
      options: ['リスクを取ってでも挑戦したい', 'ある程度の挑戦はしたい', '安定を重視したい', '状況次第で柔軟に対応したい', 'まだ分からない']
    }
  ]
};

const MAX_SUGGESTIONS = 10;

export default function QuestionSection({ sectionId, profile, setProfile }) {
  const [suggestOpenId, setSuggestOpenId] = useState(null);
  const suggestRef = useRef(null);

  const rawQuestions = QUESTIONS[sectionId] || [];
  const questions = rawQuestions.filter((q) => {
    if (!q.showIf) return true;
    return profile[q.showIf.id] === q.showIf.value;
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target)) {
        setSuggestOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (questionId, value) => {
    setProfile(prev => {
      const next = { ...prev, [questionId]: value };
      if (questionId === 'work_or_student') next.grade = '';
      return next;
    });
  };

  const getOptions = (question) => {
    if (question.options) return question.options;
    if (question.optionsWhen && question.optionsWhenKey) {
      const key = profile[question.optionsWhenKey];
      return question.optionsWhen[key] || [];
    }
    return [];
  };

  const handleMultiselectToggle = (questionId, option) => {
    const currentValues = profile[questionId] || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter(v => v !== option)
      : [...currentValues, option];
    handleChange(questionId, newValues);
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={question.id} className="space-y-2">
          <Label htmlFor={question.id} className="text-base">
            <span className="text-indigo-600 font-semibold">Q{index + 1}.</span>{' '}
            {question.label}
            {question.optional && (
              <span className="text-sm text-slate-400 ml-2">(任意)</span>
            )}
          </Label>
          
          {question.type === 'textarea' ? (
            <Textarea
              id={question.id}
              value={profile[question.id] || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="min-h-[120px] border-indigo-100 focus:border-indigo-300"
            />
          ) : question.type === 'select' ? (
            (() => {
              const options = getOptions(question);
              return (
                <Select
                  value={options.includes(profile[question.id]) ? profile[question.id] : ''}
                  onValueChange={(value) => handleChange(question.id, value)}
                  disabled={options.length === 0}
                >
                  <SelectTrigger className="border-indigo-100 focus:border-indigo-300">
                    <SelectValue placeholder={options.length === 0 ? 'まず「社会人か学生か」を選択してください' : '選択してください'} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            })()
          ) : question.type === 'suggest' ? (
            (() => {
              const value = profile[question.id] || '';
              const filtered = (question.suggestions || [])
                .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
                .slice(0, MAX_SUGGESTIONS);
              const isOpen = suggestOpenId === question.id && (value === '' || filtered.length > 0);
              return (
                <div ref={suggestRef} className="relative">
                  <Input
                    id={question.id}
                    value={value}
                    onChange={(e) => handleChange(question.id, e.target.value)}
                    onFocus={() => setSuggestOpenId(question.id)}
                    placeholder={question.placeholder}
                    className="border-indigo-100 focus:border-indigo-300"
                    autoComplete="off"
                  />
                  {isOpen && (
                    <ul className="absolute z-10 mt-1 w-full rounded-md border border-indigo-100 bg-white py-1 shadow-lg max-h-48 overflow-auto">
                      {filtered.map((s) => (
                        <li
                          key={s}
                          role="option"
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-indigo-50 focus:bg-indigo-50"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleChange(question.id, s);
                            setSuggestOpenId(null);
                          }}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })()
          ) : question.type === 'multiselect' ? (
            <div className="border border-indigo-100 rounded-md p-4 space-y-3">
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={(profile[question.id] || []).includes(option)}
                    onCheckedChange={() => handleMultiselectToggle(question.id, option)}
                  />
                  <label
                    htmlFor={`${question.id}-${option}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <Input
              id={question.id}
              value={profile[question.id] || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              className="border-indigo-100 focus:border-indigo-300"
            />
          )}
        </div>
      ))}
    </div>
  );
}