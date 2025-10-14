/**
 * COMPREHENSIVE BACKEND & DATABASE TESTING SUITE
 * Tests all authentication flows, database connections, and core functionality
 */

import { supabase } from '../lib/enhanced-auth'

// Test configuration
const TEST_CONFIG = {
  testEmail: 'test@pawmatch.test',
  testPassword: 'testpassword123',
  testUser: {
    full_name: 'Test User',
    phone: '+1234567890'
  }
}

interface TestResult {
  testName: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  message: string
  details?: any
}

class BackendTester {
  private results: TestResult[] = []
  
  private log(testName: string, status: 'PASS' | 'FAIL' | 'SKIP', message: string, details?: any) {
    const result: TestResult = { testName, status, message, details }
    this.results.push(result)
    
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️'
    console.log(`${emoji} [${testName}] ${message}`)
    if (details) console.log('   Details:', details)
  }

  // Test 1: Supabase Connection
  async testSupabaseConnection() {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        this.log('Supabase Connection', 'FAIL', `Connection failed: ${error.message}`, error)
        return false
      }
      
      this.log('Supabase Connection', 'PASS', 'Successfully connected to Supabase')
      return true
    } catch (error) {
      this.log('Supabase Connection', 'FAIL', `Connection error: ${error}`, error)
      return false
    }
  }

  // Test 2: Database Schema Validation
  async testDatabaseSchema() {
    try {
      // Test user_profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, is_admin')
        .limit(1)

      if (profilesError) {
        this.log('Database Schema', 'FAIL', `user_profiles table error: ${profilesError.message}`, profilesError)
        return false
      }

      // Test pets table
      const { data: pets, error: petsError } = await supabase
        .from('pets')
        .select('id, name, breed, adoption_status')
        .limit(1)

      if (petsError) {
        this.log('Database Schema', 'FAIL', `pets table error: ${petsError.message}`, petsError)
        return false
      }

      // Test adoption_applications table
      const { data: applications, error: applicationsError } = await supabase
        .from('adoption_applications')
        .select('id, status, user_id, pet_id')
        .limit(1)

      if (applicationsError) {
        this.log('Database Schema', 'FAIL', `adoption_applications table error: ${applicationsError.message}`, applicationsError)
        return false
      }

      this.log('Database Schema', 'PASS', 'All required tables exist and are accessible')
      return true
    } catch (error) {
      this.log('Database Schema', 'FAIL', `Schema validation error: ${error}`, error)
      return false
    }
  }

  // Test 3: User Registration
  async testUserRegistration() {
    try {
      // Clean up any existing test user first
      await this.cleanupTestUser()

      const { data, error } = await supabase.auth.signUp({
        email: TEST_CONFIG.testEmail,
        password: TEST_CONFIG.testPassword,
        options: {
          data: TEST_CONFIG.testUser
        }
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          this.log('User Registration', 'SKIP', 'Test user already exists')
          return true
        }
        this.log('User Registration', 'FAIL', `Registration failed: ${error.message}`, error)
        return false
      }

      this.log('User Registration', 'PASS', `User registered successfully: ${data.user?.email}`)
      return true
    } catch (error) {
      this.log('User Registration', 'FAIL', `Registration error: ${error}`, error)
      return false
    }
  }

  // Test 4: User Authentication
  async testUserAuthentication() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: TEST_CONFIG.testEmail,
        password: TEST_CONFIG.testPassword
      })

      if (error) {
        this.log('User Authentication', 'FAIL', `Sign in failed: ${error.message}`, error)
        return false
      }

      if (!data.user) {
        this.log('User Authentication', 'FAIL', 'No user data returned')
        return false
      }

      this.log('User Authentication', 'PASS', `User authenticated successfully: ${data.user.email}`)
      return true
    } catch (error) {
      this.log('User Authentication', 'FAIL', `Authentication error: ${error}`, error)
      return false
    }
  }

  // Test 5: Profile Creation
  async testProfileCreation() {
    try {
      const { data: user } = await supabase.auth.getUser()
      
      if (!user.user) {
        this.log('Profile Creation', 'SKIP', 'No authenticated user for profile test')
        return false
      }

      const profileData = {
        id: user.user.id,
        email: user.user.email,
        full_name: TEST_CONFIG.testUser.full_name,
        phone: TEST_CONFIG.testUser.phone,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData)
        .select()

      if (error) {
        this.log('Profile Creation', 'FAIL', `Profile creation failed: ${error.message}`, error)
        return false
      }

      this.log('Profile Creation', 'PASS', 'User profile created/updated successfully')
      return true
    } catch (error) {
      this.log('Profile Creation', 'FAIL', `Profile creation error: ${error}`, error)
      return false
    }
  }

  // Test 6: Password Reset Flow
  async testPasswordReset() {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(TEST_CONFIG.testEmail, {
        redirectTo: 'http://localhost:8081/auth/reset-password'
      })

      if (error) {
        // In development, email service might not be configured
        if (error.message.includes('Error sending recovery email')) {
          this.log('Password Reset', 'SKIP', 'Email service not configured (development mode)')
          return true
        }
        this.log('Password Reset', 'FAIL', `Password reset failed: ${error.message}`, error)
        return false
      }

      this.log('Password Reset', 'PASS', 'Password reset email sent successfully')
      return true
    } catch (error) {
      this.log('Password Reset', 'FAIL', `Password reset error: ${error}`, error)
      return false
    }
  }

  // Test 7: Data Retrieval
  async testDataRetrieval() {
    try {
      // Test fetching pets
      const { data: pets, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .limit(5)

      if (petsError) {
        this.log('Data Retrieval', 'FAIL', `Pets fetch failed: ${petsError.message}`, petsError)
        return false
      }

      // Test fetching user profile
      const { data: user } = await supabase.auth.getUser()
      if (user.user) {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') { // Not found is OK
          this.log('Data Retrieval', 'FAIL', `Profile fetch failed: ${profileError.message}`, profileError)
          return false
        }
      }

      this.log('Data Retrieval', 'PASS', `Data retrieval successful (${pets?.length || 0} pets found)`)
      return true
    } catch (error) {
      this.log('Data Retrieval', 'FAIL', `Data retrieval error: ${error}`, error)
      return false
    }
  }

  // Test 8: JWT Token Validation
  async testJWTTokens() {
    try {
      const { data: session } = await supabase.auth.getSession()
      
      if (!session.session) {
        this.log('JWT Tokens', 'FAIL', 'No active session found')
        return false
      }

      const { access_token, refresh_token } = session.session
      
      if (!access_token || !refresh_token) {
        this.log('JWT Tokens', 'FAIL', 'Missing JWT tokens')
        return false
      }

      // Test token refresh
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
      
      if (refreshError) {
        this.log('JWT Tokens', 'FAIL', `Token refresh failed: ${refreshError.message}`, refreshError)
        return false
      }

      this.log('JWT Tokens', 'PASS', 'JWT tokens valid and refresh working')
      return true
    } catch (error) {
      this.log('JWT Tokens', 'FAIL', `JWT token error: ${error}`, error)
      return false
    }
  }

  // Cleanup helper
  async cleanupTestUser() {
    try {
      // Sign out current user
      await supabase.auth.signOut()
      
      // Note: We can't delete auth.users directly, but we can clean up profiles
      console.log('🧹 Test cleanup completed')
    } catch (error) {
      console.log('🧹 Cleanup warning:', error)
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting PawMatch Backend & Database Test Suite...\n')

    const tests = [
      () => this.testSupabaseConnection(),
      () => this.testDatabaseSchema(),
      () => this.testUserRegistration(),
      () => this.testUserAuthentication(),
      () => this.testProfileCreation(),
      () => this.testPasswordReset(),
      () => this.testDataRetrieval(),
      () => this.testJWTTokens()
    ]

    let passCount = 0
    let failCount = 0
    let skipCount = 0

    for (const test of tests) {
      const result = await test()
      if (result === true) passCount++
      else if (result === false) failCount++
      else skipCount++
    }

    // Cleanup
    await this.cleanupTestUser()

    // Final report
    console.log('\n📊 TEST RESULTS SUMMARY:')
    console.log(`✅ PASSED: ${passCount}`)
    console.log(`❌ FAILED: ${failCount}`)
    console.log(`⏭️ SKIPPED: ${skipCount}`)
    console.log(`📋 TOTAL: ${this.results.length}`)

    const overallStatus = failCount === 0 ? 'ALL TESTS PASSED' : `${failCount} TESTS FAILED`
    console.log(`\n🎯 OVERALL STATUS: ${overallStatus}`)

    return {
      passed: passCount,
      failed: failCount,
      skipped: skipCount,
      overall: failCount === 0,
      results: this.results
    }
  }
}

// Export for use in the app
export default BackendTester

// Export test runner function
export const runBackendTests = async () => {
  const tester = new BackendTester()
  return await tester.runAllTests()
}