'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import { useFetch } from '@/lib/useFetch';
import { api } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { ApiResponse, CampaignDetail, CreatedTransaction } from '@/types/api';
import { formatNumber, imageUrl, progressPercentage } from '@/lib/format';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const campaignId = Number(params.id);
  const router = useRouter();
  const loggedIn = useAppSelector((state) => state.auth.loggedIn);

  const { data: campaign } = useFetch<ApiResponse<CampaignDetail>>(
    `/api/v1/campaigns/${campaignId}`
  );

  const [defaultImage, setDefaultImage] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (campaign) {
      setDefaultImage(imageUrl(campaign.data.image_url));
    }
  }, [campaign]);

  async function fund() {
    try {
      const response = await api.post<ApiResponse<CreatedTransaction>>('/api/v1/transactions', {
        amount,
        campaign_id: campaignId,
      });
      window.location.href = response.data.data.payment_url || '/transaction/error';
    } catch (err) {
      console.error(err);
      router.push('/transaction/error');
    }
  }

  if (!campaign) {
    return (
      <div className="project-page">
        <section className="project-header pt-5">
          <div className="container mx-auto relative px-5 md:px-8 lg:px-0">
            <Navbar />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="project-page">
      <section className="project-header pt-5">
        <div className="container mx-auto relative px-5 md:px-8 lg:px-0">
          <Navbar />
        </div>
      </section>
      <section className="container project-container mx-auto px-5 md:px-8 lg:px-0 -mt-56">
        <div className="flex flex-col lg:flex-row mt-3">
          <div className="w-full lg:w-3/4 lg:mr-6">
            <div className="bg-white p-3 mb-3 border border-gray-400 rounded-20">
              <figure className="item-image aspect-video overflow-hidden rounded-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={defaultImage} alt="" className="rounded-20 w-full h-full object-cover" />
              </figure>
            </div>
            <div className="flex flex-wrap -mx-2">
              {campaign.data.images.map((image) => (
                <div
                  key={image.image_url}
                  className="relative w-1/4 bg-white m-2 p-2 border border-gray-400 rounded-20"
                >
                  <figure className="item-thumbnail cursor-pointer aspect-square overflow-hidden rounded-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl(image.image_url)}
                      onClick={() => setDefaultImage(imageUrl(image.image_url))}
                      alt=""
                      className="rounded-20 w-full h-full object-cover"
                    />
                  </figure>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
            <div
              className="bg-white w-full p-5 border border-gray-400 rounded-20 lg:sticky"
              style={{ top: 15 }}
            >
              <h3>Project Leader:</h3>

              <div className="flex mt-3">
                <div className="w-1/4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={campaign.data.user.image_url ? imageUrl(campaign.data.user.image_url) : '/avatar.jpg'}
                    alt=""
                    className="w-full inline-block rounded-full"
                  />
                </div>
                <div className="w-3/4 ml-5 mt-1">
                  <div className="font-semibold text-xl text-gray-800">
                    {campaign.data.user.name}
                  </div>
                  <div className="font-light text-md text-gray-400">
                    {campaign.data.backer_count} backer
                  </div>
                </div>
              </div>

              <h4 className="mt-5 font-semibold">What will you get:</h4>
              <ul className="list-check mt-3">
                {campaign.data.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>

              {loggedIn ? (
                <>
                  <input
                    type="number"
                    className="border border-gray-500 block w-full px-6 py-3 mt-4 rounded-full text-gray-800 transition duration-300 ease-in-out focus:outline-none focus:shadow-outline"
                    placeholder="Amount in Rp"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    onKeyUp={(e) => e.key === 'Enter' && fund()}
                  />
                  <button
                    onClick={fund}
                    className="mt-3 button-cta block w-full bg-orange-button hover:bg-green-button text-white font-medium px-6 py-3 text-md rounded-full"
                  >
                    Fund Now
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="mt-3 button-cta block w-full bg-orange-button hover:bg-green-button text-white font-medium px-6 py-3 text-md rounded-full"
                >
                  Sign in to Fund
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-5 md:px-8 lg:px-0 pt-8">
        <div className="flex justify-between items-center">
          <div className="w-full lg:w-3/4 mr-6">
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-2 font-medium">{campaign.data.name}</h2>
            <p className="font-light text-lg sm:text-xl mb-5">{campaign.data.short_description}</p>

            <div className="relative progress-bar">
              <div className="overflow-hidden mb-4 text-xs flex rounded-full bg-gray-200 h-6">
                <div
                  style={{
                    width: `${progressPercentage(
                      campaign.data.current_amount,
                      campaign.data.goal_amount
                    )}%`,
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-progress progress-striped"
                />
              </div>
            </div>
            <div className="flex progress-info mb-6">
              <div className="text-2xl">
                {progressPercentage(campaign.data.current_amount, campaign.data.goal_amount)}%
              </div>
              <div className="ml-auto font-semibold text-2xl">
                Rp {formatNumber(campaign.data.goal_amount)}
              </div>
            </div>

            <p className="font-light text-lg sm:text-xl mb-5">{campaign.data.description}</p>
          </div>
          <div className="w-1/4 hidden lg:block" />
        </div>
      </section>
      <CallToAction />
      <Footer />
    </div>
  );
}
