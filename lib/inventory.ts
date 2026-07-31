import { PinLocation } from '@/components/WarehouseBlueprint'

export interface InventoryItem {
  id: string
  itemName: string
  unit: string
  note?: string
  imagePreview?: string | null
  selectedLocation?: PinLocation[] | null
}

export const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: 'item-1',
    itemName: 'Industrial Hydraulic Pump Model-X',
    unit: 'pcs',
    note: 'High-pressure hydraulic pump for heavy machinery assembly.',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-main',
        blueprintName: 'Main Warehouse Floorplan',
        xPct: 35,
        yPct: 45,
        quantity: 8,
      },
      {
        blueprintId: 'wh-highbay',
        blueprintName: 'High-Bay Storage Facility',
        xPct: 60,
        yPct: 25,
        quantity: 4,
      },
    ],
  },
  {
    id: 'item-2',
    itemName: 'Heavy-Duty Steel Pallet Racks',
    unit: 'plt',
    note: 'Tier-3 modular structural steel storage racks.',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-highbay',
        blueprintName: 'High-Bay Storage Facility',
        xPct: 60,
        yPct: 30,
        quantity: 45,
      },
    ],
  },
  {
    id: 'item-3',
    itemName: 'Refrigerated Vaccine Storage Container',
    unit: 'boxes',
    note: 'Maintained at strictly 4°C with dual battery backups.',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-cold',
        blueprintName: 'Cold Storage Vault',
        xPct: 40,
        yPct: 55,
        quantity: 5,
      },
      {
        blueprintId: 'wh-main',
        blueprintName: 'Main Warehouse Floorplan',
        xPct: 50,
        yPct: 30,
        quantity: 3,
      },
    ],
  },
  {
    id: 'item-4',
    itemName: 'Precision Laser Sensor Unit',
    unit: 'units',
    note: 'Optical distance measurement sensors for automated guided vehicles.',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-main',
        blueprintName: 'Main Warehouse Floorplan',
        xPct: 80,
        yPct: 70,
        quantity: 120,
      },
    ],
  },
  {
    id: 'item-5',
    itemName: 'Forklift Lithium Battery Pack 48V',
    unit: 'pcs',
    note: 'Fast-charging lithium iron phosphate battery for electric forklifts.',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-highbay',
        blueprintName: 'High-Bay Storage Facility',
        xPct: 25,
        yPct: 80,
        quantity: 5,
      },
    ],
  },
  {
    id: 'item-6',
    itemName: 'Insulated Thermal Shipping Blankets',
    unit: 'meters',
    note: 'Reflective foil insulation wraps for temperature-sensitive cargo.',
    imagePreview: null,
    selectedLocation: [
      {
        blueprintId: 'wh-cold',
        blueprintName: 'Cold Storage Vault',
        xPct: 70,
        yPct: 40,
        quantity: 200,
      },
      {
        blueprintId: 'wh-highbay',
        blueprintName: 'High-Bay Storage Facility',
        xPct: 30,
        yPct: 50,
        quantity: 100,
      },
    ],
  },
]
