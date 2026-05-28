import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginContext from '../../../Context/LoginContext/CreateLoginContext.js';

/**
 * ProfileAndVisibility Page — /account/profile-and-visibility
 * Displays current user's profile with visibility controls.
 * Mirrors Atlassian's "Profile and visibility" settings page.
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
    setTimeout(() => setSaved(false), 2500);
  };

  const VisibilityBadge = () => (
    <select className="text-[12px] font-semibold text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer">
      <option value="anyone">Anyone</option>
      <option value="teammates">Teammates only</option>
      <option value="private">Private</option>
    </select>
  );

  return (
    <div className="space-y-6">

      {/* Page Title */}
      <div>
        <h1 className="text-xl font-black text-slate-900">Profile and visibility</h1>
        <p className="text-[13px] text-slate-500 mt-1">
          Manage your personal information and control who can see your profile details.
        </p>
      </div>

      {/* Profile Photo Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="relative">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={userName}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl ring-4 ring-white shadow-lg">
                  {getInitials(userName)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[12px] text-slate-500 font-medium">Who can see your profile photo?</span>
              <VisibilityBadge />
            </div>
          </div>
          <h2 className="text-[18px] font-black text-slate-900">{userName || 'Your Name'}</h2>
          <p className="text-[13px] text-slate-500">{userEmail || ''}</p>
        </div>
      </div>

      {/* About You Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-[15px] font-black text-slate-900 mb-1">About you</h3>
        <p className="text-[12px] text-slate-500 mb-6">
          Some of this information may appear publicly. You control who sees what.
        </p>

        <form onSubmit={handleSave} className="space-y-5">

          {/* Full Name */}
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Full name</label>
              <input
                type="text"
                defaultValue={userName || ''}
                readOnly
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-[13px] font-semibold focus:outline-none cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">Managed through your login provider.</p>
            </div>
            <div className="flex-shrink-0 pt-7">
              <VisibilityBadge />
            </div>
          </div>

          {/* Public Name */}
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Public name</label>
              <input
                type="text"
                value={publicName}
                onChange={e => setPublicName(e.target.value)}
                placeholder="How you appear to others"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex-shrink-0 pt-7">
              <VisibilityBadge />
            </div>
          </div>

          {/* Pronouns */}
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Pronouns</label>
              <input
                type="text"
                value={pronouns}
                onChange={e => setPronouns(e.target.value)}
                placeholder="e.g. he/him, she/her, they/them"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex-shrink-0 pt-7">
              <VisibilityBadge />
            </div>
          </div>

          {/* Job Title */}
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Job title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <div className="flex-shrink-0 pt-7">
              <VisibilityBadge />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              id="profile-save-btn"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              Save changes
            </button>
            {saved && (
              <span className="text-[13px] font-semibold text-emerald-600 flex items-center gap-1.5">
                ✓ Saved!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileAndVisibility;
