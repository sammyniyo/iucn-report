import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.organization.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Organization deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete organization' }, { status: 500 });
  }
}
