import { INITIAL_ITEMS } from '@/lib/inventory'
import ItemDetailsClient from '@/components/ItemDetailsClient'
import { notFound } from 'next/navigation'

interface ItemDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function ItemDetailsPage({ params }: ItemDetailsPageProps) {
  const resolvedParams = await params
  const item = INITIAL_ITEMS.find((i) => i.id === resolvedParams.id)

  if (!item) {
    notFound()
  }

  return <ItemDetailsClient item={item} />
}
