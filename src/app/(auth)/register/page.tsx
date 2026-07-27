'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { register } from '@/store/authSlice';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    name: '',
    occupation: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  async function userRegister() {
    try {
      setError(null);
      await dispatch(register(form)).unwrap();
      router.push('/upload');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please check your details and try again.');
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center py-10">
      <div className="hidden md:block lg:w-1/3 bg-white h-full rounded-tr-lg rounded-br-lg auth-background-register" />
      <div className="w-auto md:w-2/4 lg:w-2/3 flex justify-center items-center">
        <div className="w-full lg:w-1/2 px-10 lg:px-0">
          <h2 className="font-normal mb-6 text-3xl text-white">Sign Up Account</h2>

          {error ? (
            <div className="mb-4 text-red-200 bg-red-900 bg-opacity-30 rounded px-4 py-2">
              {error}
            </div>
          ) : null}

          <div className="mb-6">
            <div className="mb-4">
              <label className="font-normal text-lg text-white block mb-3">Full Name</label>
              <input
                type="text"
                className="auth-form focus:outline-none focus:bg-purple-hover focus:shadow-outline focus:border-purple-hover-stroke focus:text-gray-100"
                placeholder="Write Your Name Here"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-4">
              <label className="font-normal text-lg text-white block mb-3">Occupation</label>
              <input
                type="text"
                className="auth-form focus:outline-none focus:bg-purple-hover focus:shadow-outline focus:border-purple-hover-stroke focus:text-gray-100"
                placeholder="Write your occupation here"
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-4">
              <label className="font-normal text-lg text-white block mb-3">Email Address</label>
              <input
                type="email"
                className="auth-form focus:outline-none focus:bg-purple-hover focus:shadow-outline focus:border-purple-hover-stroke focus:text-gray-100"
                placeholder="Write your email address here"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-4">
              <label className="font-normal text-lg text-white block mb-3">Password</label>
              <input
                type="password"
                className="auth-form focus:outline-none focus:bg-purple-hover focus:shadow-outline focus:border-purple-hover-stroke focus:text-gray-100"
                placeholder="Type your password here"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyUp={(e) => e.key === 'Enter' && userRegister()}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-4">
              <button
                onClick={userRegister}
                className="block w-full bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-4 text-lg rounded-full"
              >
                Continue Sign Up
              </button>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white text-md">
              Already have account?{' '}
              <Link href="/login" className="no-underline text-orange-button">
                Sign In
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-background-register {
          background-image: url('/sign-up-background.jpg');
          background-position: center;
          background-size: cover;
        }
      `}</style>
    </div>
  );
}
