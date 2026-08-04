import { NextRequest, NextResponse } from 'next/server'
import { getAllItems, createItem, CreateItemInput } from '@/lib/services/inventoryService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('q') || searchParams.get('search') || undefined

    const items = await getAllItems(searchQuery)
    return NextResponse.json({ success: true, data: items })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch items'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateItemInput = await request.json()

    if (!body.itemName || !body.itemName.trim()) {
      return NextResponse.json({ success: false, error: 'Item name is required' }, { status: 400 })
    }

    if (!body.unit || !body.unit.trim()) {
      return NextResponse.json({ success: false, error: 'Unit of quantity is required' }, { status: 400 })
    }

    if (!body.locations || body.locations.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one warehouse floorplan location pin must be selected' },
        { status: 400 }
      )
    }

    for (const loc of body.locations) {
      if (!loc.blueprintId) {
        return NextResponse.json(
          { success: false, error: 'Warehouse blueprint ID is required for each location pin' },
          { status: 400 }
        )
      }
      if (loc.quantity === undefined || loc.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'Location stock quantity must be greater than zero' },
          { status: 400 }
        )
      }
      if (loc.xPct < 0 || loc.xPct > 100 || loc.yPct < 0 || loc.yPct > 100) {
        return NextResponse.json(
          { success: false, error: 'Location map coordinates must be between 0% and 100%' },
          { status: 400 }
        )
      }
    }

    const newItem = await createItem(body)
    return NextResponse.json({ success: true, data: newItem }, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create item'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
