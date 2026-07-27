'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import { api } from '@/lib/api';
import { PaginatedApiResponse, Pagination, UserTransaction } from '@/types/api';
import { formatNumber, imageUrl } from '@/lib/format';

const PAGE_SIZE = 6;

export default function DashboardTransactionsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('sort', 'newest');
    params.set('limit', String(PAGE_SIZE));
    params.set('page', String(page));

    api
      .get<PaginatedApiResponse<UserTransaction[]>>(`/api/v1/transactions?${params.toString()}`)
      .then((response) => {
        if (cancelled) return;
        setTransactions(response.data.data);
        setPagination(response.data.pagination);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, page]);

  return (
    <div className="project-page">
      <section className="dashboard-header pt-5">
        <div className="container mx-auto relative px-5 md:px-8 lg:px-0">
          <Navbar />
        </div>
      </section>
      <section className="container mx-auto px-5 md:px-8 lg:px-0 pt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-2 font-medium">Dashboard</h2>
            <ul className="flex items-center gap-8 border-b border-gray-200 mt-4">
              <li>
                <Link
                  href="/dashboard"
                  className="inline-block pb-3 text-gray-500 hover:text-gray-800 border-b-2 border-transparent transition-colors"
                >
                  Your Projects
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-block pb-3 text-gray-900 font-semibold border-b-2 border-purple-progress"
                >
                  Your Transactions
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 my-6 pt-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search your transactions..."
            className="border border-gray-300 rounded-full px-6 py-3 w-full md:w-80 focus:outline-none focus:border-purple-progress"
          />
        </div>

        <div className="block mb-2">
          {loading ? (
            <div className="text-center text-gray-500 py-16">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              {search ? `No transactions found for "${search}".` : 'You have no transactions yet.'}
            </div>
          ) : (
            transactions.map((transaction) => (
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
            ))
          )}
        </div>

        {pagination && pagination.totalPages > 1 ? (
          <div className="flex items-center justify-between mt-6 mb-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="border border-gray-300 rounded-full px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-progress"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page >= pagination.totalPages}
              className="border border-gray-300 rounded-full px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-progress"
            >
              Next
            </button>
          </div>
        ) : null}
      </section>
      <FooterSection />
    </div>
  );
}
