import { prisma } from '@repo/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { slug, adminId } = await request.json();

  const room = await prisma.room.create({
    data: {
      slug,
      adminId,
    },
  });

  return NextResponse.json(room);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Room slug is required' }, { status: 400 });
  }

  const room = await prisma.room.findUnique({
    where: { slug },
  });

  return NextResponse.json(room);
}
  