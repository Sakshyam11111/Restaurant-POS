import React, { useState, useEffect } from 'react';
import {
  Globe, Palette, Bell, Shield, Printer, Store,
  Monitor, Moon, Sun, Check, ChevronRight, Volume2,
  VolumeX, Smartphone, Mail, AlertTriangle, Package,
  Clock, RefreshCw, User, Key, Eye, EyeOff, Save,
  ToggleLeft, ToggleRight, Zap, Coffee, Wifi
} from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ne', label: 'नेपाली (Nepali)', flag: '🇳🇵' },
  { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
];

const THEME_COLORS = [
  { id: 'blue',   label: 'Ocean Blue',   primary: '#487AA4', dark: '#386184', light: '#E6F1FB' },
  { id: 'emerald',label: 'Emerald',      primary: '#10B981', dark: '#059669', light: '#D1FAE5' },
  { id: 'violet', label: 'Violet',       primary: '#7C3AED', dark: '#6D28D9', light: '#EDE9FE' },
  { id: 'rose',   label: 'Rose',         primary: '#F43F5E', dark: '#E11D48', light: '#FFE4E6' },
  { id: 'amber',  label: 'Amber',        primary: '#D97706', dark: '#B45309', light: '#FEF3C7' },
  { id: 'slate',  label: 'Slate',        primary: '#475569', dark: '#334155', light: '#F1F5F9' },
];

const FONT_SIZES = [
  { id: 'sm',  label: 'Small',   px: '13px' },
  { id: 'md',  label: 'Medium',  px: '14px' },
  { id: 'lg',  label: 'Large',   px: '16px' },
];

const TIMEZONES = [
  'Asia/Kathmandu (UTC+5:45)',
  'Asia/Kolkata (UTC+5:30)',
  'Asia/Dhaka (UTC+6:00)',
  'Asia/Bangkok (UTC+7:00)',
  'UTC',
];

const CURRENCIES = [
  { code: 'NPR', symbol: 'Rs.', label: 'Nepali Rupee' },
  { code: 'INR', symbol: '₹',   label: 'Indian Rupee' },
  { code: 'USD', symbol: '$',   label: 'US Dollar' },
  { code: 'EUR', symbol: '€',   label: 'Euro' },
];

const Toggle = ({ value, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!value)}
    disabled={disabled}
    style={{
      width: 44, height: 24, borderRadius: 99, border: 'none',
      background: value ? 'var(--theme-primary)' : '#D1D5DB',
      cursor: disabled ? 'not-allowed' : 'pointer',
      position: 'relative', transition: 'background .2s', flexShrink: 0,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <span style={{
      position: 'absolute', top: 3, left: value ? 23 : 3,
      width: 18, height: 18, borderRadius: '50%', background: '#fff',
      transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
    }} />
  </button>
);

const SectionCard = ({ children, style }) => (
  <div style={{
    background: '#fff', border: '0.5px solid #E5E7EB',
    borderRadius: 14, overflow: 'hidden', ...style,
  }}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title, sub }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '16px 20px', borderBottom: '0.5px solid #F3F4F6',
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: 'var(--theme-light)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={16} color="var(--theme-primary)" />
    </div>
    <div>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{title}</p>
      {sub && <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, marginTop: 1 }}>{sub}</p>}
    </div>
  </div>
);

