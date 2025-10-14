/**
 * ADOPTION TRACKER PAGE
 * Shows all user's adoption applications and their status
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Calendar, MessageCircle } from 'lucide-react-native';
import { 
  AdoptionApplication, 
  AdoptionFlowManager, 
  mockAdoptionApplications 
} from '../../lib/adoption-flow';
import { mockPets } from '../../data/pets';
import AdoptionStatusTracker from '../../components/AdoptionStatusTracker';

export default function AdoptionTrackerScreen() {
  const router = useRouter();
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApplications(mockAdoptionApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadApplications();
  };

  const getPetDetails = (petId: string) => {
    return mockPets.find((pet: any) => pet.id === petId);
  };

  const getNextAction = (application: AdoptionApplication) => {
    const nextStatuses = AdoptionFlowManager.getNextStatuses(application.status);
    const canTakeAction = AdoptionFlowManager.canUserTakeAction(application.status);
    
    if (!canTakeAction || nextStatuses.length === 0) {
      return null;
    }

    switch (application.status) {
      case 'approved':
        return {
          label: 'Schedule Meeting',
          icon: Calendar,
          action: () => scheduleMeeting(application.id)
        };
      case 'meeting_completed':
        return {
          label: 'Update Status',
          icon: MessageCircle,
          action: () => updateMeetingStatus(application.id)
        };
      default:
        return null;
    }
  };

  const scheduleMeeting = (applicationId: string) => {
    // TODO: Implement meeting scheduling
    console.log('Schedule meeting for application:', applicationId);
  };

  const updateMeetingStatus = (applicationId: string) => {
    // TODO: Implement meeting status update
    console.log('Update meeting status for application:', applicationId);
  };

  const renderApplication = ({ item }: { item: AdoptionApplication }) => {
    const pet = getPetDetails(item.pet_id);
    const nextAction = getNextAction(item);

    if (!pet) return null;

    return (
      <View style={styles.applicationCard}>
        <View style={styles.applicationHeader}>
          <Image 
            source={{ uri: Array.isArray(pet.image) ? pet.image[0] : pet.image }} 
            style={styles.petImage} 
          />
          <View style={styles.applicationInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.applicationDate}>
              Applied: {new Date(item.applied_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <AdoptionStatusTracker 
          status={item.status}
          petName={pet.name}
          style={styles.statusTracker}
        />

        {nextAction && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={nextAction.action}
          >
            <nextAction.icon size={16} color="#FF6B6B" />
            <Text style={styles.actionButtonText}>{nextAction.label}</Text>
          </TouchableOpacity>
        )}

        {/* Application Details */}
        <View style={styles.applicationDetails}>
          {item.shelter_notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Shelter Notes:</Text>
              <Text style={styles.notesText}>{item.shelter_notes}</Text>
            </View>
          )}
          
          {item.reviewed_at && (
            <Text style={styles.reviewDate}>
              Reviewed: {new Date(item.reviewed_at).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Adoption Applications</Text>
      <Text style={styles.emptyStateSubtitle}>
        Start browsing pets and apply for adoption when you find your perfect match!
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.browseButtonText}>Browse Pets</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Adoption Applications</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Applications List */}
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderApplication}
        contentContainerStyle={[
          styles.listContent,
          applications.length === 0 && styles.listContentEmpty
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  listContent: {
    padding: 20,
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  applicationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  applicationInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  applicationDate: {
    fontSize: 14,
    color: '#666',
  },
  statusTracker: {
    marginVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  applicationDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notesSection: {
    marginBottom: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});