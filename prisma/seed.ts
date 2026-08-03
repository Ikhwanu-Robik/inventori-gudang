if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile()
  } catch {
    // Ignore error
  }
}

import { prisma } from '../lib/prisma'

const BLUEPRINTS = [
  {
    id: 'gudang-joglo',
    name: 'Gudang-Joglo',
    code: 'GDG-JGL',
    description: 'Fasilitas gudang utama area Joglo dengan zona loading dock & rak barang',
    svgPath: '/blueprints/gudang-joglo.svg',
  },
  {
    id: 'gudang-selatan',
    name: 'Gudang-Selatan',
    code: 'GDG-SLT',
    description: 'Fasilitas gudang cabang area Selatan dengan rak high-bay & pendingin',
    svgPath: '/blueprints/gudang-selatan.svg',
  },
]

const INITIAL_ITEMS_SEED = [
  {
    id: 'item-1',
    itemName: 'Industrial Hydraulic Pump Model-X',
    unit: 'pcs',
    imageUrl: null,
    locations: [
      {
        blueprintId: 'gudang-joglo',
        xPct: 35,
        yPct: 45,
        quantity: 8,
        note: 'Primary assembly batch for heavy machinery.',
      },
      {
        blueprintId: 'gudang-selatan',
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
    imageUrl: null,
    locations: [
      {
        blueprintId: 'gudang-selatan',
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
    imageUrl: null,
    locations: [
      {
        blueprintId: 'gudang-selatan',
        xPct: 40,
        yPct: 55,
        quantity: 5,
        note: 'Maintained at strictly 4°C with dual battery backups.',
      },
      {
        blueprintId: 'gudang-joglo',
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
    imageUrl: null,
    locations: [
      {
        blueprintId: 'gudang-joglo',
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
    imageUrl: null,
    locations: [
      {
        blueprintId: 'gudang-selatan',
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
    imageUrl: null,
    locations: [
      {
        blueprintId: 'gudang-selatan',
        xPct: 70,
        yPct: 40,
        quantity: 200,
        note: 'Reflective foil insulation wraps for temperature-sensitive cargo.',
      },
      {
        blueprintId: 'gudang-selatan',
        xPct: 30,
        yPct: 50,
        quantity: 100,
        note: 'Secondary staging rolls.',
      },
    ],
  },
]

async function main() {
  console.log('Seeding warehouse blueprints...')
  for (const bp of BLUEPRINTS) {
    await prisma.warehouseBlueprint.upsert({
      where: { id: bp.id },
      update: bp,
      create: bp,
    })
  }

  console.log('Seeding initial inventory items and locations...')
  for (const item of INITIAL_ITEMS_SEED) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: {
        itemName: item.itemName,
        unit: item.unit,
        imageUrl: item.imageUrl,
      },
      create: {
        id: item.id,
        itemName: item.itemName,
        unit: item.unit,
        imageUrl: item.imageUrl,
        locations: {
          create: item.locations.map((loc) => ({
            blueprintId: loc.blueprintId,
            xPct: loc.xPct,
            yPct: loc.yPct,
            quantity: loc.quantity,
            note: loc.note,
          })),
        },
      },
    })
  }

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
