import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react-native';

export default function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AlertTriangle size={64} color="#EF4444" />
        <Text style={styles.title}>Something Went Wrong</Text>
        <Text style={styles.subtitle}>An error occurred while loading the app</Text>
        
        <ScrollView style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Details:</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          {error.stack && (
            <>
              <Text style={styles.errorTitle}>Stack Trace:</Text>
              <Text style={styles.errorStack}>{error.stack}</Text>
            </>
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={retry}>
            <RefreshCw size={20} color="#FFF" />
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => router.replace('/')}
          >
            <Home size={20} color="#E67E9C" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#171717',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#525252',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    maxHeight: 300,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  errorTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#171717',
    marginBottom: 8,
    marginTop: 8,
  },
  errorMessage: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#EF4444',
    marginBottom: 12,
  },
  errorStack: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    color: '#737373',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E67E9C',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E67E9C',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  secondaryButtonText: {
    color: '#E67E9C',
  },
});

