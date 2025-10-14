/**
 * LOCALIZATION CONSTANTS
 * Bangladesh-specific language support (Bengali/Bangla & English)
 */

export type Language = 'en' | 'bn';

export interface Translations {
  // Tab Navigation
  discover: string;
  saved: string;
  aiVet: string;
  learn: string;
  shops: string;
  
  // Common Actions
  search: string;
  filter: string;
  save: string;
  share: string;
  back: string;
  next: string;
  submit: string;
  cancel: string;
  
  // Pet Discovery
  swipeRight: string;
  swipeLeft: string;
  viewProfile: string;
  contactShelter: string;
  
  // Pet Details
  age: string;
  breed: string;
  size: string;
  gender: string;
  location: string;
  vaccinated: string;
  neutered: string;
  
  // App Name & Tagline
  appName: string;
  tagline: string;
  welcomeMessage: string;
  
  // Bangladesh-specific
  currency: string;
  distanceUnit: string;
  
  // Cities in Bangladesh
  cities: {
    dhaka: string;
    chittagong: string;
    sylhet: string;
    rajshahi: string;
    khulna: string;
    barisal: string;
    rangpur: string;
    mymensingh: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    // Tab Navigation
    discover: 'Discover',
    saved: 'Saved',
    aiVet: 'AI Vet',
    learn: 'Learn',
    shops: 'Shops',
    
    // Common Actions
    search: 'Search',
    filter: 'Filter',
    save: 'Save',
    share: 'Share',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    cancel: 'Cancel',
    
    // Pet Discovery
    swipeRight: 'Swipe right to like',
    swipeLeft: 'Swipe left to pass',
    viewProfile: 'View Full Profile',
    contactShelter: 'Contact Shelter',
    
    // Pet Details
    age: 'Age',
    breed: 'Breed',
    size: 'Size',
    gender: 'Gender',
    location: 'Location',
    vaccinated: 'Vaccinated',
    neutered: 'Neutered',
    
    // App Name & Tagline
    appName: 'Pawfect Match',
    tagline: 'Find Your Perfect Pet',
    welcomeMessage: 'Find your perfect furry friend',
    
    // Bangladesh-specific
    currency: '৳', // Taka symbol
    distanceUnit: 'km',
    
    // Cities in Bangladesh
    cities: {
      dhaka: 'Dhaka',
      chittagong: 'Chittagong',
      sylhet: 'Sylhet',
      rajshahi: 'Rajshahi',
      khulna: 'Khulna',
      barisal: 'Barisal',
      rangpur: 'Rangpur',
      mymensingh: 'Mymensingh',
    },
  },
  
  bn: {
    // Tab Navigation
    discover: 'আবিষ্কার',
    saved: 'সংরক্ষিত',
    aiVet: 'এআই ভেট',
    learn: 'শিখুন',
    shops: 'দোকান',
    
    // Common Actions
    search: 'খুঁজুন',
    filter: 'ফিল্টার',
    save: 'সংরক্ষণ',
    share: 'শেয়ার',
    back: 'পিছনে',
    next: 'পরবর্তী',
    submit: 'জমা দিন',
    cancel: 'বাতিল',
    
    // Pet Discovery
    swipeRight: 'পছন্দ করতে ডানে সোয়াইপ করুন',
    swipeLeft: 'বাদ দিতে বামে সোয়াইপ করুন',
    viewProfile: 'সম্পূর্ণ প্রোফাইল দেখুন',
    contactShelter: 'আশ্রয়ে যোগাযোগ করুন',
    
    // Pet Details
    age: 'বয়স',
    breed: 'জাত',
    size: 'আকার',
    gender: 'লিঙ্গ',
    location: 'অবস্থান',
    vaccinated: 'টিকা দেওয়া',
    neutered: 'নিরপেক্ষ',
    
    // App Name & Tagline
    appName: 'পফেক্ট ম্যাচ',
    tagline: 'আপনার নিখুঁত পোষা প্রাণী খুঁজুন',
    welcomeMessage: 'আপনার নিখুঁত পশম বন্ধু খুঁজুন',
    
    // Bangladesh-specific
    currency: '৳', // Taka symbol
    distanceUnit: 'কিমি',
    
    // Cities in Bangladesh
    cities: {
      dhaka: 'ঢাকা',
      chittagong: 'চট্টগ্রাম',
      sylhet: 'সিলেট',
      rajshahi: 'রাজশাহী',
      khulna: 'খুলনা',
      barisal: 'বরিশাল',
      rangpur: 'রংপুর',
      mymensingh: 'ময়মনসিংহ',
    },
  },
};

// Default language
export const DEFAULT_LANGUAGE: Language = 'en';

// Helper function to get translation
export const getTranslation = (key: keyof Translations, lang: Language = DEFAULT_LANGUAGE): string => {
  return translations[lang][key];
};

// Bangladesh-specific constants
export const BD_CONFIG = {
  country: 'Bangladesh',
  countryCode: 'BD',
  currency: '৳',
  currencyCode: 'BDT',
  phonePrefix: '+880',
  timezone: 'Asia/Dhaka',
  dateFormat: 'DD/MM/YYYY',
  
  // Major cities for location filtering
  majorCities: [
    { id: 'dhaka', name: 'Dhaka', nameBn: 'ঢাকা' },
    { id: 'chittagong', name: 'Chittagong', nameBn: 'চট্টগ্রাম' },
    { id: 'sylhet', name: 'Sylhet', nameBn: 'সিলেট' },
    { id: 'rajshahi', name: 'Rajshahi', nameBn: 'রাজশাহী' },
    { id: 'khulna', name: 'Khulna', nameBn: 'খুলনা' },
    { id: 'barisal', name: 'Barisal', nameBn: 'বরিশাল' },
    { id: 'rangpur', name: 'Rangpur', nameBn: 'রংপুর' },
    { id: 'mymensingh', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
  ],
  
  // Common pet breeds in Bangladesh
  commonBreeds: {
    dogs: [
      'Deshi Dog (দেশি কুকুর)',
      'German Shepherd',
      'Labrador',
      'Golden Retriever',
      'Pomeranian',
      'Husky',
      'Rottweiler',
      'Doberman',
    ],
    cats: [
      'Deshi Cat (দেশি বিড়াল)',
      'Persian',
      'Siamese',
      'Maine Coon',
      'Bengal',
      'British Shorthair',
    ],
  },
  
  // Price ranges in BDT
  adoptionFees: {
    min: 0,
    max: 50000,
    typical: 5000,
  },
};
