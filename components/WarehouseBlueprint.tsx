'use client'

import React, { useState, useEffect } from 'react'

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
  svgPath: string
  aspectRatio?: number
}

const FALLBACK_BLUEPRINTS: BlueprintData[] = [
  {
    id: 'gudang-joglo',
    name: 'Gudang-Joglo',
    code: 'GDG-JGL',
    description: 'Fasilitas gudang utama area Joglo dengan zona loading dock & rak barang',
    svgPath: '/blueprints/gudang-joglo.svg',
    aspectRatio: 1, // 1:1 ratio (114.968mm x 114.968mm)
  },
  {
    id: 'gudang-selatan',
    name: 'Gudang-Selatan',
    code: 'GDG-SLT',
    description: 'Fasilitas gudang cabang area Selatan dengan rak high-bay & pendingin',
    svgPath: '/blueprints/gudang-selatan.svg',
    aspectRatio: 200 / 96, // 200mm x 96mm (~2.083 ratio)
  },
]

interface Props {
  selectedLocation: PinLocation | PinLocation[] | null
  onSelectLocation?: (loc: PinLocation) => void
  displayOnly?: boolean
}

const VIEW_WIDTH = 1000
const MAX_HEIGHT_PX = 580

export default function WarehouseBlueprint({ selectedLocation, onSelectLocation, displayOnly = false }: Props) {
  const [blueprints, setBlueprints] = useState<BlueprintData[]>(FALLBACK_BLUEPRINTS)
  const [currentBlueprintIndex, setCurrentBlueprintIndex] = useState(0)

  // Fetch blueprints from database API
  useEffect(() => {
    let isMounted = true
    const fetchBlueprints = async () => {
      try {
        const res = await fetch('/api/blueprints')
        const json = await res.json()
        if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          if (isMounted) {
            setBlueprints(json.data)
          }
        }
      } catch {
        // Fallback to FALLBACK_BLUEPRINTS on network error
      }
    }
    fetchBlueprints()
    return () => {
      isMounted = false
    }
  }, [])

  const currentBlueprint = blueprints[currentBlueprintIndex] || blueprints[0] || FALLBACK_BLUEPRINTS[0]

  // Dynamic aspect ratio state (defaults to blueprint metadata or fallback 1.6)
  const [aspectRatio, setAspectRatio] = useState<number>(
    currentBlueprint?.aspectRatio || 1.6
  )

  useEffect(() => {
    let isMounted = true
    const img = new Image()
    img.src = currentBlueprint.svgPath
    img.onload = () => {
      if (!isMounted) return
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight)
      } else if (currentBlueprint.aspectRatio) {
        setAspectRatio(currentBlueprint.aspectRatio)
      }
    }
    img.onerror = () => {
      if (!isMounted) return
      if (currentBlueprint.aspectRatio) {
        setAspectRatio(currentBlueprint.aspectRatio)
      }
    }
    return () => {
      isMounted = false
    }
  }, [currentBlueprint.svgPath, currentBlueprint.aspectRatio])

  const viewHeight = Math.round(VIEW_WIDTH / aspectRatio)

  const locations = Array.isArray(selectedLocation)
    ? selectedLocation
    : selectedLocation
      ? [selectedLocation]
      : []

  const handleSwitchBlueprint = () => {
    setCurrentBlueprintIndex((prev) => (prev + 1) % blueprints.length)
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
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/80 p-5 backdrop-blur-md shadow-lg dark:shadow-xl text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header & Switch Blueprint Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-wide">
              {currentBlueprint.name}
            </h3>
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {currentBlueprint.code}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentBlueprint.description}</p>
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
        {blueprints.map((bp, idx) => {
          const isActive = idx === currentBlueprintIndex
          return (
            <button
              key={bp.id}
              type="button"
              onClick={() => setCurrentBlueprintIndex(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-200 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {bp.name}
            </button>
          )
        })}
      </div>

      {/* Interactive SVG Warehouse Blueprint Canvas */}
      <div className="w-full flex justify-center">
        <div 
          className={`relative w-full rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden select-none flex items-center justify-center ${displayOnly ? 'cursor-default' : 'cursor-crosshair'}`}
          style={{
            aspectRatio: `${aspectRatio}`,
            maxHeight: `${MAX_HEIGHT_PX}px`,
            maxWidth: `min(100%, calc(${MAX_HEIGHT_PX}px * ${aspectRatio}))`,
          }}
        >
          {/* Background Blueprint Grid */}
          <div
            className="absolute inset-0 opacity-40 dark:opacity-80 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.2) 1px, transparent 1px)`,
              backgroundSize: '25px 25px',
            }}
          />

          <svg
            className="w-full h-full block"
            viewBox={`0 0 ${VIEW_WIDTH} ${viewHeight}`}
            onClick={handleSvgClick}
          >
            {/* Render Blueprint SVG image matching exact view dimensions */}
            <image
              href={currentBlueprint.svgPath}
              x="0"
              y="0"
              width={VIEW_WIDTH}
              height={viewHeight}
              preserveAspectRatio="none"
            />

            {/* Selected Pin Location Markers */}
            {locations
              .filter((loc) => loc.blueprintId === currentBlueprint.id)
              .map((loc, idx) => (
                <g 
                  key={idx} 
                  transform={`translate(${(loc.xPct / 100) * VIEW_WIDTH}, ${(loc.yPct / 100) * viewHeight})`}
                >
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
        </div>
      </div>

      {/* Selected Location Coordinate Feedback */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-3 w-3 rounded-full bg-pink-500 flex-shrink-0 animate-pulse" />
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Selected Map Coordinate</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {locations.length > 0
                ? locations.map((l) => `${l.blueprintName} (Qty: ${l.quantity})`).join(', ')
                : 'No point selected yet'}
            </span>
          </div>
        </div>
        {locations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {locations.map((l, i) => (
              <span key={i} className="text-xs font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700/60 px-2.5 py-1 rounded-md">
                {l.blueprintId}: {l.xPct}%, {l.yPct}% (Qty: {l.quantity}){l.note ? (', ' + l.note) : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

