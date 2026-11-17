import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminRequest } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - List all content assets
export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentAssets = await prisma.contentAsset.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ contentAssets });
  } catch (error) {
    console.error('Failed to fetch content assets:', error);
    return NextResponse.json({ error: 'Failed to fetch content assets' }, { status: 500 });
  }
}

// POST - Create new content asset
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const googleDriveLink = formData.get('googleDriveLink') as string;
    const thumbnailFile = formData.get('thumbnail') as File | null;

    console.log('Content asset request - title:', title, 'description:', description, 'googleDriveLink:', googleDriveLink, 'thumbnail:', !!thumbnailFile);

    if (!title || !description || !googleDriveLink) {
      return NextResponse.json({ error: 'Title, description, and Google Drive link are required' }, { status: 400 });
    }

    let thumbnailUrl = null;
    
    // Upload thumbnail to Supabase if provided
    if (thumbnailFile) {
      try {
        const fileExt = thumbnailFile.name.split('.').pop();
        const thumbnailFileName = `content-assets-thumbnails/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        console.log('Uploading thumbnail:', thumbnailFileName);
        
        const { data: thumbnailData, error: thumbnailError } = await supabase.storage
          .from('content-assets')
          .upload(thumbnailFileName, thumbnailFile);

        if (thumbnailError) {
          console.error('Thumbnail upload error:', thumbnailError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('content-assets')
            .getPublicUrl(thumbnailFileName);
          thumbnailUrl = publicUrl;
        }
      } catch (err) {
        console.error('Error uploading thumbnail:', err);
      }
    }

    const contentAsset = await prisma.contentAsset.create({
      data: {
        title,
        description,
        googleDriveLink,
        thumbnail: thumbnailUrl,
        sortOrder: 0,
      },
    });

    return NextResponse.json({ contentAsset }, { status: 201 });
  } catch (error) {
    console.error('Failed to create content asset:', error);
    return NextResponse.json({ error: 'Failed to create content asset: ' + (error as Error).message }, { status: 500 });
  }
}
