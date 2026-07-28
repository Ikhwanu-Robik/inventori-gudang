export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { Building2, Boxes, Info, AlertCircle, Plus, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { ToggleLocationButton, DeleteLocationButton } from './actions-client';
import { requireSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { mockWarehouses } from '@/lib/warehouse';

type StockItem = { quantity: number; item: { sku: string; name: string; unit: string } | null };

type GridRow = {
  id: number;
  code: string;
  row?: number | null;
  col?: number | null;
  isActive: boolean;
  stockBalancesHere: StockItem[];
};

type WarehouseRow = {
  id: number;
  name: string;
  rows: number;
  cols: number;
  grids: GridRow[];
};

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ warehouseId?: string }>;
}) {
  const session = await requireSession();
  if (session.role !== 'admin') {
    redirect('/');
  }

  const resolvedParams = await searchParams;

  let warehouses: WarehouseRow[] = [];
  let dbOnline = true;

  try {
    warehouses = (await prisma.warehouse.findMany({
      include: {
        grids: {
          include: { stockBalancesHere: { include: { item: true } } },
          orderBy: [{ row: 'asc' }, { col: 'asc' }, { code: 'asc' }],
        },
      },
      orderBy: { id: 'asc' },
    })) as WarehouseRow[];

    if (warehouses.length === 0) {
      // Auto seed default 2 warehouses if database empty
      const g1 = await prisma.warehouse.create({
        data: { name: 'Gudang Utama', rows: 4, cols: 3 },
      });
      const g2 = await prisma.warehouse.create({
        data: { name: 'Gudang Cadangan', rows: 3, cols: 3 },
      });

      for (let r = 1; r <= 4; r += 1) {
        for (let c = 1; c <= 3; c += 1) {
          await prisma.grid.create({
            data: { code: `G1-R${r}-C${c}`, warehouseId: g1.id, row: r, col: c, isActive: true },
          });
        }
      }
      for (let r = 1; r <= 3; r += 1) {
        for (let c = 1; c <= 3; c += 1) {
          await prisma.grid.create({
            data: { code: `G2-R${r}-C${c}`, warehouseId: g2.id, row: r, col: c, isActive: true },
          });
        }
      }

      warehouses = (await prisma.warehouse.findMany({
        include: {
          grids: {
            include: { stockBalancesHere: { include: { item: true } } },
            orderBy: [{ row: 'asc' }, { col: 'asc' }, { code: 'asc' }],
          },
        },
        orderBy: { id: 'asc' },
      })) as WarehouseRow[];
    }
  } catch {
    dbOnline = false;
    warehouses = mockWarehouses.map((w) => ({
      ...w,
      grids: w.grids.map((g) => ({ ...g, stockBalancesHere: [] })),
    }));
  }

  const selectedWarehouseId = resolvedParams.warehouseId
    ? Number(resolvedParams.warehouseId)
    : warehouses[0]?.id ?? 1;

  const currentWarehouse =
    warehouses.find((w) => w.id === selectedWarehouseId) ?? warehouses[0] ?? warehouses;

  return (
    <div className='flex flex-col gap-8 animate-in fade-in duration-300'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-white'>Banyak Gudang & Grid Denah</h1>
          <p className='text-zinc-400 text-sm mt-1'>
            Kelola multi-gudang dan visualisasi grid tata letak barang secara real-time
          </p>
        </div>
        <Link
          href='/locations/new'
          className='px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm hover:shadow-md transition-all'
        >
          <Plus className='h-4 w-4' />
          Tambah Gudang
        </Link>
      </div>

      {!dbOnline && (
        <div className='flex items-start gap-3 p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-amber-850 dark:text-amber-400 shadow-sm animate-in fade-in duration-200'>
          <AlertCircle className='h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5' />
          <div className='flex flex-col gap-0.5'>
            <span className='font-bold text-sm'>Mode Demo (Database Offline)</span>
            <span className='text-xs text-amber-700/90 dark:text-amber-400/90 leading-relaxed'>
              Koneksi database tidak terdeteksi. Sistem secara otomatis menggunakan mock data lokal multi-gudang.
            </span>
          </div>
        </div>
      )}

      {/* Warehouse Selector Tabs */}
      <div className='flex items-center gap-3 overflow-x-auto pb-2 border-b border-zinc-800'>
        {warehouses.map((w) => {
          const isSelected = w.id === currentWarehouse.id;
          return (
            <Link
              key={w.id}
              href={`/locations?warehouseId=${w.id}`}
              className={
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ' +
                (isSelected
                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/40 shadow-sm'
                  : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200')
              }
            >
              <Building2 className='h-4 w-4' />
              <span>{w.name}</span>
              <span className='text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md font-mono'>
                {w.rows}×{w.cols} Grid
              </span>
            </Link>
          );
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Visual Matrix Map */}
        <div className='lg:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm flex flex-col gap-5'>
          <div className='flex items-center justify-between border-b border-zinc-800 pb-3'>
            <div className='flex items-center gap-2 font-semibold text-sm'>
              <LayoutGrid className='h-4 w-4 text-indigo-500' />
              <span className='text-white'>Denah Grid {currentWarehouse.name}</span>
            </div>
            <span className='text-xs text-zinc-400 font-mono'>
              Ukuran: {currentWarehouse.rows} Baris × {currentWarehouse.cols} Kolom
            </span>
          </div>

          <div
            className='grid gap-3 w-full bg-zinc-950 p-4 rounded-xl border border-zinc-800 select-none'
            style={{
              gridTemplateColumns: `repeat(${currentWarehouse.cols}, minmax(0, 1fr))`,
            }}
          >
            {currentWarehouse.grids.map((grid) => {
              const totalItems = grid.stockBalancesHere.reduce((sum, b) => sum + b.quantity, 0);
              const hasStock = totalItems > 0;
              return (
                <div
                  key={grid.id}
                  className={
                    'p-3 rounded-xl border flex flex-col justify-between min-h-[90px] transition-all ' +
                    (!grid.isActive
                      ? 'bg-zinc-900/30 border-zinc-800/40 opacity-50'
                      : hasStock
                      ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300 shadow-sm'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700')
                  }
                >
                  <div className='flex items-center justify-between gap-1'>
                    <span className='font-mono font-bold text-xs bg-zinc-800/80 px-2 py-0.5 rounded text-white'>
                      {grid.code}
                    </span>
                    <span
                      className={
                        'text-[9px] font-bold px-1.5 py-0.5 rounded-full border ' +
                        (grid.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700')
                      }
                    >
                      {grid.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <div className='mt-2 text-xs'>
                    {hasStock ? (
                      <div className='flex flex-col gap-0.5'>
                        <span className='font-bold text-indigo-400 text-sm'>
                          {totalItems} unit
                        </span>
                        <span className='text-[10px] text-zinc-400 truncate'>
                          {grid.stockBalancesHere.map((b) => b.item?.name).filter(Boolean).join(', ')}
                        </span>
                      </div>
                    ) : (
                      <span className='text-[10px] text-zinc-600 italic'>Kosong</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grids Detail & Actions */}
        <div className='bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm flex flex-col gap-6'>
          <div className='flex items-center justify-between border-b border-zinc-800 pb-3'>
            <div className='flex items-center gap-2 font-semibold text-sm'>
              <Boxes className='h-4 w-4 text-indigo-500' />
              <span className='text-white'>Grid Gudang ({currentWarehouse.grids.length})</span>
            </div>
          </div>

          <div className='flex flex-col gap-3 flex-1 overflow-y-auto max-h-[480px] pr-1'>
            {currentWarehouse.grids.map((grid) => {
              const hasStock = grid.stockBalancesHere.length > 0;
              return (
                <div
                  key={grid.id}
                  className='p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40 flex flex-col gap-2.5 hover:border-indigo-500/30 transition-all'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='font-bold text-xs bg-zinc-800 px-2 py-0.5 rounded-md font-mono text-zinc-300'>
                        {grid.code}
                      </span>
                      <span
                        className={
                          'text-[9px] font-bold px-2 py-0.5 rounded-full border ' +
                          (grid.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-500 border-zinc-700/50')
                        }
                      >
                        {grid.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <ToggleLocationButton id={grid.id} isActive={grid.isActive} />
                      <DeleteLocationButton id={grid.id} code={grid.code} />
                    </div>
                  </div>

                  {hasStock ? (
                    <div className='flex flex-col gap-1.5 text-xs pt-1 border-t border-zinc-800/60'>
                      {grid.stockBalancesHere.map((b, i) => (
                        <div
                          key={i}
                          className='flex items-center justify-between font-medium text-zinc-400'
                        >
                          <span className='truncate max-w-32 text-zinc-300'>{b.item?.name}</span>
                          <span className='font-bold text-white shrink-0'>
                            {b.quantity} {b.item?.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className='text-[10px] text-zinc-500 italic flex items-center gap-1'>
                      <Info className='h-3 w-3 shrink-0' /> Stok kosong
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
