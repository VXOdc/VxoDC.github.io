import React, { useState, useEffect, useRef } from 'react';
import {
  ExternalLink, Mail, ShieldCheck, Cpu, Code2, ArrowRight,
  Settings, Sun, Moon, Monitor, X, Award,
  BookOpen, HelpCircle, CheckSquare,
} from 'lucide-react';

// ─── PORTFOLIO DATA ───────────────────────────────────────────────────────────

const DATA = {
  personal: {
    name: 'Noah Ly',
    email: 'lynoah18@gmail.com',
    tagline: 'Student · Web Developer · Robotics Enthusiast',
    description:
      'Building applications and hardware systems with a focus on artificial intelligence, embedded electronics, and modern web technologies. Committed to structured engineering and intentional design.',
    credlyProfile: 'https://www.credly.com/users/noah-ly/badges#credly',
    github: 'https://github.com/VXOdc',
  },
  flagship: {
    id: 'syllastudy',
    title: 'SyllaStudy AI',
    url: 'https://syllastudyai.vercel.app/',
    description:
      'An AI-powered study platform that transforms how students interact with course materials. Designed for clarity, speed, and deep retention — turning syllabi into structured, actionable study systems.',
    features: [
      {
        id: 'smartnotes',
        label: 'SmartNotes',
        Icon: BookOpen,
        detail: 'AI-generated, structured study notes synthesized from any uploaded source material.',
      },
      {
        id: 'quizgen',
        label: 'QuizGen',
        Icon: HelpCircle,
        detail: 'Adaptive quizzes automatically constructed from your own content and learning goals.',
      },
      {
        id: 'taskflow',
        label: 'TaskFlow',
        Icon: CheckSquare,
        detail: 'Deadline-aware study task planning that organizes work around your actual schedule.',
      },
    ],
  },
  projects: [
    {
      id: 'esp32',
      title: 'ESP32 Microcontroller Projects',
      url: null,
      description:
        'A series of embedded hardware projects built on the ESP32 platform. Covers IoT sensor integration, Wi-Fi and Bluetooth communication protocols, real-time data processing, and low-level firmware development in C/C++.',
      Icon: Cpu,
    },
  ],
  certifications: [
    { id: 'linux',  title: 'Linux Unhatched',  issuer: 'Cisco',   date: 'Apr 29, 2026' },
    { id: 'quantum', title: 'Quantum Enigma', issuer: 'IBM',     date: 'Jan 19, 2026' },
    { id: 'ai-lit', title: 'AI Literacy',      issuer: 'Credly',  date: 'Jan 10, 2026' },
    { id: 'ai-fund', title: 'AI Fundamentals', issuer: 'Credly',  date: 'Jan 9, 2026'  },
  ],
  awards: [
    {
      id: 'coding-2023',
      title: 'Best Coding Award',
      context: 'Robotics Competition',
      year: '2023',
    },
    {
      id: 'teamwork-2022',
      title: 'Teamwork Award',
      context: 'Sacred Heart Invitational Robotics Competition',
      year: '2021–2022',
    },
    {
      id: 'design-2020',
      title: 'Best Design Award',
      context: 'Robotics Competition',
      year: '2020',
    },
  ],
};

// ─── SETTINGS HOOK ────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  theme: 'system',   // 'light' | 'dark' | 'system'
  font: 'sans',      // 'sans' | 'mono'
  reduceMotion: false,
  compact: false,
};

