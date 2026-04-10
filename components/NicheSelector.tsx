'use client';

import { getAllNiches } from '@/lib/niches';
import { NicheType } from '@/lib/types';

interface NicheSelectorProps {
  onSelect: (niche: NicheType) => void;
}

export default function NicheSelector({ onSelect }: NicheSelectorProps) {
  const niches = getAllNiches();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">What type of business is this?</h2>
        <p className="text-slate-400">Select the closest match — we'll customize the AI agent specifically for that industry.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {niches.map((niche) => (
          <button
            key={niche.id}
            onClick={() => onSelect(niche.id)}
            className={`niche-card glass rounded-2xl p-6 text-left border ${niche.borderColor} hover:border-opacity-70 transition-all duration-300 group`}
          >
            <div className="flex items-start gap-4">
              <div className={`text-4xl p-3 rounded-xl ${niche.bgColor} flex-shrink-0`}>
                {niche.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-lg text-white mb-1 ${niche.color} group-hover:opacity-90`}>
                  {niche.label}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {niche.description}
                </p>
              </div>
            </div>

            {/* Call flow preview */}
            <div className="mt-4 space-y-1">
              {niche.callFlow.slice(0, 3).map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={`w-4 h-4 rounded-full ${niche.bgColor} ${niche.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                    {i + 1}
                  </span>
                  <span className="truncate">{step}</span>
                </div>
              ))}
            </div>

            <div className={`mt-4 flex items-center justify-between`}>
              <span className={`text-xs ${niche.color} font-medium`}>
                Select →
              </span>
              <div className={`w-8 h-1 rounded-full ${niche.bgColor} group-hover:w-12 transition-all`}></div>
            </div>
          </button>
        ))}
      </div>

      {/* Social proof bar */}
      <div className="glass rounded-xl p-4 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>Industry-specific AI prompts</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>Custom call flow per niche</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>Live demo in 60 seconds</span>
        </div>
      </div>
    </div>
  );
}
