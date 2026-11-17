import { supabase } from '@/lib/supabase';

// Client-side auth only - no database imports
export async function getClientSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting client session:', error);
    return null;
  }
}

export async function getClientUser() {
  const session = await getClientSession();
  return session?.user || null;
}
