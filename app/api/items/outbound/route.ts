import { NextRequest, NextResponse } from 'next/server'
import { recordOutboundMovement, RecordOutboundInput } from '@/lib/services/inventoryService'

export async function POST(request: NextRequest) {
  try {
    const body: RecordOutboundInput = await request.json()

    if (!body.itemId || !body.itemId.trim()) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      )
    }

    if (!body.blueprintId || !body.blueprintId.trim()) {
      return NextResponse.json(
        { success: false, error: 'Blueprint ID is required' },
        { status: 400 }
      )
    }

    if (
      body.xPct === undefined ||
      body.xPct < 0 ||
      body.xPct > 100 ||
      body.yPct === undefined ||
      body.yPct < 0 ||
      body.yPct > 100
    ) {
      return NextResponse.json(
        { success: false, error: 'Dispatch map coordinates (xPct, yPct) must be between 0% and 100%' },
        { status: 400 }
      )
    }

    if (body.quantity === undefined || body.quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Outbound quantity must be greater than zero' },
        { status: 400 }
      )
    }

    if (!body.unit || !body.unit.trim()) {
      return NextResponse.json(
        { success: false, error: 'Unit of quantity is required' },
        { status: 400 }
      )
    }

    const result = await recordOutboundMovement(body)
    return NextResponse.json({ success: true, data: result })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to record outbound movement'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 })
  }
}
