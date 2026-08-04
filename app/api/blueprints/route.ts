import { NextResponse } from 'next/server'
import { getAllBlueprints } from '@/lib/services/inventoryService'

export async function GET() {
  try {
    const blueprints = await getAllBlueprints()
    return NextResponse.json({ success: true, data: blueprints })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blueprints'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
