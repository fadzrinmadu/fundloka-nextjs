'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { api } from '@/lib/api';

export default function UploadAvatarPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState('/avatar.jpg');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
  }

  async function upload() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      await api.post('/api/v1/avatars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/register-success');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto min-h-screen flex justify-center items-center py-10">
      <div className="w-full lg:w-1/3 px-10 lg:px-0">
        <div className="flex justify-center items-center mx-auto mb-4 w-40">
          <div className="relative">
            <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="" className="rounded-full border-white border-4" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icon-avatar-add.svg"
                alt=""
                className="absolute right-0 bottom-0 pb-2"
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={onFileChange}
            />
          </div>
        </div>
        <h2 className="font-normal mb-3 text-3xl text-white text-center">
          Hi, {user?.name}
        </h2>
        <p className="text-white text-center font-light">Please upload your selfie</p>
        <div className="mb-4 mt-6">
          <div className="mb-3">
            <button
              disabled={!selectedFile}
              onClick={upload}
              className={
                'block w-full bg-orange-button hover:bg-green-button text-white font-semibold px-6 py-4 text-lg rounded-full' +
                (!selectedFile ? ' opacity-50 cursor-not-allowed' : '')
              }
            >
              Sign Up Now
            </button>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <button
              onClick={() => router.push('/register-success')}
              className="block w-full bg-transparent border-white border hover:bg-white hover:bg-opacity-25 text-white font-light px-6 py-4 text-lg rounded-full"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
