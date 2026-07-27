'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import { useFetch } from '@/lib/useFetch';
import { api } from '@/lib/api';
import { ApiResponse, CampaignDetail } from '@/types/api';

interface EditForm {
  name: string;
  short_description: string;
  description: string;
  goal_amount: number;
  perks: string;
}

export default function EditCampaignPage() {
  const params = useParams<{ id: string }>();
  const campaignId = params.id;
  const router = useRouter();

  const { data: campaign } = useFetch<ApiResponse<CampaignDetail>>(
    `/api/v1/campaigns/${campaignId}`
  );

  const [form, setForm] = useState<EditForm | null>(null);

  useEffect(() => {
    if (campaign && !form) {
      setForm({
        name: campaign.data.name,
        short_description: campaign.data.short_description,
        description: campaign.data.description,
        goal_amount: campaign.data.goal_amount,
        perks: campaign.data.perks.join(','),
      });
    }
  }, [campaign, form]);

  async function save() {
    if (!form) return;

    try {
      await api.put(`/api/v1/campaigns/${campaignId}`, form);
      router.push(`/dashboard/projects/${campaignId}`);
    } catch (err) {
      console.error(err);
    }
  }

  if (!campaign || !form) {
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
            <h3 className="text-2xl text-gray-900 mb-4">Edit Campaign &quot;{campaign.data.name}&quot;</h3>
          </div>
          <div>
            <button
              onClick={save}
              className="bg-green-button hover:bg-green-button text-white font-bold px-4 py-2 rounded inline-flex items-center justify-center w-full sm:w-auto"
            >
              Save
            </button>
          </div>
        </div>
        <div className="block mb-2">
          <div className="w-full lg:max-w-full lg:flex mb-4">
            <div className="w-full border border-gray-400 bg-white rounded p-5 sm:p-8 flex flex-col justify-between leading-normal">
              <form className="w-full" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Campaign Name
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Price
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="number"
                      value={form.goal_amount}
                      onChange={(e) => setForm({ ...form, goal_amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-3">
                      Short Description
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="text"
                      value={form.short_description}
                      onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                    />
                  </div>
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      What will backers get
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="text"
                      value={form.perks}
                      onChange={(e) => setForm({ ...form, perks: e.target.value })}
                    />
                  </div>
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  );
}
