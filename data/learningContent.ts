export interface LearningArticle {
  id: string;
  title: string;
  category: 'basic-care' | 'training' | 'health' | 'breed-guide' | 'emergency' | 'pet-services';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number; // in minutes
  content: string;
  summary: string;
  tags: string[];
  author: string;
  featuredImage: string;
  videoUrl?: string;
  audioUrl?: string;
  createdAt: Date;
  likes: number;
  views: number;
}

export interface LearningCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Now represents Lucide icon name
  color: string;
  articleCount: number;
}

export const learningCategories: LearningCategory[] = [
  {
    id: 'basic-care',
    name: 'Basic Pet Care',
    description: 'Essential knowledge for pet care',
    icon: 'Heart', // Lucide Heart icon
    color: '#FF6B6B',
    articleCount: 12,
  },
  {
    id: 'training',
    name: 'Training & Behavior',
    description: 'Train your pet effectively',
    icon: 'GraduationCap', // Lucide GraduationCap icon
    color: '#4ECDC4',
    articleCount: 8,
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Keep your pet healthy',
    icon: 'Stethoscope', // Lucide Stethoscope icon
    color: '#45B7D1',
    articleCount: 15,
  },
  {
    id: 'breed-guide',
    name: 'Breed Guides',
    description: 'Breed-specific information',
    icon: 'BookOpen', // Lucide BookOpen icon
    color: '#96CEB4',
    articleCount: 25,
  },
  {
    id: 'emergency',
    name: 'Emergency Care',
    description: 'Critical care knowledge',
    icon: 'AlertTriangle', // Lucide AlertTriangle icon
    color: '#FECA57',
    articleCount: 6,
  },
  {
    id: 'pet-services',
    name: 'Pet Services & Shops',
    description: 'Find local pet services and shops',
    icon: 'MapPin', // Lucide MapPin icon
    color: '#9013FE',
    articleCount: 2,
  },
];

