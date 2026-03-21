import { useState } from 'react';
import { Bell, Search, Plus, Menu, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function TopNav() {
  const { t, theme, toggleTheme, language, setLanguage } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isLight = theme === 'light';

  /* ── Dynamic text colors based on theme ── */
  const textMuted = isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)';
  const textSub   = isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)';
  const border    = isLight ? 'rgba(109,40,217,0.12)' : 'rgba(255,255,255,0.07)';
  const btnBg     = isLight ? 'rgba(109,40,217,0.06)' : 'rgba(255,255,255,0.04)';
  const btnHover  = isLight ? 'rgba(109,40,217,0.1)'  : 'rgba(255,255,255,0.08)';
  const inputBg   = isLight ? 'rgba(109,40,217,0.05)' : 'rgba(255,255,255,0.05)';
  const inputBorder = searchFocused
    ? 'rgba(109,40,217,0.6)'
    : isLight ? 'rgba(109,40,217,0.18)' : 'rgba(255,255,255,0.08)';
  const topbarBg  = isLight
    ? 'rgba(255,255,255,0.97)'
    : 'rgba(11,11,15,0.7)';
  const topbarBorder = isLight
    ? 'rgba(109,40,217,0.1)'
    : 'rgba(255,255,255,0.06)';

  const flags: Record<string, string> = { en: '🇬🇧', tr: '🇹🇷' };
  const langLabels: Record<string, string> = { en: 'EN', tr: 'TR' };
  const langFull: Record<string, string> = { en: 'English', tr: 'Türkçe' };

  return (
    <div
      className="topbar-root flex h-16 items-center justify-between px-6 shrink-0"
      style={{
        background: topbarBg,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${topbarBorder}`,
        position: 'relative',
        zIndex: 40,
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="rounded-lg p-2 lg:hidden transition-colors"
          style={{ color: textMuted }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = btnBg; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #6D28D9, #EC4899)',
              boxShadow: '0 0 8px rgba(109,40,217,0.8)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          <span className="text-sm" style={{ color: textMuted, fontWeight: 500 }}>
            {t('topnav.workspace')}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
            style={{ color: searchFocused ? '#a78bfa' : textSub }}
          />
          <input
            type="text"
            placeholder={t('topnav.search')}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-56 rounded-xl py-2 pl-10 pr-4 text-sm outline-none transition-all duration-300"
            style={{
              background: inputBg,
              border: `1px solid ${inputBorder}`,
              color: isLight ? '#1a1a2e' : 'rgba(255,255,255,0.8)',
              boxShadow: searchFocused ? '0 0 20px rgba(109,40,217,0.2)' : 'none',
            }}
          />
          <style>{`input::placeholder { color: ${textSub}; }`}</style>
        </div>

        {/* Upload Recording */}
        <button
          className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-white transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #6D28D9, #EC4899)',
            fontWeight: 600,
            boxShadow: '0 0 16px rgba(109,40,217,0.35)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(109,40,217,0.6)';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(109,40,217,0.35)';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          <Plus className="h-4 w-4" />
          {t('topnav.upload')}
        </button>

        {/* ── Theme Toggle ── */}
        <button
          onClick={toggleTheme}
          title={isLight ? t('theme.dark') : t('theme.light')}
          className="relative flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs transition-all duration-300"
          style={{
            background: btnBg,
            border: `1px solid ${border}`,
            color: textMuted,
            fontWeight: 600,
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = btnHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = btnBg; }}
        >
          {/* Sliding pill */}
          <span
            className="absolute inset-0 rounded-xl transition-all duration-300"
            style={{
              background: isLight
                ? 'linear-gradient(135deg,rgba(109,40,217,0.1),rgba(236,72,153,0.07))'
                : 'linear-gradient(135deg,rgba(109,40,217,0.15),rgba(236,72,153,0.08))',
              opacity: 0.7,
            }}
          />
          <span className="relative flex items-center gap-1.5">
            {isLight ? (
              <>
                <Sun className="h-4 w-4" style={{ color: '#f59e0b' }} />
                <span style={{ color: isLight ? '#6D28D9' : 'rgba(255,255,255,0.6)' }}>
                  {t('theme.light')}
                </span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" style={{ color: '#a78bfa' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {t('theme.dark')}
                </span>
              </>
            )}
          </span>
        </button>

        {/* ── Language Selector ── */}
        <div className="relative">
          <button
            onClick={() => setLangOpen((p) => !p)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs transition-all duration-200"
            style={{
              background: langOpen ? btnHover : btnBg,
              border: `1px solid ${langOpen ? 'rgba(109,40,217,0.4)' : border}`,
              color: textMuted,
              fontWeight: 600,
              boxShadow: langOpen ? '0 0 16px rgba(109,40,217,0.2)' : 'none',
            }}
            onMouseEnter={(e) => { if (!langOpen) (e.currentTarget as HTMLElement).style.background = btnHover; }}
            onMouseLeave={(e) => { if (!langOpen) (e.currentTarget as HTMLElement).style.background = btnBg; }}
          >
            <Globe className="h-3.5 w-3.5" style={{ color: '#a78bfa' }} />
            <span>{flags[language]} {langLabels[language]}</span>
            <ChevronDown
              className="h-3 w-3 transition-transform duration-200"
              style={{
                color: textSub,
                transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          {/* Dropdown */}
          {langOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
              <div
                className="absolute right-0 top-full mt-2 overflow-hidden rounded-2xl z-50"
                style={{
                  background: isLight ? '#fff' : 'rgba(18,12,30,0.97)',
                  border: `1px solid rgba(109,40,217,0.3)`,
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 8px 40px rgba(109,40,217,0.25)',
                  minWidth: 160,
                }}
              >
                {/* Header */}
                <div
                  className="px-4 py-2.5 text-xs uppercase tracking-wider"
                  style={{
                    color: 'rgba(109,40,217,0.7)',
                    fontWeight: 700,
                    borderBottom: `1px solid rgba(109,40,217,0.1)`,
                    background: 'rgba(109,40,217,0.05)',
                  }}
                >
                  Language / Dil
                </div>
                {(['en', 'tr'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setLangOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-all duration-150"
                    style={{
                      color: language === lang
                        ? '#a78bfa'
                        : isLight ? '#1a1a2e' : 'rgba(255,255,255,0.65)',
                      background: language === lang
                        ? 'rgba(109,40,217,0.1)'
                        : 'transparent',
                      fontWeight: language === lang ? 700 : 500,
                    }}
                    onMouseEnter={(e) => {
                      if (language !== lang)
                        (e.currentTarget as HTMLElement).style.background = 'rgba(109,40,217,0.07)';
                    }}
                    onMouseLeave={(e) => {
                      if (language !== lang)
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{flags[lang]}</span>
                    <div className="text-left">
                      <p className="text-sm">{langFull[lang]}</p>
                      <p className="text-xs" style={{ color: 'rgba(109,40,217,0.5)', marginTop: 1 }}>
                        {langLabels[lang]}
                      </p>
                    </div>
                    {language === lang && (
                      <span
                        className="ml-auto h-2 w-2 rounded-full"
                        style={{ background: '#a78bfa', boxShadow: '0 0 6px rgba(167,139,250,0.8)' }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-xl p-2.5 transition-all duration-200"
          style={{ background: btnBg, border: `1px solid ${border}` }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = btnHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = btnBg; }}
        >
          <Bell className="h-4 w-4" style={{ color: textMuted }} />
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
            style={{
              background: '#EC4899',
              boxShadow: '0 0 6px rgba(236,72,153,0.8)',
              animation: 'pulse-dot 1.5s ease-in-out infinite',
            }}
          />
        </button>

        {/* User Avatar */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-white text-xs transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #6D28D9, #EC4899)',
            fontWeight: 700,
            boxShadow: '0 0 12px rgba(109,40,217,0.4)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(109,40,217,0.7)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 12px rgba(109,40,217,0.4)'; }}
        >
          SC
        </button>
      </div>
    </div>
  );
}
