/**
 * Backend Testing Screen
 * Run comprehensive backend and database tests
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { ArrowLeft, Play, CheckCircle, XCircle, SkipForward } from 'lucide-react-native'
import { runBackendTests } from '../lib/backend-tester'

interface TestResult {
  testName: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  message: string
  details?: any
}

export default function BackendTestScreen() {
  const router = useRouter()
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [summary, setSummary] = useState<any>(null)

  const runTests = async () => {
    setTesting(true)
    setResults([])
    setSummary(null)

    try {
      const testResults = await runBackendTests()
      setResults(testResults.results)
      setSummary(testResults)
    } catch (error) {
      console.error('Test execution error:', error)
      setResults([{
        testName: 'Test Execution',
        status: 'FAIL',
        message: `Test execution failed: ${error}`,
        details: error
      }])
    } finally {
      setTesting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle size={20} color="#4CAF50" />
      case 'FAIL':
        return <XCircle size={20} color="#F44336" />
      case 'SKIP':
        return <SkipForward size={20} color="#FF9800" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
        return '#4CAF50'
      case 'FAIL':
        return '#F44336'
      case 'SKIP':
        return '#FF9800'
      default:
        return '#666'
    }
  }

  return (
    <LinearGradient colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Backend Testing</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>PawMatch Backend Test Suite</Text>
            <Text style={styles.cardSubtitle}>
              Comprehensive testing of authentication, database, and core functionality
            </Text>

            <TouchableOpacity
              style={[styles.testButton, testing && styles.testButtonDisabled]}
              onPress={runTests}
              disabled={testing}
            >
              {testing ? (
                <>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.testButtonText}>Running Tests...</Text>
                </>
              ) : (
                <>
                  <Play size={20} color="white" />
                  <Text style={styles.testButtonText}>Run All Tests</Text>
                </>
              )}
            </TouchableOpacity>

            {summary && (
              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Test Results Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryText, { color: '#4CAF50' }]}>
                    ✅ Passed: {summary.passed}
                  </Text>
                  <Text style={[styles.summaryText, { color: '#F44336' }]}>
                    ❌ Failed: {summary.failed}
                  </Text>
                  <Text style={[styles.summaryText, { color: '#FF9800' }]}>
                    ⏭️ Skipped: {summary.skipped}
                  </Text>
                </View>
                <Text style={[
                  styles.overallStatus,
                  { color: summary.overall ? '#4CAF50' : '#F44336' }
                ]}>
                  {summary.overall ? '🎉 ALL TESTS PASSED' : '🚨 SOME TESTS FAILED'}
                </Text>
              </View>
            )}
          </View>

          {results.length > 0 && (
            <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.resultsTitle}>Detailed Results</Text>
              {results.map((result, index) => (
                <View key={index} style={styles.resultItem}>
                  <View style={styles.resultHeader}>
                    {getStatusIcon(result.status)}
                    <Text style={styles.resultTestName}>{result.testName}</Text>
                  </View>
                  <Text style={[
                    styles.resultMessage,
                    { color: getStatusColor(result.status) }
                  ]}>
                    {result.message}
                  </Text>
                  {result.details && (
                    <Text style={styles.resultDetails}>
                      Details: {JSON.stringify(result.details, null, 2)}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          {!testing && results.length === 0 && (
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>Testing Instructions</Text>
              <Text style={styles.instructionsText}>
                • Tests Supabase connection and authentication{'\n'}
                • Validates database schema and tables{'\n'}
                • Tests user registration and login flows{'\n'}
                • Validates JWT token management{'\n'}
                • Tests password reset functionality{'\n'}
                • Checks data retrieval operations
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  testButtonDisabled: {
    backgroundColor: '#999',
  },
  testButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  summary: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
  },
  overallStatus: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  resultTestName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  resultMessage: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    marginBottom: 4,
  },
  resultDetails: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6,
  },
  instructions: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 16,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    lineHeight: 22,
  },
})