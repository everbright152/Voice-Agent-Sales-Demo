'use client';

import { useState } from 'react';
import { BusinessData, NicheType } from '@/lib/types';
import { getNicheConfig } from '@/lib/niches';

interface WebsiteCrawlerProps {
  niche: NicheType;
  onDataExtracted: (data: BusinessData) => void;
  onBack: () => void;
}

export default function WebsiteCrawler({ niche, onDataExtracted, onBack }: WebsiteCrawlerProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [crawlPhase, setCrawlPhase] = useState('');
  const nicheConfig = getNicheConfig(niche);

  const crawlWebsite = async () => {
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setCrawlPhase('Connecting to website...');

    try {
      // Simulate phased loading for visual effect
      await new Promise(r => setTimeout(r, 600));
      setCrawlPhase('Extracting business information...');
      
      await new Promise(r => setTimeout(r, 800));
      setCrawlPhase('Analyzing services and hours...');

      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), niche }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to crawl website');
      }

      setCrawlPhase('Building your AI agent profile...');
      await new Promise(r => setTimeout(r, 500));

      onDataExtracted(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract business data. You can still enter it manually.');
      setIsLoading(false);
      setCrawlPhase('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') crawlWebsite();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Niche indicator */}
      <div className={`inline-flex items-center gap-2 ${nicheConfig.bgColor} ${nicheConfig.color} border ${nicheConfig.borderColor} rounded-full px-4 py-2 text-sm font-medium`}>
        <span>{nicheConfig.icon}</span>
        <span>{nicheConfig.label} Selected</span>
      </div>

      <div className="glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Enter the Business Website</h2>
        <p className="text-slate-400 mb-8">
          We'll scan the website and automatically pull in the business name, services, hours, and more — then you can review and edit everything.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Website URL
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🌐</span>
                <input
                  type="url"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder="https://example.com"
                  className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
                />
              </div>
              <button
                onClick={crawlWebsite}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-center"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Scanning...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Generate Demo
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading phases */}
          {isLoading && crawlPhase && (
            <div className="bg-dark-900 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="wave-bar" style={{height: '14px'}}></span>
                  <span className="wave-bar" style={{height: '14px'}}></span>
                  <span className="wave-bar" style={{height: '14px'}}></span>
                </div>
                <span className="text-green-400 text-sm font-medium">{crawlPhase}</span>
              </div>
              <div className="mt-3 h-1 bg-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              <span className="font-medium">⚠️ Note: </span>{error}
            </div>
          )}

          {/* What we extract */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: '🏢', label: 'Business Name' },
              { icon: '⚙️', label: 'Services Offered' },
              { icon: '🕐', label: 'Business Hours' },
              { icon: '📍', label: 'Location(s)' },
              { icon: '📞', label: 'Phone & Email' },
              { icon: '❓', label: 'FAQs' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-slate-400 bg-dark-900/50 rounded-lg px-3 py-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Or enter manually */}
      <div className="text-center">
        <button
          onClick={() => {
            const domain = url.replace(/https?:\/\//, '').replace('www.', '').split('/')[0] || 'Your Business';
            const businessName = domain.split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
            
            onDataExtracted({
              business_name: businessName || 'Your Business Name',
              industry: niche,
              services: [],
              locations: [],
              hours: 'Monday-Friday: 9:00 AM - 5:00 PM',
              phone: '',
              email: '',
              faq: [],
              booking_link: '',
              summary: `Professional ${getNicheConfig(niche).label} services.`,
              website_url: url || '',
            });
          }}
          className="text-slate-500 hover:text-slate-300 text-sm underline transition-colors"
        >
          Skip URL — Enter business info manually
        </button>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
      >
        ← Change niche selection
      </button>
    </div>
  );
}
