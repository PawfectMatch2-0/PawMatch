/**
 * Database Population Script
 * Run this script to populate the Supabase database with all pet data and learning articles
 * Usage: npx ts-node scripts/populate-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import { mockPets } from '../data/pets';
import { mockLearningArticles } from '../data/learningContent';

// Supabase credentials from .env
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://afxkliyukojjymvfwiyp.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeGtsaXl1a29qanltdmZ3aXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTYzOTIsImV4cCI6MjA0NTI5MjM5Mn0.i5ws0A0vTKZHgFORejoiShips4dEUZXMzcEnKDNmjQUc7c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function populatePets() {
  console.log('🐾 Starting to populate pets...');
  
  try {
    // First, get or create a default owner
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️  No active session. Creating pets without owner_id...');
    }

    const userId = authData?.session?.user?.id;

    // Transform pet data for database
    const petsForDB = mockPets.map(pet => ({
      id: pet.id,
      name: pet.name,
      type: pet.type || 'dog',
      breed: pet.breed,
      age: typeof pet.age === 'string' ? parseInt(pet.age) || 2 : pet.age,
      gender: pet.gender.toLowerCase(),
      size: pet.size || 'medium',
      color: pet.color || '',
      location: pet.location,
      description: pet.description,
      personality: pet.personality || [],
      health_status: pet.healthStatus || 'healthy',
      vaccination_status: pet.vaccinationStatus || 'up-to-date',
      images: pet.images || [pet.image],
      adoption_status: pet.adoptionStatus || 'available',
      owner_id: userId || null,
      shelter_id: pet.shelterId || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert pets in batches to avoid timeout
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < petsForDB.length; i += batchSize) {
      const batch = petsForDB.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('pets')
        .upsert(batch, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error(`❌ Error inserting pets batch ${i / batchSize + 1}:`, error);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(`✅ Inserted pets batch ${i / batchSize + 1}: ${batch.length} pets`);
      }
    }

    console.log(`\n📊 Pet Population Summary:`);
    console.log(`   ✅ Success: ${successCount} pets`);
    console.log(`   ❌ Errors: ${errorCount} pets`);
    
  } catch (error) {
    console.error('❌ Error populating pets:', error);
  }
}

async function populateLearningArticles() {
  console.log('\n📚 Starting to populate learning articles...');
  
  try {
    // Transform article data for database
    const articlesForDB = mockLearningArticles.map(article => ({
      id: article.id,
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      image_url: article.image,
      read_time: article.readTime,
      author: article.author || 'PawfectMatch Team',
      is_featured: article.featured || false,
      tags: article.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert articles in batches
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < articlesForDB.length; i += batchSize) {
      const batch = articlesForDB.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('learning_articles')
        .upsert(batch, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error(`❌ Error inserting articles batch ${i / batchSize + 1}:`, error);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(`✅ Inserted articles batch ${i / batchSize + 1}: ${batch.length} articles`);
      }
    }

    console.log(`\n📊 Article Population Summary:`);
    console.log(`   ✅ Success: ${successCount} articles`);
    console.log(`   ❌ Errors: ${errorCount} articles`);
    
  } catch (error) {
    console.error('❌ Error populating articles:', error);
  }
}

async function verifyData() {
  console.log('\n🔍 Verifying database data...');
  
  try {
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('id, name, breed')
      .limit(5);

    if (petsError) {
      console.error('❌ Error fetching pets:', petsError);
    } else {
      console.log(`✅ Found ${pets?.length || 0} pets in database (showing first 5):`);
      pets?.forEach(pet => {
        console.log(`   - ${pet.name} (${pet.breed})`);
      });
    }

    const { data: articles, error: articlesError } = await supabase
      .from('learning_articles')
      .select('id, title, category')
      .limit(5);

    if (articlesError) {
      console.error('❌ Error fetching articles:', articlesError);
    } else {
      console.log(`\n✅ Found ${articles?.length || 0} articles in database (showing first 5):`);
      articles?.forEach(article => {
        console.log(`   - ${article.title} (${article.category})`);
      });
    }

    // Get counts
    const { count: petCount } = await supabase
      .from('pets')
      .select('*', { count: 'exact', head: true });

    const { count: articleCount } = await supabase
      .from('learning_articles')
      .select('*', { count: 'exact', head: true });

    console.log(`\n📊 Total Database Records:`);
    console.log(`   🐾 Pets: ${petCount || 0}`);
    console.log(`   📚 Articles: ${articleCount || 0}`);

  } catch (error) {
    console.error('❌ Error verifying data:', error);
  }
}

async function main() {
  console.log('🚀 Starting Database Population Script...\n');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Using API Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...\n`);

  // Populate data
  await populatePets();
  await populateLearningArticles();
  
  // Verify
  await verifyData();

  console.log('\n✨ Database population completed!');
}

// Run the script
main().catch(console.error);
