// Adoption Flow Types - Clear Structure for Pet Adoption Process

export interface AdoptionInteraction {
  id: string;
  userId: string;
  petId: string;
  type: 'like' | 'pass' | 'super_like';
  timestamp: Date;
}

export interface MatchStatus {
  id: string;
  userId: string;
  petId: string;
  shelterId: string;
  isMatch: boolean; // Both user liked and shelter approved initial interest
  timestamp: Date;
}

export interface AdoptionApplication {
  id: string;
  userId: string;
  petId: string;
  shelterId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed';
  
  // Application details
  experienceLevel: 'first_time' | 'some_experience' | 'very_experienced';
  livingSpace: 'apartment' | 'house_with_yard' | 'house_without_yard' | 'farm';
  hasOtherPets: boolean;
  otherPetsDetails?: string;
  workSchedule: 'work_from_home' | 'part_time' | 'full_time' | 'retired';
  reasonForAdoption: string;
  
  // Contact preferences
  preferredContactMethod: 'email' | 'phone' | 'video_call';
  availableForInterview: string[];
  
  // Timeline
  submittedAt?: Date;
  reviewedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  completedAt?: Date;
  
  // Communication
  shelterNotes?: string;
  rejectionReason?: string;
}

export interface AdoptionMessage {
  id: string;
  applicationId: string;
  senderId: string;
  senderType: 'user' | 'shelter';
  message: string;
  timestamp: Date;
  readAt?: Date;
}

// Flow Status Enum for easy tracking
export enum AdoptionFlowStatus {
  // Phase 1: Discovery
  BROWSING = 'browsing',
  LIKED = 'liked',
  
  // Phase 2: Matching
  MATCHED = 'matched', // Mutual interest
  CHATTING = 'chatting',
  
  // Phase 3: Application
  CONSIDERING = 'considering',
  APPLYING = 'applying',
  APPLIED = 'applied',
  
  // Phase 4: Review
  UNDER_REVIEW = 'under_review',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  
  // Phase 5: Decision
  APPROVED = 'approved',
  REJECTED = 'rejected',
  
  // Phase 6: Adoption
  MEET_AND_GREET = 'meet_and_greet',
  TRIAL_PERIOD = 'trial_period',
  ADOPTED = 'adopted',
  
  // Special cases
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired'
}

// User Journey Steps - Clear progression
export interface AdoptionFlowStep {
  status: AdoptionFlowStatus;
  title: string;
  description: string;
  nextActions: string[];
  timelineEstimate?: string;
}

