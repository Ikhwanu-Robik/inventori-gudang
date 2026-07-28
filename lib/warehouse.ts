export type WarehouseInfo = {
  id: number;
  name: string;
  rows: number;
  cols: number;
};

export type GridInfo = {
  id: number;
  code: string;
  warehouseId: number;
  row?: number | null;
  col?: number | null;
  isActive: boolean;
};

// Fallback mock warehouses and grids for offline/demo mode
export const mockWarehouses: (WarehouseInfo & { grids: GridInfo[] })[] = [
  {
    id: 1,
    name: 'Gudang Utama',
    rows: 4,
    cols: 3,
    grids: Array.from({ length: 12 }, (_, i) => {
      const r = Math.floor(i / 3) + 1;
      const c = (i % 3) + 1;
      return {
        id: i + 1,
        code: `G1-R${r}-C${c}`,
        warehouseId: 1,
        row: r,
        col: c,
        isActive: true,
      };
    }),
  },
  {
    id: 2,
    name: 'Gudang Cadangan',
    rows: 3,
    cols: 3,
    grids: Array.from({ length: 9 }, (_, i) => {
      const r = Math.floor(i / 3) + 1;
      const c = (i % 3) + 1;
      return {
        id: i + 13,
        code: `G2-R${r}-C${c}`,
        warehouseId: 2,
        row: r,
        col: c,
        isActive: true,
      };
    }),
  },
];
