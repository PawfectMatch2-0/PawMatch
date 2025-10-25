// BANGLADESHI PET CONTENT & SERVICES STRUCTURE
// Fill in the real data based on this format

export interface BangladeshiLearningArticle {
  id: string;
  title: string;
  category: 'basic-care' | 'training' | 'health' | 'breed-guide' | 'emergency' | 'pet-services';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  content: string;
  summary: string;
  tags: string[];
  author: string;
  featuredImage: string;
  location: 'bangladesh' | 'dhaka' | 'chittagong' | 'sylhet' | 'general';
  createdAt: Date;
  likes: number;
  views: number;
}

export interface PetServiceProvider {
  id: string;
  name: string;
  category: 'veterinary' | 'grooming' | 'training' | 'boarding' | 'pet-store' | 'emergency';
  description: string;
  services: string[];
  location: {
    area: string;
    district: string;
    address: string;
    landmarks?: string;
  };
  contact: {
    phone: string[];
    email?: string;
    facebook?: string;
    website?: string;
    whatsapp?: string;
  };
  timings: {
    weekdays: string;
    weekends: string;
    emergency?: boolean;
  };
  specialties: string[];
  priceRange: 'budget' | 'moderate' | 'premium';
  rating: number;
  reviews: number;
  established: number;
  languages: string[];
  acceptsInsurance: boolean;
  homeService: boolean;
  featuredImage: string;
  gallery?: string[];
}

// ===========================================
// LEARNING ARTICLES FOR BANGLADESH
// ===========================================

