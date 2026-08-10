'use client'

import React from 'react'
import { PinLocation } from './WarehouseBlueprint'
import Image from 'next/image'
import Link from 'next/link'

export interface InventoryItem {
  id: string
  itemName: string
  unit: string
  imagePreview?: string | null
  selectedLocation?: PinLocation[] | null
}

interface ItemCardProps {
  item: InventoryItem
}

export default function ItemCard({ item }: ItemCardProps) {
  const totalQuantity = item.selectedLocation?.reduce((acc, loc) => acc + loc.quantity, 0) || 0

  return (
    <Link href={`/items/${item.id}`} className="block group">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden shadow-md dark:shadow-xl hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-200 flex flex-col h-full">
        {/* Item Image / Thumbnail Container */}
        <div className="relative w-full h-48 sm:h-52 bg-slate-100 dark:bg-slate-950 overflow-hidden border-b border-slate-200 dark:border-slate-800/80">
          {item.imagePreview ? (
            <Image
              src={item.imagePreview}
              alt={item.itemName}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950/80 text-slate-400 dark:text-slate-600">
              <svg
                className="w-12 h-12 mb-2 text-slate-400 dark:text-slate-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs text-slate-500 dark:text-slate-500">No Image</span>
            </div>
          )}
          <div className="absolute top-3 right-3 rounded-lg bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm">
            {totalQuantity} {item.unit}
          </div>
        </div>

        {/* Item Details */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
              {item.itemName}
            </h3>
            {item.selectedLocation?.[0]?.note && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
                {item.selectedLocation[0].note}
              </p>
            )}
          </div>

          {/* Location Info */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate max-w-[180px]">
                {item.selectedLocation && item.selectedLocation.length > 0
                  ? item.selectedLocation.length === 1
                    ? item.selectedLocation[0].blueprintName
                    : `${item.selectedLocation[0].blueprintName} (+${item.selectedLocation.length - 1} more)`
                  : 'Unassigned Location'}
              </span>
            </div>
            {item.selectedLocation && item.selectedLocation.length > 0 && (
              <span className="font-mono text-[10px] bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 px-2 py-0.5 rounded">
                {item.selectedLocation.length} zone{item.selectedLocation.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

