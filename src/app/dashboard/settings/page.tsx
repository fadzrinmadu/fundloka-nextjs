'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import { api } from '@/lib/api';
import { imageUrl } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCurrentUser, setUser } from '@/store/authSlice';
import { ApiResponse, User } from '@/types/api';

interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const errors = err.response?.data?.data?.errors;
    if (Array.isArray(errors)) return errors.join(', ');
    if (typeof errors === 'string') return errors;
    if (err.response?.data?.meta?.message) return err.response.data.meta.message;
  }
  return fallback;
}

function StatusAlert({ status }: { status: StatusMessage | null }) {
  if (!status) return null;

  return (
    <div
      className={
        'mb-4 rounded px-4 py-2 border text-sm ' +
        (status.type === 'success'
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-red-50 text-red-600 border-red-200')
      }
    >
      {status.message}
    </div>
  );
}

const inputClass =
  'appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500';
const labelClass = 'block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2';
const cardClass = 'w-full border border-gray-400 bg-white rounded p-8 mb-6';

export default function AccountSettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [profileForm, setProfileForm] = useState({ name: '', occupation: '', email: '' });
  const [profileStatus, setProfileStatus] = useState<StatusMessage | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, occupation: user.occupation, email: user.email });
    }
  }, [user]);

  async function saveProfile() {
    setSavingProfile(true);
    setProfileStatus(null);

    try {
      const response = await api.put<ApiResponse<User>>('/api/v1/users/profile', profileForm);
      dispatch(setUser(response.data.data));
      setProfileStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      setProfileStatus({ type: 'error', message: extractErrorMessage(err, 'Failed to update profile.') });
    } finally {
      setSavingProfile(false);
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState<StatusMessage | null>(null);

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
    setAvatarStatus(null);
  }

  async function uploadAvatar() {
    if (!avatarFile) return;

    setUploadingAvatar(true);
    setAvatarStatus(null);

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      await api.post('/api/v1/avatars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await dispatch(fetchCurrentUser());
      setAvatarFile(null);
      setAvatarPreview(null);
      setAvatarStatus({ type: 'success', message: 'Avatar updated successfully.' });
    } catch (err) {
      setAvatarStatus({ type: 'error', message: extractErrorMessage(err, 'Failed to upload avatar.') });
    } finally {
      setUploadingAvatar(false);
    }
  }

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [passwordStatus, setPasswordStatus] = useState<StatusMessage | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  async function changePassword() {
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setPasswordStatus({ type: 'error', message: 'New password confirmation does not match.' });
      return;
    }

    setSavingPassword(true);
    setPasswordStatus(null);

    try {
      await api.put('/api/v1/users/password', passwordForm);
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      setPasswordStatus({ type: 'success', message: 'Password updated successfully.' });
    } catch (err) {
      setPasswordStatus({ type: 'error', message: extractErrorMessage(err, 'Failed to update password.') });
    } finally {
      setSavingPassword(false);
    }
  }

  const currentAvatar = avatarPreview || (user?.image_url ? imageUrl(user.image_url) : '/avatar.jpg');

  return (
    <div className="project-page">
      <section className="dashboard-header pt-5">
        <div className="container mx-auto relative px-5 md:px-8 lg:px-0">
          <Navbar />
        </div>
      </section>
      <section className="container mx-auto px-5 md:px-8 lg:px-0 pt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-2 font-medium">Account Settings</h2>
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 text-sm">
              &larr; Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className={cardClass}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Avatar</h3>
            <StatusAlert status={avatarStatus} />
            <div className="flex flex-wrap items-center gap-6">
              <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentAvatar}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border border-gray-300"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={onAvatarChange}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-gray-300 rounded-full px-5 py-2 text-sm hover:border-purple-progress mr-3"
                >
                  Choose Photo
                </button>
                <button
                  type="button"
                  disabled={!avatarFile || uploadingAvatar}
                  onClick={uploadAvatar}
                  className="bg-orange-button hover:bg-green-button text-white font-semibold rounded-full px-5 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingAvatar ? 'Uploading...' : 'Save Avatar'}
                </button>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile</h3>
            <StatusAlert status={profileStatus} />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile();
              }}
            >
              <div className="mb-4">
                <label className={labelClass}>Full Name</label>
                <input
                  className={inputClass}
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className={labelClass}>Occupation</label>
                <input
                  className={inputClass}
                  type="text"
                  value={profileForm.occupation}
                  onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className={labelClass}>Email Address</label>
                <input
                  className={inputClass}
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-orange-button hover:bg-green-button text-white font-semibold rounded-full px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className={cardClass}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h3>
            <StatusAlert status={passwordStatus} />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                changePassword();
              }}
            >
              <div className="mb-4">
                <label className={labelClass}>Current Password</label>
                <input
                  className={inputClass}
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className={labelClass}>New Password</label>
                <input
                  className={inputClass}
                  type="password"
                  minLength={8}
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className={labelClass}>Confirm New Password</label>
                <input
                  className={inputClass}
                  type="password"
                  minLength={8}
                  value={passwordForm.new_password_confirmation}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="bg-orange-button hover:bg-green-button text-white font-semibold rounded-full px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  );
}
