
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MrCeesAI — AI Voice Agent Demo',
  description: 'See a live AI voice receptionist answer calls as your business. Built for legal, beauty, healthcare, home services & financial. MrCeesAI automation agency.',
  keywords: 'AI voice agent, AI receptionist, business automation, MrCeesAI, Retell AI',
  openGraph: {
    title: 'MrCeesAI — Your Business Needs an AI Receptionist That Never Sleeps',
    description: 'Watch an AI answer calls as YOUR business — live demo in 60 seconds.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#080d1a] text-white min-h-screen antialiased font-sans">
        {/* Top Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{background:'rgba(8,13,26,0.85)',backdropFilter:'blur(16px)'}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-all">
                  <span className="text-white font-black text-base">M</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-black text-xl text-white">MrCeesAI</span>
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mb-0.5 animate-pulse"></span>
                </div>
              </a>

              {/* Center label */}
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 border border-white/10 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                AI Voice Agent Sales Demo
              </div>

              {/* CTA */}
              <a
                href="tel:+12764479695"
                className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-semibold text-sm px-4 py-2 rounded-full transition-all duration-200"
              >
                <span>📞</span>
                <span className="hidden sm:inline">Call Demo:</span>
                <span className="font-bold">+1 (276) 447-9695</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Page content with nav offset */}
        <main className="pt-16">{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-10 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">M</span>
                </div>
                <span className="text-slate-400 text-sm">© {new Date().getFullYear()} MrCeesAI — AI Automation Agency</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Live demo agent:</span>
                  <a href="tel:+12764479695" className="text-green-400 font-bold hover:text-green-300 transition-colors">+1 (276) 447-9695</a>
                </div>
                <span>|</span>
                <span>Powered by Retell AI</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
