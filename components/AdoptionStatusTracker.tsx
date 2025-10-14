/**
 * ADOPTION STATUS TRACKER COMPONENT
 * Shows current adoption status with progress indicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  FileText, 
  Eye, 
  CheckCircle, 
  Calendar,
  Users,
  Award,
  X,
  Clock
} from 'lucide-react-native';
import { AdoptionStatus, AdoptionFlowManager } from '../lib/adoption-flow';

interface AdoptionStatusTrackerProps {
  status: AdoptionStatus;
  petName: string;
  style?: any;
}

export default function AdoptionStatusTracker({ 
  status, 
  petName, 
  style 
}: AdoptionStatusTrackerProps) {
  
  const getStatusIcon = () => {
    const color = '#fff';
    const size = 24;
    
    switch (status) {
      case 'browsing':
      case 'interested':
        return <Heart size={size} color={color} fill={color} />;
      case 'applying':
      case 'application_sent':
        return <FileText size={size} color={color} />;
      case 'under_review':
        return <Eye size={size} color={color} />;
      case 'approved':
        return <CheckCircle size={size} color={color} />;
      case 'meet_scheduled':
        return <Calendar size={size} color={color} />;
      case 'meeting_completed':
        return <Users size={size} color={color} />;
      case 'adoption_approved':
      case 'adopted':
        return <Award size={size} color={color} />;
      case 'rejected':
      case 'withdrawn':
      case 'unavailable':
        return <X size={size} color={color} />;
      default:
        return <Clock size={size} color={color} />;
    }
  };

  const getProgressPercentage = (): number => {
    const progressMap: Record<AdoptionStatus, number> = {
      'browsing': 0,
      'interested': 15,
      'applying': 25,
      'application_sent': 35,
      'under_review': 50,
      'approved': 65,
      'meet_scheduled': 75,
      'meeting_completed': 85,
      'adoption_approved': 95,
      'adopted': 100,
      'rejected': 0,
      'withdrawn': 0,
      'unavailable': 0,
    };
    
    return progressMap[status] || 0;
  };

  const getTitle = (): string => {
    switch (status) {
      case 'browsing':
        return 'Keep Looking';
      case 'interested':
        return `Interested in ${petName}`;
      case 'applying':
        return `Applying for ${petName}`;
      case 'application_sent':
        return 'Application Submitted';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Application Approved!';
      case 'meet_scheduled':
        return 'Meeting Scheduled';
      case 'meeting_completed':
        return 'Meeting Complete';
      case 'adoption_approved':
        return 'Adoption Approved!';
      case 'adopted':
        return `Welcome Home, ${petName}!`;
      case 'rejected':
        return 'Application Not Approved';
      case 'withdrawn':
        return 'Application Withdrawn';
      case 'unavailable':
        return `${petName} No Longer Available`;
      default:
        return 'Status Unknown';
    }
  };

  const statusColor = AdoptionFlowManager.getStatusColor(status);
  const message = AdoptionFlowManager.getStatusMessage(status);
  const progress = getProgressPercentage();

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[statusColor, `${statusColor}CC`]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {getStatusIcon()}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{getTitle()}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
        
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{progress}% Complete</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'right',
    marginTop: 4,
    opacity: 0.8,
  },
});