'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

const TYPE_CONFIG = {
  realistic: {
    label: 'Pattern A',
    color: '#1a1a1a',
    bgColor: '#f5f5f5'
  },
  growth: {
    label: 'Pattern B',
    color: '#1a1a1a',
    bgColor: '#f5f5f5'
  },
  risk: {
    label: 'Pattern C',
    color: '#1a1a1a',
    bgColor: '#f5f5f5'
  }
};

export default function ScenarioResultCard({ scenario, index: _index, compact = false }) {
  const typeConfig = TYPE_CONFIG[scenario.scenario_type] || TYPE_CONFIG.realistic;

  const headerPad = compact ? 'px-5 sm:px-8 pt-8 pb-6' : 'px-12 pt-16 pb-8';
  const contentPad = compact ? 'px-5 sm:px-8 pb-10' : 'px-12 pb-16';
  const titleClass = compact
    ? 'text-2xl sm:text-3xl font-light leading-tight mb-0'
    : 'text-4xl font-light leading-tight mb-0';
  const sectionGap = compact ? 'space-y-10' : 'space-y-16';
  const bodyLead = compact ? 'text-lg' : 'text-xl';

  return (
    <Card className="border-none shadow-none bg-white">
      <CardHeader className={headerPad}>
        <div className="mb-6">
          <CardTitle 
            className={titleClass}
            style={{ color: typeConfig.color, letterSpacing: '-0.02em' }}
          >
            {scenario.scenario_title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className={contentPad}>
        <div className={`w-full ${sectionGap}`}>
          {/* 役割 */}
          {scenario.role_definition && (
            <section>
              <p 
                className={`${bodyLead} font-light leading-relaxed`}
                style={{ lineHeight: '2.0', color: typeConfig.color }}
              >
                {scenario.role_definition}
              </p>
            </section>
          )}

          {/* 構造説明（本文） */}
          {scenario.scenario_description && (
            <section>
              <h2 className="text-xs tracking-widest text-slate-400 mb-6">
                WHY THIS PATH
              </h2>
              <div 
                className="text-base leading-loose whitespace-pre-wrap"
                style={{ lineHeight: '2.2', color: '#333' }}
              >
                {scenario.scenario_description}
              </div>
            </section>
          )}

          {/* なぜ避けられないか */}
          {scenario.reasoning && (
            <section>
              <h2 className="text-xs tracking-widest text-slate-400 mb-6">
                STRUCTURAL CONSTRAINTS
              </h2>
              <div 
                className="text-base leading-loose whitespace-pre-wrap"
                style={{ lineHeight: '2.2', color: '#333' }}
              >
                {scenario.reasoning}
              </div>
            </section>
          )}

          {/* Next Step - 検証カード */}
          {scenario.next_step_recommendation && (
            <section>
              <div 
                className="border p-8"
                style={{ 
                  borderColor: typeConfig.color,
                  backgroundColor: typeConfig.bgColor 
                }}
              >
                <div className="flex items-start gap-4">
                  <Search className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: typeConfig.color }} />
                  <p 
                    className="text-base leading-relaxed"
                    style={{ lineHeight: '2.0', color: '#333' }}
                  >
                    {scenario.next_step_recommendation}
                  </p>
                </div>
              </div>
            </section>
          )}



        </div>
      </CardContent>
    </Card>
  );
}