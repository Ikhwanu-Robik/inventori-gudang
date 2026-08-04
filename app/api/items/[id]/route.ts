import { NextRequest, NextResponse } from 'next/server'
import { getItemById } from '@/lib/services/inventoryService'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 })
    }

    const item = await getItemById(id)

    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: item })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch item details'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
