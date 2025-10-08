import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    if (data?.user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', data.user.id)
        .single()

      // If no profile exists, create one
      if (!profile) {
        const displayName = data.user.user_metadata?.full_name ||
                           data.user.user_metadata?.name ||
                           data.user.email?.split('@')[0] ||
                           'User'

        // Get pending username from cookie
        const cookieStore = await cookies()
        const pendingUsername = cookieStore.get('pending_username')?.value || ''

        await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            username: pendingUsername,
            name: displayName,
            bio: '',
            profile_photo: data.user.user_metadata?.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
            favorite_genres: [],
            social_links: [],
          })

        // Clear the pending username cookie
        const response = NextResponse.redirect(`${origin}/dashboard`)
        response.cookies.delete('pending_username')
        return response
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
