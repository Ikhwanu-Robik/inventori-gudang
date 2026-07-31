import { PinLocation } from '@/components/WarehouseBlueprint'

export interface InventoryItem {
  id: string
  itemName: string
  unit: string
  imagePreview?: string | null
  selectedLocation?: PinLocation[] | null
}

export const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: 'item-1',
    itemName: 'Industrial Hydraulic Pump Model-X',
    unit: 'pcs',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-main',
        blueprintName: 'Main Warehouse Floorplan',
        xPct: 35,
        yPct: 45,
        quantity: 8,
        note: 'Primary assembly batch for heavy machinery.',
      },
      {
        blueprintId: 'wh-highbay',
        blueprintName: 'High-Bay Storage Facility',
        xPct: 60,
        yPct: 25,
        quantity: 4,
        note: 'Overflow reserve stock.',
      },
    ],
  },
  {
    id: 'item-2',
    itemName: 'Heavy-Duty Steel Pallet Racks',
    unit: 'plt',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-highbay',
        blueprintName: 'High-Bay Storage Facility',
        xPct: 60,
        yPct: 30,
        quantity: 45,
        note: 'Tier-3 modular structural steel storage racks.',
      },
    ],
  },
  {
    id: 'item-3',
    itemName: 'Refrigerated Vaccine Storage Container',
    unit: 'boxes',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-cold',
        blueprintName: 'Cold Storage Vault',
        xPct: 40,
        yPct: 55,
        quantity: 5,
        note: 'Maintained at strictly 4°C with dual battery backups.',
      },
      {
        blueprintId: 'wh-main',
        blueprintName: 'Main Warehouse Floorplan',
        xPct: 50,
        yPct: 30,
        quantity: 3,
        note: 'Staging area for dispatch.',
      },
    ],
  },
  {
    id: 'item-4',
    itemName: 'Precision Laser Sensor Unit',
    unit: 'units',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-main',
        blueprintName: 'Main Warehouse Floorplan',
        xPct: 80,
        yPct: 70,
        quantity: 120,
        note: 'Optical distance measurement sensors for automated guided vehicles.',
      },
    ],
  },
  {
    id: 'item-5',
    itemName: 'Forklift Lithium Battery Pack 48V',
    unit: 'pcs',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-highbay',
        blueprintName: 'High-Bay Storage Facility',
        xPct: 25,
        yPct: 80,
        quantity: 5,
        note: 'Fast-charging lithium iron phosphate battery for electric forklifts.',
      },
    ],
  },
  {
    id: 'item-6',
    itemName: 'Insulated Thermal Shipping Blankets',
    unit: 'meters',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-cold',
        blueprintName: 'Cold Storage Vault',
        xPct: 70,
        yPct: 40,
        quantity: 200,
        note: 'Reflective foil insulation wraps for temperature-sensitive cargo.',
      },
      {
        blueprintId: 'wh-highbay',
        blueprintName: 'High-Bay Storage Facility',
        xPct: 30,
        yPct: 50,
        quantity: 100,
        note: 'Secondary staging rolls.',
      },
    ],
  },
]
