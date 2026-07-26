'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { imageUrl } from '@/lib/format';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loggedIn, user } = useAppSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logout());
    router.push('/');
  }

  return (
    <header className="flex items-center">
      <div style={{ height: 54 }} className="pr-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="logo" className="h-full" />
      </div>
      <ul className="flex items-center">
        <li>
          <Link className="text-white hover:text-teal-500 text-lg px-4 py-3" href="/">
            Home
          </Link>
        </li>
        <li>
          <a className="text-white hover:text-teal-500 text-lg px-4 py-3" href="#projects">
            Project
          </a>
        </li>
        <li>
          <a className="text-white hover:text-teal-500 text-lg px-4 py-3" href="#features">
            Features
          </a>
        </li>
        <li>
          <a className="text-white hover:text-teal-500 text-lg px-4 py-3" href="#testimonials">
            Success Stories
          </a>
        </li>
      </ul>

      {!loggedIn ? (
        <ul className="flex ml-auto items-center mt-2">
          <li>
            <Link
              href="/register"
              className="inline-block bg-transparent border-white border hover:bg-white hover:bg-opacity-25 text-white font-light w-40 text-center px-6 py-1 text-lg rounded-full mr-4"
            >
              Sign Up
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="inline-block bg-transparent border-white border hover:bg-white hover:bg-opacity-25 text-white font-light w-40 text-center px-6 py-1 text-lg rounded-full"
            >
              My Account
            </Link>
          </li>
        </ul>
      ) : (
        <div className="flex ml-auto">
          <div className="dropdown inline-block relative z-10">
            <button className="bg-white text-gray-700 font-semibold py-4 px-6 rounded inline-flex items-center">
              {user?.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl(user.image_url)}
                  alt=""
                  className="h-8 rounded-full mr-2"
                />
              ) : null}
              <span className="mr-1">{user?.name}</span>
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </button>
            <ul className="dropdown-menu absolute hidden text-gray-700 pt-1 shadow w-full -mt-2">
              <li>
                <Link
                  className="bg-white hover:bg-gray-100 hover:text-orange-500 py-2 px-4 block whitespace-nowrap"
                  href="/dashboard"
                >
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className="bg-white hover:bg-gray-100 border-t hover:text-orange-500 py-2 px-4 block whitespace-nowrap"
                  href="/dashboard/settings"
                >
                  Account Settings
                </Link>
              </li>
              <li>
                <a
                  className="cursor-pointer rounded-b bg-white hover:bg-gray-100 border-t hover:text-orange-500 py-2 px-4 block whitespace-nowrap"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
