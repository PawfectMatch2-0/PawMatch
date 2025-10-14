/**
 * Simple JavaScript backend test runner
 * Tests the core functionality without TypeScript compilation
 */

const { createClient } = require('@supabase/supabase-js')

// Environment variables (in development, these would come from .env)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co'
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseConnection() {
  console.log('🔗 Testing Supabase Connection...')
  
  try {
    const { data, error } = await supabase.from('user_profiles').select('*').limit(1)
    
    if (error) {
      console.log('❌ Connection test failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (err) {
    console.log('❌ Connection error:', err.message)
    return false
  }
}

async function testDatabaseSchema() {
  console.log('🗄️ Testing Database Schema...')
  
  const essentialTables = ['user_profiles', 'pets', 'adoption_applications']
  const optionalTables = ['learning_content', 'pet_services']
  
  let allEssentialTablesExist = true
  
  // Test essential tables
  for (const table of essentialTables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1)
      
      if (error) {
        console.log(`❌ Essential table '${table}' not accessible:`, error.message)
        allEssentialTablesExist = false
      } else {
        console.log(`✅ Essential table '${table}' exists and accessible`)
      }
    } catch (err) {
      console.log(`❌ Error testing essential table '${table}':`, err.message)
      allEssentialTablesExist = false
    }
  }
  
  // Test optional tables (don't fail if missing)
  for (const table of optionalTables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1)
      
      if (error) {
        console.log(`⚠️  Optional table '${table}' not available:`, error.message)
      } else {
        console.log(`✅ Optional table '${table}' exists and accessible`)
      }
    } catch (err) {
      console.log(`⚠️  Optional table '${table}' not available:`, err.message)
    }
  }
  
  return allEssentialTablesExist
}

async function testAuthentication() {
  console.log('🔐 Testing Authentication...')
  
  const testEmail = `test_${Date.now()}@pawmatch.test`
  const testPassword = 'TestPassword123!'
  
  try {
    // Test signup
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    })
    
    if (signupError) {
      console.log('❌ Signup failed:', signupError.message)
      return false
    }
    
    console.log('✅ User signup successful')
    
    // Test signin
    const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })
    
    if (signinError) {
      console.log('❌ Signin failed:', signinError.message)
      return false
    }
    
    console.log('✅ User signin successful')
    
    // Test getting current user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError || !userData.user) {
      console.log('❌ Get user failed:', userError?.message || 'No user data')
      return false
    }
    
    console.log('✅ Get current user successful')
    
    // Clean up - sign out
    await supabase.auth.signOut()
    console.log('✅ User signout successful')
    
    return true
  } catch (err) {
    console.log('❌ Authentication test error:', err.message)
    return false
  }
}

async function testDataRetrieval() {
  console.log('📊 Testing Data Retrieval...')
  
  try {
    // Test pets data
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('*')
      .limit(5)
    
    if (petsError) {
      console.log('❌ Pets data retrieval failed:', petsError.message)
      return false
    }
    
    console.log(`✅ Retrieved ${pets?.length || 0} pets successfully`)
    
    // Test user profiles data
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5)
    
    if (profilesError) {
      console.log('❌ User profiles retrieval failed:', profilesError.message)
      return false
    }
    
    console.log(`✅ Retrieved ${profiles?.length || 0} user profiles successfully`)
    
    return true
  } catch (err) {
    console.log('❌ Data retrieval test error:', err.message)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 Starting PawMatch Backend Tests...')
  console.log('==========================================')
  
  const results = {
    connection: false,
    schema: false,
    authentication: false,
    dataRetrieval: false,
  }
  
  // Run tests
  results.connection = await testSupabaseConnection()
  console.log('')
  
  if (results.connection) {
    results.schema = await testDatabaseSchema()
    console.log('')
    
    results.authentication = await testAuthentication()
    console.log('')
    
    results.dataRetrieval = await testDataRetrieval()
    console.log('')
  }
  
  // Summary
  console.log('==========================================')
  console.log('📋 TEST SUMMARY')
  console.log('==========================================')
  console.log(`🔗 Supabase Connection: ${results.connection ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`🗄️ Database Schema: ${results.schema ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`🔐 Authentication: ${results.authentication ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`📊 Data Retrieval: ${results.dataRetrieval ? '✅ PASS' : '❌ FAIL'}`)
  
  const allPassed = Object.values(results).every(result => result)
  console.log('')
  console.log(`🎯 OVERALL RESULT: ${allPassed ? '🎉 ALL TESTS PASSED' : '🚨 SOME TESTS FAILED'}`)
  
  if (allPassed) {
    console.log('')
    console.log('✨ Backend and Database are fully functional!')
    console.log('✨ Authentication system is working correctly!')
    console.log('✨ PawMatch is ready for production!')
  } else {
    console.log('')
    console.log('⚠️  Some components need attention before deployment')
  }
  
  return results
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error)
}

module.exports = { runAllTests }