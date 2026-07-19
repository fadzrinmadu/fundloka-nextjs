'use client';

import { useRouter } from 'next/navigation';

export default function TransactionErrorPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto h-screen flex justify-center items-center">
      <div className="w-full lg:w-1/3 px-10 lg:px-0">
        <h2 className="font-medium mb-3 text-3xl text-center">Oops. Something wrong!</h2>
        <p className="text-center font-light">
          An error occured when processing your transaction.
          <br />
          Please try again later.
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
