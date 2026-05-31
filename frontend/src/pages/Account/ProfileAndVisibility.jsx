import React, { useContext, useState } from 'react';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

/**
 * ProfileAndVisibility Page — /account/profile-and-visibility
 * Displays current user's profile with clean visibility controls,
 * with premium Atlassian aesthetics and full dark mode support.
 */
const ProfileAndVisibility = () => {
  const { User: userName, userEmail, profilePic } = useContext(LoginContext);
  const [pronouns, setPronouns]   = useState('');
  const [jobTitle, setJobTitle]   = useState('');
  const [publicName, setPublicName] = useState(userName || '');
  const [saved, setSaved]         = useState(false);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const VisibilityBadge = () => (
    <select className="text-[12px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition">
      <option value="anyone">Anyone</option>
      <option value="teammates">Teammates only</option>
      <option value="private">Private</option>
    </select>
  );

  return (
    <div className="space-y-8 max-w-2xl mx-auto">

      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Profile and visibility</h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-450 mt-1.5 leading-relaxed">
          Manage your personal information and control who can see your profile details across Project-Sync.
        </p>
      </div>

      {/* Profile Card Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="h-28 bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-600 relative opacity-90" />
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-10 mb-4 gap-4">
            <div className="relative">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={userName}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl ring-4 ring-white dark:ring-slate-900 shadow-md">
                  {getInitials(userName)}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 pb-1 shrink-0">
              <span className="text-[12px] text-slate-500 dark:text-slate-400 font-bold">Profile photo visibility</span>
              <VisibilityBadge />
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-[18px] font-black text-slate-900 dark:text-white">{userName || 'Your Name'}</h2>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-semibold">{userEmail || ''}</p>
          </div>
        </div>
      </div>

      {/* About You Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-colors">
        <div>
          <h3 className="text-[15px] font-black text-slate-900 dark:text-white">About you</h3>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Some of this information may appear publicly. You control who sees what details.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          {/* Full Name */}
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="flex-1">
              <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Full name</label>
              <input
                type="text"
                defaultValue={userName || ''}
                readOnly
                className="mt-1.5 w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[13px] font-semibold focus:outline-none cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Managed through your primary login provider.</p>
            </div>
            <div className="flex-shrink-0 pt-6">
              <VisibilityBadge />
            </div>
          </div>

          {/* Public Name */}
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="flex-1">
              <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Public name</label>
              <input
                type="text"
                value={publicName}
                onChange={e => setPublicName(e.target.value)}
                placeholder="How you appear to others"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex-shrink-0 pt-6">
              <VisibilityBadge />
            </div>
          </div>

          {/* Pronouns */}
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="flex-1">
              <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Pronouns</label>
              <input
                type="text"
                value={pronouns}
                onChange={e => setPronouns(e.target.value)}
                placeholder="e.g. he/him, she/her, they/them"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex-shrink-0 pt-6">
              <VisibilityBadge />
            </div>
          </div>

          {/* Job Title */}
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="flex-1">
              <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Job title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex-shrink-0 pt-6">
              <VisibilityBadge />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              id="profile-save-btn"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition shadow-sm shadow-blue-500/10 cursor-pointer"
            >
              Save changes
            </button>
            {saved && (
              <span className="text-[13px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse">
                ✓ Saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileAndVisibility;
