import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  // Validate username format
  const usernameRegex = /^[a-z0-9_-]{3,20}$/;
  if (!usernameRegex.test(username.toLowerCase())) {
    return NextResponse.json({
      available: false,
      error: 'Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens',
    }, { status: 400 });
  }

  try {
    // Use service role key to bypass RLS policies for username checking
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('[USERNAME CHECK] Checking username:', username);
    console.log('[USERNAME CHECK] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    // Check if username exists (case-insensitive)
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .ilike('username', username)
      .maybeSingle();

    console.log('[USERNAME CHECK] Query result - data:', data, 'error:', error);

    if (error) {
      console.error('[USERNAME CHECK] Database error:', JSON.stringify(error));
      return NextResponse.json({
        available: false,
        error: 'Failed to check username availability',
        debug: error.message
      }, { status: 500 });
    }

    const available = !data;
    console.log('[USERNAME CHECK] Username available:', available);

    return NextResponse.json({ available, username: username.toLowerCase() });
  } catch (error) {
    console.error('[USERNAME CHECK] Unexpected error:', error);
    return NextResponse.json({
      available: false,
      error: 'Failed to check username',
      debug: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