export const bangladeshiLearningArticles: BangladeshiLearningArticle[] = [
  // BREED GUIDES - POPULAR IN BANGLADESH
  {
    id: 'bd-breed-001',
    title: 'বাংলাদেশে জনপ্রিয় কুকুরের জাত: সম্পূর্ণ গাইড',
    category: 'breed-guide',
    difficulty: 'beginner',
    estimatedReadTime: 12,
    content: `# বাংলাদেশে জনপ্রিয় কুকুরের জাত

## ১. জার্মান শেফার্ড (German Shepherd)
- **বৈশিষ্ট্য**: বুদ্ধিমান, অনুগত, রক্ষক প্রকৃতির
- **আকার**: বড় (২৫-৪০ কেজি)
- **জলবায়ু সহনশীলতা**: মধ্যম (গরমে বিশেষ যত্ন প্রয়োজন)
- **দাম পরিসীমা**: ৩০,০০০-১,০০,০০০ টাকা

## ২. ল্যাব্রাডর রিট্রিভার (Labrador Retriever)
- **বৈশিষ্ট্য**: বন্ধুত্বপূর্ণ, শিশুদের সাথে ভালো
- **আকার**: বড় (২৫-৩৫ কেজি)
- **জলবায়ু সহনশীলতা**: ভালো
- **দাম পরিসীমা**: ২৫,০০০-৮০,০০০ টাকা

## ৩. পোমেরেনিয়ান (Pomeranian)
- **বৈশিষ্ট্য**: ছোট, সুন্দর, পারিবারিক
- **আকার**: ছোট (২-৪ কেজি)
- **জলবায়ু সহনশীলতা**: গরমে সমস্যা
- **দাম পরিসীমা**: ১৫,০০০-৫০,০০০ টাকা

[Continue with more breeds...]

## বাংলাদেশের জলবায়ুর জন্য উপযুক্ত জাত
- ল্যাব্রাডর
- বিগল
- স্থানীয় দেশি কুকুর
- ইন্ডিয়ান স্পিটজ

## প্রতিটি জাতের জন্য বিশেষ যত্ন
### গরমকালীন যত্ন:
- পর্যাপ্ত পানি
- শীতাতপ নিয়ন্ত্রিত পরিবেশ
- নিয়মিত গোসল

### বর্ষাকালীন যত্ন:
- শুকনো রাখা
- ফাঙ্গাল ইনফেকশন প্রতিরোধ
- নিয়মিত ব্রাশিং`,
    summary: 'বাংলাদেশে জনপ্রিয় কুকুরের জাত সম্পর্কে বিস্তারিত তথ্য এবং স্থানীয় জলবায়ুতে তাদের যত্ন নেওয়ার উপায়।',
    tags: ['বাংলাদেশ', 'কুকুর', 'জাত', 'গাইড', 'জলবায়ু'],
    author: 'ডাঃ রহিম উদ্দিন, ভেটেরিনারিয়ান',
    featuredImage: 'https://example.com/bangladesh-dog-breeds.jpg',
    location: 'bangladesh',
    createdAt: new Date('2024-01-15'),
    likes: 156,
    views: 890,
  },
  
  // BASIC CARE - BANGLADESH SPECIFIC
  {
    id: 'bd-care-001',
    title: 'বাংলাদেশের গরমে পোষা প্রাণীর যত্ন',
    category: 'basic-care',
    difficulty: 'beginner',
    estimatedReadTime: 8,
    content: `# বাংলাদেশের গরমে পোষা প্রাণীর যত্ন

## গরমকালীন সমস্যা
- হিট স্ট্রোক
- ডিহাইড্রেশন
- ত্বকের সমস্যা
- খাবারে অরুচি

## প্রতিরোধের উপায়
### ১. পানির ব্যবস্থা
- সর্বদা পরিষ্কার পানি রাখুন
- দিনে কয়েকবার পানি পরিবর্তন করুন
- বরফ দেওয়া পানি দিতে পারেন

### ২. খাবারের সময়সূচী
- সকাল ও সন্ধ্যায় খাবার দিন
- দুপুরে ভারী খাবার এড়িয়ে চলুন
- পানিযুক্ত খাবার বেশি দিন

### ৩. ঘরের পরিবেশ
- ফ্যান বা এসি চালু রাখুন
- ছায়াযুক্ত ঠান্ডা জায়গা তৈরি করুন
- মাদুর বা টাইলসের উপর শুতে দিন

## জরুরি অবস্থার লক্ষণ
- অতিরিক্ত হাঁপানি
- মুখ দিয়ে লালা পড়া
- অজ্ঞান হয়ে যাওয়া
- বমি করা

এসব লক্ষণ দেখলে তৎক্ষণাত ভেটেরিনারিয়ানের কাছে নিয়ে যান।`,
    summary: 'বাংলাদেশের গরম আবহাওয়ায় কীভাবে পোষা প্রাণীর সঠিক যত্ন নেবেন এবং হিট স্ট্রোক প্রতিরোধ করবেন।',
    tags: ['গরম', 'যত্ন', 'হিট স্ট্রোক', 'পানি', 'বাংলাদেশ'],
    author: 'ডাঃ ফাতেমা খাতুন',
    featuredImage: 'https://example.com/summer-pet-care-bd.jpg',
    location: 'bangladesh',
    createdAt: new Date('2024-03-15'),
    likes: 245,
    views: 1200,
  },

  // Add more articles...
  // - Monsoon care for pets in Bangladesh
  // - Local vaccination schedules
  // - Common diseases in Bangladesh
  // - Street animal care
  // - Pet-friendly places in Dhaka
];

// ===========================================
// PET SERVICE PROVIDERS IN DHAKA
// ===========================================

