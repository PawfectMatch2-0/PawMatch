/**
 * Environment Variable Checker
 * Run this to verify your environment is properly configured
 */

export const checkEnvironment = () => {
  const checks = {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    ADMIN_EMAIL: process.env.EXPO_PUBLIC_ADMIN_EMAIL,
    DEBUG_AUTH: process.env.EXPO_PUBLIC_DEBUG_AUTH,
    APP_ENV: process.env.APP_ENV,
  };

  console.log('\n========================================');
  console.log('🔍 ENVIRONMENT VARIABLE CHECK');
  console.log('========================================\n');

  let allGood = true;

  // Check Supabase URL
  if (!checks.SUPABASE_URL || checks.SUPABASE_URL.includes('your_supabase_url_here')) {
    console.log('❌ EXPO_PUBLIC_SUPABASE_URL: NOT CONFIGURED');
    allGood = false;
  } else {
    console.log('✅ EXPO_PUBLIC_SUPABASE_URL:', checks.SUPABASE_URL.substring(0, 30) + '...');
  }

  // Check Supabase Key
  if (!checks.SUPABASE_ANON_KEY || checks.SUPABASE_ANON_KEY.includes('your_supabase_anon_key_here')) {
    console.log('❌ EXPO_PUBLIC_SUPABASE_ANON_KEY: NOT CONFIGURED');
    allGood = false;
  } else {
    console.log('✅ EXPO_PUBLIC_SUPABASE_ANON_KEY:', checks.SUPABASE_ANON_KEY.substring(0, 30) + '...');
  }

  // Optional checks
  console.log('ℹ️  EXPO_PUBLIC_ADMIN_EMAIL:', checks.ADMIN_EMAIL || 'not set');
  console.log('ℹ️  EXPO_PUBLIC_DEBUG_AUTH:', checks.DEBUG_AUTH || 'not set');
  console.log('ℹ️  APP_ENV:', checks.APP_ENV || 'not set');

  console.log('\n========================================');
  if (allGood) {
    console.log('✅ ALL REQUIRED ENVIRONMENT VARIABLES ARE SET');
    console.log('✅ Supabase backend is configured and ready!');
  } else {
    console.log('❌ SOME REQUIRED ENVIRONMENT VARIABLES ARE MISSING');
    console.log('\n📝 To fix this:');
    console.log('1. Make sure .env file exists in project root');
    console.log('2. Add these lines to .env:');
    console.log('   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.log('   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
    console.log('3. Restart Expo dev server: npx expo start --clear');
    console.log('\n⚠️  IMPORTANT: Expo requires server restart after .env changes!');
  }
  console.log('========================================\n');

  return allGood;
};

// Auto-run on import during development
if (process.env.NODE_ENV === 'development') {
  checkEnvironment();
}
