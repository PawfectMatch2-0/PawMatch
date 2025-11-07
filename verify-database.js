/**
 * Database Verification Script
 * Run this to check if your Supabase tables exist
 * Usage: node verify-database.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log('🔍 Verifying Supabase database setup...\n');

  // Check user_profiles table
  console.log('1. Checking user_profiles table...');
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(1);

  if (profilesError) {
    console.error('❌ user_profiles table error:', profilesError.message);
    console.log('   → Run database/01_schema.sql in Supabase SQL Editor\n');
  } else {
    console.log('✅ user_profiles table exists\n');
  }

  // Check pets table
  console.log('2. Checking pets table...');
  const { data: pets, error: petsError } = await supabase
    .from('pets')
    .select('*')
    .limit(1);

  if (petsError) {
    console.error('❌ pets table error:', petsError.message);
    console.log('   → Run database/01_schema.sql in Supabase SQL Editor\n');
  } else {
    console.log(`✅ pets table exists (${pets?.length || 0} sample fetched)\n`);
  }

  // Check storage buckets
  console.log('3. Checking storage buckets...');
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets();

  if (bucketsError) {
    console.error('❌ Storage error:', bucketsError.message);
  } else {
    const petImagesBucket = buckets?.find(b => b.name === 'pet-images');
    const userAvatarsBucket = buckets?.find(b => b.name === 'user-avatars');

    if (petImagesBucket) {
      console.log('✅ pet-images bucket exists');
    } else {
      console.log('❌ pet-images bucket NOT FOUND');
      console.log('   → Create it in Supabase Dashboard → Storage');
    }

    if (userAvatarsBucket) {
      console.log('✅ user-avatars bucket exists\n');
    } else {
      console.log('❌ user-avatars bucket NOT FOUND');
      console.log('   → Create it in Supabase Dashboard → Storage\n');
    }
  }

  console.log('✨ Verification complete!\n');
}

verifyDatabase().catch(console.error);
