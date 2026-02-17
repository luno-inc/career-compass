import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, Clock, Lightbulb, Sparkles } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { FUTURE_JOBS } from '../components/scenarios/futureJobs';

const TIMEFRAME_LABELS = {
  short: '5〜10年後',
  medium: '15〜25年後',
  long: '25〜50年後'
};

const TIMEFRAME_COLORS = {
  short: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  long: 'bg-purple-100 text-purple-800 border-purple-200'
};

export default function FutureJobs() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);

  const categories = Object.entries(FUTURE_JOBS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={() => router.push(createPageUrl('Home'))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホームに戻る
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                未来の仕事カタログ
              </h1>
              <p className="text-lg text-slate-600 mt-1">
                これから生まれる可能性のある新しい職業
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 mt-6">
            <p className="text-sm text-slate-700 leading-relaxed">
              このカタログは、学術機関や未来予測レポート（World Economic Forum、McKinsey、OECD等）に基づき、
              今後10〜50年の間に生まれる可能性のある職業をまとめたものです。
              既存の職業の延長ではなく、社会変化により<strong>新たに必要とされる役割</strong>を中心に掲載しています。
            </p>
          </div>
        </div>

        {/* Category Selection */}
        {!selectedCategory && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(([key, category]) => {
              const jobCount = category.jobs.length;
              const shortTermJobs = category.jobs.filter(j => j.timeframe === 'short').length;
              
              return (
                <Card 
                  key={key}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 bg-white/80 backdrop-blur-sm"
                  onClick={() => setSelectedCategory(key)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      {category.label}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {jobCount}種類の職業
                      <span className="text-emerald-600 ml-2">
                        （うち{shortTermJobs}種は5〜10年後）
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.jobs.slice(0, 3).map((job, idx) => (
                        <div key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span>{job.title}</span>
                        </div>
                      ))}
                      {jobCount > 3 && (
                        <div className="text-sm text-slate-400 italic">
                          ...他{jobCount - 3}種
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Job List for Selected Category */}
        {selectedCategory && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedCategory(null);
                    setExpandedJob(null);
                  }}
                  className="mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  カテゴリ一覧に戻る
                </Button>
                <h2 className="text-3xl font-bold text-slate-900">
                  {FUTURE_JOBS[selectedCategory].label}
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              {FUTURE_JOBS[selectedCategory].jobs.map((job, index) => {
                const isExpanded = expandedJob === index;
                
                return (
                  <Card 
                    key={index}
                    className="border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-2xl text-slate-900">
                              {job.title}
                            </CardTitle>
                            <Badge 
                              variant="outline" 
                              className={`${TIMEFRAME_COLORS[job.timeframe]} border`}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {TIMEFRAME_LABELS[job.timeframe]}
                            </Badge>
                          </div>
                          <CardDescription className="text-base text-slate-700 leading-relaxed">
                            {job.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <Button
                        variant="ghost"
                        onClick={() => setExpandedJob(isExpanded ? null : index)}
                        className="w-full justify-between mb-4"
                      >
                        <span className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          {isExpanded ? '詳細を閉じる' : 'この仕事が必要とされる世界を見る'}
                        </span>
                        <span className="text-xl">{isExpanded ? '−' : '+'}</span>
                      </Button>

                      {isExpanded && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                          {/* World Context */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm">🌍</span>
                              </div>
                              この仕事が必要とされる世界
                            </h4>
                            <p className="text-slate-700 leading-relaxed">
                              {job.worldContext}
                            </p>
                          </div>

                          {/* Required Skills */}
                          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm">💡</span>
                              </div>
                              必要とされるスキル
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.requiredSkills.map((skill, idx) => (
                                <Badge 
                                  key={idx}
                                  variant="secondary"
                                  className="bg-white border-slate-200 text-slate-700 px-3 py-1.5"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}