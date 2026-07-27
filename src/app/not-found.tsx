'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="container mx-auto min-h-screen flex justify-center items-center py-10">
      <div className="w-full lg:w-1/3 px-10 lg:px-0">
        <div className="flex justify-center items-center mx-auto mt-6 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/404-illustration.svg" alt="" className="w-full" />
        </div>
        <h2 className="font-medium mb-3 text-3xl text-center">Oops! something wrong</h2>
        <p className="text-center font-light">
          The page that you requsted doesn&rsquo;t
          <br />
          exist at this moment
        </p>
        <div className="mb-4 mt-6">
          <div className="mb-3">
            <button
              onClick={() => router.push('/')}
              className="block w-full bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-4 text-lg rounded-full"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
