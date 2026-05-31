import React from 'react';
import { Mail, Settings, Link as LinkIcon, Package, Star } from 'lucide-react';

/**
 * Placeholder account pages for tabs that don't have full content yet.
 * Enhanced with sleek dark mode support.
 */

const PlaceholderCard = ({ icon: Icon, title, description, color = 'blue' }) => {
  const colors = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-950/20',     text: 'text-blue-500 dark:text-blue-400',     border: 'border-blue-100 dark:border-blue-900/30' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/20', text: 'text-purple-500 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/30' },
    green:  { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/30' },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-955/20',   text: 'text-amber-500 dark:text-amber-400',   border: 'border-amber-100 dark:border-amber-900/30' },
    slate:  { bg: 'bg-slate-100 dark:bg-slate-800/40',   text: 'text-slate-500 dark:text-slate-400',   border: 'border-slate-200 dark:border-slate-700/50' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-450 mt-1">{description}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-10 flex flex-col items-center justify-center text-center gap-5 transition-colors">
        <div className={`w-16 h-16 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${c.text}`} />
        </div>
        <div className="space-y-1">
          <h2 className="text-[16px] font-black text-slate-800 dark:text-white">{title}</h2>
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mx-auto">
            This settings section is coming soon. Full functionality will be added in an upcoming Sprint.
          </p>
        </div>
        <span className="px-3.5 py-1.5 text-[11.5px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  );
};

export default PlaceholderCard;

export const EmailPage = () => (
  <PlaceholderCard
    icon={Mail}
    title="Email"
    description="Manage your email address and notification delivery preferences."
    color="blue"
  />
);

export const PreferencesPage = () => (
  <PlaceholderCard
    icon={Settings}
    title="Account preferences"
    description="Customize your timezone, language, and account-level settings."
    color="purple"
  />
);

export const ConnectedAppsPage = () => (
  <PlaceholderCard
    icon={LinkIcon}
    title="Connected apps"
    description="View and manage third-party applications connected to your account."
    color="green"
  />
);

export const LinkPreferencesPage = () => (
  <PlaceholderCard
    icon={Package}
    title="Link preferences"
    description="Set how smart links and embedded content behave across your workspace."
    color="amber"
  />
);

export const ProductSettingsPage = () => (
  <PlaceholderCard
    icon={Settings}
    title="Product settings"
    description="Configure product-specific settings like notifications, themes, and integrations."
    color="slate"
  />
);

export const LicensesPage = () => (
  <PlaceholderCard
    icon={Star}
    title="Licenses"
    description="View your active product licenses and subscription information."
    color="amber"
  />
);
