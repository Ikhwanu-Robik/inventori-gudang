'use client'

import React, { useState } from 'react'

export interface PinLocation {
  blueprintId: string
  blueprintName: string
  xPct: number
  yPct: number
  quantity: number
  note?: string
}

interface BlueprintData {
  id: string
  name: string
  code: string
  description: string
  // SVG floorplan type for rendering different SVG visual layouts
  type: 'main-complex' | 'high-bay' | 'cold-storage'
}

const BLUEPRINTS: BlueprintData[] = [
  {
    id: 'wh-main',
    name: 'Main Warehouse Floorplan',
    code: 'WH-01',
    description: 'Primary facility with loading docks, storage racks, and dispatch lanes',
    type: 'main-complex',
  },
  {
    id: 'wh-highbay',
    name: 'High-Bay Storage Facility',
    code: 'WH-02',
    description: 'Automated high-density racking and conveyor logistics area',
    type: 'high-bay',
  },
  {
    id: 'wh-cold',
    name: 'Cold Storage Vault',
    code: 'WH-COLD',
    description: 'Temperature-controlled refrigerated storage layout with airlock',
    type: 'cold-storage',
  },
]

interface Props {
  selectedLocation: PinLocation | PinLocation[] | null
  onSelectLocation?: (loc: PinLocation) => void
  displayOnly?: boolean
}

