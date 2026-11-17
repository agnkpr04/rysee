import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, id, avatar_url, source, eliteBadgeColor, username } = body;

    console.log(`[AUTH POST] Received request:`, { id, email, name, avatar_url: !!avatar_url, source, eliteBadgeColor, username });

    // Validasi data input
    if (!id || !email) {
      console.error(`[AUTH POST] Validation failed: missing id or email`);
      return NextResponse.json({ error: 'ID and Email are required' }, { status: 400 });
    }

    console.log(`[AUTH POST] Processing user: ${email} with ID: ${id}`);

    // 1. Cek apakah USER dengan ID ini sudah ada
    let user = await prisma.user.findUnique({
      where: { id: id }
    });

    console.log(`[AUTH POST] User found by ID:`, !!user);

    // 2. Jika user sudah ada, update avatar_url, name, username, dan eliteBadgeColor berdasarkan source
    if (user && (avatar_url || eliteBadgeColor || name || username)) {
      // Dari settings page: selalu update database (sync dari Supabase auth ke database)
      // Dari auth callback: sync username jika belum ada di database
      // Dari auth lain: JANGAN update database (preserve database sebagai source of truth)
      const shouldUpdate = source === 'settings' || (source === 'auth_callback' && username);

      if (shouldUpdate) {
        console.log(`[AUTH POST] Updating avatar_url/storeLogo/name/username/eliteBadgeColor for existing user (source: ${source})`);
        const updateData: any = {};
        if (avatar_url) {
          updateData.avatar_url = avatar_url;
          updateData.storeLogo = avatar_url; // Sync storeLogo for ranking page
        }
        if (name) updateData.name = name;
        if (eliteBadgeColor) updateData.eliteBadgeColor = eliteBadgeColor;
        if (username !== undefined) updateData.username = username;

        user = await prisma.user.update({
          where: { id: id },
          data: updateData
        });

        // Sync username to Supabase Auth metadata if source is 'settings' and username is provided
        if (source === 'settings' && username) {
          try {
            const supabase = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
            );
            // Get the user by ID to get their email for auth update
            const { data: { users } } = await supabase.auth.admin.listUsers();
            const authUser = users.find(u => u.id === id);
            if (authUser) {
              await supabase.auth.admin.updateUserById(id, {
                user_metadata: {
                  ...authUser.user_metadata,
                  username: username,
                },
              });
              console.log(`[AUTH POST] Synced username to Supabase Auth metadata:`, username);
            }
          } catch (supabaseError) {
            console.error(`[AUTH POST] Failed to sync username to Supabase Auth:`, supabaseError);
            // Don't fail the request if Supabase Auth sync fails
          }
        }
      } else {
        console.log(`[AUTH POST] Preserving database avatar_url/name/username/eliteBadgeColor (source: ${source})`);
      }
    }

    // 3. Jika ID tidak ada, cek apakah EMAIL sudah ada (Kasus migrasi ID lama ke baru)
    if (!user) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email }
      });

      console.log(`[AUTH POST] User found by email:`, !!existingEmail);

      if (existingEmail) {
        console.log(`[AUTH POST] Found email match, updating ID to ${id}`);
        // Update ID lama menjadi ID baru dari Supabase, plus avatar_url if provided
        user = await prisma.user.update({
          where: { email: email },
          data: { 
            id: id,
            ...(avatar_url && { avatar_url: avatar_url })
          }
        });
        console.log(`[AUTH POST] Successfully updated user ID`);
      }
    }

    // 3. Jika benar-benar belum ada, CREATE USER BARU
    if (!user) {
      console.log(`[AUTH POST] Creating new user record for ${email}`);
      const defaultName = name || email.split('@')[0];
      const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 16);
      const autoUsername = username || (base + id.replace(/-/g, '').slice(0, 4));
      
      try {
        user = await prisma.user.create({
          data: {
            id: id,
            email: email,
            name: defaultName,
            storeName: defaultName,
            ...(avatar_url && { avatar_url: avatar_url }),
            username: autoUsername,
          },
        });
        console.log(`[AUTH POST] Successfully created new user:`, user.id);
      } catch (createError: any) {
        console.error(`[AUTH POST] Error creating user:`, createError);
        throw createError;
      }
    }

    console.log(`[AUTH POST] User sync complete:`, user.id);
    return NextResponse.json({ success: true, user });

  } catch (error: any) {
    console.error('[AUTH POST] ERROR:', error);
    console.error('[AUTH POST] Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    });
    
    // Tangani error unik Prisma (P2002) agar tidak 500
    if (error.code === 'P2002') {
       console.error('[AUTH POST] Duplicate key error');
       return NextResponse.json({ error: 'User with this identity already exists' }, { status: 409 });
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const username = searchParams.get('username');
    const identifier = id || email || username;

    if (!identifier) {
      return NextResponse.json({ error: 'Identifier required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier },
          { username: identifier }
        ]
      },
      include: {
        userProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user's subscription plan
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    let userPlan = 'free';
    let isPremium = false;

    if (subscription) {
      const isActive = subscription.status === 'active';

      if (isActive) {
        userPlan = subscription.plan;
        isPremium = userPlan === 'premium';
      }
    }

    return NextResponse.json({ success: true, user, userPlan, isPremium });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