export const dhakaVeterinaryServices: PetServiceProvider[] = [
  {
    id: 'dhk-vet-001',
    name: 'Care & Cure Veterinary Clinic',
    category: 'veterinary',
    description: 'Complete pet healthcare provider with experienced doctors. Clients appreciate friendly staff and fast emergency response.',
    services: [
      'General checkups',
      'Surgery',
      'Emergency care',
      'Lab tests',
      'Vaccination'
    ],
    location: {
      area: 'Dhanmondi',
      district: 'Dhaka',
      address: 'House 28, Road 7, Dhanmondi Lake Road, Dhaka 1205, Bangladesh',
      landmarks: 'Located on Dhanmondi Lake Road'
    },
    contact: {
      phone: ['01551-807384'],
      facebook: 'facebook.com/careandcurevetclinic'
    },
    timings: {
      weekdays: '10:00 AM - 8:00 PM',
      weekends: '10:00 AM - 8:00 PM',
      emergency: true
    },
    specialties: [
      'Small animals',
      'Surgery',
      'Dentistry'
    ],
    priceRange: 'moderate',
    rating: 4.5,
    reviews: 89,
    established: 2015,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: false,
    featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=400&h=300'
  },
  {
    id: 'dhk-vet-002',
    name: 'Pet Heaven Veterinary Clinic',
    category: 'veterinary',
    description: 'Highly rated for surgical outcomes and post-op care. Specializes in spay/neuter and emergency C-sections.',
    services: [
      'Spay/Neuter',
      'Emergency C-section',
      'Deworming',
      'Vaccination'
    ],
    location: {
      area: 'Mirpur',
      district: 'Dhaka',
      address: '567/1-Barek Mollar Mor, Mirpur 60 Feet Road, Dhaka 1216, Bangladesh',
      landmarks: 'Located on Mirpur 60 Feet Road'
    },
    contact: {
      phone: ['01944-370090'],
      facebook: 'facebook.com/PetHeavenVetClinic'
    },
    timings: {
      weekdays: '10:00 AM - 10:00 PM (Lunch break 3:00-5:00 PM)',
      weekends: '10:00 AM - 10:00 PM (Lunch break 3:00-5:00 PM)',
      emergency: true
    },
    specialties: [
      'Cats & Dogs',
      'Surgery',
      'Neuter/Spay'
    ],
    priceRange: 'moderate',
    rating: 4.7,
    reviews: 112,
    established: 2018,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: false,
    featuredImage: 'https://images.unsplash.com/photo-1559190394-90caa8fc893c?auto=format&fit=crop&w=400&h=300'
  },
  {
    id: 'dhk-vet-003',
    name: 'MR Veterinary Clinic',
    category: 'veterinary',
    description: 'Affordable vet care with home visit services. Surgery requires prior booking. Good for routine care and emergency treatment.',
    services: [
      'General treatment',
      'Vaccination',
      'Surgery by appointment',
      'Home visit'
    ],
    location: {
      area: 'East Bashabo',
      district: 'Dhaka',
      address: '126/6 Patwary Gali, East Bashabo, Dhaka 1214, Bangladesh',
      landmarks: 'Located in East Bashabo area'
    },
    contact: {
      phone: ['01521-489206'],
      facebook: 'facebook.com/MRVeterinaryClinic'
    },
    timings: {
      weekdays: '10:00 AM - 4:00 PM',
      weekends: '10:00 AM - 4:00 PM',
      emergency: false
    },
    specialties: [
      'Small pets',
      'Emergency care',
      'Home visits'
    ],
    priceRange: 'budget',
    rating: 4.2,
    reviews: 76,
    established: 2019,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: true,
    featuredImage: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=400&h=300'
  }
];

