import React from 'react';
import { Mail, Settings, Link as LinkIcon, Package, Star } from 'lucide-react';

/**
 * Placeholder account pages for tabs that don't have full content yet.
 * Each exported component corresponds to one account route.
 */

const PlaceholderCard = ({ icon: Icon, title, description, color = 'blue' }) => {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-500'   },
    purple: { bg: 'bg-purple-50', text: 'text-purple-500' },
    green:  { bg: 'bg-emerald-50',text: 'text-emerald-500'},
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-500'  },
    slate:  { bg: 'bg-slate-100', text: 'text-slate-500'  },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">{title}</h1>
        <p className="text-[13px] text-slate-500 mt-1">{description}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 flex flex-col items-center justify-center text-center gap-5">
        <div className={`w-16 h-16 rounded-2xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${c.text}`} />
        </div>
        <div>
          <h2 className="text-[16px] font-black text-slate-800">{title}</h2>
          <p className="text-[13px] text-slate-500 mt-1 max-w-sm leading-relaxed">
            This section is coming soon. Full functionality will be added in a future sprint.
          </p>
        </div>
        <span className="px-3.5 py-1.5 text-[12px] font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded-full">
          Coming Soon
        </span>
      </div>
    </div>
  );
};

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