function useSettings() {
  const [settings, setState] = useState(() => {
    try {
      const raw = localStorage.getItem('noah-portfolio-v2');
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const setSettings = (updates) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      try { localStorage.setItem('noah-portfolio-v2', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Apply dark/light class to <html>
  useEffect(() => {
    const html = document.documentElement;
    const mq   = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const isDark =
        settings.theme === 'dark' ||
        (settings.theme === 'system' && mq.matches);
      html.classList.toggle('dark', isDark);
    };

    apply();

    if (settings.theme === 'system') {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [settings.theme]);

  // Apply reduce-motion class
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', settings.reduceMotion);
  }, [settings.reduceMotion]);

  // Apply compact-mode class
  useEffect(() => {
    document.documentElement.classList.toggle('compact-mode', settings.compact);
  }, [settings.compact]);

  return { settings, setSettings };
}

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <h3 className="text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-6">
    {children}
  </h3>
);

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────

const THEME_OPTIONS = [
  { value: 'light',  label: 'Light',  Icon: Sun     },
  { value: 'dark',   label: 'Dark',   Icon: Moon    },
  { value: 'system', label: 'System', Icon: Monitor },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-400 ${
        checked
          ? 'bg-zinc-900 dark:bg-zinc-100'
          : 'bg-zinc-200 dark:bg-zinc-700'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white dark:bg-zinc-900 shadow transition-transform duration-200 ${
          checked ? 'translate-x-[1.125rem]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
        {description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function SettingsPanel({ settings, setSettings, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const onKey   = (e) => { if (e.key === 'Escape') onClose(); };
    const onClick = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-start sm:justify-end p-4 sm:p-6">
      {/* Scrim */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full sm:w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-display">
              Settings
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">v2.1.0</span>
              <span className="inline-flex items-center px-1.5 py-px rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 tracking-wide uppercase">
                Stable
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme selector */}
        <div className="px-6 pt-5 pb-3">
          <p className="text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-3">
            Appearance
          </p>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5 gap-0.5">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSettings({ theme: opt.value })}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  settings.theme === opt.value
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                <opt.Icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="px-6 pb-4">
          <p className="text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-1 mt-2">
            Display
          </p>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            <SettingRow
              label="Monospace Font"
              description="Switch to JetBrains Mono for a technical aesthetic"
            >
              <Toggle
                checked={settings.font === 'mono'}
                onChange={(v) => setSettings({ font: v ? 'mono' : 'sans' })}
              />
            </SettingRow>

            <SettingRow
              label="Reduce Motion"
              description="Disables all transitions and animations"
            >
              <Toggle
                checked={settings.reduceMotion}
                onChange={(v) => setSettings({ reduceMotion: v })}
              />
            </SettingRow>

            <SettingRow
              label="Compact Mode"
              description="Tighter layout — more content per viewport"
            >
              <Toggle
                checked={settings.compact}
                onChange={(v) => setSettings({ compact: v })}
              />
            </SettingRow>
          </div>
        </div>

        {/* Footer meta */}
        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Last updated: May 2026</p>
          <a
            href={DATA.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            Source <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

function Header({ onSettingsOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {DATA.personal.name}
        </span>
        <div className="flex items-center gap-5">
          <nav aria-label="Primary">
            <ul className="hidden sm:flex gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {[
                ['#projects',       'Projects'      ],
                ['#certifications', 'Certifications'],
                ['#awards',         'Awards'        ],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={onSettingsOpen}
            aria-label="Open settings"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-16 pb-12 px-6 max-w-4xl mx-auto">
      <p className="text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-5">
        {DATA.personal.tagline}
      </p>
      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 leading-[1.1]">
        {DATA.personal.name}
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl mb-8 text-base sm:text-lg">
        {DATA.personal.description}
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={`mailto:${DATA.personal.email}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Email Me
        </a>
        <a
          href={DATA.personal.credlyProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
          Credly Profile
        </a>
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

function FlagshipCard() {
  const { title, url, description, features } = DATA.flagship;
  return (
    <div className="col-span-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
      {/* Title row */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <Code2 className="w-5 h-5 text-white dark:text-zinc-900" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {title}
              </h4>
              <span className="inline-flex items-center px-2 py-px rounded text-[10px] font-semibold tracking-widest bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 uppercase">
                Flagship
              </span>
            </div>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors flex-shrink-0"
        >
          View Project <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 max-w-2xl">
        {description}
      </p>

      {/* Feature sub-cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {features.map(({ id, label, Icon, detail }) => (
          <div
            key={id}
            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {label}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section
      id="projects"
      className="py-12 px-6 max-w-4xl mx-auto border-t border-zinc-200 dark:border-zinc-800"
    >
      <SectionLabel>Projects</SectionLabel>
      <div className="grid md:grid-cols-2 gap-6">
        <FlagshipCard />
        {DATA.projects.map(({ id, title, description, Icon }) => (
          <div
            key={id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6">
              <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </div>
            <h4 className="font-display text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {title}
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed flex-grow mb-6">
              {description}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 dark:text-zinc-500">
              <Cpu className="w-3.5 h-3.5" />
              Hardware Implementation
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CERTIFICATIONS ───────────────────────────────────────────────────────────

function Certifications() {
  return (
    <section
      id="certifications"
      className="py-12 px-6 max-w-4xl mx-auto border-t border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex items-center justify-between mb-6 gap-4">
        <SectionLabel>Certifications</SectionLabel>
        <a
          href={DATA.personal.credlyProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 inline-flex items-center gap-1.5 transition-colors flex-shrink-0 -mt-6"
        >
          Verify on Credly <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        {DATA.certifications.map((cert, i) => (
          <div
            key={cert.id}
            className={`flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors ${
              i !== DATA.certifications.length - 1
                ? 'border-b border-zinc-100 dark:border-zinc-800'
                : ''
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShieldCheck className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {cert.title}
              </span>
            </div>
            <span className="text-sm text-zinc-400 dark:text-zinc-500 tabular-nums flex-shrink-0 ml-4">
              {cert.date}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── AWARDS ───────────────────────────────────────────────────────────────────

function Awards() {
  return (
    <section
      id="awards"
      className="py-12 px-6 max-w-4xl mx-auto border-t border-zinc-200 dark:border-zinc-800 pb-20"
    >
      <SectionLabel>Awards &amp; Recognition</SectionLabel>
      <div className="space-y-4">
        {DATA.awards.map(({ id, title, context, year }) => (
          <div
            key={id}
            className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-6 py-4"
          >
            <Award className="w-5 h-5 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
            <div className="flex-grow min-w-0">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{context}</p>
            </div>
            <span className="flex-shrink-0 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 tabular-nums">
              {year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} {DATA.personal.name}. All rights reserved.
        </p>
        <a
          href={DATA.personal.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 inline-flex items-center gap-1.5 transition-colors"
        >
          View Source <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </footer>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const { settings, setSettings } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div
      className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200 selection:bg-zinc-200 dark:selection:bg-zinc-700 selection:text-zinc-900 dark:selection:text-zinc-100 ${
        settings.font === 'mono' ? 'font-mono' : 'font-sans'
      }`}
    >
      <Header onSettingsOpen={() => setSettingsOpen(true)} />

      <main>
        <Hero />
        <Projects />
        <Certifications />
        <Awards />
      </main>

      <Footer />

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          setSettings={setSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
