import { supabase } from './supabase';
import { Book, UserProfile, SocialLink } from './mock-data';
import { getCurrentUserId } from './auth';

// Profile operations
export async function getProfile(userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('No user ID provided and no authenticated user');
      return null;
    }
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  // Handle both old object format and new array format for socialLinks
  let socialLinks: SocialLink[] = [];

  if (data.social_links) {
    // If it's an old object format, convert to array
    if (!Array.isArray(data.social_links) && typeof data.social_links === 'object') {
      socialLinks = Object.entries(data.social_links)
        .filter(([, value]) => value)
        .map(([platform, value], index) => ({
          id: `${Date.now()}-${index}`,
          platform,
          value: value as string,
        }));
    } else if (Array.isArray(data.social_links)) {
      socialLinks = data.social_links;
    }
  }

  return {
    username: data.username,
    name: data.name || '',
    bio: data.bio || '',
    favoriteGenres: data.favorite_genres || [],
    profilePhoto: data.profile_photo || '',
    socialLinks: socialLinks,
  } as UserProfile;
}

export async function updateProfile(updates: Partial<UserProfile>, userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('No user ID provided and no authenticated user');
      return null;
    }
  }
  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: updates.username,
      name: updates.name,
      bio: updates.bio,
      profile_photo: updates.profilePhoto,
      favorite_genres: updates.favoriteGenres,
      social_links: updates.socialLinks,
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  // Handle both old object format and new array format for socialLinks
  let socialLinks: SocialLink[] = [];

  if (data.social_links) {
    // If it's an old object format, convert to array
    if (!Array.isArray(data.social_links) && typeof data.social_links === 'object') {
      socialLinks = Object.entries(data.social_links)
        .filter(([, value]) => value)
        .map(([platform, value], index) => ({
          id: `${Date.now()}-${index}`,
          platform,
          value: value as string,
        }));
    } else if (Array.isArray(data.social_links)) {
      socialLinks = data.social_links;
    }
  }

  return {
    username: data.username,
    name: data.name || '',
    bio: data.bio || '',
    favoriteGenres: data.favorite_genres || [],
    profilePhoto: data.profile_photo || '',
    socialLinks: socialLinks,
  } as UserProfile;
}

export async function createProfile(profile: UserProfile, userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('No user ID provided and no authenticated user');
      return null;
    }
  }
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      profile_photo: profile.profilePhoto,
      favorite_genres: profile.favoriteGenres,
      social_links: profile.socialLinks,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data;
}

// Book operations
export async function getBooks(userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('No user ID provided and no authenticated user');
      return [];
    }
  }

  // Fetch books ordered by created_at (custom_order column doesn't exist yet)
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching books:', error);
    return [];
  }

  return data.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover || '',
    rating: book.rating || 0,
    status: book.status as 'reading' | 'completed' | 'to-read',
    notes: book.notes,
    genre: book.genre,
    customOrder: 0, // Default value since column doesn't exist
  })) as Book[];
}

export async function createBook(book: Omit<Book, 'id'>, userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('[CREATE BOOK] No user ID - user not authenticated');
      return null;
    }
  }

  console.log('[CREATE BOOK] Adding book:', { title: book.title, userId });

  const { data, error } = await supabase
    .from('books')
    .insert({
      user_id: userId,
      title: book.title,
      author: book.author,
      cover: book.cover,
      genre: book.genre,
      rating: book.rating,
      status: book.status,
      notes: book.notes,
      // Don't include custom_order - column doesn't exist in Supabase yet
    })
    .select()
    .single();

  if (error) {
    console.error('[CREATE BOOK] Error:', error);
    return null;
  }

  console.log('[CREATE BOOK] Success! Book ID:', data.id);

  return {
    id: data.id,
    title: data.title,
    author: data.author,
    cover: data.cover || '',
    rating: data.rating || 0,
    status: data.status as 'reading' | 'completed' | 'to-read',
    notes: data.notes,
    genre: data.genre,
    customOrder: data.custom_order || 0,
  } as Book;
}

export async function updateBook(id: string, updates: Partial<Book>) {
  // Build update object without undefined values
  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.author !== undefined) updateData.author = updates.author;
  if (updates.cover !== undefined) updateData.cover = updates.cover;
  if (updates.genre !== undefined) updateData.genre = updates.genre;
  if (updates.rating !== undefined) updateData.rating = updates.rating;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  // Skip custom_order since column doesn't exist yet

  const { data, error } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating book:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    author: data.author,
    cover: data.cover || '',
    rating: data.rating || 0,
    status: data.status as 'reading' | 'completed' | 'to-read',
    notes: data.notes,
    genre: data.genre,
    customOrder: data.custom_order || 0,
  } as Book;
}

export async function deleteBook(id: string) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting book:', error);
    return false;
  }

  return true;
}

// Bulk update book orders for drag-and-drop
// NOTE: custom_order column doesn't exist yet, so this function is a no-op for now
export async function updateBooksOrder(books: Array<{ id: string; customOrder: number }>, userId?: string) {
  console.log('[UPDATE BOOKS ORDER] Skipping - custom_order column not available yet');
  // Will implement this once custom_order column is added to the database
  return true;
}
