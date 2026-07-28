'use server';

import { prisma } from '@/lib/prisma';
import { mockWarehouses } from '@/lib/warehouse';

export async function getActiveCategories(): Promise<Array<{ code: string; name: string }>> {
  try {
    return await prisma.itemCategory.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
      select: { code: true, name: true },
    });
  } catch {
    return [
      { code: 'KRS', name: 'Kursi' },
      { code: 'MJA', name: 'Meja' },
      { code: 'LMP', name: 'Lampu' },
      { code: 'ALT', name: 'Alat Kantor' },
    ];
  }
}

export async function getActiveWarehousesWithGrids(): Promise<
  Array<{
    id: number;
    name: string;
    rows: number;
    cols: number;
    grids: Array<{ id: number; code: string; row?: number | null; col?: number | null; isActive: boolean }>;
  }>
> {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        grids: {
          where: { isActive: true },
          orderBy: [{ row: 'asc' }, { col: 'asc' }, { code: 'asc' }],
          select: { id: true, code: true, row: true, col: true, isActive: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    if (warehouses.length > 0) return warehouses;
    return mockWarehouses;
  } catch {
    return mockWarehouses;
  }
}

export async function getActiveLocations(): Promise<
  Array<{ code: string; name: string; xPercent: number | null; yPercent: number | null; isActive: boolean }>
> {
  try {
    const grids = await prisma.grid.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
      select: { code: true, isActive: true },
    });

    return grids.map((g) => ({
      code: g.code,
      name: `Grid ${g.code}`,
      xPercent: null,
      yPercent: null,
      isActive: g.isActive,
    }));
  } catch {
    return mockWarehouses[0].grids.map((g) => ({
      code: g.code,
      name: `Grid ${g.code}`,
      xPercent: null,
      yPercent: null,
      isActive: g.isActive,
    }));
  }
}

export async function generateNextSku(categoryCode: string): Promise<string> {
  try {
    const prefix = categoryCode.toUpperCase();
    const lastItem = await prisma.item.findFirst({
      where: { sku: { startsWith: prefix + '-' } },
      orderBy: { sku: 'desc' },
      select: { sku: true },
    });

    if (!lastItem) {
      return `${prefix}-001`;
    }

    const match = lastItem.sku.match(/^[A-Z]+-(\d+)$/);
    if (!match) {
      return `${prefix}-001`;
    }

    const nextNumber = parseInt(match[1], 10) + 1;
    return `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
  } catch {
    return `${categoryCode.toUpperCase()}-001`;
  }
}
