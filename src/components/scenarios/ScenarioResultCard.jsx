import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

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

export default function ScenarioResultCard({ scenario, index }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const typeConfig = TYPE_CONFIG[scenario.scenario_type] || TYPE_CONFIG.realistic;

  return (
    <Card className="border-none shadow-none bg-white">
      <CardHeader className="px-12 pt-16 pb-8">
        <div className="mb-6">
          <CardTitle 
            className="text-4xl font-light leading-tight mb-0"
            style={{ color: typeConfig.color, letterSpacing: '-0.02em' }}
          >
            {scenario.scenario_title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-12 pb-16">
        <div className="max-w-3xl space-y-16">
          {/* 役割 */}
          {scenario.role_definition && (
            <section>
              <p 
                className="text-xl font-light leading-relaxed"
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