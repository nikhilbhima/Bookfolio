import { config } from "dotenv";
import path from "path";

// Load .env.local file BEFORE importing anything else
config({ path: path.resolve(process.cwd(), ".env.local") });

import { createProfile, createBook } from "../lib/database";
import { mockBooks, mockProfile } from "../lib/mock-data";

async function seedDatabase() {
  console.log("Starting database seeding...");

  // Create profile
  console.log("Creating profile...");
  const profile = await createProfile(mockProfile);
  if (profile) {
    console.log("✓ Profile created successfully");
  } else {
    console.log("✗ Failed to create profile");
  }

  // Create books
  console.log("\nCreating books...");
  for (const book of mockBooks) {
    const { id, ...bookData } = book; // Remove the id field
    const created = await createBook(bookData);
    if (created) {
      console.log(`✓ Created: ${book.title}`);
    } else {
      console.log(`✗ Failed to create: ${book.title}`);
    }
  }

  console.log("\nDatabase seeding completed!");
}

seedDatabase().catch(console.error);
