/**
 * PET ADOPTION FLOW SYSTEM
 * Simplified but comprehensive adoption workflow
 */

// Adoption Status Types
export type AdoptionStatus = 
  // Phase 1: Discovery
  | 'browsing'           // User is swiping through pets
  | 'interested'         // User liked/saved a pet (swipe right)
  
  // Phase 2: Initial Application  
  | 'applying'           // User is filling out application
  | 'application_sent'   // Application submitted, waiting for review
  
  // Phase 3: Review Process
  | 'under_review'       // Shelter is reviewing application
  | 'approved'           // Application approved by shelter
  | 'rejected'           // Application rejected
  
  // Phase 4: Meeting & Adoption
  | 'meet_scheduled'     // Meet & greet scheduled
  | 'meeting_completed'  // Meet & greet happened
  | 'adoption_approved'  // Final approval for adoption
  | 'adopted'            // Pet has been adopted
  
  // Edge Cases
  | 'withdrawn'          // User withdrew application
  | 'unavailable';       // Pet became unavailable

// Adoption Application Interface
export interface AdoptionApplication {
  id: string;
  user_id: string;
  pet_id: string;
  status: AdoptionStatus;
  
  // Application Data
  applicant_info: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    employment_status: string;
    housing_type: 'house' | 'apartment' | 'condo' | 'other';
    has_yard: boolean;
    other_pets: string;
    experience_with_pets: string;
    why_adopt: string;
  };
  
  // Process Tracking
  applied_at: string;
  reviewed_at?: string;
  approved_at?: string;
  meeting_scheduled_at?: string;
  adopted_at?: string;
  
  // Communication
  shelter_notes?: string;
  user_notes?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

// Pet Interest (Simplified Matching)
export interface PetInterest {
  id: string;
  user_id: string;
  pet_id: string;
  interest_type: 'like' | 'super_like' | 'pass';
  created_at: string;
}

// Status Flow Helpers
export class AdoptionFlowManager {
  // Get next possible statuses
  static getNextStatuses(currentStatus: AdoptionStatus): AdoptionStatus[] {
    switch (currentStatus) {
      case 'browsing':
        return ['interested'];
        
      case 'interested':
        return ['applying', 'browsing']; // Can go back to browsing
        
      case 'applying':
        return ['application_sent', 'withdrawn'];
        
      case 'application_sent':
        return ['under_review', 'withdrawn'];
        
      case 'under_review':
        return ['approved', 'rejected'];
        
      case 'approved':
        return ['meet_scheduled', 'withdrawn'];
        
      case 'meet_scheduled':
        return ['meeting_completed', 'withdrawn'];
        
      case 'meeting_completed':
        return ['adoption_approved', 'rejected'];
        
      case 'adoption_approved':
        return ['adopted'];
        
      default:
        return []; // Terminal states
    }
  }

  // Check if status allows user action
  static canUserTakeAction(status: AdoptionStatus): boolean {
    return [
      'browsing',
      'interested', 
      'applying',
      'approved',
      'meet_scheduled'
    ].includes(status);
  }

  // Get user-friendly status message
  static getStatusMessage(status: AdoptionStatus): string {
    switch (status) {
      case 'browsing':
        return 'Keep swiping to find your perfect pet!';
      case 'interested':
        return 'You liked this pet! Ready to apply?';
      case 'applying':
        return 'Complete your adoption application';
      case 'application_sent':
        return 'Application sent! Waiting for shelter review';
      case 'under_review':
        return 'Your application is being reviewed';
      case 'approved':
        return 'Congratulations! Your application was approved';
      case 'rejected':
        return 'Application not approved. Keep looking!';
      case 'meet_scheduled':
        return 'Meet & greet scheduled! Get excited!';
      case 'meeting_completed':
        return 'How did the meeting go?';
      case 'adoption_approved':
        return 'You\'re approved to adopt! Final steps ahead';
      case 'adopted':
        return 'Congratulations on your new family member! 🎉';
      case 'withdrawn':
        return 'Application withdrawn';
      case 'unavailable':
        return 'This pet is no longer available';
      default:
        return 'Unknown status';
    }
  }

  // Get status color for UI
  static getStatusColor(status: AdoptionStatus): string {
    switch (status) {
      case 'browsing':
      case 'interested':
        return '#FF6B6B'; // Red/Pink
      case 'applying':
      case 'application_sent':
        return '#FFA500'; // Orange
      case 'under_review':
        return '#4169E1'; // Blue
      case 'approved':
      case 'meet_scheduled':
      case 'adoption_approved':
        return '#32CD32'; // Green
      case 'adopted':
        return '#FFD700'; // Gold
      case 'rejected':
      case 'withdrawn':
      case 'unavailable':
        return '#808080'; // Gray
      default:
        return '#666666';
    }
  }

  // Check if pet is available for adoption
  static isPetAvailable(pet: any, allApplications: AdoptionApplication[]): boolean {
    const activeApplications = allApplications.filter(app => 
      app.pet_id === pet.id && 
      !['rejected', 'withdrawn', 'unavailable'].includes(app.status)
    );

    // If someone has been approved or adopted, pet is unavailable
    const hasActiveAdoption = activeApplications.some(app =>
      ['adopted', 'adoption_approved', 'meeting_completed'].includes(app.status)
    );

    return !hasActiveAdoption;
  }
}

// Mock Data for Development
export const mockAdoptionApplications: AdoptionApplication[] = [
  {
    id: '1',
    user_id: 'user1',
    pet_id: 'pet1',
    status: 'under_review',
    applicant_info: {
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, City, State',
      employment_status: 'Full-time',
      housing_type: 'house',
      has_yard: true,
      other_pets: 'One cat named Whiskers',
      experience_with_pets: '10+ years with dogs and cats',
      why_adopt: 'Looking for a companion for daily walks and outdoor activities'
    },
    applied_at: '2024-10-01T10:00:00Z',
    reviewed_at: '2024-10-02T14:30:00Z',
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-02T14:30:00Z'
  }
];

export const mockPetInterests: PetInterest[] = [
  {
    id: '1',
    user_id: 'user1',
    pet_id: 'pet1',
    interest_type: 'like',
    created_at: '2024-10-01T09:00:00Z'
  },
  {
    id: '2',
    user_id: 'user1',
    pet_id: 'pet2',
    interest_type: 'super_like',
    created_at: '2024-10-01T09:15:00Z'
  }
];