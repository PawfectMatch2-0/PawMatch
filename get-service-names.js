const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://afxkliyukojjymvfwiyp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmeGtsaXl1a29qanltdmZ3aXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNjc1NTcsImV4cCI6MjA2OTc0MzU1N30.tAn3GDt39F4xVMubXBpgYKEXh9eleIQzGg6SmEucAdc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getServices() {
  const { data } = await supabase
    .from('pet_services')
    .select('name, contact_facebook')
    .not('contact_facebook', 'is', null);
  
  console.log('Services with Facebook URLs:');
  data.forEach(s => console.log(`  "${s.name}"`));
}

getServices();
