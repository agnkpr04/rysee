import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { canUserDownload } from '@/lib/membership';
import { getSessionFromRequest } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Get session from Authorization header
    const session = await getSessionFromRequest(request);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { assetUrl } = body;

    if (!assetUrl) {
      return NextResponse.json({ error: 'Asset URL is required' }, { status: 400 });
    }

    // Get user from database by email (consistent with user-products route)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, downloadCount: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;
    const currentDownloadCount = user.downloadCount || 0;

    console.log('[Download API] User ID:', userId);
    console.log('[Download API] Current download count:', currentDownloadCount);

    // Validate download limit
    const { canDownload, reason } = await canUserDownload(userId, currentDownloadCount);
    console.log('[Download API] Can download:', canDownload, 'Reason:', reason);
    
    if (!canDownload) {
      return NextResponse.json({ error: reason }, { status: 403 });
    }

    // Detect if file is a video
    const isVideo = /\.(mp4|mov|avi|mkv|webm|flv|wmv)$/i.test(assetUrl);

    if (isVideo) {
      // For videos, use server-side force download
      console.log('[Download API] Video detected, using server-side force download');
      
      // Extract filename from URL
      const urlParts = assetUrl.split('/');
      const filename = urlParts[urlParts.length - 1] || `video-${Date.now()}.mp4`;
      
      // Fetch file from Supabase using service role key
      const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      // Extract storage path from URL
      const url = new URL(assetUrl);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
      
      if (!pathMatch) {
        console.log('[Download API] Invalid Supabase storage URL, returning direct URL');
        // Fallback to direct URL if not a Supabase storage URL
        await prisma.user.update({
          where: { id: userId },
          data: { downloadCount: { increment: 1 } },
        } as any);
        return NextResponse.json({ downloadUrl: assetUrl, message: 'Download authorized' });
      }
      
      const bucket = pathMatch[1];
      const path = pathMatch[2];
      
      console.log('[Download API] Fetching file from Supabase:', { bucket, path });
      
      // Download file from Supabase
      const { data: fileData, error: downloadError } = await supabaseService.storage
        .from(bucket)
        .download(path);
      
      if (downloadError || !fileData) {
        console.error('[Download API] Error downloading from Supabase:', downloadError);
        // Fallback to direct URL if download fails
        await prisma.user.update({
          where: { id: userId },
          data: { downloadCount: { increment: 1 } },
        } as any);
        return NextResponse.json({ downloadUrl: assetUrl, message: 'Download authorized' });
      }
      
      // Increment download count
      await prisma.user.update({
        where: { id: userId },
        data: { downloadCount: { increment: 1 } },
      } as any);
      
      // Return file with Content-Disposition header to force download
      return new NextResponse(fileData, {
        headers: {
          'Content-Type': fileData.type || 'video/mp4',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileData.size.toString(),
        },
      });
    } else {
      // For images and other files, return the asset URL directly
      console.log('[Download API] Non-video file, returning direct URL');
      
      // Increment download count
      await prisma.user.update({
        where: { id: userId },
        data: { downloadCount: { increment: 1 } },
      } as any);

      return NextResponse.json({ 
        downloadUrl: assetUrl,
        message: 'Download authorized'
      });
    }

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
