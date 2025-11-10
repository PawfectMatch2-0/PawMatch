const { createClient } = require('@supabase/supabase-js');

// Read environment variables
const supabaseUrl = 'https://afxkliyukojjymvfwiyp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeGtsaXl1a29qanltdmZ3aXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNjc1NTcsImV4cCI6MjA2OTc0MzU1N30.tAn3GDt39F4xVMubXBpgYKEXh9eleIQzGg6SmEucAdc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearFeaturedImages() {
  console.log('🔄 Updating pet_services to clear featured_image for Facebook-enabled services...\n');

  try {
    // Clear featured images for ALL services with Facebook URLs
    const { data, error } = await supabase
      .from('pet_services')
      .update({ featured_image: null })
      .not('contact_facebook', 'is', null)
      .select();

    if (error) {
      console.error('❌ Error updating services:', error.message);
      return;
    }

    console.log(`✅ Updated ${data.length} services:\n`);
    data.forEach(service => {
      console.log(`  📝 ${service.name}`);
      console.log(`     Category: ${service.category}`);
      console.log(`     Facebook: ${service.contact_facebook}`);
      console.log(`     Featured Image: ${service.featured_image || 'NULL (will use Facebook)'}`);
      console.log('');
    });

    // Fetch all services with Facebook URLs to verify
    console.log('📊 All services with Facebook URLs:\n');
    const { data: allServices, error: fetchError } = await supabase
      .from('pet_services')
      .select('name, category, featured_image, contact_facebook')
      .not('contact_facebook', 'is', null)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching services:', fetchError.message);
      return;
    }

    allServices.forEach(service => {
      const willUseFacebook = !service.featured_image;
      const icon = willUseFacebook ? '📘' : '🖼️';
      console.log(`${icon} ${service.name} (${service.category})`);
      console.log(`   Featured: ${service.featured_image || 'NULL'}`);
      console.log(`   Facebook: ${service.contact_facebook}`);
      console.log(`   ${willUseFacebook ? '✅ Will use Facebook profile picture' : '⚠️ Will use featured image'}`);
      console.log('');
    });

  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

clearFeaturedImages();