export default function WarehouseBlueprint({ selectedLocation, onSelectLocation, displayOnly = false }: Props) {
  const [currentBlueprintIndex, setCurrentBlueprintIndex] = useState(0)
  const currentBlueprint = BLUEPRINTS[currentBlueprintIndex]

  const locations = Array.isArray(selectedLocation)
    ? selectedLocation
    : selectedLocation
      ? [selectedLocation]
      : []

  const handleSwitchBlueprint = () => {
    setCurrentBlueprintIndex((prev) => (prev + 1) % BLUEPRINTS.length)
  }

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (displayOnly) return

    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    const xPct = Math.round((clickX / rect.width) * 100)
    const yPct = Math.round((clickY / rect.height) * 100)

    if (onSelectLocation) {
      onSelectLocation({
        blueprintId: currentBlueprint.id,
        blueprintName: currentBlueprint.name,
        xPct,
        yPct,
        quantity: 1,
        note: '',
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-700/60 bg-slate-900/80 p-5 backdrop-blur-md shadow-xl text-slate-100">
      {/* Top Header & Switch Blueprint Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-base font-semibold text-white tracking-wide">
              {currentBlueprint.name}
            </h3>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-400 border border-slate-700">
              {currentBlueprint.code}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{currentBlueprint.description}</p>
        </div>

        {/* Switch Warehouse Blueprint Button */}
        <button
          type="button"
          onClick={handleSwitchBlueprint}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 px-3.5 py-2 text-xs font-medium text-white transition-all duration-150 shadow-md hover:shadow-indigo-500/25 cursor-pointer"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          Switch Warehouse Blueprint
        </button>
      </div>

      {/* Blueprint Tabs */}
      <div className="flex flex-wrap gap-2">
        {BLUEPRINTS.map((bp, idx) => {
          const isActive = idx === currentBlueprintIndex
          return (
            <button
              key={bp.id}
              type="button"
              onClick={() => setCurrentBlueprintIndex(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                isActive
                  ? 'border-indigo-500 bg-indigo-950/60 text-indigo-200'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {bp.name}
            </button>
          )
        })}
      </div>

      {/* Interactive SVG Warehouse Blueprint Canvas */}
      <div className={`relative w-full aspect-[16/10] rounded-lg bg-slate-950 border border-slate-800 overflow-hidden select-none ${displayOnly ? 'cursor-default' : 'cursor-crosshair'}`}>
        {/* Background Blueprint Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.15) 1px, transparent 1px)`,
            backgroundSize: '25px 25px',
          }}
        />

        <svg
          className="w-full h-full"
          viewBox="0 0 1000 625"
          onClick={handleSvgClick}
        >
          {/* Blueprint Outer Structure Walls */}
          <rect x="20" y="20" width="960" height="585" fill="none" stroke="#475569" strokeWidth="4" rx="6" />
          <rect x="25" y="25" width="950" height="575" fill="#090d16" rx="4" />

          {/* Render Blueprint 1: Main Warehouse Complex */}
          {currentBlueprint.type === 'main-complex' && (
            <g>
              {/* Loading Docks (Top Left) */}
              <g stroke="#3b82f6" strokeWidth="1.5" fill="#1e293b">
                <rect x="40" y="35" width="80" height="40" rx="3" />
                <rect x="135" y="35" width="80" height="40" rx="3" />
                <rect x="230" y="35" width="80" height="40" rx="3" />
                <text x="80" y="60" fill="#93c5fd" fontSize="12" textAnchor="middle">DOCK 1</text>
                <text x="175" y="60" fill="#93c5fd" fontSize="12" textAnchor="middle">DOCK 2</text>
                <text x="270" y="60" fill="#93c5fd" fontSize="12" textAnchor="middle">DOCK 3</text>
              </g>

              {/* Receiving Staging Area */}
              <rect x="40" y="90" width="270" height="120" fill="#1e3a8a" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,4" rx="4" />
              <text x="175" y="155" fill="#60a5fa" fontSize="14" fontWeight="bold" textAnchor="middle">RECEIVING & STAGING</text>

              {/* Racks Block A (Middle Left) */}
              <g fill="#1e293b" stroke="#64748b" strokeWidth="1.2">
                {[120, 160, 200, 240, 280, 320].map((y, idx) => (
                  <rect key={`rack-a-${idx}`} x="40" y={y + 130} width="270" height="25" rx="2" />
                ))}
              </g>

              {/* Racks Block B (Center Right) */}
              <g fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.2">
                {[120, 160, 200, 240, 280, 320, 360, 400].map((y, idx) => (
                  <rect key={`rack-b-${idx}`} x="380" y={y + 60} width="320" height="25" rx="2" />
                ))}
              </g>

              {/* High Bay Racks (Far Right) */}
              <g fill="#1e293b" stroke="#ec4899" strokeWidth="1.2">
                {[120, 160, 200, 240, 280, 320, 360, 400].map((y, idx) => (
                  <rect key={`rack-c-${idx}`} x="740" y={y + 60} width="200" height="25" rx="2" />
                ))}
              </g>

              {/* Main Aisle Pathways (Horizontal & Vertical) */}
              <line x1="335" y1="35" x2="335" y2="590" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8,6" />
              <line x1="715" y1="35" x2="715" y2="590" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8,6" />
              <text x="335" y="315" fill="#fbbf24" fontSize="12" textAnchor="middle" transform="rotate(-90 335 315)">MAIN AISLE A</text>

              {/* Dispatch & Packing Area (Bottom Left) */}
              <rect x="40" y="490" width="270" height="95" fill="#065f46" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" rx="4" />
              <text x="175" y="542" fill="#34d399" fontSize="14" fontWeight="bold" textAnchor="middle">OUTBOUND DISPATCH</text>

              {/* Admin & Office Block (Top Right) */}
              <rect x="740" y="35" width="200" height="120" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" rx="4" />
              <text x="840" y="100" fill="#e2e8f0" fontSize="13" fontWeight="bold" textAnchor="middle">OPERATIONS OFFICE</text>
            </g>
          )}

          {/* Render Blueprint 2: High-Bay Facility */}
          {currentBlueprint.type === 'high-bay' && (
            <g>
              {/* Conveyor Track */}
              <path d="M 60 100 L 920 100 L 920 520 L 60 520 Z" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="10,6" />
              <text x="490" y="80" fill="#22d3ee" fontSize="14" fontWeight="bold" textAnchor="middle">AUTOMATED CONVEYOR LOOP</text>

              {/* ASRS Storage Racks Matrix */}
              <g fill="#0f172a" stroke="#0284c7" strokeWidth="1.5">
                {[140, 200, 260, 320, 380, 440].map((y, rIdx) => (
                  <g key={`hb-row-${rIdx}`}>
                    {[100, 260, 420, 580, 740].map((x, cIdx) => (
                      <rect key={`hb-cell-${rIdx}-${cIdx}`} x={x} y={y} width="120" height="40" rx="3" />
                    ))}
                  </g>
                ))}
              </g>

              {/* Robotic Crane Bay Lines */}
              {[230, 390, 550, 710].map((x, idx) => (
                <line key={`crane-${idx}`} x1={x} y1="130" x2={x} y2="490" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,4" />
              ))}
            </g>
          )}

          {/* Render Blueprint 3: Cold Storage Vault */}
          {currentBlueprint.type === 'cold-storage' && (
            <g>
              {/* Airlock Chamber Entrance */}
              <rect x="40" y="240" width="140" height="150" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
              <text x="110" y="320" fill="#7dd3fc" fontSize="13" fontWeight="bold" textAnchor="middle">AIRLOCK ANTEROOM</text>

              {/* Chilled Vault A (0°C to 4°C) */}
              <rect x="220" y="50" width="340" height="525" fill="#0284c7" fillOpacity="0.15" stroke="#0284c7" strokeWidth="2" rx="6" />
              <text x="390" y="90" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle" className="font-sans">CHILLED VAULT A (4°C)</text>

              {/* Chilled Storage Racks */}
              <g fill="#0f172a" stroke="#38bdf8" strokeWidth="1">
                {[130, 180, 230, 280, 330, 380, 430, 480].map((y, idx) => (
                  <rect key={`chilled-rack-${idx}`} x="250" y={y} width="280" height="30" rx="2" />
                ))}
              </g>

              {/* Deep Freeze Vault B (-20°C) */}
              <rect x="590" y="50" width="350" height="525" fill="#3b82f6" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="2.5" rx="6" />
              <text x="765" y="90" fill="#93c5fd" fontSize="16" fontWeight="bold" textAnchor="middle">DEEP FREEZE B (-20°C)</text>

              {/* Freezer Racks */}
              <g fill="#0f172a" stroke="#60a5fa" strokeWidth="1">
                {[130, 180, 230, 280, 330, 380, 430, 480].map((y, idx) => (
                  <rect key={`freezer-rack-${idx}`} x="620" y={y} width="290" height="30" rx="2" />
                ))}
              </g>
            </g>
          )}

          {/* Selected Pin Location Markers */}
          {locations
            .filter((loc) => loc.blueprintId === currentBlueprint.id)
            .map((loc, idx) => (
              <g key={idx} transform={`translate(${(loc.xPct / 100) * 1000}, ${(loc.yPct / 100) * 625})`}>
                {/* Outer Pulsing Aura */}
                <circle r="30" fill="#6366f1" fillOpacity="0.2" className="animate-ping" />
                <circle r="18" fill="#6366f1" fillOpacity="0.4" stroke="#ffffff" strokeWidth="2" />
                
                {/* Target Pin Icon */}
                <path
                  d="M 0 -18 C -8 -18 -14 -12 -14 -4 C -14 6 0 18 0 18 C 0 18 14 6 14 -4 C 14 -12 8 -18 0 -18 Z"
                  fill="#ec4899"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle cy="-4" r="5" fill="#ffffff" />

                {/* Quantity Badge */}
                <g transform="translate(0, -28)">
                  <rect x="-18" y="-12" width="36" height="20" rx="4" fill="#0f172a" stroke="#ec4899" strokeWidth="1.5" />
                  <text x="0" y="2" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Qty: {loc.quantity}</text>
                </g>
              </g>
            ))}
        </svg>

        {/* Blueprint Helper Legend */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded border border-slate-800 pointer-events-none">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            {displayOnly ? 'Warehouse location markers (Read-only view)' : 'Click anywhere on the SVG floorplan to mark location'}
          </span>
          <span className="font-mono text-slate-500">SVG Map Layout</span>
        </div>
      </div>

      {/* Selected Location Coordinate Feedback */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-3 w-3 rounded-full bg-pink-500 flex-shrink-0 animate-pulse" />
          <div>
            <span className="text-xs text-slate-400 block">Selected Map Coordinate</span>
            <span className="text-sm font-semibold text-slate-100">
              {locations.length > 0
                ? locations.map((l) => `${l.blueprintName} (Qty: ${l.quantity})`).join(', ')
                : 'No point selected yet'}
            </span>
          </div>
        </div>
        {locations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {locations.map((l, i) => (
              <span key={i} className="text-xs font-mono bg-indigo-950 text-indigo-200 border border-indigo-700/60 px-2.5 py-1 rounded-md">
                {l.blueprintId}: {l.xPct}%, {l.yPct}% (Qty: {l.quantity}){l.note ? (', ' + l.note) : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
