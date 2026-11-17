import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Get order
    const order = await prisma.templateOrder.findUnique({
      where: { id: params.id },
      include: { userTemplate: { include: { masterTemplate: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order belongs to user
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Verify order status
    if (order.status !== 'verified') {
      return NextResponse.json(
        { error: 'Order not verified' },
        { status: 400 }
      );
    }

    // Check if download expired
    if (order.downloadExpireAt && new Date() > order.downloadExpireAt) {
      return NextResponse.json(
        { error: 'Download link expired' },
        { status: 400 }
      );
    }

    // Check download limit
    if (order.downloadCount >= 3) {
      return NextResponse.json(
        { error: 'Download limit exceeded' },
        { status: 400 }
      );
    }

    // Increment download count
    await prisma.templateOrder.update({
      where: { id: params.id },
      data: { downloadCount: order.downloadCount + 1 },
    });

    // Return download URL
    return NextResponse.json({ downloadUrl: order.userTemplate.masterTemplate.downloadUrl });
  } catch (error) {
    console.error('Error downloading template:', error);
    return NextResponse.json(
      { error: 'Failed to download template' },
      { status: 500 }
    );
  }
}