export const dhakaGroomingServices: PetServiceProvider[] = [
  {
    id: 'dhk-groom-001',
    name: 'Pet Grooming BD',
    category: 'grooming',
    description: 'Professional pet grooming services with home service available. Convenient and professional service with advance payment required.',
    services: [
      'Bath',
      'Haircut',
      'Nail trim',
      'Ear cleaning',
      'Home service available'
    ],
    location: {
      area: 'Mohammadpur',
      district: 'Dhaka',
      address: '25/22 Block-C, Tajmohal Road, Mohammadpur, Dhaka 1207, Bangladesh',
      landmarks: 'Located on Tajmohal Road'
    },
    contact: {
      phone: ['01717-227070']
    },
    timings: {
      weekdays: '9:00 AM - 8:00 PM',
      weekends: '10:00 AM - 6:00 PM',
      emergency: false
    },
    specialties: [
      'Breed-specific grooming: Pomeranian, Shih Tzu',
      'Home service specialist',
      'Small to medium dogs'
    ],
    priceRange: 'moderate',
    rating: 4.3,
    reviews: 67,
    established: 2018,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: true,
    featuredImage: 'https://images.unsplash.com/photo-1568461603322-67b2eaccbfba?auto=format&fit=crop&w=400&h=300'
  },
  {
    id: 'dhk-groom-002',
    name: 'Head to Tail – Pet Groom & Care',
    category: 'grooming',
    description: 'Premium grooming with on-site accessories store. Large breed specialists with imported accessories available.',
    services: [
      'Grooming',
      'Bath & blow-dry',
      'Accessories sale'
    ],
    location: {
      area: 'Madani Avenue',
      district: 'Dhaka',
      address: '100ft Madani Avenue, Dhaka, Bangladesh',
      landmarks: 'Located on 100ft Madani Avenue'
    },
    contact: {
      phone: ['Contact via Facebook']
    },
    timings: {
      weekdays: '10:00 AM - 8:00 PM',
      weekends: '10:00 AM - 6:00 PM',
      emergency: false
    },
    specialties: [
      'Large breed dogs',
      'Imported accessories',
      'Premium grooming services'
    ],
    priceRange: 'premium',
    rating: 4.1,
    reviews: 43,
    established: 2019,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: false,
    featuredImage: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&h=300'
  }
];

export const dhakaTrainingServices: PetServiceProvider[] = [
  {
    id: 'dhk-train-001',
    name: 'Dogs Health Care Centre & Puppy Training, Mirpur-1',
    category: 'training',
    description: 'Effective training with good home-visit support. Approximately 85% success rate with experienced trainers.',
    services: [
      'Basic obedience',
      'Puppy classes',
      'Home training available'
    ],
    location: {
      area: 'Mirpur-1',
      district: 'Dhaka',
      address: 'Flat-8A (8th floor), 371 South Paikpara, Mirpur-1, Dhaka 1216, Bangladesh',
      landmarks: 'Located in South Paikpara area'
    },
    contact: {
      phone: ['01819-263621'],
      email: 'doghealthcare@yahoo.com',
      website: 'www.petcareclinic-bd.com'
    },
    timings: {
      weekdays: '6:00 AM - 10:00 AM, 5:00 PM - 8:00 PM',
      weekends: '6:00 AM - 12:00 PM',
      emergency: false
    },
    specialties: [
      'Puppy foundation',
      'Behavior correction',
      'Home visit training'
    ],
    priceRange: 'moderate',
    rating: 4.5,
    reviews: 32,
    established: 2018,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: true,
    featuredImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=300'
  },
  {
    id: 'dhk-train-002',
    name: 'Surokkha Vet Clinic – Pet Training Unit',
    category: 'training',
    description: 'Good choice for large breed training and home-service sessions. Specializes in guard dog training with 80% success rate.',
    services: [
      'Obedience',
      'Guard dog training',
      'Individual & group sessions'
    ],
    location: {
      area: 'Sobhanbag',
      district: 'Dhaka',
      address: 'Mohammadia Super Market (1st Floor), Sobhanbag, Mirpur Road, Dhaka 1216, Bangladesh',
      landmarks: 'Located in Mohammadia Super Market'
    },
    contact: {
      phone: ['01711-770827']
    },
    timings: {
      weekdays: '6:00 AM - 10:00 AM, 4:00 PM - 8:00 PM',
      weekends: '6:00 AM - 12:00 PM',
      emergency: false
    },
    specialties: [
      'Guard dogs',
      'Behavior training for large breeds',
      'Individual training sessions'
    ],
    priceRange: 'moderate',
    rating: 4.3,
    reviews: 28,
    established: 2019,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: true,
    featuredImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&h=300'
  }
];

