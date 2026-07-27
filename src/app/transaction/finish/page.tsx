'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ApiResponse, CreatedTransaction } from '@/types/api';

function TransactionFinishContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [syncing, setSyncing] = useState(!!orderId);

  useEffect(() => {
    if (!orderId) return;

    api
      .post<ApiResponse<CreatedTransaction>>(`/api/v1/transactions/${orderId}/sync`)
      .catch((err) => console.error(err))
      .finally(() => setSyncing(false));
  }, [orderId]);

  return (
    <div className="container mx-auto min-h-screen flex justify-center items-center py-10">
      <div className="w-full lg:w-1/3 px-10 lg:px-0">
        <div className="flex justify-center items-center mx-auto mt-6 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/funded-illustration.svg" alt="" className="w-full" />
        </div>
        <h2 className="font-medium mb-3 text-3xl text-center">Yeay! You are super</h2>
        <p className="text-center font-light">
          {syncing ? (
            'Verifying your payment...'
          ) : (
            <>
              Your money has ben transferred
              <br />
              into company&apos;s account
            </>
          )}
        </p>
        <div className="mb-4 mt-6">
          <div className="mb-3">
            <button
              onClick={() => router.push('/')}
              className="block w-full bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-4 text-lg rounded-full"
            >
              Fund Other Project
            </button>
          </div>
          <div className="mb-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="block w-full bg-transparent border border-gray-500 text-gray-500 hover:bg-green-button hover:border-green-button hover:text-white font-light px-6 py-4 text-lg rounded-full"
            >
              My Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransactionFinishPage() {
  return (
    <Suspense fallback={null}>
      <TransactionFinishContent />
    </Suspense>
  );
}
