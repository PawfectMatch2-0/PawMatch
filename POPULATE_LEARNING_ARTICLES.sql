-- =====================================================
-- POPULATE LEARNING ARTICLES
-- =====================================================
-- This script populates the learning_articles table with diverse content
-- Run this in Supabase SQL Editor to add articles to the Learning Center
-- =====================================================

-- Clear existing articles to avoid duplicate key errors
DELETE FROM public.learning_articles;

-- Reset the table (optional, if you want to start fresh)
-- TRUNCATE public.learning_articles CASCADE;

-- =====================================================
-- BASIC PET CARE ARTICLES (3 articles)
-- =====================================================

INSERT INTO public.learning_articles (id, title, category, excerpt, content, image_url, read_time, author, is_featured, tags) VALUES
('basic-care-1', 
'The Complete Guide to Puppy Feeding', 
'basic-care',
'Learn everything about proper puppy nutrition, feeding schedules, and choosing the right food for your growing pup.',
'# The Complete Guide to Puppy Feeding

Feeding your puppy properly is one of the most important things you can do to ensure they grow up healthy and strong.

## Understanding Puppy Nutritional Needs

Puppies need higher protein content (22-32% vs 18% for adults), more calories per pound of body weight, essential fatty acids for brain development, and proper calcium and phosphorus ratio for bone growth.

## Feeding Schedule by Age

**6-12 Weeks:** Feed 4 times daily
**3-6 Months:** Feed 3 times daily  
**6-12 Months:** Feed 2 times daily
**12+ Months:** Feed 1-2 times daily

## Choosing the Right Food

Look for AAFCO certification, high-quality protein sources, and appropriate calorie content for your puppy''s breed size.',
'https://images.unsplash.com/photo-1587300003388-59208cc962cb',
'8 min',
'Dr. Sarah Ahmed',
true,
ARRAY['nutrition', 'puppies', 'feeding', 'beginner']
),

('basic-care-2',
'Kitten Care Essentials for First-Time Owners',
'basic-care',
'Everything you need to know about caring for a new kitten, from feeding to litter training.',
'# Kitten Care Essentials

Bringing home a new kitten is exciting! Here''s what you need to know.

## Essential Supplies
- High-quality kitten food
- Litter box and litter
- Scratching posts
- Toys for mental stimulation
- Food and water bowls

## Feeding Your Kitten
Feed specially formulated kitten food 3-4 times daily until 6 months old.

## Litter Training
Most kittens naturally know how to use a litter box. Place them in it after meals and naps.

## Socialization
Handle your kitten gently and frequently to build trust and confidence.',
'https://images.unsplash.com/photo-1574158622682-e40e69881006',
'6 min',
'Fatima Rahman',
false,
ARRAY['kittens', 'beginner', 'basics', 'care']
),

('basic-care-3',
'Pet-Proofing Your Home',
'basic-care',
'Make your home safe for pets by identifying and eliminating common household hazards.',
'# Pet-Proofing Your Home

Creating a safe environment is crucial for your pet''s wellbeing.

## Common Hazards
- Toxic plants (lilies, philodendron, aloe)
- Electrical cords
- Small objects that can be swallowed
- Toxic foods (chocolate, grapes, onions)
- Cleaning chemicals

## Room-by-Room Guide

**Kitchen:** Secure trash cans, store food safely
**Bathroom:** Keep toilet lids down, secure medicines
**Living Room:** Hide electrical cords, secure heavy items
**Garage:** Store chemicals on high shelves

## Emergency Preparedness
Keep your vet''s number handy and know the location of the nearest 24-hour emergency clinic.',
'https://images.unsplash.com/photo-1560807707-8cc77767d783',
'5 min',
'Mohammad Hasan',
false,
ARRAY['safety', 'home', 'beginner', 'prevention']
);

-- =====================================================
-- TRAINING & BEHAVIOR ARTICLES (8 articles)
-- =====================================================

INSERT INTO public.learning_articles (id, title, category, excerpt, content, image_url, read_time, author, is_featured, tags) VALUES
('training-1',
'Basic Obedience Commands Every Dog Should Know',
'training',
'Master the fundamental commands: sit, stay, come, down, and heel for a well-behaved dog.',
'# Basic Obedience Commands

These five commands form the foundation of good dog behavior.

## 1. Sit
The easiest command to teach. Hold a treat above your dog''s nose and move it back over their head. Their bottom will naturally lower.

## 2. Stay  
Once your dog knows "sit," extend your hand palm-out and say "stay." Take a step back and reward if they don''t move.

## 3. Come
This could save your dog''s life. Start in a safe area, say "come" enthusiastically, and reward every time.

## 4. Down
From sitting position, bring treat to ground between paws. Say "down" as they lie down.

## 5. Heel
Teach your dog to walk calmly beside you without pulling on the leash.',
'https://images.unsplash.com/photo-1601758228041-f3b2795255f1',
'10 min',
'Trainer Kamal Uddin',
true,
ARRAY['training', 'commands', 'obedience', 'beginner']
),

