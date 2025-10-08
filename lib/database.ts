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
  // Try to fetch with custom_order first
  let { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('custom_order', { ascending: true })
    .order('created_at', { ascending: false });

  // If custom_order column doesn't exist yet, fallback to created_at only
  if (error && error.message?.includes('custom_order')) {
    console.warn('custom_order column not found, using created_at for ordering. Please run the database migration.');
    const fallback = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    data = fallback.data;
    error = fallback.error;
  }

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
    customOrder: book.custom_order || 0,
  })) as Book[];
}

export async function createBook(book: Omit<Book, 'id'>, userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('No user ID provided and no authenticated user');
      return null;
    }
  }
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
      custom_order: book.customOrder || 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating book:', error);
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

export async function updateBook(id: string, updates: Partial<Book>) {
  const { data, error } = await supabase
    .from('books')
    .update({
      title: updates.title,
      author: updates.author,
      cover: updates.cover,
      genre: updates.genre,
      rating: updates.rating,
      status: updates.status,
      notes: updates.notes,
      custom_order: updates.customOrder,
    })
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
export async function updateBooksOrder(books: Array<{ id: string; customOrder: number }>, userId?: string) {
  if (!userId) {
    userId = await getCurrentUserId() || undefined;
    if (!userId) {
      console.error('No user ID provided and no authenticated user');
      return false;
    }
  }
  try {
    // Update each book's custom_order
    const updates = books.map(({ id, customOrder }) =>
      supabase
        .from('books')
        .update({ custom_order: customOrder })
        .eq('id', id)
        .eq('user_id', userId)
    );

    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Error updating book order:', error);
    return false;
  }
}
