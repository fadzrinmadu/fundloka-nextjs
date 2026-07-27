'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function CallToAction() {
  const router = useRouter();
  const loggedIn = useAppSelector((state) => state.auth.loggedIn);

  return (
    <section className="call-to-action relative bg-purple-progress mt-[120px] pt-32 pb-10">
      <div className="container mx-auto px-5">
        <div className="w-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-white font-semibold">
            Easy way to funding
            <br />
            best idea and innovation
          </h1>
          <button
            onClick={() => router.push(loggedIn ? '/dashboard' : '/register')}
            className="inline-block bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-4 mt-8 text-lg rounded-full"
          >
            Getting Started
          </button>
        </div>
      </div>
    </section>
  );
}
