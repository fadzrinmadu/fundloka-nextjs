'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container mx-auto h-screen flex justify-center items-center">
      <div className="w-full lg:w-1/3 px-10 lg:px-0">
        <div className="flex justify-center items-center mx-auto mt-6 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/404-illustration.svg" alt="" className="w-full" />
        </div>
        <h2 className="font-medium mb-3 text-3xl text-center">Oops! something wrong</h2>
        <p className="text-center font-light">An error occurred</p>
        <div className="mb-4 mt-6">
          <div className="mb-3">
            <button
              onClick={() => reset()}
              className="block w-full bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-4 text-lg rounded-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
