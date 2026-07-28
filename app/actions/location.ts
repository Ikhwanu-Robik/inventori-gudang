'use server';

import {
  saveWarehouse,
  deleteGrid,
  toggleGridStatus,
  deleteWarehouse,
  type WarehouseActionResult,
} from './warehouse';

export type LocationActionResult = WarehouseActionResult;

export { saveWarehouse as saveLocation };
export { deleteGrid as deleteLocation };
export { toggleGridStatus as toggleLocationStatus };
export { deleteWarehouse };
