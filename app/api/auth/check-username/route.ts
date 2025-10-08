import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

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
    const supabase = await createClient();

    // Check if username exists (case-insensitive)
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .ilike('username', username)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found (username is available)
      console.error('Error checking username:', error);
      return NextResponse.json({ error: 'Failed to check username availability' }, { status: 500 });
    }

    const available = !data;

    return NextResponse.json({ available, username: username.toLowerCase() });
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json({ error: 'Failed to check username' }, { status: 500 });
  }
}
