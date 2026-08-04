import { prisma } from '@/lib/prisma'
import { InventoryItem, CreateItemLocationInput } from '@/lib/inventory'

export interface CreateItemInput {
  itemName: string
  unit: string
  note?: string | null
  imageUrl?: string | null
  locations?: CreateItemLocationInput[] | null
}

export interface RecordOutboundInput {
  itemId: string
  blueprintId: string
  xPct: number
  yPct: number
  quantity: number
  unit: string
  outboundNote?: string | null
}

/**
 * Fetch all items from database with optional search filter on itemName.
 * Maps Prisma models to InventoryItem format expected by the UI.
 */
export async function getAllItems(searchQuery?: string): Promise<InventoryItem[]> {
  const items = await prisma.item.findMany({
    where: searchQuery
      ? {
          itemName: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        }
      : undefined,
    include: {
      locations: {
        include: {
          blueprint: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return items.map((item) => ({
    id: item.id,
    itemName: item.itemName,
    unit: item.unit,
    imagePreview: item.imageUrl,
    selectedLocation: item.locations.map((loc) => ({
      blueprintId: loc.blueprintId,
      blueprintName: loc.blueprint.name,
      xPct: loc.xPct,
      yPct: loc.yPct,
      quantity: loc.quantity,
      note: loc.note || undefined,
    })),
  }))
}

/**
 * Fetch a single item by ID with location allocations.
 */
export async function getItemById(id: string): Promise<InventoryItem | null> {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      locations: {
        include: {
          blueprint: true,
        },
      },
    },
  })

  if (!item) return null

  return {
    id: item.id,
    itemName: item.itemName,
    unit: item.unit,
    imagePreview: item.imageUrl,
    selectedLocation: item.locations.map((loc) => ({
      blueprintId: loc.blueprintId,
      blueprintName: loc.blueprint.name,
      xPct: loc.xPct,
      yPct: loc.yPct,
      quantity: loc.quantity,
      note: loc.note || undefined,
    })),
  }
}

/**
 * Create a new inventory item, initial locations, and log INBOUND stock movements.
 */
export async function createItem(data: CreateItemInput): Promise<InventoryItem> {
  const createdItem = await prisma.$transaction(async (tx) => {
    const item = await tx.item.create({
      data: {
        itemName: data.itemName,
        unit: data.unit || 'pcs',
        note: data.note || null,
        imageUrl: data.imageUrl || null,
        locations:
          data.locations && data.locations.length > 0
            ? {
                create: data.locations.map((loc) => ({
                  blueprintId: loc.blueprintId,
                  xPct: loc.xPct,
                  yPct: loc.yPct,
                  quantity: loc.quantity,
                  note: loc.note || null,
                })),
              }
            : undefined,
      },
      include: {
        locations: {
          include: {
            blueprint: true,
          },
        },
      },
    })

    if (item.locations.length > 0) {
      for (const loc of item.locations) {
        await tx.stockMovement.create({
          data: {
            type: 'INBOUND',
            itemId: item.id,
            itemLocationId: loc.id,
            blueprintId: loc.blueprintId,
            quantity: loc.quantity,
            unit: item.unit,
            outboundNote: data.note || 'Initial stock entry',
          },
        })
      }
    }

    return item
  })

  return {
    id: createdItem.id,
    itemName: createdItem.itemName,
    unit: createdItem.unit,
    imagePreview: createdItem.imageUrl,
    selectedLocation: createdItem.locations.map((loc) => ({
      blueprintId: loc.blueprintId,
      blueprintName: loc.blueprint.name,
      xPct: loc.xPct,
      yPct: loc.yPct,
      quantity: loc.quantity,
      note: loc.note || undefined,
    })),
  }
}

/**
 * Record outbound stock movement for a specific location marker.
 * Deducts stock from ItemLocation (retaining zero-quantity locations for tracing)
 * and creates an OUTBOUND StockMovement audit record.
 */
export async function recordOutboundMovement(data: RecordOutboundInput) {
  return await prisma.$transaction(async (tx) => {
    const targetLocation = await tx.itemLocation.findFirst({
      where: {
        itemId: data.itemId,
        blueprintId: data.blueprintId,
        xPct: data.xPct,
        yPct: data.yPct,
      },
    })

    if (!targetLocation) {
      throw new Error('Target location marker not found for this item')
    }

    if (data.quantity > targetLocation.quantity) {
      throw new Error(
        `Insufficient stock quantity. Requested: ${data.quantity}, Available: ${targetLocation.quantity}`
      )
    }

    const updatedLocation = await tx.itemLocation.update({
      where: { id: targetLocation.id },
      data: {
        quantity: targetLocation.quantity - data.quantity,
      },
    })

    const movement = await tx.stockMovement.create({
      data: {
        type: 'OUTBOUND',
        itemId: data.itemId,
        itemLocationId: targetLocation.id,
        blueprintId: data.blueprintId,
        quantity: data.quantity,
        unit: data.unit,
        outboundNote: data.outboundNote || null,
      },
    })

    return {
      success: true,
      updatedLocation,
      movement,
    }
  })
}

/**
 * Fetch all master warehouse blueprints.
 */
export async function getAllBlueprints() {
  return await prisma.warehouseBlueprint.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}