export const mockLearningArticles: LearningArticle[] = [
  {
    id: '1',
    title: 'The Complete Guide to Puppy Feeding',
    category: 'basic-care',
    difficulty: 'beginner',
    estimatedReadTime: 8,
    content: `# The Complete Guide to Puppy Feeding

Feeding your puppy properly is one of the most important things you can do to ensure they grow up healthy and strong. This comprehensive guide will walk you through everything you need to know about puppy nutrition.

## Understanding Puppy Nutritional Needs

Puppies have different nutritional requirements than adult dogs. They need:

- **Higher protein content** (22-32% vs 18% for adults)
- **More calories per pound** of body weight
- **Essential fatty acids** for brain development
- **Proper calcium and phosphorus ratio** for bone growth

## Feeding Schedule by Age

### 6-12 Weeks Old
- Feed 4 times per day
- Small, frequent meals help with digestion
- Stick to the breeder's or shelter's current food initially

### 3-6 Months Old
- Reduce to 3 meals per day
- Increase portion sizes gradually
- Monitor weight gain weekly

### 6-12 Months Old
- Transition to 2 meals per day
- Begin transitioning to adult food around 12 months

## Choosing the Right Food

Look for puppy food that:
- Is labeled "complete and balanced"
- Lists meat as the first ingredient
- Is appropriate for your puppy's expected adult size
- Has been tested through AAFCO feeding trials

## Common Feeding Mistakes to Avoid

1. **Overfeeding** - Can lead to obesity and joint problems
2. **Free feeding** - Makes house training harder
3. **Too many treats** - Should be less than 10% of daily calories
4. **Sudden food changes** - Always transition gradually over 7-10 days

## Signs of Proper Nutrition

Your puppy should have:
- Steady, appropriate weight gain
- Bright, clear eyes
- Shiny coat
- Good energy levels
- Normal, firm stools

## When to Consult Your Vet

Contact your veterinarian if you notice:
- Loss of appetite lasting more than 24 hours
- Vomiting or diarrhea
- Excessive weight gain or loss
- Changes in energy levels

Remember, every puppy is unique. Work with your veterinarian to develop a feeding plan that's right for your specific puppy's needs.`,
    summary: 'Learn everything about feeding your puppy properly, from nutritional needs to feeding schedules and choosing the right food.',
    tags: ['puppy', 'nutrition', 'feeding', 'health', 'beginner'],
    author: 'Dr. Sarah Mitchell, DVM',
    featuredImage: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://example.com/puppy-feeding-video',
    createdAt: new Date('2024-01-15'),
    likes: 234,
    views: 1520,
  },
  {
    id: '2',
    title: 'House Training Your Dog: A Step-by-Step Guide',
    category: 'training',
    difficulty: 'beginner',
    estimatedReadTime: 12,
    content: `# House Training Your Dog: A Step-by-Step Guide

House training (also called potty training or housebreaking) is one of the first and most important skills you'll teach your dog. With patience, consistency, and the right approach, most dogs can be successfully house trained.

## Understanding Your Dog's Natural Instincts

Dogs naturally want to keep their sleeping and eating areas clean. This instinct is the foundation of house training. Your job is to:

- Establish clear indoor and outdoor areas
- Create a consistent routine
- Reward success immediately
- Never punish accidents

## Step 1: Establish a Routine

### Daily Schedule
- **First thing in the morning** - Take your dog outside immediately
- **After meals** - Wait 5-30 minutes, then go outside
- **After naps** - Dogs often need to go after sleeping
- **Every 2-4 hours** during the day (more frequently for puppies)
- **Last thing at night** - Final potty break before bed

### Feeding Schedule
- Feed at the same times each day
- Remove food between meals
- Provide fresh water throughout the day
- Take water away 2-3 hours before bedtime

## Step 2: Choose a Designated Potty Area

- Pick a specific spot in your yard
- Always take your dog to the same area
- Use a consistent command like "go potty"
- Stay with your dog until they eliminate

## Step 3: Supervise and Confine

### When You're Home
- Watch for signs your dog needs to go out:
  - Sniffing around
  - Circling
  - Whining or barking
  - Going to the door
  - Restlessness

### When You're Away
- Use a crate that's just large enough for your dog to stand and turn around
- Alternatively, confine to a small, dog-proofed room
- Never leave your dog confined for longer than they can hold it

## Step 4: Reward Success

- Praise enthusiastically the moment your dog eliminates outside
- Give treats immediately (within 3 seconds)
- Use the same praise phrase each time
- Make going outside more rewarding than going inside

## Step 5: Handle Accidents Properly

### What to Do
- Clean thoroughly with an enzymatic cleaner
- Don't punish or scold your dog
- If you catch them in the act, interrupt and take them outside immediately
- Clean the area completely to remove odors

### What NOT to Do
- Never rub your dog's nose in the accident
- Don't yell or punish after the fact
- Avoid using ammonia-based cleaners (smell like urine)

## Common Challenges and Solutions

### Accidents Keep Happening
- Review your supervision and scheduling
- Consider reducing the area your dog has access to
- Increase frequency of potty breaks
- Check for medical issues with your vet

### Dog Won't Go Outside
- Make sure the area is comfortable and safe
- Go outside with your dog
- Try different times of day
- Consider weather factors

### Regression After Progress
- Return to more frequent supervision
- Go back to a more frequent potty schedule
- Check for stressors in the environment
- Rule out medical issues

## Timeline Expectations

- **Puppies (8-16 weeks)**: 4-6 months for reliable training
- **Adult dogs**: 2-4 weeks with consistent training
- **Rescue dogs**: May take longer due to previous experiences

## Signs of Success

Your dog is successfully house trained when they:
- Consistently eliminate outside
- Show signs they need to go out
- Have no accidents for several weeks
- Can "hold it" for age-appropriate periods

## When to Seek Help

Contact a professional trainer or veterinarian if:
- Your dog is over 6 months old and still having frequent accidents
- You see signs of medical issues (frequent urination, straining, blood)
- Your dog seems afraid to eliminate outside
- You're feeling frustrated or overwhelmed

Remember: House training requires patience and consistency. Every dog learns at their own pace, but with the right approach, your dog will get there!`,
    summary: 'Master the fundamentals of house training with this comprehensive step-by-step guide covering routines, supervision, and troubleshooting.',
    tags: ['training', 'house training', 'potty training', 'puppy', 'beginner'],
    author: 'Mark Thompson, CCDT',
    featuredImage: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date('2024-01-10'),
    likes: 189,
    views: 892,
  },
  {
    id: '3',
    title: 'Recognizing Signs of Illness in Your Pet',
    category: 'health',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    content: `# Recognizing Signs of Illness in Your Pet

As a pet owner, you are your pet's first line of defense against illness. Knowing how to recognize early warning signs can mean the difference between a quick recovery and a serious health crisis.

## Daily Health Monitoring

### What to Check Daily
- **Appetite and water consumption**
- **Energy levels and behavior**
- **Urination and defecation**
- **Basic physical condition**

### Creating a Health Baseline
Keep track of your pet's normal:
- Eating and drinking habits
- Sleep patterns
- Activity levels
- Bathroom habits
- Weight

## Physical Warning Signs

### Eyes
**Normal**: Clear, bright, no discharge
**Concerning**: 
- Cloudiness or opacity
- Excessive tearing or discharge
- Redness or swelling
- Squinting or pawing at eyes

### Nose
**Normal**: Cool and moist (for dogs), clean
**Concerning**:
- Thick, colored discharge
- Persistent dryness
- Bleeding
- Strong odor

### Mouth and Teeth
**Normal**: Pink gums, clean teeth, fresh breath
**Concerning**:
- Pale, yellow, or blue gums
- Bad breath (worse than usual)
- Excessive drooling
- Difficulty eating or chewing

### Skin and Coat
**Normal**: Shiny coat, healthy skin
**Concerning**:
- Excessive scratching or licking
- Red, irritated skin
- Bald patches or hair loss
- Lumps or bumps
- Parasites (fleas, ticks)

## Behavioral Changes

### Appetite Changes
- **Complete loss of appetite** for more than 24 hours
- **Increased appetite** with weight loss
- **Difficulty eating** or swallowing
- **Eating non-food items**

### Activity Level Changes
- **Lethargy** or unusual tiredness
- **Restlessness** or inability to get comfortable
- **Hiding** or withdrawing from family
- **Aggression** or personality changes

### Bathroom Changes
- **Straining** to urinate or defecate
- **Changes in frequency**
- **Blood** in urine or stool
- **Accidents** in house-trained pets

## Emergency Warning Signs

### Seek Immediate Veterinary Care for:
- **Difficulty breathing** or gasping
- **Unconsciousness** or collapse
- **Severe vomiting** or diarrhea
- **Bloated abdomen**
- **Pale or blue gums**
- **Severe pain** (crying, panting, restlessness)
- **Inability to urinate**
- **Seizures**
- **Traumatic injuries**

## Species-Specific Signs

### Dogs
- Excessive panting when not hot or after exercise
- Reverse sneezing episodes
- Tail tucked under consistently
- Changes in barking patterns

### Cats
- Changes in litter box habits
- Excessive hiding
- Changes in grooming habits
- Unusual vocalizations

## Age-Related Considerations

### Puppies and Kittens
- More vulnerable to illness
- Can decline quickly
- May not show obvious symptoms
- Regular vet checkups crucial

### Senior Pets (7+ years)
- More prone to chronic conditions
- May be slower to show symptoms
- Regular screenings important
- Watch for mobility changes

## When to Call Your Veterinarian

### Same Day Appointment Needed:
- Vomiting or diarrhea lasting more than 24 hours
- Not eating for more than 24 hours
- Lethargy with other symptoms
- Difficulty urinating or defecating
- Limping or apparent pain

### Can Wait for Regular Hours:
- Minor changes in appetite (still eating some food)
- Mild lethargy without other symptoms
- Small cuts or scrapes
- Routine concerns about behavior

### Emergency Care Required:
- Any of the emergency warning signs listed above
- Suspected poisoning
- Severe trauma
- Extreme pain or distress

## Documentation Tips

### Keep Track Of:
- When symptoms started
- How symptoms have progressed
- Your pet's appetite and water consumption
- Bathroom habits
- Any recent changes in environment or routine

### Take Photos/Videos When Possible:
- Skin conditions
- Unusual behaviors
- Gait abnormalities
- Any visible symptoms

## Prevention is Key

### Regular Veterinary Care
- Annual wellness exams for young adult pets
- Bi-annual exams for senior pets
- Keep vaccinations current
- Regular dental care

### Home Monitoring
- Weekly weight checks for overweight pets
- Daily observation and interaction
- Maintain consistent routines
- Keep emergency vet contact information handy

Remember: You know your pet best. Trust your instincts – if something seems "off," it's always better to check with your veterinarian. Early intervention often leads to better outcomes and can prevent minor issues from becoming major problems.`,
    summary: 'Learn to identify early warning signs of illness in your pet, from daily monitoring tips to emergency symptoms that require immediate care.',
    tags: ['health', 'symptoms', 'veterinary', 'monitoring', 'emergency'],
    author: 'Dr. Emily Rodriguez, DVM',
    featuredImage: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date('2024-01-05'),
    likes: 312,
    views: 2100,
  },
  {
    id: '4',
    title: 'Golden Retriever: Complete Breed Guide',
    category: 'breed-guide',
    difficulty: 'beginner',
    estimatedReadTime: 15,
    content: `# Golden Retriever: Complete Breed Guide

Golden Retrievers are one of America's most popular dog breeds. They're friendly, intelligent, and devoted family companions. This comprehensive guide covers everything you need to know about this beloved breed.

## Breed Overview

### Physical Characteristics
- **Size**: Large breed
- **Weight**: Males 65-75 lbs, Females 55-65 lbs
- **Height**: Males 23-24 inches, Females 21.5-22.5 inches
- **Lifespan**: 10-12 years
- **Coat**: Dense, water-repellent double coat
- **Colors**: Various shades of gold

### Temperament
- Friendly and outgoing
- Reliable and trustworthy
- Eager to please
- Great with children
- Generally good with other pets

## History and Origin

Golden Retrievers were originally bred in Scotland in the late 1800s by Lord Tweedmouth. He wanted to create the ultimate hunting dog that could retrieve waterfowl in the Scottish highlands.

### Development Timeline
- **1868**: First Golden Retriever breeding program begins
- **1908**: First Golden Retrievers shown in England
- **1925**: Breed recognition by American Kennel Club
- **1938**: Golden Retriever Club of America founded

## Personality and Behavior

### Positive Traits
- **Highly intelligent** - Easy to train
- **Patient and gentle** - Excellent with children
- **Loyal and devoted** - Strong family bonds
- **Active and playful** - Loves games and exercise
- **Social** - Generally friendly with strangers

### Potential Challenges
- **High energy** - Requires daily exercise
- **Heavy shedding** - Year-round grooming needs
- **Mouthy behavior** - Tendency to carry objects
- **Separation anxiety** - Doesn't like being alone
- **Slow to mature** - Puppy behavior until 2-3 years old

## Exercise and Activity Needs

### Daily Requirements
- **Minimum 2 hours** of exercise daily
- **Mental stimulation** through training and puzzles
- **Variety** in activities to prevent boredom

### Ideal Activities
- **Swimming** - Natural water dogs
- **Fetch** - Instinctual retrieving behavior
- **Hiking** - Excellent adventure companions
- **Agility training** - Mental and physical exercise
- **Dog sports** - Dock diving, rally, obedience

### Exercise by Life Stage

#### Puppies (8 weeks - 18 months)
- Short, frequent play sessions
- 5 minutes per month of age, twice daily
- Focus on socialization and basic training
- Avoid excessive jumping or long runs

#### Adults (18 months - 7 years)
- 1-2 hours of exercise daily
- Combination of physical and mental activities
- Can handle longer hikes and more intense activities

#### Seniors (7+ years)
- Adjust intensity based on health
- Maintain regular, gentle exercise
- Swimming is excellent for aging joints
- Monitor for fatigue and overheating

## Training and Intelligence

### Training Characteristics
- **Highly trainable** - Ranks 4th in canine intelligence
- **Eager to please** - Responds well to positive reinforcement
- **Food motivated** - Treats are excellent motivators
- **Sensitive** - Harsh corrections can be counterproductive

### Essential Training Areas

#### Basic Obedience
- **Sit, Stay, Come, Down** - Foundation commands
- **Loose leash walking** - Important for large dogs
- **Drop it/Leave it** - Critical for mouthy breeds

#### Socialization
- **Early exposure** to people, animals, environments
- **Puppy classes** - Great for social skills
- **Ongoing socialization** throughout life

#### Specialized Training
- **Therapy dog** - Natural temperament for therapy work
- **Service dog** - Intelligence and trainability ideal
- **Hunting/retrieving** - Can develop natural instincts
- **Competitive sports** - Agility, obedience, rally

## Grooming and Care

### Coat Care
- **Daily brushing** during shedding seasons
- **2-3 times weekly** brushing normally
- **Professional grooming** every 6-8 weeks
- **Never shave** - Coat protects from heat and cold

### Grooming Routine
- **Brush thoroughly** before bathing
- **Bath monthly** or as needed
- **Trim nails** every 2-3 weeks
- **Clean ears** weekly
- **Brush teeth** daily or several times per week

### Seasonal Considerations
- **Spring shedding** - Intensive daily brushing needed
- **Summer care** - Watch for overheating
- **Winter protection** - Paws may need protection from salt
- **Year-round** - Regular parasite prevention

## Health Considerations

### Common Health Issues
- **Hip and Elbow Dysplasia** - Genetic joint conditions
- **Eye conditions** - Cataracts, progressive retinal atrophy
- **Heart conditions** - Subvalvular aortic stenosis
- **Cancer** - Higher rates than some breeds
- **Bloat** - Emergency condition in deep-chested dogs

### Health Screening
- **Hip and elbow X-rays** before breeding
- **Eye examinations** by veterinary ophthalmologist
- **Heart clearances** for breeding dogs
- **Regular wellness exams** for early detection

### Maintaining Health
- **Quality nutrition** appropriate for life stage
- **Regular exercise** for joint and cardiovascular health
- **Weight management** - Obesity increases health risks
- **Dental care** - Regular cleaning and home care
- **Parasite prevention** - Year-round protection

## Nutrition Guidelines

### Feeding Basics
- **High-quality dog food** appropriate for age and activity
- **Measured portions** - Goldens prone to overeating
- **Regular meal times** - 2 meals daily for adults
- **Fresh water** always available

### Life Stage Nutrition

#### Puppies
- **Puppy formula** until 12-15 months
- **3-4 meals daily** until 6 months old
- **Large breed puppy food** for proper development

#### Adults
- **Adult maintenance** formula
- **2 meals daily**
- **Adjust for activity level**

#### Seniors
- **Senior formula** with joint support
- **Monitor weight** closely
- **Consider supplements** as recommended by vet

## Living Arrangements

### Ideal Home Environment
- **Fenced yard** for safe off-leash exercise
- **Active family** who enjoys outdoor activities
- **Time for grooming** and maintenance
- **Commitment to training** and socialization

### Apartment Living
- **Possible but challenging** - High exercise needs
- **Must commit** to 2+ hours daily exercise
- **Mental stimulation** crucial in smaller spaces
- **Consider doggy daycare** for socialization

## Golden Retrievers and Families

### With Children
- **Excellent family dogs** - Patient and gentle
- **Supervise interactions** with very young children
- **Teach children** proper interaction with dogs
- **Size consideration** - May accidentally knock over small children

### With Other Pets
- **Generally good** with other dogs
- **Early socialization** improves compatibility
- **Prey drive** may affect relationships with small animals
- **Individual personalities** vary

## Finding a Golden Retriever

### Responsible Breeders
- **Health testing** of breeding dogs
- **Breed club membership** and involvement
- **References** from previous buyers
- **Lifetime support** and contract

### Rescue Organizations
- **Golden Retriever rescues** nationwide
- **Mixed breeds** often available
- **Adult dogs** may be easier for some families
- **Thorough evaluation** of temperament and health

### Red Flags to Avoid
- **Puppy mills** - Multiple breeds, poor conditions
- **No health testing** of parents
- **Won't let you** meet the mother
- **Pressure tactics** or "deals"

## Cost of Ownership

### Initial Costs
- **Purchase price**: $1,500-$3,000+ from breeder
- **Supplies**: $200-$500 (crate, bed, toys, etc.)
- **Initial vet care**: $200-$500

### Annual Costs
- **Food**: $600-$1,200
- **Veterinary care**: $500-$1,500
- **Grooming**: $600-$1,200
- **Supplies/toys**: $200-$400

### Potential Additional Costs
- **Emergency veterinary care**: $1,000-$5,000+
- **Training classes**: $200-$600
- **Pet insurance**: $300-$800 annually
- **Boarding/pet sitting**: Varies

## Is a Golden Retriever Right for You?

### You Might Be a Good Match If:
- You enjoy an active lifestyle
- You have time for daily grooming
- You want a family-friendly dog
- You're committed to training and socialization
- You don't mind dog hair everywhere

### Consider Another Breed If:
- You want a low-maintenance dog
- You're away from home 8+ hours daily
- You prefer a more independent dog
- You can't provide adequate exercise
- You're not prepared for a 10-12 year commitment

Golden Retrievers make wonderful companions for the right families. They require significant time, energy, and resources, but reward their families with years of loyalty, love, and joy. If you're considering adding a Golden Retriever to your family, make sure you're prepared for the commitment and can provide for all their needs throughout their lifetime.`,
    summary: 'Everything you need to know about Golden Retrievers - from temperament and training to health considerations and finding the right dog for your family.',
    tags: ['golden retriever', 'breed guide', 'family dog', 'large breed', 'training'],
    author: 'Jennifer Walsh, CPDT-KA',
    featuredImage: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://example.com/golden-retriever-guide',
    createdAt: new Date('2024-01-01'),
    likes: 567,
    views: 3200,
  },
  {
    id: '5',
    title: 'Pet Emergency First Aid: What Every Owner Should Know',
    category: 'emergency',
    difficulty: 'intermediate',
    estimatedReadTime: 20,
    content: `# Pet Emergency First Aid: What Every Owner Should Know

When your pet has a medical emergency, the first few minutes can be critical. Knowing basic first aid can help stabilize your pet until you can get professional veterinary care.

## Emergency Preparedness

### First Aid Kit Essentials
- **Gauze pads and rolls**
- **Medical tape**
- **Hydrogen peroxide** (3% - for inducing vomiting ONLY when instructed by vet)
- **Digital thermometer**
- **Disposable gloves**
- **Scissors**
- **Tweezers**
- **Emergency contact numbers**
- **Pet carrier or blanket**

### Important Phone Numbers to Keep Handy
- Your regular veterinarian
- 24-hour emergency clinic
- Animal poison control hotline
- Local animal hospital

## Assessing Your Pet's Condition

### Primary Assessment (ABC)
- **A - Airway**: Is the airway clear?
- **B - Breathing**: Is your pet breathing normally?
- **C - Circulation**: Check pulse and gum color

### Vital Signs

#### Normal Heart Rates
- **Small dogs**: 100-140 beats per minute
- **Large dogs**: 60-100 beats per minute
- **Cats**: 120-140 beats per minute

#### Normal Body Temperature
- **Dogs and Cats**: 101-102.5°F (38.3-39.2°C)

#### Gum Color Assessment
- **Normal**: Pink and moist
- **Emergency signs**: Pale, white, blue, or bright red

## Common Emergency Situations

### Choking

#### Signs:
- Pawing at the mouth
- Difficulty breathing
- Blue gums
- Panic or distress

#### First Aid:
1. **Open the mouth** and look for visible objects
2. **For small objects**: Use tweezers to remove
3. **For large dogs**: Lift hind legs and push firmly upward on abdomen
4. **For small dogs/cats**: Hold upside down and strike between shoulder blades
5. **Get to vet immediately** even if object is removed

### Bleeding

#### External Bleeding:
1. **Apply direct pressure** with clean cloth
2. **Elevate the wound** if possible
3. **Don't remove** embedded objects
4. **Bandage firmly** but not too tight
5. **Seek veterinary care**

#### Internal Bleeding Signs:
- Pale gums
- Weakness
- Swollen abdomen
- Vomiting blood
- **Seek emergency care immediately**

### Poisoning

#### Common Household Toxins:
- Chocolate
- Grapes/raisins
- Onions/garlic
- Xylitol (artificial sweetener)
- Household cleaners
- Antifreeze

#### First Aid:
1. **Identify the poison** if possible
2. **Call poison control** or your vet immediately
3. **DO NOT induce vomiting** unless instructed
4. **Bring the packaging** to the vet if possible
5. **Follow professional instructions** exactly

### Seizures

#### During a Seizure:
1. **Stay calm** and time the seizure
2. **Remove nearby objects** that could cause injury
3. **DO NOT put anything** in the mouth
4. **DO NOT try to restrain** your pet
5. **Keep the area quiet** and dim

#### After a Seizure:
1. **Comfort your pet** gently
2. **Check for injuries**
3. **Contact your veterinarian**
4. **Multiple seizures** = emergency situation

### Heatstroke

#### Signs:
- Heavy panting
- Drooling
- Red gums
- Vomiting
- Loss of coordination
- Collapse

#### First Aid:
1. **Move to cool area** immediately
2. **Apply cool (not cold) water** to paw pads and abdomen
3. **Offer small amounts** of cool water
4. **Use fan** if available
5. **Get to vet immediately** - can be fatal

### Fractures

#### Signs:
- Obvious deformity
- Unable to bear weight
- Pain when touched
- Swelling

#### First Aid:
1. **Keep your pet calm** and still
2. **DO NOT try to set** the bone
3. **Support the limb** with towels or cardboard
4. **Transport carefully** to vet
5. **Control any bleeding**

### Burns

#### First Aid:
1. **Remove from heat source**
2. **Cool the burn** with cool water for 10-15 minutes
3. **DO NOT use ice** or butter
4. **Cover with clean cloth**
5. **Seek veterinary care**

### Eye Injuries

#### First Aid:
1. **DO NOT try to remove** objects from eye
2. **Flush with saline** if available
3. **Prevent rubbing** with E-collar if possible
4. **Keep moist** with damp cloth
5. **Seek immediate veterinary care**

## What NOT to Do

### Never:
- **Give human medications** unless specifically directed by a vet
- **Induce vomiting** unless instructed by a professional
- **Try to treat** severe injuries yourself
- **Panic** - stay calm for your pet's sake
- **Assume your pet is "fine"** after an emergency

## When to Seek Emergency Care

### Immediate Emergency:
- Difficulty breathing
- Unconsciousness
- Severe bleeding
- Poisoning
- Seizures lasting more than 5 minutes
- Bloated abdomen
- Can't urinate
- Severe trauma

### Urgent (within hours):
- Vomiting/diarrhea with blood
- Not eating for 24+ hours
- Straining to urinate or defecate
- Limping or apparent pain
- Eye injuries

## Transporting an Injured Pet

### Small Pets:
- Use a carrier or box
- Line with soft towels
- Keep warm and quiet

### Large Dogs:
- Use a blanket as a stretcher
- Support the head and spine
- Have someone help you lift
- Keep the injured area supported

### Handling Injured Pets:
- **Approach slowly** and speak softly
- **Watch for signs** of pain or fear
- **Muzzle if necessary** (but not if vomiting or breathing problems)
- **Support the body** when lifting

## Prevention is the Best Medicine

### Pet-Proof Your Home:
- Secure toxic substances
- Remove choking hazards
- Block access to dangerous areas
- Use safety gates
- Keep emergency numbers accessible

### Regular Veterinary Care:
- Annual wellness exams
- Keep vaccinations current
- Discuss emergency plans with your vet
- Consider pet insurance

### Stay Educated:
- Take a pet first aid class
- Know your pet's normal behavior
- Practice emergency procedures
- Keep first aid supplies updated

## Special Considerations

### Senior Pets:
- More prone to emergencies
- May hide symptoms
- Need gentler handling
- Slower recovery times

### Puppies and Kittens:
- Can decline rapidly
- Smaller margin for error
- More vulnerable to toxins
- Require immediate care

Remember: First aid is not a substitute for professional veterinary care. The goal is to stabilize your pet and get them to a veterinarian as quickly and safely as possible. When in doubt, err on the side of caution and seek professional help immediately.

Being prepared and knowing these basic techniques can make a crucial difference in an emergency situation. Practice these skills before you need them, and always have your emergency contacts readily available.`,
    summary: 'Master essential first aid techniques for pet emergencies including choking, poisoning, seizures, and trauma care. Learn what to do and what to avoid.',
    tags: ['emergency', 'first aid', 'safety', 'health', 'critical care'],
    author: 'Dr. Michael Chen, DVM, DACVECC',
    featuredImage: 'https://images.pexels.com/photos/333083/pexels-photo-333083.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://example.com/pet-first-aid-video',
    createdAt: new Date('2023-12-20'),
    likes: 445,
    views: 2800,
  },
  {
    id: '10',
    title: 'Finding the Right Veterinarian for Your Pet',
    category: 'pet-services',
    difficulty: 'beginner',
    estimatedReadTime: 6,
    content: `# Finding the Right Veterinarian for Your Pet

Choosing the right veterinarian is one of the most important decisions you'll make as a pet owner. A good vet will be your partner in keeping your pet healthy throughout their life.

## What to Look For

### Qualifications and Experience
- **Board certification** from accredited veterinary schools
- **Years of experience** with your type of pet
- **Continuing education** and specializations
- **Professional memberships** in veterinary associations

### Clinic Facilities
- **Clean, modern facilities** with up-to-date equipment
- **Emergency capabilities** or partnerships with emergency clinics
- **On-site laboratory** for quick test results
- **Separate areas** for different types of animals

### Communication Style
- **Patient and thorough** explanations of treatments
- **Willingness to answer questions** without rushing
- **Clear pricing** and treatment options
- **Comfortable handling** of your pet

## Questions to Ask

Before choosing a veterinarian, consider asking:

1. **What are your hours and emergency policies?**
2. **What is your approach to preventive care?**
3. **How do you handle payment and insurance?**
4. **Can you provide references from other pet owners?**
5. **What is your experience with my pet's breed?**

## Red Flags to Avoid

- **Unwillingness to show facilities** or answer questions
- **Pressure to buy expensive treatments** immediately
- **Lack of clear pricing** or hidden fees
- **Poor handling** of animals or unsanitary conditions
- **No emergency coverage** or referral system

## Building a Relationship

Once you've chosen a vet:
- **Schedule regular check-ups** as recommended
- **Keep detailed records** of your pet's health
- **Be honest about your budget** and concerns
- **Follow through** with recommended treatments
- **Provide feedback** about your experience

Remember, a good veterinarian should make both you and your pet feel comfortable and well-cared for.`,
    summary: 'Learn how to choose the best veterinarian for your pet, what questions to ask, and red flags to avoid when selecting veterinary care.',
    tags: ['veterinarian', 'pet care', 'health', 'services', 'choosing vet'],
    author: 'Dr. Sarah Johnson, DVM',
    featuredImage: 'https://images.pexels.com/photos/6235234/pexels-photo-6235234.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date('2024-01-10'),
    likes: 234,
    views: 1456,
  },
  {
    id: '11',
    title: 'Complete Guide to Pet Grooming Services',
    category: 'pet-services',
    difficulty: 'beginner',
    estimatedReadTime: 8,
    content: `# Complete Guide to Pet Grooming Services

Regular grooming is essential for your pet's health and happiness. While some grooming can be done at home, professional services offer expertise and specialized care.

## Types of Grooming Services

### Basic Grooming Package
- **Bath and dry** with professional shampoos
- **Nail trimming** to appropriate length
- **Ear cleaning** to prevent infections
- **Basic brushing** to remove loose fur

### Full-Service Grooming
- **Complete coat care** including cuts and styling
- **Dental cleaning** (basic)
- **Anal gland expression** (if needed)
- **Flea and tick treatments**
- **Specialized skin treatments**

### Breed-Specific Services
- **Show cuts** for specific breeds
- **Breed-standard grooming** techniques
- **Specialized coat treatments** for double coats
- **Hand-stripping** for wire-haired breeds

## What to Expect

### First Visit
1. **Consultation** about your pet's needs
2. **Health assessment** before grooming begins
3. **Discussion of services** and pricing
4. **Timeline** for completion

### During the Service
- **Gentle handling** techniques
- **Regular breaks** for anxious pets
- **Use of proper restraints** for safety
- **Monitoring** for stress or health issues

## Choosing a Groomer

### Important Qualifications
- **Professional training** or certification
- **Experience** with your pet's breed
- **Clean, safe facilities** with proper equipment
- **Good references** from other pet owners

### Questions to Ask
1. **How do you handle anxious pets?**
2. **What products do you use?**
3. **How long will the grooming take?**
4. **What is included in each service?**
5. **Do you have experience with my pet's breed?**

## Grooming Schedule

### Dogs
- **Short-haired breeds**: Every 6-12 weeks
- **Long-haired breeds**: Every 4-6 weeks
- **High-maintenance breeds**: Every 4 weeks

### Cats
- **Short-haired**: Every 8-12 weeks
- **Long-haired**: Every 4-6 weeks
- **Senior cats**: More frequent as needed

## Home Care Between Visits

- **Regular brushing** as recommended
- **Nail checks** and basic trimming
- **Ear cleaning** with vet-approved solutions
- **Dental care** with appropriate products

Professional grooming not only keeps your pet looking great but also helps maintain their health and comfort.`,
    summary: 'Everything you need to know about professional pet grooming services, from choosing the right groomer to understanding different service packages.',
    tags: ['grooming', 'pet care', 'services', 'hygiene', 'professional care'],
    author: 'Lisa Martinez, Certified Pet Groomer',
    featuredImage: 'https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date('2024-01-08'),
    likes: 189,
    views: 1122,
  },
  // Bangladesh-specific learning articles
  {
    id: 'bd-01',
    title: 'Pet Care in Bangladesh\'s Climate: Essential Tips',
    category: 'basic-care',
    difficulty: 'beginner',
    estimatedReadTime: 10,
    content: `# Pet Care in Bangladesh's Climate: Essential Tips

Bangladesh's tropical climate presents unique challenges for pet owners. High humidity, monsoon seasons, and intense heat require special care strategies to keep your pets healthy and comfortable.

## Understanding Bangladesh's Climate Challenges

### Monsoon Season (June-October)
- **High humidity** (80-90%)
- **Heavy rainfall** and flooding
- **Increased fungal infections**
- **Limited outdoor exercise opportunities**

### Summer Season (March-May)
- **Extreme heat** (up to 40°C/104°F)
- **High humidity** making it feel hotter
- **Risk of heat stroke**
- **Dehydration concerns**

### Winter Season (November-February)
- **Mild temperatures** (10-25°C/50-77°F)
- **Lower humidity**
- **Ideal time for outdoor activities**
- **Respiratory issues from dust**

## Heat Management

### Keeping Pets Cool
- **Provide constant shade** when outdoors
- **Use cooling mats** or wet towels
- **Ensure fresh water** is always available
- **Limit exercise** to early morning or evening
- **Use fans or air conditioning** when possible

### Recognizing Heat Stroke
**Warning Signs:**
- Excessive panting
- Drooling
- Weakness or collapse
- Vomiting
- Red or blue gums

**Emergency Action:**
1. Move pet to cool area immediately
2. Apply cool (not cold) water to paw pads
3. Offer small amounts of water
4. Contact veterinarian immediately

## Monsoon Care

### Indoor Environment
- **Use dehumidifiers** to reduce moisture
- **Ensure proper ventilation**
- **Keep pets dry** after going outside
- **Regular grooming** to prevent matting

### Health Monitoring
- **Watch for skin infections** from humidity
- **Check ears regularly** for infections
- **Monitor for respiratory issues**
- **Maintain vaccination schedule**

### Flooding Precautions
- **Have evacuation plan** for pets
- **Keep carriers accessible**
- **Store pet supplies** in waterproof containers
- **Know location** of emergency veterinary clinics

## Common Health Issues in Bangladesh

### Skin Problems
- **Fungal infections** from humidity
- **Bacterial infections** from scratching
- **Parasites** like fleas and ticks
- **Hot spots** from excessive licking

**Prevention:**
- Regular bathing with antifungal shampoo
- Keep fur dry and well-groomed
- Use prescribed flea/tick prevention
- Maintain clean living environment

### Digestive Issues
- **Food spoilage** in heat and humidity
- **Waterborne parasites**
- **Dietary changes** affecting digestion

**Management:**
- Store food in airtight containers
- Use boiled or filtered water
- Avoid feeding street food to pets
- Monitor for signs of illness

## Nutrition in Hot Climate

### Feeding Guidelines
- **Feed during cooler hours** (early morning/evening)
- **Smaller, frequent meals** to aid digestion
- **High-quality protein** for energy maintenance
- **Avoid overfeeding** in hot weather

### Hydration
- **Multiple water sources** throughout home
- **Clean, fresh water** changed daily
- **Ice cubes** as treats (for dogs)
- **Wet food** to increase water intake

## Exercise and Activity

### Safe Exercise Times
- **Early morning** (5:00-7:00 AM)
- **Late evening** (6:00-8:00 PM)
- **Avoid midday** activities
- **Check pavement temperature** before walks

### Indoor Activities
- **Interactive toys** and puzzles
- **Training sessions** for mental stimulation
- **Indoor play areas** during storms
- **Stair climbing** for exercise

## Grooming in Humid Climate

### Regular Maintenance
- **Daily brushing** to prevent matting
- **Weekly baths** with appropriate shampoo
- **Nail trimming** every 2-3 weeks
- **Ear cleaning** to prevent infections

### Professional Services
Bangladesh has several professional grooming services:
- **Pet Grooming BD** (Mohammadpur)
- **Head to Tail** (Madani Avenue)
- Mobile grooming services available

## Healthcare Considerations

### Finding Veterinary Care
Quality veterinary services in Dhaka:
- **Care & Cure Veterinary Clinic** (Dhanmondi)
- **Pet Heaven Veterinary Clinic** (Mirpur)
- **MR Veterinary Clinic** (East Bashabo)

### Preventive Care
- **Regular vaccinations** against local diseases
- **Parasite prevention** year-round
- **Health check-ups** every 6 months
- **Dental care** to prevent infections

## Emergency Preparedness

### Natural Disasters
- **Cyclone preparation** with pet supplies
- **Flood evacuation** plans
- **Emergency contact list** for veterinarians
- **Pet identification** with updated information

### First Aid Kit
Essential items for Bangladesh climate:
- Antifungal medication
- Electrolyte solution
- Cooling pads
- Emergency veterinary contacts
- Waterproof containers

## Local Pet Supplies

### Reliable Stores
- **Paw Care** (Katabon) - Quality imported brands
- **Bangladesh Pet House** (Katabon) - Local and imported supplies
- **Head to Tail Pet Store** (Madani Avenue) - Premium accessories

### What to Stock
- High-quality pet food (store properly)
- Antifungal shampoos
- Flea and tick prevention
- Cooling accessories
- Waterproof bedding

Living with pets in Bangladesh requires extra attention to climate-related challenges, but with proper care and preparation, your furry friends can thrive in this beautiful country.`,
    summary: 'Navigate Bangladesh\'s unique climate challenges with essential pet care tips for monsoon seasons, extreme heat, and humidity management.',
    tags: ['bangladesh', 'climate', 'monsoon', 'heat', 'humidity', 'tropical care'],
    author: 'Dr. Rahman Ahmed, DVM (Dhaka)',
    featuredImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&h=600',
    createdAt: new Date('2024-01-20'),
    likes: 145,
    views: 892,
  },
  {
    id: 'bd-02',
    title: 'Popular Dog Breeds in Bangladesh: A Complete Guide',
    category: 'breed-guide',
    difficulty: 'beginner',
    estimatedReadTime: 12,
    content: `# Popular Dog Breeds in Bangladesh: A Complete Guide

Bangladesh has a growing community of dog lovers, with certain breeds being particularly well-suited to the local climate and lifestyle. This guide covers the most popular breeds and their care requirements.

## Climate-Suitable Breeds

### German Shepherd
**Why Popular in Bangladesh:**
- Excellent guard dogs
- Intelligent and trainable
- Adapt well to heat with proper care
- Strong presence for security

**Special Care Needs:**
- Regular grooming during shedding season
- Plenty of exercise in cooler hours
- High-quality diet for joint health
- Air conditioning during extreme heat

### Labrador Retriever
**Why Popular:**
- Friendly family dogs
- Good with children
- Swimming ability (useful during floods)
- Relatively heat tolerant

**Care Requirements:**
- Daily exercise and swimming
- Regular grooming
- Weight management crucial
- Joint supplements as they age

### Local Mixed Breeds (Deshi Dogs)
**Advantages:**
- Naturally adapted to local climate
- Strong immune systems
- Lower maintenance costs
- Excellent street smarts

**Care Tips:**
- Regular health check-ups
- Proper nutrition despite hardy nature
- Socialization training
- Parasite prevention

## Medium-Sized Breeds

### Cocker Spaniel
**Popularity Reasons:**
- Moderate size suitable for apartments
- Good temperament with families
- Beautiful coat appealing to owners
- Manageable exercise needs

**Bangladesh-Specific Care:**
- Daily brushing to prevent matting
- Regular ear cleaning (humidity issues)
- Professional grooming every 6 weeks
- Indoor exercise during hot weather

### Beagle
**Why Chosen:**
- Friendly and social
- Good size for urban living
- Hardy constitution
- Good with children

**Special Considerations:**
- High energy needs regular outlets
- Tendency to gain weight in hot weather
- Need secure fencing (escape artists)
- Regular health monitoring

## Small Breeds

### Pomeranian
**Appeal Factors:**
- Compact size for small homes
- Beautiful fluffy coat
- Alert watchdogs
- Social media appeal

**Heat Management:**
- Air conditioning essential
- Limited outdoor time
- Regular grooming to prevent overheating
- Cool water always available

### Shih Tzu
**Popularity:**
- Friendly, outgoing personality
- Good apartment dogs
- Minimal exercise needs
- Good with families

**Climate Challenges:**
- Breathing difficulties in heat
- Daily facial cleaning needed
- Professional grooming essential
- Heat stroke risk - monitor closely

## Large Breeds

### Rottweiler
**Why Kept:**
- Excellent security dogs
- Loyal family protectors
- Strong, impressive appearance
- Intelligent and trainable

**Hot Climate Care:**
- Extensive cooling measures needed
- Exercise only in early morning/evening
- Constant water access
- Watch for overheating signs

### Great Dane
**Growing Popularity:**
- Gentle giants personality
- Status symbol appeal
- Good apartment dogs (surprisingly)
- Calm temperament

**Special Needs in Bangladesh:**
- High food costs and requirements
- Joint health supplements essential
- Climate control crucial
- Regular veterinary monitoring

## Breed-Specific Health Concerns

### Hip Dysplasia (Large Breeds)
**Common in:** German Shepherds, Labradors, Rottweilers
**Prevention:**
- Quality breeding selection
- Proper nutrition during growth
- Weight management
- Regular exercise on soft surfaces

### Respiratory Issues (Flat-Faced Breeds)
**Affected Breeds:** Shih Tzu, Pug, Bulldog
**Management:**
- Air conditioning mandatory
- Avoid exercise in heat
- Weight control crucial
- Monitor breathing closely

### Skin Problems (All Breeds)
**Common Issues:** Fungal infections, hot spots
**Prevention:**
- Regular grooming and bathing
- Keep skin dry
- Use antifungal shampoos
- Proper ventilation

## Choosing the Right Breed

### Consider Your Lifestyle
- **Apartment vs. House:** Size and exercise needs
- **Family Situation:** Children, elderly members
- **Experience Level:** First-time vs. experienced owners
- **Budget:** Food, healthcare, grooming costs

### Climate Compatibility
- **Heat Tolerance:** Essential in Bangladesh
- **Grooming Needs:** Professional vs. home care
- **Exercise Requirements:** Indoor vs. outdoor options
- **Health Risks:** Breed-specific concerns

## Responsible Breeding

### Finding Good Breeders
- **Health testing** of parent dogs
- **Proper socialization** of puppies
- **Clean facilities** and healthy environment
- **Ongoing support** after purchase

### Red Flags to Avoid
- **Puppy mills** with poor conditions
- **No health records** for parents
- **Multiple breeds** in same location
- **Pressure sales** tactics

## Local Breed Communities

### Dog Shows and Clubs
- **Bangladesh Kennel Club** - Breed standards and shows
- **Local breed groups** on social media
- **Training clubs** for specific breeds
- **Meet-up groups** for breed socialization

### Training Resources
- **Professional trainers** familiar with breeds
- **Breed-specific training needs**
- **Socialization opportunities**
- **Problem behavior solutions**

## Cost Considerations

### Initial Costs (BDT)
- **Purebred puppy:** 15,000-150,000+
- **Mixed breed:** 2,000-15,000
- **Initial supplies:** 10,000-25,000
- **First vet visit:** 2,000-5,000

### Monthly Expenses (BDT)
- **Food:** 3,000-10,000
- **Veterinary care:** 1,000-5,000
- **Grooming:** 1,500-5,000
- **Supplies:** 1,000-3,000

## Healthcare for Different Breeds

### Vaccination Schedule
All breeds need core vaccines:
- **Distemper, Hepatitis, Parvovirus, Parainfluenza**
- **Rabies** (legally required)
- **Local disease considerations**

### Breed-Specific Health Monitoring
- **Large breeds:** Joint health, bloat prevention
- **Small breeds:** Dental care, luxating patella
- **Flat-faced breeds:** Respiratory monitoring
- **All breeds:** Parasite prevention

## Exercise and Recreation

### Breed-Appropriate Activities
- **High-energy breeds:** Agility, fetch, swimming
- **Guard breeds:** Training, structured walks
- **Small breeds:** Indoor play, short walks
- **All breeds:** Mental stimulation games

### Safe Locations in Dhaka
- **Ramna Park** (early morning)
- **Dhanmondi Lake** area
- **Private dog parks** (emerging)
- **Indoor training facilities**

## Future Trends

### Growing Breeds
- **French Bulldog** - Apartment-friendly
- **Border Collie** - Intelligence appeal
- **Husky mixes** - Appearance (challenging for climate)
- **Designer mixes** - Poodle crosses

### Changing Attitudes
- **Pet insurance** becoming available
- **Professional services** expanding
- **Better veterinary care** emerging
- **Breed-specific rescue** organizations

Remember: Every dog is an individual, regardless of breed. Proper care, training, and love are more important than breed characteristics. Choose a breed that fits your lifestyle and commitment level for a happy, lifelong partnership.`,
    summary: 'Discover the most popular dog breeds in Bangladesh, their climate suitability, care requirements, and local breed community resources.',
    tags: ['bangladesh', 'dog breeds', 'breed guide', 'climate suitability', 'local breeds'],
    author: 'Md. Karim Hassan, Certified Dog Trainer (Dhaka)',
    featuredImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&h=600',
    createdAt: new Date('2024-01-18'),
    likes: 298,
    views: 1654,
  },
  {
    id: 'bd-03',
    title: 'Cat Breeds Perfect for Bangladesh: Munchkin and More',
    category: 'breed-guide',
    difficulty: 'beginner',
    estimatedReadTime: 8,
    content: `# Cat Breeds Perfect for Bangladesh: Munchkin and More

Bangladesh's climate and lifestyle make certain cat breeds particularly suitable as companions. From the adorable Munchkin to hardy local breeds, discover which feline friends thrive in our tropical environment.

## Climate-Friendly Cat Breeds

### Munchkin Cats
**Why Perfect for Bangladesh:**
- **Heat tolerant** with short legs reducing ground heat
- **Indoor lifestyle** suits apartment living
- **Low exercise needs** perfect for hot climate
- **Adaptable personality** thrives in family settings

**Special Care in Bangladesh:**
- Air conditioning recommended during peak summer
- Regular grooming to prevent matting in humidity
- Elevated feeding stations for comfort
- Daily play sessions for mental stimulation

**Munchkin Care Essentials:**
- **Diet:** High-quality kitten/adult food as appropriate
- **Exercise:** Interactive toys and climbing trees
- **Health:** Regular vet checkups for spinal health
- **Grooming:** Weekly brushing, more during shedding

### Persian Cats
**Popularity Reasons:**
- **Beautiful long coat** appeals to cat lovers
- **Calm temperament** suits quiet households
- **Indoor preference** matches climate needs
- **Prestigious appearance** status appeal

**Bangladesh-Specific Needs:**
- **Daily grooming** essential in humidity
- **Air conditioning** mandatory for comfort
- **Eye cleaning** daily due to flat face
- **Professional grooming** every 6-8 weeks

### Local Mixed Breeds (Deshi Cats)
**Natural Advantages:**
- **Climate adapted** over generations
- **Strong immune systems** resist local diseases
- **Low maintenance** grooming needs
- **Excellent hunters** for pest control

**Care Benefits:**
- Minimal grooming requirements
- Hardy health with proper nutrition
- Natural heat tolerance
- Lower veterinary costs

## Indoor vs. Outdoor Considerations

### Indoor Cat Benefits in Bangladesh
- **Safety from traffic** in busy cities
- **Protection from diseases** and parasites
- **Climate control** during extreme weather
- **Longer lifespan** with proper care

### Creating Indoor Environment
- **Multiple levels** with cat trees
- **Window perches** for bird watching
- **Interactive toys** for mental stimulation
- **Scratching posts** for claw health

### Supervised Outdoor Time
- **Screened balconies** for fresh air
- **Harness training** for safe exploration
- **Garden enclosures** if available
- **Early morning** or evening outdoor time

## Health Considerations by Breed

### Flat-Faced Breeds (Persian, Exotic)
**Common Issues:**
- Breathing difficulties in heat/humidity
- Eye infections from tear duct problems
- Skin fold dermatitis
- Dental problems

**Prevention:**
- Air conditioning during hot weather
- Daily face cleaning routines
- Regular veterinary eye exams
- Proper dental care

### Long-Haired Breeds
**Humidity Challenges:**
- Matting and tangling
- Skin infections under mats
- Overheating in hot weather
- Increased grooming needs

**Management:**
- Daily brushing routine
- Professional grooming regularly
- Cooling mats during summer
- Proper nutrition for coat health

### Short-Haired Breeds
**Advantages in Bangladesh:**
- Natural heat tolerance
- Minimal grooming needs
- Less humidity-related issues
- Easier maintenance overall

## Kitten Care in Bangladesh

### Young Kitten Needs (0-6 months)
- **Temperature control** crucial for tiny bodies
- **Frequent feeding** every few hours
- **Vaccination schedule** against local diseases
- **Parasite prevention** from early age

### Adolescent Care (6-12 months)
- **Spaying/neutering** before first heat
- **Adult food transition** around 12 months
- **Behavioral training** and socialization
- **Regular health monitoring**

## Common Cat Health Issues in Bangladesh

### Parasites
**Types:** Fleas, ticks, intestinal worms
**Prevention:**
- Regular flea/tick treatments
- Clean living environment
- Regular deworming schedule
- Veterinary-recommended preventatives

### Skin Problems
**Causes:** Humidity, allergens, poor grooming
**Solutions:**
- Regular grooming routines
- Antifungal shampoos when needed
- Clean, dry living spaces
- Professional veterinary treatment

### Respiratory Issues
**Risk Factors:** Dust, humidity, poor ventilation
**Management:**
- Air purifiers in living spaces
- Regular cleaning of bedding
- Proper ventilation
- Immediate veterinary care for symptoms

## Nutrition for Bangladesh Cats

### Quality Food Options
**Available Brands:**
- **Royal Canin** - breed-specific formulas
- **Whiskas** - affordable, widely available
- **Purina Pro Plan** - premium nutrition
- **Local brands** - budget-friendly options

### Feeding Guidelines
- **Multiple small meals** better than large ones
- **Fresh water** changed daily
- **Temperature consideration** - room temperature food
- **Storage** in airtight containers

### Special Dietary Needs
- **Indoor cats** - weight management formulas
- **Long-haired breeds** - coat health nutrients
- **Senior cats** - easy-to-digest options
- **Medical conditions** - prescribed diets

## Grooming Services in Bangladesh

### Professional Groomers
- **Pet Grooming BD** (Mohammadpur) - Full-service cat grooming
- **Head to Tail** (Madani Avenue) - Specialized cat care
- **Mobile groomers** - Home service available

### Home Grooming Essentials
- **Slicker brushes** for long-haired breeds
- **Rubber brushes** for short-haired cats
- **Nail clippers** - guillotine or scissor type
- **Cat-specific shampoos** for occasional baths

## Veterinary Care

### Regular Health Checkups
**Kitten Schedule:**
- 6-8 weeks: First vaccines
- 10-12 weeks: Second vaccines
- 14-16 weeks: Final vaccines
- 6 months: Spay/neuter consultation

**Adult Schedule:**
- Annual comprehensive exams
- Semi-annual for senior cats (7+)
- Regular dental checkups
- Parasite screening

### Emergency Veterinary Services
**24-Hour Clinics in Dhaka:**
- **Pet Heaven Veterinary Clinic** (Mirpur)
- **Care & Cure Veterinary Clinic** (Dhanmondi)
- **Emergency contact numbers** always accessible

## Creating Cat-Friendly Homes

### Essential Supplies
- **Multiple litter boxes** (one per cat plus one extra)
- **Scratching posts** - various textures
- **Cat carriers** for vet visits
- **Food and water bowls** - stainless steel preferred

### Safety Considerations
- **Window screens** to prevent falls
- **Toxic plant removal** - many houseplants dangerous
- **Secure balconies** with cat-proof barriers
- **Emergency preparedness** for natural disasters

## Cat Breeding in Bangladesh

### Responsible Breeding Practices
- **Health testing** of breeding cats
- **Proper socialization** of kittens
- **Clean breeding facilities**
- **Genetic diversity** considerations

### Finding Quality Breeders
- **Bangladesh Cat Breeders Association** membership
- **Health certificates** for breeding cats
- **References** from previous buyers
- **Lifetime support** offerings

## Costs of Cat Ownership

### Initial Expenses (BDT)
- **Purebred kitten:** 10,000-80,000
- **Mixed breed:** 1,000-8,000
- **Initial supplies:** 5,000-15,000
- **First veterinary care:** 1,500-3,000

### Monthly Costs (BDT)
- **Food:** 1,500-4,000
- **Litter:** 800-1,500
- **Healthcare:** 500-2,000
- **Grooming:** 1,000-3,000

## Community and Resources

### Online Communities
- **Facebook cat groups** for Bangladesh
- **Local cat shows** and exhibitions
- **Breed-specific groups** for specialized advice
- **Rescue organizations** for adoption

### Educational Resources
- **Veterinary advice** from local professionals
- **International cat care** websites
- **Breed-specific information** from registries
- **Local expert guidance** from experienced owners

Whether you choose a special breed like the charming Munchkin or a hardy local cat, providing proper care in Bangladesh's unique environment will ensure your feline friend lives a happy, healthy life.`,
    summary: 'Explore the best cat breeds for Bangladesh\'s climate, featuring the adorable Munchkin breed and essential care tips for tropical cat ownership.',
    tags: ['bangladesh', 'cat breeds', 'munchkin', 'tropical cats', 'indoor cats', 'feline care'],
    author: 'Dr. Fatima Khan, Feline Specialist (Dhaka)',
    featuredImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&h=600',
    createdAt: new Date('2024-01-15'),
    likes: 256,
    views: 1398,
  },
];

export const getFeaturedArticles = () => {
  return mockLearningArticles.slice(0, 3);
};

export const getArticlesByCategory = (categoryId: string) => {
  return mockLearningArticles.filter(article => article.category === categoryId);
};

export const getPopularArticles = () => {
  return mockLearningArticles.sort((a, b) => b.views - a.views).slice(0, 5);
};

export const searchArticles = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return mockLearningArticles.filter(article =>
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
