import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Key, Mail, Newspaper, HelpCircle, FileText, Menu, X } from 'lucide-react';
import DashboardHome from '@/components/cyber/DashboardHome.jsx';
import PasswordAnalyzer from '@/components/cyber/PasswordAnalyzer.jsx';
import CipherModule from '@/components/cyber/CipherModule.jsx';
import PhishingDetector from '@/components/cyber/PhishingDetector.jsx';
import NewsWatch from '@/components/cyber/NewsWatch.jsx';
import QuizModule from '@/components/cyber/QuizModule.jsx';
import ReportModule from '@/components/cyber/ReportModule.jsx';

const tabs = [
  { id: 'home', label: 'Dashboard', icon: Shield },
  { id: 'password', label: 'Mot de passe', icon: Lock },
  { id: 'cipher', label: 'Chiffrement', icon: Key },
  { id: 'phishing', label: 'Phishing', icon: Mail },
  { id: 'news', label: 'Veille Cyber', icon: Newspaper },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  { id: 'report', label: 'Rapport', icon: FileText },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useCallback((tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center cyber-glow-pulse">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">CyberShield</h1>
                <p className="text-xs text-muted-foreground">SecureNova</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.id)}
                  className={`nav-item ${isActive ? 'nav-item-active cyber-glow' : 'nav-item-inactive'}`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r"
                    />
                  )}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <p className="text-xs text-muted-foreground">Systeme actif</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-foreground">CyberShield</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground p-2 rounded-lg hover:bg-secondary transition-colors">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-card border-b border-border overflow-hidden z-40"
            >
              <nav className="p-4 space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => navigate(tab.id)}
                      className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'home' && <DashboardHome onNavigate={navigate} />}
              {activeTab === 'password' && <PasswordAnalyzer />}
              {activeTab === 'cipher' && <CipherModule />}
              {activeTab === 'phishing' && <PhishingDetector />}
              {activeTab === 'news' && <NewsWatch />}
              {activeTab === 'quiz' && <QuizModule />}
              {activeTab === 'report' && <ReportModule />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Index;
