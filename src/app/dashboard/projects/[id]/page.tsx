'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import { useFetch } from '@/lib/useFetch';
import { api } from '@/lib/api';
import { ApiResponse, CampaignDetail, CampaignTransaction } from '@/types/api';
import { formatNumber, imageUrl } from '@/lib/format';

export default function DashboardProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const campaignId = params.id;

  const { data: campaign, reload: reloadCampaign } = useFetch<ApiResponse<CampaignDetail>>(
    `/api/v1/campaigns/${campaignId}`
  );
  const { data: transactions } = useFetch<ApiResponse<CampaignTransaction[]>>(
    `/api/v1/campaigns/${campaignId}/transactions`
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function selectFile() {
    setSelectedFile(fileInputRef.current?.files?.[0] ?? null);
  }

  async function upload() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('campaign_id', campaignId);
    formData.append('file', selectedFile);
    formData.append('is_primary', 'true');

    try {
      await api.post('/api/v1/campaign-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      reloadCampaign();
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
    }
  }

  if (!campaign) {
    return (
      <div className="project-page">
        <section className="dashboard-header pt-5">
          <div className="container mx-auto relative px-5 md:px-8 lg:px-0">
            <Navbar />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="project-page">
      <section className="dashboard-header pt-5">
        <div className="container mx-auto relative px-5 md:px-8 lg:px-0">
          <Navbar />
        </div>
      </section>
      <section className="container mx-auto px-5 md:px-8 lg:px-0 pt-8">
        <div className="flex justify-between items-center">
          <div className="w-full mr-6">
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-2 font-medium">Dashboard</h2>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-2xl text-gray-900 mb-4">Campaign Details</h3>
          </div>
          <div>
            <Link
              href={`/dashboard/projects/${campaign.data.id}/edit`}
              className="bg-green-button hover:bg-green-button text-white font-bold px-4 py-2 rounded inline-flex items-center justify-center w-full sm:w-auto"
            >
              Edit
            </Link>
          </div>
        </div>
        <div className="block mb-2">
          <div className="w-full lg:max-w-full lg:flex mb-4">
            <div className="border border-gray-400 bg-white rounded p-5 sm:p-8 flex flex-col justify-between leading-normal">
              <div>
                <div className="text-gray-900 font-bold text-xl mb-2">{campaign.data.name}</div>
                <p className="text-gray-700 text-base">{campaign.data.short_description}</p>
                <p className="text-sm font-bold flex items-center mb-1 mt-4">Description</p>
                <p className="text-gray-700 text-base">{campaign.data.description}</p>
                <p className="text-sm font-bold flex items-center mb-1 mt-4">
                  What Will Funders Get
                </p>
                <ul className="list-disc ml-5">
                  {campaign.data.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                <p className="text-sm font-bold flex items-center mb-1 mt-4">Goal Amount</p>
                <p className="text-4xl text-gray-700 text-base">
                  {formatNumber(campaign.data.goal_amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-2xl text-gray-900 mb-4 mt-5">Gallery</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={selectFile}
              className="border p-1 rounded overflow-hidden max-w-full"
            />
            <button
              onClick={upload}
              className="bg-green-button hover:bg-green-button text-white font-bold px-4 py-2 rounded inline-flex items-center"
            >
              Upload
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 -mx-2">
          {campaign.data.images.map((image) => (
            <div
              key={image.image_url}
              className="relative w-full bg-white m-2 p-2 border border-gray-400 rounded"
            >
              <figure className="item-thumbnail">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl(image.image_url)} alt="" className="rounded w-full" />
              </figure>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl text-gray-900 mb-4 mt-5">Transaction History</h3>
          </div>
        </div>
        <div className="block mb-2">
          {transactions?.data.map((transaction) => (
            <div key={transaction.id} className="w-full lg:max-w-full lg:flex mb-4">
              <div className="w-full border border-gray-400 lg:border-gray-400 bg-white rounded p-5 sm:p-8 flex flex-col justify-between leading-normal">
                <div>
                  <div className="text-gray-900 font-bold text-xl mb-1">{transaction.name}</div>
                  <p className="text-sm text-gray-600 flex items-center mb-2">
                    Rp. {formatNumber(transaction.amount)} &middot; {transaction.created_at}
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
