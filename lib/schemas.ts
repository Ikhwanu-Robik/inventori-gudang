import { z } from 'zod';

export const itemSchema = z.object({
  sku: z
    .string()
    .min(3, 'SKU minimal 3 karakter')
    .max(50, 'SKU maksimal 50 karakter')
    .regex(/^[A-Za-z0-9_-]+$/, 'SKU hanya boleh huruf, angka, dash, dan underscore'),
  name: z.string().min(1, 'Nama barang tidak boleh kosong').max(255, 'Nama barang terlalu panjang'),
  unit: z.string().min(1, 'Satuan barang tidak boleh kosong').max(50, 'Satuan terlalu panjang'),
  isActive: z.boolean().default(true),
});

export const warehouseSchema = z.object({
  name: z.string().min(1, 'Nama gudang tidak boleh kosong').max(100, 'Nama gudang terlalu panjang'),
  rows: z.number().int().min(1, 'Jumlah baris minimal 1').max(20, 'Jumlah baris maksimal 20'),
  cols: z.number().int().min(1, 'Jumlah kolom minimal 1').max(20, 'Jumlah kolom maksimal 20'),
});

export const gridSchema = z.object({
  code: z
    .string()
    .min(2, 'Kode grid minimal 2 karakter')
    .max(50, 'Kode grid maksimal 50 karakter')
    .regex(/^[A-Za-z0-9_-]+$/, 'Kode grid hanya boleh huruf, angka, dash, dan underscore'),
  warehouseId: z.number().int().positive('ID gudang harus valid'),
  row: z.number().int().positive().optional(),
  col: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
});

export const stockMovementSchema = z.object({
  itemId: z.number().int().positive('ID barang harus valid'),
  type: z.enum(['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT']),
  quantity: z.number().int().positive('Kuantitas harus berupa angka positif lebih dari nol'),
  sourceGridId: z.number().int().positive().optional(),
  destinationGridId: z.number().int().positive().optional(),
  note: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
  createdById: z.number().int().positive('ID pembuat harus valid'),
});