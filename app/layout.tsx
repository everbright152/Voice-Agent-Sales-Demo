import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MrCeesAI — Voice Agent Demo',
  description: 'See your AI voice receptionist in action. Built for your niche, powered by MrCeesAI.',
  keywords: 'AI voice agent, AI receptionist, business automation, MrCeesAI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-dark-950 text-white min-h-screen antialiased">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="font-bold text-xl text-white">
                  MrCeesAI
                  <span className="text-green-400 ml-1">•</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400 hidden sm:block">
                  🎯 Sales Demo Platform
                </span>
                <a
                  href="tel:+12764479695"
                  className="bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2"
                >
                  <span>📞</span>
                  <span className="hidden sm:inline">Call Demo: </span>
                  <span>+1 (276) 447-9695</span>
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-slate-500 text-sm">
                © {new Date().getFullYear()} MrCeesAI — AI Automation Agency
              </div>
              <div className="text-slate-500 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Demo Agent Live: <strong className="text-green-400">+1 (276) 447-9695</strong></span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