export const ADOPTION_FLOW_STEPS: Record<AdoptionFlowStatus, AdoptionFlowStep> = {
  [AdoptionFlowStatus.BROWSING]: {
    status: AdoptionFlowStatus.BROWSING,
    title: 'Discovering Pets',
    description: 'Browse through available pets and swipe right on ones you love!',
    nextActions: ['Swipe right to like a pet', 'Use filters to narrow your search'],
  },
  
  [AdoptionFlowStatus.LIKED]: {
    status: AdoptionFlowStatus.LIKED,
    title: 'Pet Saved',
    description: 'You\'ve shown interest in this pet. Check your Saved tab to see all your liked pets.',
    nextActions: ['View pet details', 'Message the shelter', 'Continue browsing'],
  },
  
  [AdoptionFlowStatus.MATCHED]: {
    status: AdoptionFlowStatus.MATCHED,
    title: 'It\'s a Match!',
    description: 'Great news! The shelter has approved your initial interest in this pet.',
    nextActions: ['Start chatting with the shelter', 'Learn more about the pet', 'Schedule a visit'],
    timelineEstimate: 'Response within 24-48 hours',
  },
  
  [AdoptionFlowStatus.CHATTING]: {
    status: AdoptionFlowStatus.CHATTING,
    title: 'Getting to Know Each Other',
    description: 'Chat with the shelter to learn more about the pet and share information about yourself.',
    nextActions: ['Continue conversation', 'Submit adoption application', 'Schedule a meet & greet'],
    timelineEstimate: '1-3 days of conversation',
  },
  
  [AdoptionFlowStatus.CONSIDERING]: {
    status: AdoptionFlowStatus.CONSIDERING,
    title: 'Thinking It Over',
    description: 'Take your time to consider if this pet is the right fit for your lifestyle.',
    nextActions: ['Submit application when ready', 'Ask more questions', 'Visit the pet'],
  },
  
  [AdoptionFlowStatus.APPLYING]: {
    status: AdoptionFlowStatus.APPLYING,
    title: 'Completing Application',
    description: 'Fill out the adoption application with details about your experience and living situation.',
    nextActions: ['Complete all required fields', 'Submit application', 'Prepare for interview'],
  },
  
  [AdoptionFlowStatus.APPLIED]: {
    status: AdoptionFlowStatus.APPLIED,
    title: 'Application Submitted',
    description: 'Your application has been submitted and is being reviewed by the shelter.',
    nextActions: ['Wait for shelter response', 'Prepare for potential interview'],
    timelineEstimate: '3-7 business days',
  },
  
  [AdoptionFlowStatus.UNDER_REVIEW]: {
    status: AdoptionFlowStatus.UNDER_REVIEW,
    title: 'Under Review',
    description: 'The shelter is carefully reviewing your application and checking references.',
    nextActions: ['Respond to any follow-up questions', 'Be available for contact'],
    timelineEstimate: '5-10 business days',
  },
  
  [AdoptionFlowStatus.INTERVIEW_SCHEDULED]: {
    status: AdoptionFlowStatus.INTERVIEW_SCHEDULED,
    title: 'Interview Scheduled',
    description: 'The shelter would like to interview you to discuss the adoption in detail.',
    nextActions: ['Prepare for interview', 'Gather required documents', 'Plan questions to ask'],
    timelineEstimate: 'Within 2 weeks',
  },
  
  [AdoptionFlowStatus.APPROVED]: {
    status: AdoptionFlowStatus.APPROVED,
    title: 'Application Approved!',
    description: 'Congratulations! Your application has been approved. Time to meet your new pet!',
    nextActions: ['Schedule meet & greet', 'Prepare your home', 'Plan adoption day'],
    timelineEstimate: 'Meet within 1 week',
  },
  
  [AdoptionFlowStatus.REJECTED]: {
    status: AdoptionFlowStatus.REJECTED,
    title: 'Application Not Approved',
    description: 'Unfortunately, your application wasn\'t approved this time. Don\'t give up - there are many pets waiting for homes!',
    nextActions: ['Read feedback from shelter', 'Consider other pets', 'Improve application for next time'],
  },
  
  [AdoptionFlowStatus.MEET_AND_GREET]: {
    status: AdoptionFlowStatus.MEET_AND_GREET,
    title: 'Meet & Greet Scheduled',
    description: 'Time to meet your potential new family member in person!',
    nextActions: ['Visit the shelter', 'Spend time with the pet', 'Make final decision'],
    timelineEstimate: '1-2 hour visit',
  },
  
  [AdoptionFlowStatus.TRIAL_PERIOD]: {
    status: AdoptionFlowStatus.TRIAL_PERIOD,
    title: 'Trial Period',
    description: 'You\'re taking the pet home for a trial period to ensure it\'s a good fit.',
    nextActions: ['Monitor pet adjustment', 'Follow shelter guidelines', 'Communicate with shelter'],
    timelineEstimate: '1-2 weeks trial',
  },
  
  [AdoptionFlowStatus.ADOPTED]: {
    status: AdoptionFlowStatus.ADOPTED,
    title: 'Adoption Complete!',
    description: 'Congratulations! You\'ve successfully adopted your new pet. Welcome to the family!',
    nextActions: ['Schedule vet checkup', 'Join our pet parent community', 'Share your success story'],
  },
  
  [AdoptionFlowStatus.WITHDRAWN]: {
    status: AdoptionFlowStatus.WITHDRAWN,
    title: 'Application Withdrawn',
    description: 'You\'ve withdrawn your application. You can always apply for other pets.',
    nextActions: ['Browse other pets', 'Reconsider when ready', 'Update preferences'],
  },
  
  [AdoptionFlowStatus.EXPIRED]: {
    status: AdoptionFlowStatus.EXPIRED,
    title: 'Application Expired',
    description: 'This application has expired due to inactivity.',
    nextActions: ['Apply again if still interested', 'Browse other pets', 'Update contact information'],
  },
};

