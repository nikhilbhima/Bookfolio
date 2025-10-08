import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Username/email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if identifier is an email
    const isEmail = identifier.includes('@');

    let email = identifier;

    // If it's a username, get the associated email
    if (!isEmail) {
      // Get user_id from username
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .ilike('username', identifier)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'Username not found' },
          { status: 404 }
        );
      }

      // Get email from user_id
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

      if (usersError) {
        return NextResponse.json(
          { error: 'Failed to retrieve user information' },
          { status: 500 }
        );
      }

      const user = users?.find(u => u.id === profile.user_id);

      if (!user?.email) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 404 }
        );
      }

      email = user.email;
    }

    // Attempt login with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
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
