/**
 * Database Population Script (JavaScript version)
 * Run this script to populate the Supabase database with all pet data and learning articles
 * Usage: node scripts/populate-database.js
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://afxkliyukojjymvfwiyp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeGtsaXl1a29qanltdmZ3aXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTYzOTIsImV4cCI6MjA0NTI5MjM5Mn0.i5ws0A0vTKZHgFORejoiShips4dEUZXMzcEnKDNmjQUc7c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Import the data
const { mockPets } = require('../data/pets.ts');
const { mockLearningArticles } = require('../data/learningContent.ts');

async function populatePets() {
  console.log('🐾 Starting to populate pets...');
  
  try {
    // Transform pet data for database
    const petsForDB = mockPets.map(pet => {
      // Get all images
      const allImages = [];
      if (pet.image) allImages.push(pet.image);
      if (pet.additionalImages) allImages.push(...pet.additionalImages);
      
      return {
        id: pet.id,
        name: pet.name,
        type: 'dog', // default
        breed: pet.breed,
        age: parseInt(pet.age) || 2,
        gender: pet.gender.toLowerCase(),
        size: pet.size || 'medium',
        color: '',
        location: pet.location,
        description: pet.description,
        personality: pet.personality || [],
        health_status: pet.vaccinated ? 'healthy' : 'needs-checkup',
        vaccination_status: pet.vaccinated ? 'up-to-date' : 'pending',
        images: allImages.length > 0 ? allImages : ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'],
        adoption_status: 'available',
        owner_id: null,
        shelter_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    // Insert pets in batches
    const batchSize = 5;
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
        console.error(`❌ Error inserting pets batch ${i / batchSize + 1}:`, error.message);
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
    console.error('❌ Error populating pets:', error.message);
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
      excerpt: article.summary || article.title,
      content: article.content,
      image_url: article.imageUrl || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
      read_time: article.duration || '5 min',
      author: 'PawfectMatch Team',
      is_featured: article.isFeatured || false,
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert articles in batches
    const batchSize = 5;
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
        console.error(`❌ Error inserting articles batch ${i / batchSize + 1}:`, error.message);
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
    console.error('❌ Error populating articles:', error.message);
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
      console.error('❌ Error fetching pets:', petsError.message);
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
      console.error('❌ Error fetching articles:', articlesError.message);
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
    console.error('❌ Error verifying data:', error.message);
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
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