// Helper functions for flow management
export const getNextPossibleStatuses = (currentStatus: AdoptionFlowStatus): AdoptionFlowStatus[] => {
  switch (currentStatus) {
    case AdoptionFlowStatus.BROWSING:
      return [AdoptionFlowStatus.LIKED];
    
    case AdoptionFlowStatus.LIKED:
      return [AdoptionFlowStatus.MATCHED, AdoptionFlowStatus.EXPIRED];
    
    case AdoptionFlowStatus.MATCHED:
      return [AdoptionFlowStatus.CHATTING, AdoptionFlowStatus.CONSIDERING];
    
    case AdoptionFlowStatus.CHATTING:
      return [AdoptionFlowStatus.CONSIDERING, AdoptionFlowStatus.APPLYING];
    
    case AdoptionFlowStatus.CONSIDERING:
      return [AdoptionFlowStatus.APPLYING, AdoptionFlowStatus.WITHDRAWN];
    
    case AdoptionFlowStatus.APPLYING:
      return [AdoptionFlowStatus.APPLIED, AdoptionFlowStatus.WITHDRAWN];
    
    case AdoptionFlowStatus.APPLIED:
      return [AdoptionFlowStatus.UNDER_REVIEW, AdoptionFlowStatus.INTERVIEW_SCHEDULED, AdoptionFlowStatus.WITHDRAWN];
    
    case AdoptionFlowStatus.UNDER_REVIEW:
      return [AdoptionFlowStatus.INTERVIEW_SCHEDULED, AdoptionFlowStatus.APPROVED, AdoptionFlowStatus.REJECTED];
    
    case AdoptionFlowStatus.INTERVIEW_SCHEDULED:
      return [AdoptionFlowStatus.APPROVED, AdoptionFlowStatus.REJECTED];
    
    case AdoptionFlowStatus.APPROVED:
      return [AdoptionFlowStatus.MEET_AND_GREET, AdoptionFlowStatus.WITHDRAWN];
    
    case AdoptionFlowStatus.MEET_AND_GREET:
      return [AdoptionFlowStatus.TRIAL_PERIOD, AdoptionFlowStatus.ADOPTED, AdoptionFlowStatus.WITHDRAWN];
    
    case AdoptionFlowStatus.TRIAL_PERIOD:
      return [AdoptionFlowStatus.ADOPTED, AdoptionFlowStatus.WITHDRAWN];
    
    default:
      return []; // Terminal states
  }
};

export const isTerminalStatus = (status: AdoptionFlowStatus): boolean => {
  return [
    AdoptionFlowStatus.ADOPTED,
    AdoptionFlowStatus.REJECTED,
    AdoptionFlowStatus.WITHDRAWN,
    AdoptionFlowStatus.EXPIRED
  ].includes(status);
};

export const getStatusProgress = (status: AdoptionFlowStatus): number => {
  const progressMap: Record<AdoptionFlowStatus, number> = {
    [AdoptionFlowStatus.BROWSING]: 0,
    [AdoptionFlowStatus.LIKED]: 10,
    [AdoptionFlowStatus.MATCHED]: 20,
    [AdoptionFlowStatus.CHATTING]: 30,
    [AdoptionFlowStatus.CONSIDERING]: 40,
    [AdoptionFlowStatus.APPLYING]: 50,
    [AdoptionFlowStatus.APPLIED]: 60,
    [AdoptionFlowStatus.UNDER_REVIEW]: 70,
    [AdoptionFlowStatus.INTERVIEW_SCHEDULED]: 80,
    [AdoptionFlowStatus.APPROVED]: 85,
    [AdoptionFlowStatus.MEET_AND_GREET]: 90,
    [AdoptionFlowStatus.TRIAL_PERIOD]: 95,
    [AdoptionFlowStatus.ADOPTED]: 100,
    [AdoptionFlowStatus.REJECTED]: 0,
    [AdoptionFlowStatus.WITHDRAWN]: 0,
    [AdoptionFlowStatus.EXPIRED]: 0,
  };
  
  return progressMap[status] || 0;
};
