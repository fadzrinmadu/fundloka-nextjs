'use client';

import { useRouter } from 'next/navigation';

export default function CallToAction() {
  const router = useRouter();

  return (
    <section className="call-to-action relative bg-purple-progress mt-[120px] pt-32 pb-10">
      <div className="container mx-auto">
        <div className="w-full text-center">
          <h1 className="text-5xl text-white font-semibold">
            Easy way to funding
            <br />
            best idea and innovation
          </h1>
          <button
            onClick={() => router.push('/register')}
            className="inline-block bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-4 mt-8 text-lg rounded-full"
          >
            Getting Started
          </button>
        </div>
      </div>
    </section>
  );
}
