import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to check admin authentication
async function checkAdminAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');
  if (sessionCookie) {
    const admin = await prisma.admin.findUnique({
      where: { id: sessionCookie.value },
    });
    if (admin) {
      return admin;
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdminAuth(request);

    if (!admin) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const products = await prisma.masterProduct.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Error fetching master products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await checkAdminAuth(request);

    if (!admin) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const subCategory = formData.get('subCategory') as string | null;
    const granularCategory = formData.get('granularCategory') as string | null;
    const price = parseInt(formData.get('price') as string);
    const thumbnailFile = formData.get('thumbnail') as File;
    const shopeeLink = formData.get('shopeeLink') as string | null;
    const tiktokLink = formData.get('tiktokLink') as string | null;
    const assets = formData.getAll('assets') as File[];
    const videoUrl = formData.get('videoUrl') as string | null;
    const assetType = formData.get('assetType') as string | null;

    if (!title || !price || !thumbnailFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!shopeeLink && !tiktokLink) {
      return NextResponse.json(
        { error: 'At least one platform link (Shopee or TikTok) is required' },
        { status: 400 }
      );
    }

    // Upload thumbnail to Supabase Storage
    const thumbnailExt = thumbnailFile.name.split('.').pop();
    const thumbnailFileName = `thumbnails/${Date.now()}-${Math.random().toString(36).substring(7)}.${thumbnailExt}`;
    const { data: thumbnailData, error: thumbnailError } = await supabase.storage
      .from('content-assets')
      .upload(thumbnailFileName, thumbnailFile);

    if (thumbnailError) {
      console.error('Thumbnail upload error:', thumbnailError);
      return NextResponse.json(
        { error: 'Failed to upload thumbnail' },
        { status: 500 }
      );
    }

    const { data: { publicUrl: thumbnailUrl } } = supabase.storage
      .from('content-assets')
      .getPublicUrl(thumbnailFileName);

    // Handle content assets (upload to Supabase Storage)
    const contentUrl: any = [];
    if (assets && assets.length > 0) {
      for (const file of assets) {
        const fileExt = file.name.split('.').pop();
        const assetFileName = `assets/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: assetData, error: assetError } = await supabase.storage
          .from('content-assets')
          .upload(assetFileName, file);

        if (assetError) {
          console.error('Asset upload error:', assetError);
          continue; // Skip failed uploads but continue with others
        }

        const { data: { publicUrl: assetUrl } } = supabase.storage
          .from('content-assets')
          .getPublicUrl(assetFileName);

        contentUrl.push({
          url: assetUrl,
          name: file.name,
        });
      }
    }

    const product = await prisma.masterProduct.create({
      data: {
        title,
        description: description || null,
        category: category || null,
        subCategory: subCategory || null,
        granularCategory: granularCategory || null,
        price,
        thumbnail: thumbnailUrl,
        shopeeLink: shopeeLink || null,
        tiktokLink: tiktokLink || null,
        contentUrl: contentUrl.length > 0 ? contentUrl : null,
        videoUrl: videoUrl || null,
        assetType: assetType || 'image',
      },
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error creating master product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await checkAdminAuth(request);

    if (!admin) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const subCategory = formData.get('subCategory') as string | null;
    const granularCategory = formData.get('granularCategory') as string | null;
    const price = parseInt(formData.get('price') as string);
    const thumbnailFile = formData.get('thumbnail') as File | null;
    const shopeeLink = formData.get('shopeeLink') as string | null;
    const tiktokLink = formData.get('tiktokLink') as string | null;
    const assets = formData.getAll('assets') as File[];
    const videoUrl = formData.get('videoUrl') as string | null;
    const assetType = formData.get('assetType') as string | null;

    if (!id || !title || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get existing product
    const existingProduct = await prisma.masterProduct.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Handle thumbnail upload if provided
    let thumbnailUrl = existingProduct.thumbnail;
    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbnailExt = thumbnailFile.name.split('.').pop();
      const thumbnailFileName = `thumbnails/${Date.now()}-${Math.random().toString(36).substring(7)}.${thumbnailExt}`;
      const { data: thumbnailData, error: thumbnailError } = await supabase.storage
        .from('content-assets')
        .upload(thumbnailFileName, thumbnailFile);

      if (thumbnailError) {
        console.error('Thumbnail upload error:', thumbnailError);
        return NextResponse.json(
          { error: 'Failed to upload thumbnail' },
          { status: 500 }
        );
      }

      const { data: { publicUrl } } = supabase.storage
        .from('content-assets')
        .getPublicUrl(thumbnailFileName);
      thumbnailUrl = publicUrl;
    }

    // Handle content assets if provided
    let contentUrl = existingProduct.contentUrl;
    if (assets && assets.length > 0 && assets[0].size > 0) {
      contentUrl = [];
      for (const file of assets) {
        const fileExt = file.name.split('.').pop();
        const assetFileName = `assets/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: assetData, error: assetError } = await supabase.storage
          .from('content-assets')
          .upload(assetFileName, file);

        if (assetError) {
          console.error('Asset upload error:', assetError);
          continue;
        }

        const { data: { publicUrl: assetUrl } } = supabase.storage
          .from('content-assets')
          .getPublicUrl(assetFileName);

        contentUrl.push({
          url: assetUrl,
          name: file.name,
        });
      }
    }

    const product = await prisma.masterProduct.update({
      where: { id },
      data: {
        title,
        description: description || null,
        category: category || null,
        subCategory: subCategory || null,
        granularCategory: granularCategory || null,
        price,
        thumbnail: thumbnailUrl,
        shopeeLink: shopeeLink || null,
        tiktokLink: tiktokLink || null,
        contentUrl: contentUrl && Array.isArray(contentUrl) && contentUrl.length > 0 ? contentUrl as any : null,
        videoUrl: videoUrl || existingProduct.videoUrl,
        assetType: assetType || existingProduct.assetType,
      },
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error updating master product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await checkAdminAuth(request);

    if (!admin) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await prisma.masterProduct.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting master product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
