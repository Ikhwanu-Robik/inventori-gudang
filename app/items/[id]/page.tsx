import { getItemById } from '@/lib/services/inventoryService'
import ItemDetailsClient from '@/components/ItemDetailsClient'
import { notFound } from 'next/navigation'

interface ItemDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function ItemDetailsPage({ params }: ItemDetailsPageProps) {
  const resolvedParams = await params
  const item = await getItemById(resolvedParams.id)

  if (!item) {
    notFound()
  }

  return <ItemDetailsClient item={item} />
}
