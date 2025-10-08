import { supabase } from "../lib/supabase";
import { mockBooks, mockProfile } from "../lib/mock-data";

const TEMP_USER_ID = '00000000-0000-0000-0000-000000000001';

async function seedDatabase() {
  console.log("Starting database seeding...");

  // Create profile
  console.log("\nCreating profile...");
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      user_id: TEMP_USER_ID,
      username: mockProfile.username,
      name: mockProfile.name,
      bio: mockProfile.bio,
      profile_photo: mockProfile.profilePhoto,
      favorite_genres: mockProfile.favoriteGenres,
      social_links: mockProfile.socialLinks,
    })
    .select()
    .single();

  if (profileError) {
    console.log("✗ Failed to create profile:", profileError.message);
  } else {
    console.log("✓ Profile created successfully");
  }

  // Create books
  console.log("\nCreating books...");
  for (const book of mockBooks) {
    const { id, ...bookData } = book;
    const { data, error } = await supabase
      .from('books')
      .insert({
        user_id: TEMP_USER_ID,
        title: bookData.title,
        author: bookData.author,
        cover: bookData.cover,
        genre: bookData.genre,
        rating: bookData.rating,
        status: bookData.status,
        notes: bookData.notes,
      })
      .select()
      .single();

    if (error) {
      console.log(`✗ Failed to create: ${book.title} - ${error.message}`);
    } else {
      console.log(`✓ Created: ${book.title}`);
    }
  }

  console.log("\nDatabase seeding completed!");
}

seedDatabase().catch(console.error);
