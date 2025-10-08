import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    console.error('[AUTH CALLBACK] No code provided')
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const cookieStore = await cookies()

    // Create Supabase client for session management
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Exchange code for session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError || !sessionData?.user) {
      console.error('[AUTH CALLBACK] Session exchange failed:', sessionError)
      return NextResponse.redirect(`${origin}/login?error=session_failed`)
    }

    const user = sessionData.user
    console.log('[AUTH CALLBACK] User authenticated:', user.id)

    // Use service role client for profile operations
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

    // Check if profile exists using maybeSingle to avoid errors
    const { data: profile, error: profileFetchError } = await adminClient
      .from('profiles')
      .select('username')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profileFetchError) {
      console.error('[AUTH CALLBACK] Profile fetch error:', profileFetchError)
    }

    // If no profile exists, create one
    if (!profile) {
      console.log('[AUTH CALLBACK] No profile found, creating new profile')

      const displayName = user.user_metadata?.full_name ||
                         user.user_metadata?.name ||
                         user.email?.split('@')[0] ||
                         'User'

      // Get pending username from cookie
      const pendingUsername = cookieStore.get('pending_username')?.value

      if (!pendingUsername) {
        console.error('[AUTH CALLBACK] No pending username found')
        return NextResponse.redirect(`${origin}/login?error=no_username`)
      }

      // Create profile
      const { error: insertError } = await adminClient
        .from('profiles')
        .insert({
          user_id: user.id,
          username: pendingUsername.toLowerCase(),
          name: displayName,
          bio: '',
          profile_photo: user.user_metadata?.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
          favorite_genres: [],
          social_links: [],
        })

      if (insertError) {
        console.error('[AUTH CALLBACK] Profile creation error:', insertError)
        return NextResponse.redirect(`${origin}/login?error=profile_creation_failed`)
      }

      console.log('[AUTH CALLBACK] Profile created successfully')

      // Clear the pending username cookie
      cookieStore.delete('pending_username')
    }

    console.log('[AUTH CALLBACK] Redirecting to dashboard')
    return NextResponse.redirect(`${origin}/dashboard`)

  } catch (error) {
    console.error('[AUTH CALLBACK] Unexpected error:', error)
    return NextResponse.redirect(`${origin}/login?error=unexpected`)
  }
}
