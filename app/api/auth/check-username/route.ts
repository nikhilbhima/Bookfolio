import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { usernameSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  // Validate username format with Zod
  const validation = usernameSchema.safeParse({ username });
  if (!validation.success) {
    return NextResponse.json({
      available: false,
      error: validation.error.errors[0].message,
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

    // Check if username exists (case-insensitive)
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .ilike('username', username)
      .maybeSingle();

    if (error) {
      console.error('[USERNAME CHECK] Database error:', error.message);
      return NextResponse.json({
        available: false,
        error: 'Failed to check username availability'
      }, { status: 500 });
    }

    const available = !data;

    return NextResponse.json({ available, username: username.toLowerCase() });
  } catch (error) {
    console.error('[USERNAME CHECK] Unexpected error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({
      available: false,
      error: 'Failed to check username'
    }, { status: 500 });
  }
}
