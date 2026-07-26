'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import { api } from '@/lib/api';
import { ApiResponse, Campaign } from '@/types/api';

export default function CreateCampaignPage() {
  const router = useRouter();
  const [campaign, setCampaign] = useState({
    name: '',
    short_description: '',
    description: '',
    goal_amount: 0,
    perks: '',
  });

  async function save() {
    try {
      const response = await api.post<ApiResponse<Campaign>>('/api/v1/campaigns', campaign);
      router.push(`/dashboard/projects/${response.data.data.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="project-page">
      <section className="dashboard-header pt-5">
        <div className="container mx-auto relative">
          <Navbar />
        </div>
      </section>
      <section className="container mx-auto pt-8">
        <div className="flex justify-between items-center">
          <div className="w-full mr-6">
            <h2 className="text-4xl text-gray-900 mb-2 font-medium">Dashboard</h2>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="w-3/4 mr-6">
            <h3 className="text-2xl text-gray-900 mb-4">Create New Projects</h3>
          </div>
          <div className="w-1/4 text-right">
            <button
              onClick={save}
              className="bg-green-button hover:bg-green-button text-white font-bold px-4 py-1 rounded inline-flex items-center"
            >
              Save
            </button>
          </div>
        </div>
        <div className="block mb-2">
          <div className="w-full lg:max-w-full lg:flex mb-4">
            <div className="w-full border border-gray-400 bg-white rounded p-8 flex flex-col justify-between leading-normal">
              <form className="w-full" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Campaign Name
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="text"
                      placeholder="Contoh: Demi Gunpla Demi Istri"
                      value={campaign.name}
                      onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Price
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="number"
                      placeholder="Contoh: 200000"
                      value={campaign.goal_amount}
                      onChange={(e) =>
                        setCampaign({ ...campaign, goal_amount: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-3">
                      Short Description
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="text"
                      placeholder="Deskripsi singkat mengenai projectmu"
                      value={campaign.short_description}
                      onChange={(e) =>
                        setCampaign({ ...campaign, short_description: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      What will backers get
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="text"
                      placeholder="Contoh: Ayam, Nasi Goreng, Piring"
                      value={campaign.perks}
                      onChange={(e) => setCampaign({ ...campaign, perks: e.target.value })}
                    />
                  </div>
                  <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      placeholder="Isi deskripsi panjang untuk projectmu"
                      value={campaign.description}
                      onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
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
