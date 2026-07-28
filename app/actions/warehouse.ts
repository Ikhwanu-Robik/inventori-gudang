'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireSession } from '@/lib/auth';
import { warehouseSchema } from '@/lib/schemas';

export type WarehouseActionResult =
  | { success: true; warehouseId?: number }
  | { success: false; error: string };

export async function saveWarehouse(formData: FormData): Promise<WarehouseActionResult> {
  try {
    const session = await requireSession();
    if (session.role !== 'admin') {
      return { success: false, error: 'Akses ditolak. Hanya Administrator yang diizinkan.' };
    }

    const name = formData.get('name')?.toString().trim() ?? '';
    const rowsRaw = formData.get('rows')?.toString().trim() ?? '4';
    const colsRaw = formData.get('cols')?.toString().trim() ?? '3';

    const rows = Number(rowsRaw);
    const cols = Number(colsRaw);

    const validated = warehouseSchema.parse({ name, rows, cols });

    const existing = await prisma.warehouse.findFirst({
      where: { name: validated.name },
    });

    if (existing) {
      return { success: false, error: `Gudang dengan nama "${validated.name}" sudah ada.` };
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name: validated.name,
        rows: validated.rows,
        cols: validated.cols,
      },
    });

    // Auto-generate grids for rows x cols
    const prefix = validated.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase() || 'G';
    const gridData = [];

    for (let r = 1; r <= validated.rows; r += 1) {
      for (let c = 1; c <= validated.cols; c += 1) {
        gridData.push({
          code: `${prefix}-R${r}-C${c}`,
          warehouseId: warehouse.id,
          row: r,
          col: c,
          isActive: true,
        });
      }
    }

    await prisma.grid.createMany({
      data: gridData,
      skipDuplicates: true,
    });

    revalidatePath('/locations');
    revalidatePath('/items/new');

    return { success: true, warehouseId: warehouse.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Data tidak valid.' };
    }
    return { success: false, error: 'Gagal menyimpan gudang.' };
  }
}

export async function deleteWarehouse(id: number): Promise<WarehouseActionResult> {
  try {
    const session = await requireSession();
    if (session.role !== 'admin') {
      return { success: false, error: 'Akses ditolak. Hanya Administrator yang diizinkan.' };
    }

    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: { grids: { select: { id: true } } },
    });

    if (!warehouse) {
      return { success: false, error: 'Gudang tidak ditemukan.' };
    }

    const gridIds = warehouse.grids.map((g) => g.id);

    if (gridIds.length > 0) {
      const stockCount = await prisma.stockBalance.count({
        where: { gridId: { in: gridIds }, quantity: { gt: 0 } },
      });

      if (stockCount > 0) {
        return {
          success: false,
          error: `Tidak dapat menghapus Gudang "${warehouse.name}". Masih ada stok barang di grid gudang ini.`,
        };
      }

      const movementCount = await prisma.stockMovement.count({
        where: {
          OR: [
            { sourceGridId: { in: gridIds } },
            { destinationGridId: { in: gridIds } },
          ],
        },
      });

      if (movementCount > 0) {
        return {
          success: false,
          error: `Tidak dapat menghapus Gudang "${warehouse.name}" karena memiliki histori transaksi mutasi stok.`,
        };
      }
    }

    await prisma.warehouse.delete({
      where: { id },
    });

    revalidatePath('/locations');
    revalidatePath('/items/new');

    return { success: true };
  } catch {
    return { success: false, error: 'Gagal menghapus gudang.' };
  }
}

export async function deleteGrid(id: number): Promise<WarehouseActionResult> {
  try {
    const session = await requireSession();
    if (session.role !== 'admin') {
      return { success: false, error: 'Akses ditolak. Hanya Administrator yang diizinkan.' };
    }

    const grid = await prisma.grid.findUnique({
      where: { id },
      select: { code: true },
    });

    if (!grid) {
      return { success: false, error: 'Grid tidak ditemukan.' };
    }

    // Aturan bisnis #13: Grid tidak dapat dihapus jika masih ada stok aktif atau memiliki histori transaksi
    const stockCount = await prisma.stockBalance.count({
      where: { gridId: id, quantity: { gt: 0 } },
    });

    if (stockCount > 0) {
      return {
        success: false,
        error: `Tidak dapat menghapus Grid ${grid.code}. Masih terdapat barang aktif yang disimpan.`,
      };
    }

    const movementCount = await prisma.stockMovement.count({
      where: {
        OR: [{ sourceGridId: id }, { destinationGridId: id }],
      },
    });

    if (movementCount > 0) {
      return {
        success: false,
        error: `Tidak dapat menghapus Grid ${grid.code} karena memiliki histori transaksi mutasi. Nonaktifkan saja grid ini.`,
      };
    }

    await prisma.grid.delete({
      where: { id },
    });

    revalidatePath('/locations');
    revalidatePath('/items/new');

    return { success: true };
  } catch {
    return { success: false, error: 'Gagal menghapus Grid.' };
  }
}

export async function toggleGridStatus(
  id: number,
  isActive: boolean,
): Promise<WarehouseActionResult> {
  try {
    const session = await requireSession();
    if (session.role !== 'admin') {
      return { success: false, error: 'Akses ditolak. Hanya Administrator yang diizinkan.' };
    }

    await prisma.grid.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath('/locations');
    revalidatePath('/items/new');

    return { success: true };
  } catch {
    return { success: false, error: 'Gagal mengubah status Grid.' };
  }
}
