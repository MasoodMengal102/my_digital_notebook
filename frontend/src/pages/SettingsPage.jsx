import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Sun,
  Moon,
  Laptop,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function SettingsPage() {
  const { user, updateProfile, theme, changeTheme } = useAuth();

  // Profile Form
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Preferences
  const [emailNotif, setEmailNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [leadMinutes, setLeadMinutes] = useState(15);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');

  const [savingPassword, setSavingPassword] = useState(false);
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    // Fetch user settings
    const loadSettings = async () => {
      try {
        const s = await api.getSettings();
        setEmailNotif(s.email_notifications);
        setInAppNotif(s.in_app_notifications);
        setSoundEnabled(s.sound_enabled);
        setLeadMinutes(s.reminder_lead_minutes);
      } catch (err) {
        console.error(err);
      }
    };
    loadSettings();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    setProfileError('');
    try {
      await updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl,
        timezone
      });

      // Update notification settings
      await api.updateSettings({
        email_notifications: emailNotif,
        in_app_notifications: inAppNotif,
        sound_enabled: soundEnabled,
        reminder_lead_minutes: leadMinutes
      });

      setProfileMsg('Profile and preferences updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPwdMsg('');
    setPwdError('');

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match');
      setSavingPassword(false);
      return;
    }

    try {
      await updateProfile({
        current_password: currentPassword,
        new_password: newPassword
      });
      setPwdMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdMsg(''), 3000);
    } catch (err) {
      setPwdError(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-crystal-600" />
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal profile, notification triggers, and theme settings
        </p>
      </div>

      {/* Theme Settings Card */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">Theme Mode</h2>
        <p className="text-xs text-slate-500 mb-4">Choose your preferred visual appearance</p>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => changeTheme('light')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'light'
                ? 'border-crystal-500 bg-crystal-50 dark:bg-crystal-950/40 text-crystal-700 dark:text-crystal-300 ring-2 ring-crystal-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-semibold">Light</span>
          </button>

          <button
            type="button"
            onClick={() => changeTheme('dark')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'dark'
                ? 'border-crystal-500 bg-crystal-50 dark:bg-crystal-950/40 text-crystal-700 dark:text-crystal-300 ring-2 ring-crystal-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold">Dark</span>
          </button>

          <button
            type="button"
            onClick={() => changeTheme('system')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'system'
                ? 'border-crystal-500 bg-crystal-50 dark:bg-crystal-950/40 text-crystal-700 dark:text-crystal-300 ring-2 ring-crystal-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Laptop className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-semibold">System</span>
          </button>
        </div>
      </div>

      {/* Profile Information & Notifications */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-crystal-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Profile Details</h2>
          </div>
          {profileMsg && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {profileMsg}
            </span>
          )}
          {profileError && (
            <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {profileError}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-3.5 py-2 rounded-xl border bg-slate-100 dark:bg-slate-800/50 text-slate-400 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Profile Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="UTC+5">UTC+5 (Pakistan Standard Time)</option>
              <option value="UTC+5:30">UTC+5:30 (India Standard Time)</option>
              <option value="UTC-5">UTC-5 (Eastern Time US)</option>
              <option value="UTC-8">UTC-8 (Pacific Time US)</option>
              <option value="UTC+1">UTC+1 (Central European Time)</option>
            </select>
          </div>
        </div>

        {/* Notification preferences section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
          </div>

          <div className="space-y-3 max-w-lg">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                In-App Reminder Alerts & Toasts
              </span>
              <input
                type="checkbox"
                checked={inAppNotif}
                onChange={(e) => setInAppNotif(e.target.checked)}
                className="w-4 h-4 text-crystal-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Email Digests & Class Reminders
              </span>
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="w-4 h-4 text-crystal-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Sound Chime on Alerts
              </span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 text-crystal-600 rounded"
              />
            </label>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Alert Lead Time
              </span>
              <select
                value={leadMinutes}
                onChange={(e) => setLeadMinutes(parseInt(e.target.value))}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border text-xs"
              >
                <option value={5}>5 minutes before</option>
                <option value={10}>10 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={60}>1 hour before</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="px-5 py-2.5 bg-crystal-600 hover:bg-crystal-700 text-white rounded-xl font-semibold text-xs shadow-md transition-all flex items-center gap-2"
        >
          {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Profile Changes
        </button>
      </form>

      {/* Password Change Card */}
      <form onSubmit={handleUpdatePassword} className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h2>
          </div>
          {pwdMsg && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {pwdMsg}
            </span>
          )}
          {pwdError && (
            <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {pwdError}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingPassword}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs shadow-md transition-all flex items-center gap-2"
        >
          {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
          Update Password
        </button>
      </form>
    </div>
  );
}
