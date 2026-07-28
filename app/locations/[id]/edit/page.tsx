export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import EditLocationForm from './edit-form';
import { requireSession } from '@/lib/auth';

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  if (session.role !== 'admin') {
    redirect('/');
  }

  const { id } = await params;
  const gridId = Number(id);

  if (isNaN(gridId)) {
    notFound();
  }

  const grid = await prisma.grid.findUnique({
    where: { id: gridId },
  });

  if (!grid) {
    notFound();
  }

  return (
    <EditLocationForm
      location={{
        id: grid.id,
        code: grid.code,
        name: `Grid ${grid.code}`,
        xPercent: null,
        yPercent: null,
        isActive: grid.isActive,
      }}
    />
  );
}
