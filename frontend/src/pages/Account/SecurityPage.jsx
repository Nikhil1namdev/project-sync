import React, { useState } from 'react';
import apiClient from '../../utils/apiClient.js';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Security Page — /account/security
 * Provides change-password UI.
 * If a backend endpoint is connected, it calls it; otherwise shows a safe message.
 *
 * NOTE: The backend currently does not have a dedicated /auth/change-password endpoint.
 * The UI is fully built; wire it to the backend when ready.
 */
const SecurityPage = () => {
  const [currentPw,  setCurrentPw]  = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');
  const [loading,    setLoading]    = useState(false);
  const [message,    setMessage]    = useState(null); // { type: 'success'|'error'|'info', text }
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPw !== confirmPw) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    if (newPw.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    try {
      // Attempt to call the backend — endpoint may not be wired yet
      await apiClient.post('/auth/change-password', {
        currentPassword: currentPw,
        newPassword: newPw,
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
        // Endpoint not connected yet — show informative message
        setMessage({
          type: 'info',
          text: 'Password update API is not connected yet. Backend endpoint /auth/change-password needs to be implemented.',
        });
      } else {
        setMessage({
          type: 'error',
          text: err.response?.data?.message || 'Failed to update password. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const PwInput = ({ id, value, onChange, show, onToggle, placeholder }) => (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-3.5 py-2.5 pr-11 rounded-xl border border-slate-200 bg-white text-slate-800 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  const alertColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error:   'bg-red-50 border-red-200 text-red-700',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900">Security</h1>
        <p className="text-[13px] text-slate-500 mt-1">
          Manage your password and keep your account secure.
        </p>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-[15px] font-black text-slate-900 mb-1">Change password</h3>
        <p className="text-[12px] text-slate-500 mb-6">
          Choose a strong password that's at least 6 characters. Don't reuse passwords across sites.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

          {/* Current Password */}
          <div>
            <label htmlFor="current-pw" className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">
              Current password
            </label>
            <div className="mt-1.5">
              <PwInput
                id="current-pw"
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                show={showCurrent}
                onToggle={() => setShowCurrent(p => !p)}
                placeholder="Enter current password"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="new-pw" className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">
              New password
            </label>
            <div className="mt-1.5">
              <PwInput
                id="new-pw"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                show={showNew}
                onToggle={() => setShowNew(p => !p)}
                placeholder="Enter new password"
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirm-pw" className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">
              Confirm new password
            </label>
            <div className="mt-1.5">
              <PwInput
                id="confirm-pw"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                show={showConfirm}
                onToggle={() => setShowConfirm(p => !p)}
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`px-4 py-3 rounded-xl border text-[13px] font-semibold ${alertColors[message.type]}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            id="update-password-btn"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[13px] font-bold rounded-xl transition shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>

      {/* Sessions info card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-[15px] font-black text-slate-900 mb-1">Active session</h3>
        <p className="text-[13px] text-slate-500">
          You are currently logged in. Your session is persisted via a JWT token stored in localStorage.
          It expires after <strong>30 days</strong>.
        </p>
      </div>
    </div>
  );
};

export default SecurityPage;
