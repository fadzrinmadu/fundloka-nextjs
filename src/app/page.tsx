'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import { useFetch } from '@/lib/useFetch';
import { Campaign, PaginatedApiResponse } from '@/types/api';
import { formatNumber, imageUrl, progressPercentage } from '@/lib/format';

const TESTIMONIALS = [
  {
    quote: 'Funding at Bucker is very easy and comfortable. Just need to find an idea, click and already funding.',
    name: 'Shopie Nicole',
    title: 'Project Manager',
    icon: '/testimonial-1-icon.png',
  },
  {
    quote: 'Setting up a campaign took less than an hour, and support from backers started coming in almost immediately.',
    name: 'Alex Putra',
    title: 'Startup Founder',
    icon: '/testimonial-2-icon.png',
  },
  {
    quote: 'I love how transparent the funding progress is. It makes trusting a new project so much easier.',
    name: 'Maria Santoso',
    title: 'Community Backer',
    icon: '/testimonial-3-icon.png',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { data: campaigns } = useFetch<PaginatedApiResponse<Campaign[]>>(
    '/api/v1/campaigns?sort=newest&limit=6&page=1'
  );

  const latestCampaigns = campaigns?.data ?? [];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTestimonial((current) => (current + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeTestimonial]);

  const testimonial = TESTIMONIALS[activeTestimonial];

  return (
    <div className="landing-page">
      <section className="landing-hero pt-5 relative">
        <div className="header__bg" />
        <div className="container mx-auto relative">
          <Navbar />
          <div className="flex items-center pt-10 px-5 md:px-0">
            <div className="w-1/2">
              <h1 className="text-4xl text-white mb-5">
                We helps <u className="hero-underline">startup</u> to <br />
                getting started &amp; <u className="hero-underline">funding</u> <br />
                their truly needs
              </h1>
              <p className="text-white text-xl font-light mb-8">
                Fund the best idea to become <br />
                a real product and be the contributor
              </p>
              <a
                href="#projects"
                className="bg-orange-button hover:bg-green-button text-white font-semibold px-12 py-3 text-xl rounded-full"
              >
                Find a Project
              </a>
            </div>
            <div className="w-1/2 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero-image@2x.png" alt="crowdfunding project" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto pt-24" id="features">
        <div className="flex justify-between items-center mb-10">
          <div className="w-auto">
            <h2 className="text-3xl text-gray-900 mb-8">
              Only 3 steps to execute <br />
              your bright ideas
            </h2>
          </div>
        </div>
        <div className="flex">
          <div className="w-full px-56 mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/line-step.svg" alt="" className="w-full" />
          </div>
        </div>
        <div className="flex justify-between items-center text-center">
          <div className="w-1/3">
            <figure className="flex justify-center items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/step-1-illustration.svg" alt="" className="h-30 mb-8" />
            </figure>
            <div className="step-content">
              <h3 className="font-medium">Sign Up</h3>
              <p className="font-light">
                Sign Up account and start <br />
                funding project
              </p>
            </div>
          </div>
          <div className="w-1/3">
            <figure className="flex justify-center items-center -mt-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/step-2-illustration.svg" alt="" className="h-30 mb-8" />
            </figure>
            <div className="step-content">
              <h3 className="font-medium">Open Project</h3>
              <p className="font-light">
                Choose some project idea, <br />
                and start funding
              </p>
            </div>
          </div>
          <div className="w-1/3">
            <figure className="flex justify-center items-center -mt-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/step-3-illustration.svg" alt="" className="h-30 mb-8" />
            </figure>
            <div className="step-content">
              <h3 className="font-medium">Execute</h3>
              <p className="font-light">
                Time to makes dream <br />
                comes true
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto pt-24" id="projects">
        <div className="flex justify-between items-center">
          <div className="w-auto">
            <h2 className="text-3xl text-gray-900 mb-8">
              New projects you can <br />
              taken care of
            </h2>
          </div>
          <div className="w-auto mt-5">
            <Link className="text-gray-900 hover:underline text-md font-medium" href="/projects">
              View All
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[30px] mt-6">
          {latestCampaigns.map((campaign) => (
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
      </section>

      <section className="container mx-auto pt-24" id="testimonials">
        <div className="flex justify-between items-center">
          <div className="w-auto">
            <h2 className="text-3xl text-gray-900 mb-8">
              See What Our <br />
              Happy Clients Say
            </h2>
          </div>
        </div>
        <div className="flex mb-10">
          <div className="w-2/12 flex justify-center items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/testimonial-line.svg" alt="" />
          </div>
          <div className="w-8/12 mt-16">
            <div key={activeTestimonial} className="testimonial-fade">
              <h2 className="text-3xl text-gray-900 font-light">&ldquo;{testimonial.quote}&rdquo;</h2>
              <div className="testimonial-info mt-8">
                <div className="name text-xl font-semibold">{testimonial.name}</div>
                <div className="title text-xl font-light text-gray-400">{testimonial.title}</div>
              </div>
            </div>
            <div className="testimonial-icon mt-10">
              {TESTIMONIALS.map((item, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.icon}
                  src={item.icon}
                  alt=""
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-20 mr-5 inline-block testimonial-user rounded-full cursor-pointer ${
                    index === activeTestimonial ? 'active' : ''
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-2/12" />
        </div>
      </section>

      <CallToAction />
      <Footer />
    </div>
  );
}
