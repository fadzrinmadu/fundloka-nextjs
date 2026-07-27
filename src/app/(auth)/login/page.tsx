'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  async function userLogin() {
    try {
      setError(null);
      await dispatch(login(form)).unwrap();
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your email and password.');
    }
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="hidden md:block lg:w-1/3 bg-white rounded-tr-lg rounded-br-lg auth-background-login" />
      <div className="w-auto md:w-2/4 lg:w-2/3 flex justify-center items-center py-10">
        <div className="w-full lg:w-1/2 px-10 lg:px-0">
          <h2 className="font-normal mb-6 text-3xl text-white">Sign In to Your Account</h2>

          {error ? (
            <div className="mb-4 text-red-200 bg-red-900 bg-opacity-30 rounded px-4 py-2">
              {error}
            </div>
          ) : null}

          <div className="mb-6">
            <div className="mb-4">
              <label className="font-normal text-lg text-white block mb-3">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="auth-form focus:outline-none focus:bg-purple-hover focus:shadow-outline focus:border-purple-hover-stroke focus:text-gray-100"
                placeholder="Write your email address here"
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-4">
              <label className="font-normal text-lg text-white block mb-3">Password</label>
              <input
                onKeyUp={(e) => e.key === 'Enter' && userLogin()}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="auth-form focus:outline-none focus:bg-purple-hover focus:shadow-outline focus:border-purple-hover-stroke focus:text-gray-100"
                placeholder="Write your password here"
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-4">
              <button
                onClick={userLogin}
                className="block w-full bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-4 text-lg rounded-full"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white text-md">
              Don&apos;t have account?{' '}
              <Link href="/register" className="no-underline text-orange-button">
                Sign Up
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-background-login {
          background-image: url('/sign-in-background.jpg');
          background-position: center;
          background-size: cover;
        }
      `}</style>
    </div>
  );
}