('training-2',
'Stopping Unwanted Barking Behavior',
'training',
'Understand why dogs bark and learn effective techniques to reduce excessive barking.',
'# Understanding and Managing Barking

Barking is natural, but excessive barking can be problematic.

## Why Dogs Bark
- Alert/Warning
- Playfulness/Excitement
- Attention-seeking
- Anxiety/Fear
- Boredom

## Training Techniques

**Quiet Command:** When your dog barks, say "quiet" calmly. When they stop, reward immediately.

**Remove Motivation:** If they bark at passersby, close the curtains or move them to a quieter room.

**Exercise:** A tired dog barks less. Ensure adequate daily exercise.

**Ignore Attention-Seeking:** Don''t respond to barking for attention.',
'https://images.unsplash.com/photo-1568572933382-74d440642117',
'7 min',
'Dr. Nasrin Akter',
false,
ARRAY['behavior', 'barking', 'training', 'intermediate']
),

('training-3',
'Litter Box Training for Cats',
'training',
'Step-by-step guide to successfully litter train your cat or kitten.',
'# Litter Box Training Success

Most cats instinctively use litter boxes, but proper setup is key.

## Choosing the Right Box
- Large enough for your cat to turn around
- Low sides for kittens and seniors
- Covered vs uncovered depends on cat preference

## Location Matters
- Quiet, low-traffic area
- Away from food and water
- Easy access 24/7

## Litter Selection
Most cats prefer unscented, clumping litter. Depth should be 2-3 inches.

## Multiple Cat Households
Rule: Number of cats + 1 = number of boxes needed

## Troubleshooting
If accidents occur, check for medical issues first, then review setup and cleanliness.',
'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc',
'6 min',
'Rehana Khatun',
false,
ARRAY['cats', 'litter', 'training', 'beginner']
);

-- =====================================================
-- HEALTH & WELLNESS ARTICLES (15 articles)
-- =====================================================

INSERT INTO public.learning_articles (id, title, category, excerpt, content, image_url, read_time, author, is_featured, tags) VALUES
('health-1',
'Complete Vaccination Schedule for Puppies',
'health',
'Essential guide to puppy vaccinations, timing, and what each vaccine protects against.',
'# Puppy Vaccination Schedule

Vaccinations protect your puppy from serious diseases.

## Core Vaccines (Required)

**6-8 Weeks:**
- Distemper
- Parvovirus  
- Adenovirus

**10-12 Weeks:**
- DHPP booster
- Leptospirosis

**14-16 Weeks:**
- DHPP booster
- Rabies vaccine
- Leptospirosis booster

## Non-Core Vaccines (Situational)
- Bordetella (kennel cough)
- Canine influenza
- Lyme disease

## Important Notes
- Keep puppy home until fully vaccinated
- Maintain annual boosters
- Discuss with your vet based on lifestyle',
'https://images.unsplash.com/photo-1626897505254-e0f811aa9bf7',
'8 min',
'Dr. Abdul Karim',
true,
ARRAY['health', 'vaccines', 'puppies', 'prevention']
),

('health-2',
'Recognizing Signs of Illness in Your Pet',
'health',
'Learn to identify warning signs that your pet needs veterinary attention.',
'# Warning Signs in Pets

Early detection can save lives. Watch for these signs:

## Immediate Emergency Signs
- Difficulty breathing
- Uncontrolled bleeding
- Seizures
- Unconsciousness
- Severe vomiting/diarrhea

## Concerning Symptoms
- Loss of appetite for 24+ hours
- Lethargy lasting more than a day
- Changes in drinking habits
- Difficulty urinating
- Persistent coughing

## Behavioral Changes
- Hiding more than usual
- Aggression or irritability
- Confusion or disorientation

## When to Call the Vet
If you notice any of these signs, contact your veterinarian immediately.',
'https://images.unsplash.com/photo-1530126483408-aa533e55bdb2',
'7 min',
'Dr. Ayesha Siddiqui',
false,
ARRAY['health', 'symptoms', 'emergency', 'intermediate']
),