export const dhakaPetStores: PetServiceProvider[] = [
  {
    id: 'dhk-store-001',
    name: 'Paw Care',
    category: 'pet-store',
    description: 'Wide selection and good after-sales service. Complete pet supplies with quality products and online ordering.',
    services: [
      'Food',
      'Toys',
      'Medicine',
      'Accessories',
      'Home delivery'
    ],
    location: {
      area: 'Katabon',
      district: 'Dhaka',
      address: 'Katabon, 290 Dhaka University Market, Dhaka 1205, Bangladesh',
      landmarks: 'Located in Dhaka University Market'
    },
    contact: {
      phone: ['01700-000000'],
      website: 'pawcare.com.bd'
    },
    timings: {
      weekdays: '9:00 AM - 9:00 PM',
      weekends: '9:00 AM - 10:00 PM',
      emergency: false
    },
    specialties: [
      'Royal Canin',
      'Reflex',
      'Whiskas',
      'Imported Toys'
    ],
    priceRange: 'moderate',
    rating: 4.2,
    reviews: 95,
    established: 2016,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: true,
    featuredImage: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?auto=format&fit=crop&w=400&h=300'
  },
  {
    id: 'dhk-store-002',
    name: 'Bangladesh Pet House',
    category: 'pet-store',
    description: 'Known for exotic fish and good packaging for delivery. Expert advice and pet resale accepted under policy.',
    services: [
      'Pets',
      'Food',
      'Toys',
      'Aquarium',
      'Home delivery'
    ],
    location: {
      area: 'Katabon',
      district: 'Dhaka',
      address: '290 Dhaka University Market, Katabon, Dhaka 1205, Bangladesh',
      landmarks: 'Located in Dhaka University Market'
    },
    contact: {
      phone: ['01711-146763']
    },
    timings: {
      weekdays: '10:00 AM - 8:00 PM',
      weekends: '10:00 AM - 9:00 PM',
      emergency: false
    },
    specialties: [
      'Imported Fish',
      'Premium Dog Foods',
      'Aquarium setup',
      'Pet consultation'
    ],
    priceRange: 'moderate',
    rating: 4.4,
    reviews: 78,
    established: 2017,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: true,
    featuredImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&h=300'
  },
  {
    id: 'dhk-store-003',
    name: 'Head to Tail – Pet Store & Groom',
    category: 'pet-store',
    description: 'Large store with grooming services and good stock of imported items. Membership discounts available.',
    services: [
      'Food',
      'Accessories',
      'Grooming Services',
      'Home delivery'
    ],
    location: {
      area: 'Madani Avenue',
      district: 'Dhaka',
      address: '100ft Madani Avenue, Dhaka, Bangladesh',
      landmarks: 'Located on 100ft Madani Avenue'
    },
    contact: {
      phone: ['Contact via Facebook']
    },
    timings: {
      weekdays: '10:00 AM - 8:00 PM',
      weekends: '10:00 AM - 9:00 PM',
      emergency: false
    },
    specialties: [
      'International Pet Brands',
      'Combined store and grooming',
      'Premium accessories'
    ],
    priceRange: 'premium',
    rating: 4.0,
    reviews: 52,
    established: 2019,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: true,
    featuredImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=300'
  }
];

