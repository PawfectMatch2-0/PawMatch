import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function SimpleAuthTest() {
  const router = useRouter();

  useEffect(() => {
    testAuthFlow();
  }, []);

  const testAuthFlow = async () => {
    console.log('🧪 [Simple Auth Test] Starting...');
    
    if (!supabase) {
      console.error('❌ Supabase not configured');
      return;
    }

    try {
      // Simple OAuth call with minimal configuration
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `http://localhost:8082/auth-simple-callback`,
        }
      });

      if (error) {
        console.error('❌ OAuth error:', error);
      } else {
        console.log('✅ OAuth initiated:', data);
        // This will redirect automatically
      }
    } catch (error) {
      console.error('❌ Exception:', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'system-ui',
      backgroundColor: '#f5f5f5'
    }}>
      <h2>🧪 Simple Auth Test</h2>
      <p>Initiating Google OAuth with minimal configuration...</p>
      <button 
        onClick={() => router.back()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#FF6B6B',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>
    </div>
  );
}