('health-3',
'Dental Care for Dogs and Cats',
'health',
'Proper dental hygiene prevents serious health issues. Learn brushing techniques and preventive care.',
'# Pet Dental Health

80% of pets over 3 have dental disease. Prevention is key!

## Why Dental Care Matters
- Prevents painful infections
- Reduces bad breath
- Protects against organ damage
- Extends lifespan

## Brushing Technique
1. Use pet-specific toothpaste
2. Start slowly, reward heavily
3. Focus on outer surfaces
4. Brush daily if possible

## Alternative Options
- Dental treats
- Water additives
- Dental toys
- Professional cleanings

## Signs of Dental Problems
- Bad breath
- Red or swollen gums
- Difficulty eating
- Pawing at mouth',
'https://images.unsplash.com/photo-1548681528-6a5c45b66b42',
'6 min',
'Dr. Tahmina Begum',
false,
ARRAY['dental', 'health', 'prevention', 'care']
);

-- =====================================================
-- BREED GUIDES (Sample breeds)
-- =====================================================

INSERT INTO public.learning_articles (id, title, category, excerpt, content, image_url, read_time, author, is_featured, tags) VALUES
('breed-1',
'Golden Retriever: Complete Breed Guide',
'breed-guide',
'Everything about Golden Retrievers - temperament, care needs, health concerns, and training tips.',
'# Golden Retriever Guide

One of the most popular family dogs worldwide.

## Temperament
- Friendly and devoted
- Great with children
- Eager to please
- Intelligent and trainable

## Physical Characteristics
- **Weight:** 55-75 lbs
- **Height:** 20-24 inches
- **Coat:** Long, golden, double-layered
- **Lifespan:** 10-12 years

## Exercise Needs
High energy! Requires 60+ minutes of daily exercise including walks, play, and swimming.

## Grooming
- Brush several times weekly
- Professional grooming every 8-12 weeks
- Heavy shedding, especially seasonally

## Health Concerns
- Hip dysplasia
- Elbow dysplasia
- Heart problems
- Cancer (later in life)',
'https://images.unsplash.com/photo-1633722715463-d30f4f325e24',
'9 min',
'Breed Expert Shakib Ahmed',
false,
ARRAY['breeds', 'dogs', 'golden-retriever', 'guide']
),

('breed-2',
'Persian Cat: Comprehensive Care Guide',
'breed-guide',
'Learn about Persian cat temperament, grooming requirements, and health considerations.',
'# Persian Cat Complete Guide

The ultimate lap cat with luxurious long fur.

## Personality
- Calm and gentle
- Affectionate but not demanding
- Quiet voice
- Prefers stable environment

## Physical Features
- **Weight:** 7-12 lbs
- **Coat:** Long, silky, dense
- **Face:** Flat (brachycephalic)
- **Lifespan:** 12-17 years

## Grooming Requirements
**Daily brushing essential** to prevent mats. Professional grooming recommended every 4-6 weeks.

## Special Care
- Eye cleaning daily (prone to tearing)
- Face wiping to prevent staining
- Monitor breathing (flat face issues)

## Health Considerations
- Polycystic kidney disease
- Breathing difficulties
- Eye conditions
- Dental issues',
'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e',
'8 min',
'Cat Specialist Nusrat Jahan',
false,
ARRAY['breeds', 'cats', 'persian', 'guide']
);

-- =====================================================
-- EMERGENCY CARE ARTICLES
-- =====================================================

INSERT INTO public.learning_articles (id, title, category, excerpt, content, image_url, read_time, author, is_featured, tags) VALUES
('emergency-1',
'Pet First Aid: Essential Skills Every Owner Needs',
'emergency',
'Learn basic first aid techniques that could save your pet''s life in an emergency.',
'# Pet First Aid Basics

Being prepared can make all the difference in an emergency.

## First Aid Kit Essentials
- Gauze pads and rolls
- Medical tape
- Scissors
- Tweezers
- Digital thermometer
- Saline solution
- Emergency vet number

## CPR for Pets
**For Dogs:**
1. Check airway
2. 30 compressions, 2 breaths
3. 100-120 compressions/minute

**For Cats:**
Similar but gentler due to smaller size.

## Common Emergencies

**Choking:** Open mouth, remove visible objects, perform Heimlich if needed.

**Bleeding:** Apply direct pressure, elevate wound if possible.

**Poisoning:** Call emergency vet immediately, bring product packaging.',
'https://images.unsplash.com/photo-1628407846-3da2bbe5d2a6',
'12 min',
'Dr. Emergency Specialist Rahman',
true,
ARRAY['emergency', 'first-aid', 'safety', 'critical']
),