export const dhakaBoardingServices: PetServiceProvider[] = [
  {
    id: 'dhk-board-001',
    name: 'Paw Stay Boarding',
    category: 'boarding',
    description: 'Safe and caring pet boarding facility with professional 24/7 care. Air-conditioned rooms and trained staff.',
    services: [
      '24/7 supervision',
      'Air conditioned rooms',
      'Regular exercise',
      'Medical care',
      'Grooming service',
      'Video updates',
      'Pickup/drop service',
      'Special diet'
    ],
    location: {
      area: 'Mirpur',
      district: 'Dhaka',
      address: 'Mirpur-1, Dhaka, Bangladesh',
      landmarks: 'Near Mirpur-1 Circle'
    },
    contact: {
      phone: ['01711-123456'],
      email: 'info@pawstaybd.com',
      facebook: 'facebook.com/pawstayboarding',
      website: 'www.pawstaybd.com'
    },
    timings: {
      weekdays: '24 hours open',
      weekends: '24 hours open',
      emergency: true
    },
    specialties: [
      'Large breed expert',
      'Medical boarding',
      'Long term stay',
      'Puppy day care'
    ],
    priceRange: 'moderate',
    rating: 4.4,
    reviews: 67,
    established: 2019,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: false,
    featuredImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=300'
  },
  {
    id: 'dhk-board-002',
    name: 'Fur Home Boarding',
    category: 'boarding',
    description: 'Homely environment for pets with personalized care. Family-run boarding service with outdoor play area.',
    services: [
      'Home-style boarding',
      'Personalized care',
      'Daily walks',
      'Play sessions',
      'Medicine administration',
      'Photo updates',
      'Transportation service'
    ],
    location: {
      area: 'Dhanmondi',
      district: 'Dhaka',
      address: 'Dhanmondi R/A, Dhaka, Bangladesh',
      landmarks: 'Near Dhanmondi Lake'
    },
    contact: {
      phone: ['01755-987654'],
      email: 'furhomebd@gmail.com',
      whatsapp: '01755-987654'
    },
    timings: {
      weekdays: '8:00 AM - 8:00 PM (Drop-off/Pick-up)',
      weekends: '9:00 AM - 6:00 PM (Drop-off/Pick-up)',
      emergency: true
    },
    specialties: [
      'Home environment',
      'Personal attention',
      'Daily photo updates',
      'Outdoor garden play'
    ],
    priceRange: 'budget',
    rating: 4.5,
    reviews: 89,
    established: 2020,
    languages: ['English', 'Bangla'],
    acceptsInsurance: false,
    homeService: true,
    featuredImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&h=300'
  }
];

// ===========================================
// DATA COLLECTION INSTRUCTIONS
// ===========================================

/*
📋 INSTRUCTIONS FOR COLLECTING REAL DATA:

1. VETERINARY SERVICES:
   - Hospital/clinic names in Dhaka
   - Complete addresses with landmarks
   - Phone numbers (mobile + landline)
   - Email addresses and websites
   - Facebook pages
   - Services offered
   - Doctor names and specializations
   - Operating hours including emergency services
   - Approximate consultation fees
   - Languages spoken

2. GROOMING SERVICES:
   - Salon names and locations
   - Services offered (bath, cut, nail, etc.)
   - Price ranges for different services
   - Booking procedures (walk-in or appointment)
   - Special breed expertise
   - Home service availability

3. TRAINING CENTERS:
   - Trainer names and certifications
   - Training programs offered
   - Group vs individual sessions
   - Training locations (facility or home)
   - Success rates and testimonials
   - Specialized training (guard dogs, therapy dogs)

4. PET STORES:
   - Store names and chain information
   - Product categories available
   - Brand partnerships
   - Delivery services
   - Return/exchange policies
   - Loyalty programs

5. BOARDING FACILITIES:
   - Facility size and capacity
   - Room types and amenities
   - Daily routines and care standards
   - Medical emergency procedures
   - Vaccination requirements
   - Pricing for different durations

6. LEARNING ARTICLES TOPICS:
   - Local breed preferences and care
   - Seasonal care (monsoon, summer, winter)
   - Common diseases in Bangladesh
   - Local vaccination schedules
   - Street animal care and rescue
   - Pet-friendly places in major cities
   - Legal aspects of pet ownership
   - Traditional vs modern pet care
   - Import regulations for pets
   - Breeding guidelines and ethics

PLEASE PROVIDE:
- Real business names, addresses, and contact details
- Accurate service descriptions and pricing
- Current operating status and timings
- Any special certifications or accreditations
- Customer review summaries
- High-quality photos of facilities

This structure will help create a comprehensive, localized pet service directory for Bangladesh!
*/