'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleGridStatus } from '@/app/actions/warehouse';
import { ArrowLeft, Save, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';

type LocationDetail = {
  id: number;
  code: string;
  name: string;
  xPercent: number | null;
  yPercent: number | null;
  isActive: boolean;
};

export default function EditLocationForm({ location }: { location: LocationDetail }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(location.isActive);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await toggleGridStatus(location.id, isActive);
      if (result.success) {
        router.push('/locations');
      } else {
        setError(result.error ?? 'Terjadi kesalahan sistem');
      }
    });
  };

  return (
    <div className='flex flex-col gap-6 animate-in fade-in duration-300'>
      <div className='flex items-center gap-3'>
        <Link
          href='/locations'
          className='p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 transition-all shadow-sm'
        >
          <ArrowLeft className='h-4 w-4' />
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-white'>Edit Grid: {location.code}</h1>
          <p className='text-xs text-zinc-500'>
            Aktifkan atau nonaktifkan status grid lokasi penyimpan gudang
          </p>
        </div>
      </div>

      {error && (
        <div className='flex items-start gap-3 p-4 bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-800 dark:text-red-400 shadow-sm'>
          <span className='text-sm'>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className='max-w-2xl'>
        <div className='bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm flex flex-col gap-6'>
          <div className='flex items-center gap-2 pb-3 border-b border-zinc-800'>
            <MapPin className='h-5 w-5 text-indigo-500' />
            <h2 className='font-bold text-lg text-white'>Detail Grid</h2>
          </div>

          <div className='flex flex-col gap-1.5 opacity-60'>
            <label className='text-xs font-semibold text-zinc-500'>
              Kode Grid (Tidak Dapat Diubah)
            </label>
            <input
              type='text'
              value={location.code}
              disabled
              className='px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-sm font-mono text-zinc-400 cursor-not-allowed'
            />
          </div>

          <div className='flex items-center gap-2.5 py-1'>
            <label className='text-xs font-semibold text-zinc-500'>Status Grid:</label>
            <div className='flex items-center gap-4'>
              <label className='flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-zinc-300'>
                <input
                  type='radio'
                  name='isActive'
                  value='true'
                  checked={isActive}
                  onChange={() => setIsActive(true)}
                  className='text-indigo-600'
                  disabled={isPending}
                />
                Aktif
              </label>
              <label className='flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-zinc-300'>
                <input
                  type='radio'
                  name='isActive'
                  value='false'
                  checked={!isActive}
                  onChange={() => setIsActive(false)}
                  className='text-indigo-600'
                  disabled={isPending}
                />
                Nonaktif (Sembunyikan dari pilihan form)
              </label>
            </div>
          </div>

          <button
            type='submit'
            disabled={isPending}
            className='w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-750 text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50'
          >
            {isPending ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className='h-4 w-4' />
                Simpan Status Grid
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}