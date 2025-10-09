const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ntjwstcmdpblylkwbgjy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50andzdGNtZHBibHlsa3diZ2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MDE3MDksImV4cCI6MjA3NTM3NzcwOX0.X_nU7X_GVuf0CkMYkIjLLrK3jEiHj66THSjt53npSns'
);

async function testFullFlow() {
  const userId = '5ecb172c-5d4b-4cd5-a25e-2a1a1653c17e';

  console.log('\n=== FULL FLOW TEST ===\n');

  // 1. Add a book
  console.log('1. Adding book...');
  const { data: newBook, error: insertError } = await supabase
    .from('books')
    .insert({
      user_id: userId,
      title: 'Flow Test Book',
      author: 'Flow Author',
      cover: 'https://via.placeholder.com/300x450',
      genre: 'Fiction',
      rating: 4,
      status: 'to-read',
      notes: 'Test notes',
    })
    .select()
    .single();

  if (insertError) {
    console.error('❌ INSERT FAILED:', insertError.message);
    return;
  }

  console.log('✅ Book inserted:', newBook.id);

  // 2. Fetch all books
  console.log('\n2. Fetching all books...');
  const { data: allBooks, error: fetchError } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('❌ FETCH FAILED:', fetchError.message);
    return;
  }

  console.log(`✅ Found ${allBooks.length} books:`);
  allBooks.forEach((book, i) => {
    console.log(`   ${i + 1}. ${book.title} by ${book.author}`);
  });

  // 3. Clean up
  console.log('\n3. Cleaning up test book...');
  await supabase.from('books').delete().eq('id', newBook.id);
  console.log('✅ Test book deleted');

  console.log('\n=== TEST COMPLETE ===');
  console.log('If you saw all ✅ marks, the database is working perfectly!');
  console.log('The issue must be in the frontend code or browser state.');
}

testFullFlow();
