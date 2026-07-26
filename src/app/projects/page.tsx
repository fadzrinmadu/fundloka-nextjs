'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import { api } from '@/lib/api';
import { Campaign, PaginatedApiResponse, Pagination } from '@/types/api';
import { formatNumber, imageUrl, progressPercentage } from '@/lib/format';

const PAGE_SIZE = 6;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most_funded', label: 'Most Funded' },
  { value: 'goal_high', label: 'Goal Amount: High to Low' },
  { value: 'goal_low', label: 'Goal Amount: Low to High' },
];

export default function ProjectsPage() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadPage = useCallback(
    async (page: number, replace: boolean) => {
      if (replace) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        params.set('sort', sort);
        params.set('limit', String(PAGE_SIZE));
        params.set('page', String(page));

        const response = await api.get<PaginatedApiResponse<Campaign[]>>(
          `/api/v1/campaigns?${params.toString()}`
        );

        setCampaigns((prev) => (replace ? response.data.data : [...prev, ...response.data.data]));
        setPagination(response.data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [search, sort]
  );

  // Debounce the search input before it drives a refetch.
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Reload from page 1 whenever the active search or sort changes.
  useEffect(() => {
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort]);

  // Infinite scroll: fetch the next page once the sentinel comes into view.
  useEffect(() => {
    if (!pagination?.hasMore) return undefined;
    const el = sentinelRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore) {
          loadPage(pagination.page + 1, false);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pagination, loading, loadingMore, loadPage]);

  return (
    <div className="project-page">
      <section className="projects-header pt-5">
        <div className="container mx-auto relative">
          <Navbar />
        </div>
      </section>

      <section className="container mx-auto pt-16">
        <div className="flex justify-between items-center mb-8">
          <div className="w-auto">
            <h2 className="text-3xl text-gray-900 mb-2">All Projects</h2>
            <p className="font-light text-gray-500">Browse every idea you can help fund</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search projects..."
            className="border border-gray-300 rounded-full px-6 py-3 w-full md:w-80 focus:outline-none focus:border-purple-progress"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:border-purple-progress"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-24">Loading projects...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center text-gray-500 py-24">
            {search ? `No projects found for "${search}".` : 'No projects available yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[30px]">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="card-project w-full p-4 bg-white border border-gray-200 rounded-20"
              >
                <div className="item">
                  <figure className="item-image h-44 overflow-hidden rounded-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl(campaign.image_url)}
                      alt=""
                      className="rounded-20 w-full h-full object-cover"
                    />
                  </figure>
                  <div className="item-meta">
                    <h4 className="text-xl font-semibold text-gray-900 mt-4">{campaign.name}</h4>
                    <p className="text-sm font-normal text-gray-500 mt-1 truncate">
                      {campaign.short_description}
                    </p>
                  </div>
                  <div className="relative h-16 mt-3">
                    <div className="progress-wrap">
                      <div className="relative progress-bar">
                        <div className="overflow-hidden h-2 mb-3 text-xs flex rounded-full bg-gray-200">
                          <div
                            style={{
                              width: `${progressPercentage(campaign.current_amount, campaign.goal_amount)}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-progress progress-striped"
                          />
                        </div>
                      </div>
                      <div className="flex progress-info text-sm">
                        <div className="text-gray-500">
                          {progressPercentage(campaign.current_amount, campaign.goal_amount)}%
                        </div>
                        <div className="ml-auto font-semibold text-gray-900">
                          Rp {formatNumber(campaign.goal_amount)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/projects/${campaign.id}`)}
                      className="button-cta absolute left-0 right-0 top-1/2 -translate-y-1/2 bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-3 text-lg rounded-full text-center"
                    >
                      Fund Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-4" />

        {loadingMore ? (
          <div className="text-center text-gray-500 py-8">Loading more projects...</div>
        ) : null}
      </section>

      <CallToAction />
      <Footer />
    </div>
  );
}
