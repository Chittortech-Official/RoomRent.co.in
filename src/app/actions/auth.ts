'use server';

import { createClient } from '@supabase/supabase-js';

// We create a privileged Supabase client that bypasses RLS
// to update the user's role immediately after signup.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function promoteToOwner(userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'owner' })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Failed to promote user to owner:', err);
    return { success: false, error: err.message };
  }
}
