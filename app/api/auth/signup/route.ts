import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import { signupSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, username } = validation.data;

    // Use service role client for username check and profile creation
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

    // Check if username is already taken
    const { data: existingProfile } = await adminClient
      .from('profiles')
      .select('username')
      .ilike('username', username)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      );
    }

    // Use server client for auth signup to set cookies properly
    const supabase = await createServerClient();

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
        data: {
          username: username.toLowerCase(),
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create profile with username using admin client
    const { error: profileError } = await adminClient
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        username: username.toLowerCase(),
        name: '',
        bio: '',
        profile_photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        favorite_genres: [],
        social_links: [],
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // User was created but profile failed - they can try logging in
      return NextResponse.json(
        { error: 'Account created but profile setup failed. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Signup successful! Please check your email to verify your account.',
      user: authData.user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
