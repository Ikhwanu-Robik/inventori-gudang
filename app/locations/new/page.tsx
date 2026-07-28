'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveWarehouse } from '@/app/actions/warehouse';
import { checkAdminRole } from '@/app/actions/auth';
import { ArrowLeft, Save, Loader2, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function NewWarehousePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAdminRole().then((isOk) => {
      if (!isOk) {
        router.push('/');
      } else {
        setAuthorized(true);
      }
    });
  }, [router]);

  if (!authorized) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await saveWarehouse(formData);
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
          <h1 className='text-2xl font-bold tracking-tight'>Tambah Gudang Baru</h1>
          <p className='text-xs text-zinc-500'>
            Tambahkan bangunan gudang baru beserta ukuran baris dan kolom grid
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
            <Building2 className='h-5 w-5 text-indigo-500' />
            <h2 className='font-bold text-lg text-white'>Atribut Gudang</h2>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label htmlFor='name' className='text-xs font-semibold text-zinc-400'>
              Nama Gudang
            </label>
            <input
              type='text'
              id='name'
              name='name'
              required
              placeholder='Contoh: Gudang C - Keramik & Kaca'
              maxLength={100}
              className='px-4 py-2.5 rounded-xl border border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white'
              disabled={isPending}
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='rows' className='text-xs font-semibold text-zinc-400'>
                Jumlah Baris (Rows)
              </label>
              <input
                type='number'
                id='rows'
                name='rows'
                required
                min={1}
                max={20}
                defaultValue={4}
                className='px-4 py-2.5 rounded-xl border border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white'
                disabled={isPending}
              />
              <p className='text-[10px] text-zinc-500'>Jumlah baris grid denah gudang (1-20)</p>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor='cols' className='text-xs font-semibold text-zinc-400'>
                Jumlah Kolom (Cols)
              </label>
              <input
                type='number'
                id='cols'
                name='cols'
                required
                min={1}
                max={20}
                defaultValue={3}
                className='px-4 py-2.5 rounded-xl border border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white'
                disabled={isPending}
              />
              <p className='text-[10px] text-zinc-500'>Jumlah kolom grid denah gudang (1-20)</p>
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
                Menyimpan Gudang & Membuat Grid...
              </>
            ) : (
              <>
                <Save className='h-4 w-4' />
                Simpan Gudang Baru
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