const SettingRow = ({ label, sub, children, noBorder }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: noBorder ? 'none' : '0.5px solid #F9FAFB',
    gap: 16,
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', margin: 0 }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, marginTop: 2 }}>{sub}</p>}
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

const selectStyle = {
  fontSize: 12, padding: '6px 10px', border: '0.5px solid #E5E7EB',
  borderRadius: 8, background: '#F9FAFB', color: '#374151',
  outline: 'none', cursor: 'pointer', minWidth: 160,
};

const TABS = [
  { id: 'appearance', icon: Palette,   label: 'Appearance' },
  { id: 'language',   icon: Globe,     label: 'Language & Region' },
  { id: 'notifications', icon: Bell,   label: 'Notifications' },
  { id: 'restaurant', icon: Store,     label: 'Restaurant' },
  { id: 'security',   icon: Shield,    label: 'Security' },
  { id: 'system',     icon: Monitor,   label: 'System' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [saving, setSaving] = useState(false);

  // Load from localStorage
  const load = (key, fallback) => {
    try { const v = localStorage.getItem('pos_settings_' + key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  };

  const [themeColor,    setThemeColor]    = useState(() => load('themeColor', 'blue'));
  const [darkMode,      setDarkMode]      = useState(() => load('darkMode', false));
  const [fontSize,      setFontSize]      = useState(() => load('fontSize', 'md'));
  const [compactMode,   setCompactMode]   = useState(() => load('compactMode', false));
  const [language,      setLanguage]      = useState(() => load('language', 'en'));
  const [timezone,      setTimezone]      = useState(() => load('timezone', 'Asia/Kathmandu (UTC+5:45)'));
  const [currency,      setCurrency]      = useState(() => load('currency', 'NPR'));
  const [dateFormat,    setDateFormat]    = useState(() => load('dateFormat', 'DD/MM/YYYY'));

  // Notification settings
  const [notifEnabled,  setNotifEnabled]  = useState(() => load('notifEnabled', true));
  const [rushAlert,     setRushAlert]     = useState(() => load('rushAlert', true));
  const [stockAlert,    setStockAlert]    = useState(() => load('stockAlert', true));
  const [orderAlert,    setOrderAlert]    = useState(() => load('orderAlert', true));
  const [soundAlert,    setSoundAlert]    = useState(() => load('soundAlert', true));
  const [emailAlert,    setEmailAlert]    = useState(() => load('emailAlert', false));
  const [smsAlert,      setSmsAlert]      = useState(() => load('smsAlert', false));
  const [alertInterval, setAlertInterval] = useState(() => load('alertInterval', '2'));

  // Restaurant settings
  const [restName,      setRestName]      = useState(() => load('restName', 'Bollore Restaurant'));
  const [restPhone,     setRestPhone]     = useState(() => load('restPhone', '+977 98XXXXXXXX'));
  const [restAddress,   setRestAddress]   = useState(() => load('restAddress', 'Kathmandu, Nepal'));
  const [taxRate,       setTaxRate]       = useState(() => load('taxRate', '13'));
  const [serviceCharge, setServiceCharge] = useState(() => load('serviceCharge', '10'));
  const [autoKOT,       setAutoKOT]       = useState(() => load('autoKOT', true));
  const [tableConfirm,  setTableConfirm]  = useState(() => load('tableConfirm', true));

  // Security
  const [currentPwd,    setCurrentPwd]    = useState('');
  const [newPwd,        setNewPwd]        = useState('');
  const [confirmPwd,    setConfirmPwd]    = useState('');
  const [showPwd,       setShowPwd]       = useState(false);
  const [sessionTimeout,setSessionTimeout]= useState(() => load('sessionTimeout', '60'));
  const [autoLogout,    setAutoLogout]    = useState(() => load('autoLogout', true));

  // System
  const [autoBackup,    setAutoBackup]    = useState(() => load('autoBackup', true));
  const [backupInterval,setBackupInterval]= useState(() => load('backupInterval', 'daily'));
  const [analytics,     setAnalytics]     = useState(() => load('analytics', true));
  const [debugMode,     setDebugMode]     = useState(() => load('debugMode', false));

  const theme = THEME_COLORS.find(t => t.id === themeColor) || THEME_COLORS[0];

  // Apply theme CSS vars
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-dark',    theme.dark);
    document.documentElement.style.setProperty('--theme-light',   theme.light);
  }, [theme]);

  const save = () => {
    setSaving(true);
    const settings = {
      themeColor, darkMode, fontSize, compactMode,
      language, timezone, currency, dateFormat,
      notifEnabled, rushAlert, stockAlert, orderAlert,
      soundAlert, emailAlert, smsAlert, alertInterval,
      restName, restPhone, restAddress, taxRate, serviceCharge,
      autoKOT, tableConfirm, sessionTimeout, autoLogout,
      autoBackup, backupInterval, analytics, debugMode,
    };
    Object.entries(settings).forEach(([k, v]) =>
      localStorage.setItem('pos_settings_' + k, JSON.stringify(v))
    );
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully!', { duration: 2500, position: 'top-center' });
    }, 600);
  };

  const inputStyle = {
    fontSize: 12, padding: '7px 10px', border: '0.5px solid #E5E7EB',
    borderRadius: 8, background: '#F9FAFB', color: '#374151',
    outline: 'none', width: '100%',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#F8FAFC',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      '--theme-primary': theme.primary,
      '--theme-dark':    theme.dark,
      '--theme-light':   theme.light,
    }}>
      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: '0.5px solid #E5E7EB',
        padding: '20px 32px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}>Settings</h1>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, marginTop: 2 }}>
            Manage your POS preferences and configuration
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 20px', borderRadius: 10, border: 'none',
            background: saving ? '#9CA3AF' : 'var(--theme-primary)',
            color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer', transition: 'background .2s',
          }}
        >
          {saving
            ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
            : <><Save size={14} /> Save Changes</>
          }
        </button>
      </div>

      <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', padding: '24px 24px', gap: 24 }}>
        {/* Sidebar Nav */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{
            background: '#fff', border: '0.5px solid #E5E7EB',
            borderRadius: 14, overflow: 'hidden', position: 'sticky', top: 84,
          }}>
            {TABS.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: isActive ? 'var(--theme-light)' : 'transparent',
                    borderLeft: isActive ? `3px solid var(--theme-primary)` : '3px solid transparent',
                    borderBottom: i < TABS.length - 1 ? '0.5px solid #F9FAFB' : 'none',
                    transition: 'all .15s',
                  }}
                >
                  <Icon size={15} color={isActive ? 'var(--theme-primary)' : '#9CA3AF'} />
                  <span style={{
                    fontSize: 12, fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--theme-primary)' : '#6B7280',
                  }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── APPEARANCE ── */}
          {activeTab === 'appearance' && (
            <>
              <SectionCard>
                <SectionHeader icon={Palette} title="Theme Color" sub="Choose your accent color" />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {THEME_COLORS.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setThemeColor(t.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px', borderRadius: 10,
                          border: themeColor === t.id
                            ? `2px solid ${t.primary}`
                            : '1.5px solid #E5E7EB',
                          background: themeColor === t.id ? t.light : '#F9FAFB',
                          cursor: 'pointer', transition: 'all .15s',
                        }}
                      >
                        <span style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: t.primary, flexShrink: 0,
                          boxShadow: themeColor === t.id ? `0 0 0 3px ${t.light}, 0 0 0 4px ${t.primary}` : 'none',
                        }} />
                        <span style={{
                          fontSize: 12, fontWeight: themeColor === t.id ? 600 : 400,
                          color: themeColor === t.id ? t.dark : '#6B7280',
                        }}>
                          {t.label}
                        </span>
                        {themeColor === t.id && <Check size={13} color={t.primary} />}
                      </button>
                    ))}
                  </div>
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Moon} title="Display" sub="Visual preferences" />
                <SettingRow
                  label="Dark Mode"
                  sub="Switch to dark background (coming soon)"
                >
                  <Toggle value={darkMode} onChange={setDarkMode} disabled />
                </SettingRow>
                <SettingRow label="Compact Mode" sub="Reduce padding and spacing across the UI">
                  <Toggle value={compactMode} onChange={setCompactMode} />
                </SettingRow>
                <SettingRow label="Font Size" sub="Adjust text size" noBorder>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {FONT_SIZES.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setFontSize(f.id)}
                        style={{
                          padding: '5px 12px', borderRadius: 7,
                          border: fontSize === f.id ? `1.5px solid var(--theme-primary)` : '1px solid #E5E7EB',
                          background: fontSize === f.id ? 'var(--theme-light)' : '#F9FAFB',
                          color: fontSize === f.id ? 'var(--theme-primary)' : '#6B7280',
                          fontSize: 12, fontWeight: fontSize === f.id ? 600 : 400,
                          cursor: 'pointer',
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* ── LANGUAGE & REGION ── */}
          {activeTab === 'language' && (
            <>
              <SectionCard>
                <SectionHeader icon={Globe} title="Language" sub="Select display language" />
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', borderRadius: 10,
                        border: language === lang.code ? `1.5px solid var(--theme-primary)` : '1px solid #E5E7EB',
                        background: language === lang.code ? 'var(--theme-light)' : '#F9FAFB',
                        cursor: 'pointer', transition: 'all .15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 20 }}>{lang.flag}</span>
                        <span style={{
                          fontSize: 13, fontWeight: language === lang.code ? 600 : 400,
                          color: language === lang.code ? 'var(--theme-primary)' : '#374151',
                        }}>
                          {lang.label}
                        </span>
                      </div>
                      {language === lang.code && (
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: 'var(--theme-primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={12} color="#fff" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Clock} title="Region & Format" sub="Timezone, currency and date format" />
                <SettingRow label="Timezone" sub="Used for order timestamps">
                  <select value={timezone} onChange={e => setTimezone(e.target.value)} style={selectStyle}>
                    {TIMEZONES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </SettingRow>
                <SettingRow label="Currency" sub="Used across billing and reports">
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={selectStyle}>
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.symbol} {c.label}</option>
                    ))}
                  </select>
                </SettingRow>
                <SettingRow label="Date Format" sub="How dates are displayed" noBorder>
                  <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} style={selectStyle}>
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === 'notifications' && (
            <>
              <SectionCard>
                <SectionHeader icon={Bell} title="Notification Alerts" sub="Control which alerts you receive" />
                <SettingRow
                  label="Enable All Notifications"
                  sub="Master toggle for all alerts"
                >
                  <Toggle value={notifEnabled} onChange={setNotifEnabled} />
                </SettingRow>
                <SettingRow
                  label="Rush Hour Alerts"
                  sub="Alert when restaurant hits peak load"
                >
                  <Toggle value={rushAlert} onChange={setRushAlert} disabled={!notifEnabled} />
                </SettingRow>
                <SettingRow
                  label="Stock & Ingredient Alerts"
                  sub="Notify when ingredients are low or out of stock"
                >
                  <Toggle value={stockAlert} onChange={setStockAlert} disabled={!notifEnabled} />
                </SettingRow>
                <SettingRow
                  label="New Order Notifications"
                  sub="Alert when a new order is placed"
                  noBorder
                >
                  <Toggle value={orderAlert} onChange={setOrderAlert} disabled={!notifEnabled} />
                </SettingRow>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Volume2} title="Alert Channels" sub="How you receive notifications" />
                <SettingRow label="Sound Alerts" sub="Play a sound for important alerts">
                  <Toggle value={soundAlert} onChange={setSoundAlert} disabled={!notifEnabled} />
                </SettingRow>
                <SettingRow label="Email Notifications" sub="Send alerts to your email">
                  <Toggle value={emailAlert} onChange={setEmailAlert} disabled={!notifEnabled} />
                </SettingRow>
                <SettingRow label="SMS Notifications" sub="Send SMS for critical alerts" noBorder>
                  <Toggle value={smsAlert} onChange={setSmsAlert} disabled={!notifEnabled} />
                </SettingRow>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={RefreshCw} title="Alert Frequency" sub="How often to check for new alerts" />
                <SettingRow label="Check Interval" sub="Polling frequency in minutes" noBorder>
                  <select
                    value={alertInterval}
                    onChange={e => setAlertInterval(e.target.value)}
                    style={selectStyle}
                    disabled={!notifEnabled}
                  >
                    <option value="1">Every 1 minute</option>
                    <option value="2">Every 2 minutes</option>
                    <option value="5">Every 5 minutes</option>
                    <option value="10">Every 10 minutes</option>
                    <option value="30">Every 30 minutes</option>
                  </select>
                </SettingRow>
              </SectionCard>

              {/* Alert preview */}
              <div style={{
                background: 'var(--theme-light)', border: `1px solid var(--theme-primary)`,
                borderRadius: 12, padding: '14px 18px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <Zap size={16} color="var(--theme-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--theme-dark)', margin: 0 }}>
                    Notification preview
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--theme-dark)', margin: '4px 0 0', opacity: .8 }}>
                    {notifEnabled
                      ? `Active: ${[rushAlert && 'Rush', stockAlert && 'Stock', orderAlert && 'Orders'].filter(Boolean).join(', ') || 'None'} alerts via ${[soundAlert && 'Sound', emailAlert && 'Email', smsAlert && 'SMS'].filter(Boolean).join(', ') || 'no channel'}`
                      : 'All notifications are currently disabled.'
                    }
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── RESTAURANT ── */}
          {activeTab === 'restaurant' && (
            <>
              <SectionCard>
                <SectionHeader icon={Store} title="Restaurant Info" sub="Basic business details" />
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                      Restaurant Name
                    </label>
                    <input
                      value={restName}
                      onChange={e => setRestName(e.target.value)}
                      style={inputStyle}
                      placeholder="Enter restaurant name"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                        Phone Number
                      </label>
                      <input
                        value={restPhone}
                        onChange={e => setRestPhone(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                        Tax Rate (%)
                      </label>
                      <input
                        type="number" value={taxRate}
                        onChange={e => setTaxRate(e.target.value)}
                        style={inputStyle} min="0" max="100"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                      Address
                    </label>
                    <input
                      value={restAddress}
                      onChange={e => setRestAddress(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                      Service Charge (%)
                    </label>
                    <input
                      type="number" value={serviceCharge}
                      onChange={e => setServiceCharge(e.target.value)}
                      style={{ ...inputStyle, maxWidth: 160 }} min="0" max="100"
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Coffee} title="POS Behavior" sub="Order flow preferences" />
                <SettingRow
                  label="Auto-generate KOT"
                  sub="Automatically generate kitchen order tickets on order placement"
                >
                  <Toggle value={autoKOT} onChange={setAutoKOT} />
                </SettingRow>
                <SettingRow
                  label="Table confirmation prompt"
                  sub="Ask for confirmation before starting a dine-in session"
                  noBorder
                >
                  <Toggle value={tableConfirm} onChange={setTableConfirm} />
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* ── SECURITY ── */}
          {activeTab === 'security' && (
            <>
              <SectionCard>
                <SectionHeader icon={Key} title="Change Password" sub="Update your account password" />
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                      Current Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={currentPwd}
                        onChange={e => setCurrentPwd(e.target.value)}
                        style={{ ...inputStyle, paddingRight: 36 }}
                        placeholder="Enter current password"
                      />
                      <button
                        onClick={() => setShowPwd(p => !p)}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                      >
                        {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                      New Password
                    </label>
                    <input
                      type="password" value={newPwd}
                      onChange={e => setNewPwd(e.target.value)}
                      style={inputStyle} placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password" value={confirmPwd}
                      onChange={e => setConfirmPwd(e.target.value)}
                      style={inputStyle} placeholder="Confirm new password"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!currentPwd || !newPwd || !confirmPwd) return toast.error('Fill all fields');
                      if (newPwd !== confirmPwd) return toast.error('Passwords do not match');
                      if (newPwd.length < 6) return toast.error('Password must be at least 6 characters');
                      toast.success('Password updated!');
                      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
                    }}
                    style={{
                      padding: '9px 0', borderRadius: 9, border: 'none',
                      background: 'var(--theme-primary)', color: '#fff',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      maxWidth: 180,
                    }}
                  >
                    Update Password
                  </button>
                </div>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Shield} title="Session Security" sub="Control access and session behavior" />
                <SettingRow label="Auto Logout" sub="Automatically log out after inactivity">
                  <Toggle value={autoLogout} onChange={setAutoLogout} />
                </SettingRow>
                <SettingRow label="Session Timeout" sub="Minutes of inactivity before logout" noBorder>
                  <select
                    value={sessionTimeout}
                    onChange={e => setSessionTimeout(e.target.value)}
                    style={selectStyle}
                    disabled={!autoLogout}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="120">2 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* ── SYSTEM ── */}
          {activeTab === 'system' && (
            <>
              <SectionCard>
                <SectionHeader icon={Wifi} title="Data & Backup" sub="Manage data retention and backups" />
                <SettingRow label="Auto Backup" sub="Automatically back up your data">
                  <Toggle value={autoBackup} onChange={setAutoBackup} />
                </SettingRow>
                <SettingRow label="Backup Frequency" sub="How often to create a backup" noBorder>
                  <select
                    value={backupInterval}
                    onChange={e => setBackupInterval(e.target.value)}
                    style={selectStyle}
                    disabled={!autoBackup}
                  >
                    <option value="hourly">Every hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </SettingRow>
              </SectionCard>

              <SectionCard>
                <SectionHeader icon={Monitor} title="System Preferences" sub="Advanced system options" />
                <SettingRow label="Usage Analytics" sub="Share anonymous usage data to help improve the product">
                  <Toggle value={analytics} onChange={setAnalytics} />
                </SettingRow>
                <SettingRow label="Debug Mode" sub="Enable verbose logging (for developers only)" noBorder>
                  <Toggle value={debugMode} onChange={setDebugMode} />
                </SettingRow>
              </SectionCard>

              {/* App version info */}
              <SectionCard>
                <SectionHeader icon={Smartphone} title="About" sub="App version and build info" />
                <div style={{ padding: '14px 20px' }}>
                  {[
                    ['App Name',    'Bollore POS'],
                    ['Version',     'v1.0.0'],
                    ['Build',       '2026.04.11'],
                    ['Environment', 'Production'],
                  ].map(([label, value]) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '6px 0', borderBottom: '0.5px solid #F9FAFB',
                    }}>
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <div style={{ textAlign: 'center', paddingBottom: 8 }}>
                <button
                  onClick={() => {
                    if (!window.confirm('This will clear all local settings. Continue?')) return;
                    Object.keys(localStorage).filter(k => k.startsWith('pos_settings_')).forEach(k => localStorage.removeItem(k));
                    toast.success('Settings reset to defaults');
                    window.location.reload();
                  }}
                  style={{
                    fontSize: 12, color: '#EF4444', background: 'none', border: 'none',
                    cursor: 'pointer', textDecoration: 'underline',
                  }}
                >
                  Reset all settings to default
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        button:focus { outline: none }
        input:focus { border-color: var(--theme-primary) !important; }
        select:focus { border-color: var(--theme-primary) !important; outline: none; }
      `}</style>
    </div>
  );
};

export default Settings;