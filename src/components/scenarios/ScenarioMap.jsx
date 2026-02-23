import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

export default function ScenarioMap({ scenarios, onSelectScenario, selectedScenarioId }) {
  const mapSize = 400;
  const padding = 40;

  const getProbabilityValue = (level) => {
    if (level === 'high') return 100;
    if (level === 'medium') return 50;
    return 0;
  };

  const getPosition = (scenario) => {
    const positivity = scenario.positivity_score || 0;
    const probability = getProbabilityValue(scenario.probability_level);
    
    const x = padding + ((positivity + 100) / 200) * (mapSize - padding * 2);
    const y = padding + ((100 - probability) / 100) * (mapSize - padding * 2);
    
    return { x, y };
  };

  const getColor = (scenario) => {
    const positivity = scenario.positivity_score || 0;
    if (positivity > 30) return '#22c55e';
    if (positivity > -30) return '#eab308';
    return '#ef4444';
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-center">シナリオマップ</h3>
      <div className="flex justify-center">
        <svg width={mapSize} height={mapSize} className="border rounded-lg bg-slate-50">
          {/* 軸 */}
          <line x1={mapSize/2} y1={padding} x2={mapSize/2} y2={mapSize-padding} stroke="#cbd5e1" strokeWidth="1" />
          <line x1={padding} y1={mapSize/2} x2={mapSize-padding} y2={mapSize/2} stroke="#cbd5e1" strokeWidth="1" />
          
          {/* グリッド */}
          <line x1={padding} y1={mapSize/4 + padding/2} x2={mapSize-padding} y2={mapSize/4 + padding/2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
          <line x1={padding} y1={mapSize*3/4 - padding/2} x2={mapSize-padding} y2={mapSize*3/4 - padding/2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
          <line x1={mapSize/4 + padding/2} y1={padding} x2={mapSize/4 + padding/2} y2={mapSize-padding} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
          <line x1={mapSize*3/4 - padding/2} y1={padding} x2={mapSize*3/4 - padding/2} y2={mapSize-padding} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />

          {/* ラベル */}
          <text x={mapSize - padding + 5} y={mapSize/2 + 4} fontSize="12" fill="#64748b">ポジティブ</text>
          <text x={5} y={mapSize/2 + 4} fontSize="12" fill="#64748b">ネガティブ</text>
          {/* 象限ラベル */}
          <text x={mapSize*3/4} y={mapSize/4} fontSize="10" fill="#94a3b8" textAnchor="middle">実現しやすい好機</text>
          <text x={mapSize/4} y={mapSize/4} fontSize="10" fill="#94a3b8" textAnchor="middle">起こりやすい危機</text>
          <text x={mapSize*3/4} y={mapSize*3/4} fontSize="10" fill="#94a3b8" textAnchor="middle">可能性ある好転</text>
          <text x={mapSize/4} y={mapSize*3/4} fontSize="10" fill="#94a3b8" textAnchor="middle">低確率のリスク</text>

          {/* シナリオポイント */}
          {scenarios.map((scenario, index) => {
            const pos = getPosition(scenario);
            const isSelected = selectedScenarioId === scenario.id;
            
            return (
              <g key={scenario.id} onClick={() => onSelectScenario(scenario.id)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 18 : 14}
                  fill={getColor(scenario)}
                  stroke={isSelected ? '#1e40af' : 'white'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-200 hover:opacity-80"
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  fontSize="12"
                  fill="white"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* 凡例 */}
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-slate-600">ポジティブ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-slate-600">中立</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-slate-600">ネガティブ</span>
        </div>
      </div>
    </Card>
  );
}