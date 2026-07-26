'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import { useFetch } from '@/lib/useFetch';
import { ApiResponse, UserTransaction } from '@/types/api';
import { formatNumber, imageUrl } from '@/lib/format';

export default function DashboardTransactionsPage() {
  const { data: transactions } = useFetch<ApiResponse<UserTransaction[]>>('/api/v1/transactions');

  return (
    <div className="project-page">
      <section className="dashboard-header pt-5">
        <div className="container mx-auto relative">
          <Navbar />
        </div>
      </section>
      <section className="container mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="w-3/4 mr-6">
            <h2 className="text-4xl text-gray-900 mb-2 font-medium">Dashboard</h2>
            <ul className="flex mt-2">
              <li className="mr-6">
                <Link className="text-gray-500 hover:text-gray-800" href="/dashboard">
                  Your Projects
                </Link>
              </li>
              <li className="mr-6">
                <a className="text-gray-800 font-bold" href="#">
                  Your Transactions
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="block mb-2">
          {transactions?.data.map((transaction) => (
            <div key={transaction.id} className="w-full lg:max-w-full lg:flex mb-4">
              <div
                className="border h-48 lg:h-auto lg:w-64 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
                style={{
                  backgroundColor: '#bbb',
                  backgroundPosition: 'center',
                  backgroundImage: `url('${imageUrl(transaction.campaign.image_url)}')`,
                }}
              />
              <div className="w-full border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-8 flex flex-col justify-between leading-normal">
                <div>
                  <div className="text-gray-900 font-bold text-xl mb-1">
                    {transaction.campaign.name}
                  </div>
                  <p className="text-sm text-gray-600 flex items-center mb-2">
                    Rp. {formatNumber(transaction.amount)} &middot; {transaction.created_at}{' '}
                    &middot; {transaction.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <FooterSection />
    </div>
  );
}
