'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { imageUrl } from '@/lib/format';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loggedIn, user } = useAppSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return undefined;

    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountOpen]);

  function closeMenus() {
    setMobileOpen(false);
    setAccountOpen(false);
  }

  function handleLogout() {
    closeMenus();
    dispatch(logout());
    router.push('/');
  }

  return (
    <header className="relative flex items-center justify-between py-3 md:py-0">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div style={{ height: 54 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="logo" className="h-full" />
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={
          (mobileOpen ? 'flex' : 'hidden') +
          ' md:flex flex-col md:flex-row absolute md:relative top-full md:top-auto left-0 md:left-auto w-full md:w-auto bg-purple-progress md:bg-transparent md:items-center z-20 md:ml-6 rounded-b-lg md:rounded-none shadow-lg md:shadow-none'
        }
      >
        <ul className="flex flex-col md:flex-row md:items-center px-4 md:px-0 pt-2 md:pt-0">
          <li>
            <Link
              className="text-white hover:text-teal-500 text-lg px-4 py-3 block"
              href="/"
              onClick={closeMenus}
            >
              Home
            </Link>
          </li>
          <li>
            <a
              className="text-white hover:text-teal-500 text-lg px-4 py-3 block"
              href="#projects"
              onClick={closeMenus}
            >
              Project
            </a>
          </li>
          <li>
            <a
              className="text-white hover:text-teal-500 text-lg px-4 py-3 block"
              href="#features"
              onClick={closeMenus}
            >
              Features
            </a>
          </li>
          <li>
            <a
              className="text-white hover:text-teal-500 text-lg px-4 py-3 block"
              href="#testimonials"
              onClick={closeMenus}
            >
              Success Stories
            </a>
          </li>
        </ul>

        {!loggedIn ? (
          <ul className="flex flex-col md:flex-row md:items-center md:ml-auto gap-3 md:gap-0 px-4 md:px-0 pb-4 md:pb-0">
            <li>
              <Link
                href="/register"
                onClick={closeMenus}
                className="inline-block bg-transparent border-white border hover:bg-white hover:bg-opacity-25 text-white font-light w-full md:w-40 text-center px-6 py-1 text-lg rounded-full md:mr-4"
              >
                Sign Up
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                onClick={closeMenus}
                className="inline-block bg-transparent border-white border hover:bg-white hover:bg-opacity-25 text-white font-light w-full md:w-40 text-center px-6 py-1 text-lg rounded-full"
              >
                My Account
              </Link>
            </li>
          </ul>
        ) : (
          <div className="md:ml-auto px-4 md:px-0 pb-4 md:pb-0">
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
                className="bg-white text-gray-700 font-semibold py-2 md:py-4 px-6 rounded inline-flex items-center justify-center w-full md:w-auto"
              >
                {user?.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl(user.image_url)}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                ) : null}
                <span className="mr-1">{user?.name}</span>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>

              {accountOpen ? (
                <ul className="md:absolute md:mt-1 text-gray-700 shadow w-full md:w-48 z-10">
                  <li>
                    <Link
                      className="bg-white hover:bg-gray-100 hover:text-orange-500 py-2 px-4 block whitespace-nowrap"
                      href="/dashboard"
                      onClick={closeMenus}
                    >
                      My Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="bg-white hover:bg-gray-100 border-t hover:text-orange-500 py-2 px-4 block whitespace-nowrap"
                      href="/dashboard/settings"
                      onClick={closeMenus}
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
              ) : null}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
