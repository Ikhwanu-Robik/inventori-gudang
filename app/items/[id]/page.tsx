export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Boxes, ArrowLeft, History, AlertCircle, Building2 } from 'lucide-react';
import Link from 'next/link';

type BalItem = { quantity: number; grid: { code: string; warehouse?: { name: string } | null } | null };
type MoveItem = {
  id: number;
  type: string;
  quantity: number;
  createdAt: Date;
  note: string | null;
  sourceGrid: { code: string } | null;
  destinationGrid: { code: string } | null;
};
type ItemDetail = { id: number; sku: string; name: string; unit: string; stockBalances: BalItem[]; stockMovements: MoveItem[] };

const MOCK_ITEMS: Record<string, ItemDetail> = {
  '1': {
    id: 1,
    sku: 'KRS-A12',
    name: 'Kursi Kantor Ergonomis',
    unit: 'pcs',
    stockBalances: [
      { quantity: 25, grid: { code: 'G1-R1-C2', warehouse: { name: 'Gudang Utama' } } },
      { quantity: 12, grid: { code: 'G2-R1-C1', warehouse: { name: 'Gudang Cadangan' } } },
    ],
    stockMovements: [
      { id: 101, type: 'IN', quantity: 25, createdAt: new Date(Date.now() - 600000), note: 'Barang masuk dari supplier', sourceGrid: null, destinationGrid: { code: 'G1-R1-C2' } },
      { id: 102, type: 'IN', quantity: 12, createdAt: new Date(Date.now() - 3600000), note: 'Stok tambahan', sourceGrid: null, destinationGrid: { code: 'G2-R1-C1' } },
    ],
  },
};

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let item: ItemDetail | null = null;
  let dbOnline = true;

  try {
    const dbItem = await prisma.item.findUnique({
      where: { id: Number(id) },
      include: {
        stockBalances: { include: { grid: { include: { warehouse: true } } } },
        stockMovements: {
          include: { sourceGrid: true, destinationGrid: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (dbItem) {
      item = {
        id: dbItem.id,
        sku: dbItem.sku,
        name: dbItem.name,
        unit: dbItem.unit,
        stockBalances: dbItem.stockBalances.map((b) => ({
          quantity: b.quantity,
          grid: b.grid ? { code: b.grid.code, warehouse: b.grid.warehouse ? { name: b.grid.warehouse.name } : null } : null,
        })),
        stockMovements: dbItem.stockMovements.map((m) => ({
          id: m.id,
          type: m.type,
          quantity: m.quantity,
          createdAt: m.createdAt,
          note: m.note,
          sourceGrid: m.sourceGrid ? { code: m.sourceGrid.code } : null,
          destinationGrid: m.destinationGrid ? { code: m.destinationGrid.code } : null,
        })),
      };
    }
  } catch {
    dbOnline = false;
    item = MOCK_ITEMS[id] || null;
  }

  if (!item) {
    notFound();
  }

  const totalStock = item.stockBalances.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div className='flex flex-col gap-8 animate-in fade-in duration-300'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <Link href='/items' className='p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 transition-all shadow-sm'>
          <ArrowLeft className='h-4 w-4' />
        </Link>
        <div>
          <span className='font-mono text-xs font-bold text-indigo-500 uppercase tracking-wider'>{item.sku}</span>
          <h1 className='text-3xl font-extrabold tracking-tight text-white mt-0.5'>{item.name}</h1>
        </div>
      </div>

      {!dbOnline && (
        <div className='flex items-start gap-3 p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-amber-800 dark:text-amber-400 shadow-sm animate-in fade-in duration-200'>
          <AlertCircle className='h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5' />
          <div className='flex flex-col gap-0.5'>
            <span className='font-bold text-sm'>Mode Demo (Database Offline)</span>
            <span className='text-xs text-amber-700/90 dark:text-amber-400/90 leading-relaxed'>Menampilkan detail barang simulasi lokal karena koneksi database tidak terdeteksi.</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Info & Saldo */}
        <div className='lg:col-span-2 flex flex-col gap-8'>
          {/* Stock Balances */}
          <div className='bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-lg flex flex-col gap-4'>
            <h2 className='font-bold text-lg text-white flex items-center gap-2'><Boxes className='h-5 w-5 text-indigo-400' /> Saldo & Lokasi Grid Gudang</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2'>
              <div className='p-4.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between min-h-24'>
                <span className='text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Total Seluruh Stok</span>
                <span className='text-3xl font-black text-white mt-2'>{totalStock} <span className='text-sm font-medium text-zinc-400'>{item.unit}</span></span>
              </div>
              <div className='p-4.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col gap-2'>
                <span className='text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Distribusi per Gudang & Grid</span>
                <div className='flex flex-col gap-1.5 mt-1 overflow-y-auto max-h-32'>
                  {item.stockBalances.map((bal, idx) => (
                    <div key={idx} className='flex items-center justify-between text-xs font-semibold border-b border-zinc-800/40 pb-1'>
                      <div className='flex items-center gap-1.5'>
                        <Building2 className='h-3.5 w-3.5 text-indigo-400' />
                        <span className='text-zinc-300'>{bal.grid?.warehouse?.name ?? 'Gudang'}</span>
                        <span className='font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-white text-[10px]'>{bal.grid?.code}</span>
                      </div>
                      <span className='text-white font-bold'>{bal.quantity} {item.unit}</span>
                    </div>
                  ))}
                  {item.stockBalances.length === 0 && (
                    <span className='text-xs text-zinc-500 italic'>Tidak ada stok tersedia</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Mutasi */}
        <div className='bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-lg flex flex-col gap-5'>
          <h2 className='font-bold text-lg text-white flex items-center gap-2'><History className='h-5 w-5 text-indigo-400' /> Riwayat Mutasi</h2>
          <div className='flex flex-col gap-4.5 overflow-y-auto max-h-[420px] pr-1'>
            {item.stockMovements.map((move) => {
              const formattedDate = new Date(move.createdAt).toLocaleDateString('id-ID', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
              });
              return (
                <div key={move.id} className='p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/60 flex flex-col gap-2 hover:border-zinc-700 transition-all'>
                  <div className='flex items-center justify-between'>
                    <span className={'text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ' + (
                      move.type === 'IN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      move.type === 'OUT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    )}>
                      {move.type}
                    </span>
                    <span className='text-[10px] text-zinc-500 font-bold'>{formattedDate}</span>
                  </div>
                  <div className='flex items-baseline justify-between'>
                    <span className='text-xs font-semibold text-zinc-400'>
                      {move.type === 'IN' ? 'Masuk ke Grid ' + (move.destinationGrid?.code ?? '?') :
                       move.type === 'OUT' ? 'Keluar dari Grid ' + (move.sourceGrid?.code ?? '?') :
                       'Pindah: ' + (move.sourceGrid?.code ?? '?') + ' -> ' + (move.destinationGrid?.code ?? '?')}
                    </span>
                    <span className='font-bold text-xs text-white'>
                      {move.type === 'IN' ? '+' : move.type === 'OUT' ? '-' : ''}{move.quantity} {item!.unit}
                    </span>
                  </div>
                  {move.note && (
                    <span className='text-[10px] text-zinc-500 bg-zinc-900 p-2 rounded-lg italic'>{move.note}</span>
                  )}
                </div>
              );
            })}
            {item.stockMovements.length === 0 && (
              <span className='text-xs text-zinc-500 italic text-center py-6'>Belum ada riwayat mutasi</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}