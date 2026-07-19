'use client';

import { useRouter } from 'next/navigation';

export default function RegisterSuccessPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto h-screen flex justify-center items-center">
      <div className="w-full lg:w-1/3 px-10 lg:px-0">
        <div className="flex justify-center items-center mx-auto mt-6 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/success-illustration.svg" alt="" className="w-full" />
        </div>
        <h2 className="font-medium mb-3 text-3xl text-center">Welcome onboard!</h2>
        <p className="text-center font-light">
          Your account just registered
          <br />
          into our system
        </p>
        <div className="mb-4 mt-6">
          <div className="mb-3">
            <button
              onClick={() => router.push('/')}
              className="block w-full bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-4 text-lg rounded-full"
            >
              Start Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
