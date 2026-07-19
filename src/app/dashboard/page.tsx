'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useFetch } from '@/lib/useFetch';
import { useAppSelector } from '@/store/hooks';
import { ApiResponse, Campaign } from '@/types/api';
import { formatNumber, imageUrl, progressPercentage } from '@/lib/format';

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: campaigns } = useFetch<ApiResponse<Campaign[]>>(
    user ? `/api/v1/campaigns?user_id=${user.id}` : null
  );

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
                <a className="text-gray-800 font-bold" href="#">
                  Your Projects
                </a>
              </li>
              <li className="mr-6">
                <Link className="text-gray-500 hover:text-gray-800" href="/dashboard/transactions">
                  Your Transactions
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-1/4 text-right">
            <Link
              href="/dashboard/projects/create"
              className="bg-orange-button hover:bg-green-button text-white font-bold py-4 px-4 rounded inline-flex items-center"
            >
              + Create Campaign
            </Link>
          </div>
        </div>
        <hr />
        <div className="block mb-2">
          {campaigns?.data.map((campaign) => (
            <div key={campaign.id} className="w-full lg:max-w-full lg:flex mb-4">
              <div
                className="border h-48 lg:h-auto lg:w-64 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
                style={{
                  backgroundColor: '#bbb',
                  backgroundPosition: 'center',
                  backgroundImage: `url('${imageUrl(campaign.image_url)}')`,
                }}
              />
              <Link
                href={`/dashboard/projects/${campaign.id}`}
                className="w-full border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-8 flex flex-col justify-between leading-normal"
              >
                <div className="mb-8">
                  <div className="text-gray-900 font-bold text-xl mb-1">{campaign.name}</div>
                  <p className="text-sm text-gray-600 flex items-center mb-2">
                    Rp. {formatNumber(campaign.goal_amount)} &middot;{' '}
                    {progressPercentage(campaign.current_amount, campaign.goal_amount)}%
                  </p>
                  <p className="text-gray-700 text-base">{campaign.short_description}</p>
                </div>
                <div className="flex items-center">
                  <button className="bg-green-button text-white py-2 px-4 rounded">Detail</button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
      <div className="cta-clip -mt-20" />
      <section className="call-to-action bg-purple-progress pt-64 pb-10" />
      <Footer />
    </div>
  );
}
