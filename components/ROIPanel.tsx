'use client';

import { BusinessData, NicheType } from '@/lib/types';
import { getNicheConfig } from '@/lib/niches';

interface ROIPanelProps {
  niche: NicheType;
  businessData: BusinessData;
}

function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return '$' + (amount / 1000).toFixed(0) + 'k';
  }
  return '$' + amount.toLocaleString();
}

export default function ROIPanel({ niche, businessData }: ROIPanelProps) {
  const nicheConfig = getNicheConfig(niche);
  const { avgMissedCallsPerMonth, avgRevenuePerLead, hoursPerMonth, closingRate } = nicheConfig.roiConfig;

  // ROI Calculations
  const recoveredCalls = Math.round(avgMissedCallsPerMonth * 0.85); // AI captures 85% of missed calls
  const newLeadsPerMonth = Math.round(recoveredCalls * closingRate);
  const revenuePerMonth = newLeadsPerMonth * avgRevenuePerLead;
  const revenuePerYear = revenuePerMonth * 12;
  const timeSavedPerMonth = hoursPerMonth;
  const staffCostSaved = timeSavedPerMonth * 20; // $20/hr opportunity cost

  const metrics = [
    {
      label: 'Missed Calls Recovered',
      value: recoveredCalls + '/mo',
      icon: '📞',
      color: 'text-blue-400',
      subtitle: `from ${avgMissedCallsPerMonth} missed calls`,
    },
    {
      label: 'Time Saved',
      value: timeSavedPerMonth + ' hrs/mo',
      icon: '⏰',
      color: 'text-purple-400',
      subtitle: 'No more playing phone tag',
    },
    {
      label: 'New Revenue/Month',
      value: formatCurrency(revenuePerMonth),
      icon: '💵',
      color: 'text-green-400',
      subtitle: `${newLeadsPerMonth} new leads × ${formatCurrency(avgRevenuePerLead)}`,
    },
    {
      label: 'Annual Revenue Added',
      value: formatCurrency(revenuePerYear),
      icon: '📈',
      color: 'text-emerald-400',
      subtitle: 'From recovered missed calls alone',
      highlight: true,
    },
  ];

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/10 bg-gradient-to-r from-green-900/20 to-transparent">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Business Impact</div>
        <h3 className="text-xl font-bold text-white">Your ROI Estimate</h3>
        <p className="text-xs text-slate-500 mt-1">Based on {nicheConfig.label} industry averages</p>
      </div>

      {/* Metrics */}
      <div className="p-4 space-y-3">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className={`rounded-xl p-4 ${metric.highlight 
              ? 'bg-green-500/10 border border-green-500/30' 
              : 'bg-dark-900/50 border border-white/5'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{metric.icon}</span>
                <div>
                  <div className="text-xs text-slate-500">{metric.label}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{metric.subtitle}</div>
                </div>
              </div>
              <div className={`text-xl font-black ${metric.color} ${metric.highlight ? 'text-2xl' : ''}`}>
                {metric.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cost vs Value */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">AI Agent Cost</span>
            <span className="text-slate-300 text-sm">~$300-500/mo</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Revenue Added</span>
            <span className="text-green-400 font-bold text-sm">{formatCurrency(revenuePerMonth)}/mo</span>
          </div>
          <div className="border-t border-white/10 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Net ROI</span>
              <span className="text-green-400 font-black text-lg">
                {Math.round((revenuePerMonth / 400) * 10)}x Return
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-4">
        <p className="text-xs text-slate-600 text-center leading-relaxed">
          * Estimates based on industry averages for {nicheConfig.label}. Actual results vary by market, volume, and implementation.
        </p>
      </div>

      {/* CTA */}
      <div className="px-4 pb-5">
        <div className="bg-dark-900 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-sm font-semibold text-white mb-1">Ready to get started?</div>
          <div className="text-xs text-slate-500 mb-3">Setup takes less than 24 hours</div>
          <a
            href="tel:+12764479695"
            className="block w-full bg-green-500 hover:bg-green-400 text-white text-sm font-bold py-2.5 rounded-lg transition-all text-center"
          >
            📞 Call MrCeesAI Now
          </a>
        </div>
      </div>
    </div>
  );
}