('emergency-2',
'What to Do if Your Pet Is Poisoned',
'emergency',
'Quick action guide for suspected poisoning including common toxins and immediate steps.',
'# Pet Poisoning Emergency Protocol

**Time is critical! Act immediately.**

## Step 1: Call Your Vet
Have this information ready:
- Pet''s weight
- Substance ingested
- Amount consumed
- Time of ingestion

## Common Pet Toxins in Bangladesh
- Rat poison
- Insecticides
- Toxic plants
- Human medications
- Chocolate
- Onions/garlic

## What NOT to Do
- Don''t induce vomiting unless instructed
- Don''t give milk
- Don''t wait to see symptoms

## Emergency Numbers
- PRAN Veterinary Hospital: 01XXX-XXXXXX
- 24/7 Pet Emergency: 01XXX-XXXXXX

## Prevention
Store all chemicals and medications securely. Know which plants are toxic.',
'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b',
'6 min',
'Dr. Toxicology Specialist Hossain',
false,
ARRAY['emergency', 'poison', 'toxic', 'critical']
);

-- =====================================================
-- PET SERVICES & SHOPS
-- =====================================================

INSERT INTO public.learning_articles (id, title, category, excerpt, content, image_url, read_time, author, is_featured, tags) VALUES
('services-1',
'Finding the Right Veterinarian in Bangladesh',
'pet-services',
'Guide to choosing a qualified vet, what to look for, and questions to ask.',
'# Choosing Your Veterinarian

Your vet is your partner in pet healthcare.

## What to Look For
- Proper licensing and credentials
- Clean, organized facility
- Caring, knowledgeable staff
- Emergency care availability
- Good communication

## Questions to Ask
- What are your hours?
- Do you offer emergency services?
- What payment methods do you accept?
- Do you have specialists on staff?
- Can I tour the facility?

## Red Flags
- Dirty facilities
- Reluctance to answer questions
- No clear pricing
- Pushy sales tactics

## Top Vet Clinics in Major Cities

**Dhaka:**
- PRAN Veterinary Hospital
- Pet Care BD
- Animal Health Center

**Chittagong:**
- Modern Vet Care
- Pet Wellness Clinic',
'https://images.unsplash.com/photo-1551601651-bc60f254d532',
'7 min',
'Pet Services Guide Team',
false,
ARRAY['services', 'veterinary', 'bangladesh', 'guide']
),

('services-2',
'Professional Pet Grooming: When and Why',
'pet-services',
'Understand the benefits of professional grooming and how often your pet needs it.',
'# Professional Pet Grooming Guide

Regular grooming keeps pets healthy and comfortable.

## Benefits of Professional Grooming
- Expert nail trimming
- Thorough cleaning
- Early health issue detection
- Breed-specific styling
- De-shedding treatments

## How Often?

**Dogs:**
- Short coat: Every 8-12 weeks
- Long coat: Every 4-6 weeks
- High-maintenance breeds: Monthly

**Cats:**
- Long-haired: Every 6-8 weeks
- Short-haired: Every 12 weeks

## What''s Included
- Bath and dry
- Nail trim
- Ear cleaning
- Teeth brushing
- Haircut/styling

## Cost in Bangladesh
Ranges from 1,500-5,000 BDT depending on size and services.',
'https://images.unsplash.com/photo-1598133893773-de3574464ef0',
'5 min',
'Grooming Expert Sumaiya',
false,
ARRAY['grooming', 'services', 'care', 'bangladesh']
);

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Check how many articles were inserted per category
SELECT 
  category,
  COUNT(*) as article_count,
  COUNT(CASE WHEN is_featured THEN 1 END) as featured_count
FROM public.learning_articles
GROUP BY category
ORDER BY category;

-- Show all article titles
SELECT 
  category,
  title,
  is_featured,
  read_time
FROM public.learning_articles
ORDER BY category, title;

-- =====================================================
-- Expected Results:
-- - basic-care: 3 articles (1 featured)
-- - training: 3 articles (1 featured)
-- - health: 3 articles (1 featured)
-- - breed-guide: 2 articles
-- - emergency: 2 articles (1 featured)
-- - pet-services: 2 articles
-- Total: 15 articles
-- =====================================================
