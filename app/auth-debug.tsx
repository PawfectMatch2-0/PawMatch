import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react-native';

export default function AuthDebugScreen() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      const info: any = {
        timestamp: new Date().toISOString(),
        currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A',
        supabaseConfigured: !!supabase,
      };

      if (supabase) {
        // Check session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        info.session = sessionData.session ? {
          user_email: sessionData.session.user.email,
          expires_at: sessionData.session.expires_at,
        } : null;
        info.sessionError = sessionError?.message;

        // Check user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        info.user = userData.user ? {
          email: userData.user.email,
          id: userData.user.id,
          metadata: userData.user.user_metadata,
        } : null;
        info.userError = userError?.message;
      }

      setDebugInfo(info);
    } catch (error) {
      setDebugInfo({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  const clearStorageAndRetry = async () => {
    try {
      // Clear any stored auth tokens
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('auth')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Reload debug info
      await loadDebugInfo();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Auth Debug</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication Debug Info</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>
              {JSON.stringify(debugInfo, null, 2)}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={loadDebugInfo}>
            <Text style={styles.buttonText}>Refresh Info</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearStorageAndRetry}>
            <Text style={[styles.buttonText, styles.clearButtonText]}>Clear Storage & Retry</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => router.push('/auth')}>
            <Text style={styles.buttonText}>Back to Auth</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  actions: {
    gap: 12,
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#666',
  },
  clearButtonText: {
    color: 'white',
  },
});