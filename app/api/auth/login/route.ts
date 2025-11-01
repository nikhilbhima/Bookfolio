import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import { loginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { identifier, password } = validation.data;

    // Check if identifier is an email
    const isEmail = identifier.includes('@');
    let email = identifier;

    // If it's a username, get the associated email
    if (!isEmail) {
      // Use service role client for username lookup
      const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

      // Get user_id from username
      const { data: profile, error: profileError } = await adminClient
        .from('profiles')
        .select('user_id')
        .ilike('username', identifier)
        .maybeSingle();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'Username not found' },
          { status: 404 }
        );
      }

      // Get email from user_id using admin client
      const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(profile.user_id);

      if (userError || !userData?.user?.email) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 404 }
        );
      }

      email = userData.user.email;
    }

    // Use the server client for login to set cookies properly
    const supabase = await createServerClient();

    // Attempt login with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Return generic error message for security (don't reveal if account exists)
      return NextResponse.json(
        { error: 'Invalid login credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Login successful',
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
