# System Design Specification (SDS)
## PawMatch - Pet Adoption Mobile Application

### Project Information
- **Project Name**: PawMatch
- **Platform**: Cross-Platform Mobile Application (React Native/Expo)
- **Database**: PostgreSQL/Supabase
- **Primary Purpose**: Pet adoption and matching system with AI-powered counseling

---

## 1. Use Case Diagram

### Primary Actors
- **User**: Pet adopters and general users
- **Admin**: System administrators
- **AI Counselor**: Automated chat system

### Use Cases

```
                    PawMatch System Use Cases

    User                           Admin                    AI Counselor
     |                              |                           |
     |---> Browse Pets               |---> Manage Pets         |
     |---> Search/Filter Pets       |---> Review Applications |
     |---> Like/Pass Pets           |---> Manage Users        |
     |---> Save Favorites           |---> Generate Reports    |
     |---> View Pet Details         |---> Moderate Content    |
     |---> Apply for Adoption       |                         |
     |---> Chat with AI             |<------------------------|
     |---> Read Learning Content    |                         |
     |---> Manage Profile           |                         |
     |---> View Application Status  |                         |
     |---> Authenticate             |                         |
```

### Detailed Use Cases

**UC-01: Browse Pets**
- Actor: User
- Description: User browses available pets using swipe interface
- Preconditions: App is launched
- Flow: Launch app → View pet cards → Swipe left/right → View next pet

**UC-02: Search and Filter Pets**
- Actor: User
- Description: User applies filters to find specific types of pets
- Preconditions: User is on discover screen
- Flow: Tap filter → Select criteria → Apply filters → View results

**UC-03: Manage Pet Profiles**
- Actor: Admin
- Description: Admin manages pet information and availability
- Preconditions: Admin is authenticated
- Flow: Login → Access admin panel → Add/Edit/Delete pets → Save changes

**UC-04: AI Chat Consultation**
- Actor: User, AI Counselor
- Description: User receives pet care advice from AI system
- Preconditions: User accesses chat feature
- Flow: Open chat → Ask question → Receive AI response → Continue conversation

---

## 2. Class Diagram

### Core Classes and Relationships

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UserProfile   │    │      Pet        │    │LearningArticle  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id: UUID        │    │ id: UUID        │    │ id: UUID        │
│ email: string   │    │ name: string    │    │ title: string   │
│ full_name: string│   │ breed: string   │    │ content: string │
│ avatar_url: string│  │ age: integer    │    │ category: string│
│ phone: string   │    │ gender: enum    │    │ author: string  │
│ location: string│    │ size: enum      │    │ difficulty: enum│
│ preferences: JSON│   │ color: string   │    │ read_time: int  │
│ is_admin: boolean│   │ personality: []  │    │ published: bool │
│ created_at: timestamp│ description: text│   │ created_at: timestamp│
│ updated_at: timestamp│ images: []      │   │ updated_at: timestamp│
├─────────────────┤    │ location: string│    ├─────────────────┤
│ updateProfile() │    │ contact_info: JSON│  │ getByCategory() │
│ authenticate()  │    │ adoption_status: enum│ │ publish()      │
│ signOut()       │    │ owner_id: UUID  │    │ unpublish()     │
└─────────────────┘    │ created_at: timestamp│ └─────────────────┘
                       │ updated_at: timestamp│
                       ├─────────────────┤
                       │ updateStatus()  │
                       │ addImages()     │
                       │ getAvailable()  │
                       └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  PetFavorite    │    │ PetInteraction  │    │AdoptionApplication│
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id: UUID        │    │ id: UUID        │    │ id: UUID        │
│ user_id: UUID   │    │ user_id: UUID   │    │ pet_id: UUID    │
│ pet_id: UUID    │    │ pet_id: UUID    │    │ user_id: UUID   │
│ created_at: timestamp│ interaction_type: enum│ status: enum   │
├─────────────────┤    │ created_at: timestamp│ application_data: JSON│
│ add()           │    ├─────────────────┤    │ submitted_at: timestamp│
│ remove()        │    │ record()        │    │ reviewed_at: timestamp│
│ getUserFavorites()│  │ getHistory()    │    │ reviewed_by: UUID│
└─────────────────┘    └─────────────────┘    │ notes: text     │
                                              ├─────────────────┤
┌─────────────────┐    ┌─────────────────┐    │ submit()        │
│ AIChatSession   │    │ AIChatMessage   │    │ review()        │
├─────────────────┤    ├─────────────────┤    │ approve()       │
│ id: UUID        │    │ id: UUID        │    │ reject()        │
│ user_id: UUID   │    │ session_id: UUID│    └─────────────────┘
│ session_name: string│ role: enum      │
│ context: JSON   │    │ content: text   │
│ message_count: int│  │ metadata: JSON  │
│ created_at: timestamp│ created_at: timestamp│
│ updated_at: timestamp├─────────────────┤
├─────────────────┤    │ send()          │
│ createSession() │    │ generateResponse()│
│ addMessage()    │    └─────────────────┘
└─────────────────┘
```

### Relationships
- UserProfile 1:N PetFavorite
- UserProfile 1:N PetInteraction  
- UserProfile 1:N AdoptionApplication
- UserProfile 1:N AIChatSession
- Pet 1:N PetFavorite
- Pet 1:N PetInteraction
- Pet 1:N AdoptionApplication
- AIChatSession 1:N AIChatMessage

---

## 3. Activity Diagram

### Pet Discovery and Adoption Process

```
Start
  ↓
Launch App
  ↓
[Authenticated?] → No → Authentication Process
  ↓ Yes                    ↓
Load Pet Feed              Complete Auth
  ↓                        ↓
Display Pet Card ←---------┘
  ↓
[User Action?]
  ↓
  ├─ Swipe Right → Add to Favorites → Record Interaction
  ├─ Swipe Left → Record Pass → Next Pet
  ├─ Tap Card → View Details
  └─ Filter → Apply Filters → Reload Feed
       ↓
View Pet Details
  ↓
[User Decision?]
  ├─ Back → Return to Feed
  ├─ Favorite → Add to Favorites
  └─ Apply → Fill Application Form
              ↓
Submit Application
  ↓
Application Submitted
  ↓
[Admin Review Process]
  ↓
Notify User of Status
  ↓
End
```

### AI Chat Process

```
Start Chat
  ↓
Load Chat Interface
  ↓
[First Visit?] → Yes → Show Quick Questions
  ↓ No
Display Chat History
  ↓
User Types Message
  ↓
Send Message
  ↓
Process Message
  ↓
[Predefined Response?] → Yes → Return Stored Response
  ↓ No                         ↓
Analyze Keywords              Display Response
  ↓                            ↓
Generate AI Response ←--------┘
  ↓
Display Response
  ↓
[Continue Chat?] → Yes → Wait for User Input
  ↓ No
End Chat
```

---

## 4. Sequence Diagram

### Pet Browsing and Interaction Sequence

```
User      App Interface    Pet Service    Database    Notification
 |             |               |             |            |
 |─ Launch ───→|               |             |            |
 |             |─ Load Pets ──→|             |            |
 |             |               |─ Query ────→|            |
 |             |               |←─ Results ─|            |
 |             |←─ Display ────|             |            |
 |─ Swipe Right→|               |             |            |
 |             |─ Record Like ─→|             |            |
 |             |               |─ Insert ───→|            |
 |             |               |─ Add Fav ──→|            |
 |             |               |←─ Success ──|            |
 |             |←─ Next Pet ───|             |            |
 |─ Tap Details→|               |             |            |
 |             |─ Get Details ─→|             |            |
 |             |               |─ Query ────→|            |
 |             |               |←─ Pet Data ─|            |
 |             |←─ Show Details|             |            |
 |─ Apply ─────→|               |             |            |
 |             |─ Submit App ──→|             |            |
 |             |               |─ Insert ───→|            |
 |             |               |←─ App ID ───|            |
 |             |               |─ Notify ───→|──→ Admin   |
 |             |←─ Confirmation|             |            |
```

### Authentication Sequence

```
User    Auth Screen    Auth Service    Supabase    Google OAuth
 |           |              |            |            |
 |─ Tap Login→|              |            |            |
 |           |─ Start Auth ─→|            |            |
 |           |              |─ OAuth ───→|            |
 |           |              |            |─ Redirect ─→|
 |           |              |            |←─ Code ────|
 |           |              |←─ Session ─|            |
 |           |←─ Success ────|            |            |
 |           |─ Navigate ───→|            |            |
```

---

## 5. Component Diagram

### System Architecture Components

```
┌─────────────────────────────────────────────────────────────┐
│                    PawMatch Mobile App                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   UI Layer  │  │Auth Module  │  │Chat Module  │        │
│  │             │  │             │  │             │        │
│  │ • Screens   │  │ • Google    │  │ • AI Logic  │        │
│  │ • Components│  │ • Session   │  │ • Messages  │        │
│  │ • Navigation│  │ • Profile   │  │ • Responses │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Pet Discovery│  │Search Filter│  │Profile Mgmt │        │
│  │             │  │             │  │             │        │
│  │ • Swipe UI  │  │ • Criteria  │  │ • Settings  │        │
│  │ • Cards     │  │ • Results   │  │ • Favorites │        │
│  │ • Actions   │  │ • Sorting   │  │ • History   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Data Service │  │Cache Layer  │  │Error Handler│        │
│  │             │  │             │  │             │        │
│  │ • API Calls │  │ • Local     │  │ • Logging   │        │
│  │ • Sync      │  │ • Images    │  │ • Retry     │        │
│  │ • Validation│  │ • Offline   │  │ • Recovery  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Supabase   │  │   Database  │  │  Auth Layer │        │
│  │             │  │             │  │             │        │
│  │ • Real-time │  │ • PostgreSQL│  │ • Row Level │        │
│  │ • Functions │  │ • Triggers  │  │ • Security  │        │
│  │ • Storage   │  │ • Indexes   │  │ • Policies  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Google OAuth │  │Image Storage│  │Push Notify  │        │
│  │             │  │             │  │             │        │
│  │ • Identity  │  │ • CDN       │  │ • Firebase  │        │
│  │ • Tokens    │  │ • Optimize  │  │ • Expo      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Interface Dependencies
- UI Layer ↔ Data Service
- Auth Module ↔ Supabase Auth
- Pet Discovery ↔ Database Service
- Chat Module ↔ AI Processing
- All Modules ↔ Error Handler

---

## 6. Data Flow Diagram (DFD)

### Level 0 - Context Diagram

```
                     ┌─────────────┐
                     │    User     │
                     └─────┬───────┘
                           │
              User Requests│ │App Responses
                           │ │
                     ┌─────▼───────┐
                     │  PawMatch   │
                     │   System    │
                     └─────┬───────┘
                           │
              Data Queries │ │Database Results
                           │ │
                     ┌─────▼───────┐
                     │  Database   │
                     └─────────────┘
```

### Level 1 - Main Processes

```
┌─────────────┐    Pet Search     ┌─────────────┐
│    User     │ ───────────────→  │    1.0      │
└─────────────┘                   │Pet Discovery│
       │                          │  Process    │
       │                          └─────┬───────┘
       │                                │
       │ Authentication                 │ Pet Data
       │                                ▼
       ▼                          ┌─────────────┐
┌─────────────┐                   │    D1       │
│    2.0      │ Pet Interactions  │   Pets      │
│User Account │ ─────────────────→│  Database   │
│ Management  │                   └─────────────┘
└─────────────┘                          ▲
       │                                 │
       │ Chat Requests                   │ User Data
       ▼                                 │
┌─────────────┐    AI Responses    ┌─────┴───────┐
│    3.0      │ ─────────────────→ │    D2       │
│AI Counseling│                    │    Users    │
│   Process   │                    │  Database   │
└─────────────┘                    └─────────────┘
```

### Level 2 - Detailed Pet Discovery Process

```
User Request
      │
      ▼
┌─────────────┐    Filter Criteria    ┌─────────────┐
│    1.1      │ ────────────────────→ │    1.2      │
│  Receive    │                       │   Apply     │
│  Request    │                       │  Filters    │
└─────────────┘                       └─────────────┘
                                             │
                                             │ Filtered Query
                                             ▼
                                      ┌─────────────┐
                                      │    1.3      │
                                      │  Retrieve   │
                                      │    Pets     │
                                      └─────────────┘
                                             │
                                             │ Pet Records
                                             ▼
                                      ┌─────────────┐
                                      │    1.4      │
                                      │   Format    │
                                      │  Response   │
                                      └─────────────┘
                                             │
                                             │ Formatted Data
                                             ▼
                                         User
```

---

## 7. Entity Relationship Diagram (ERD)

### Database Schema Relationships

```
┌─────────────────┐         ┌─────────────────┐
│  user_profiles  │         │      pets       │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │────┐    │ id (PK)         │
│ email           │    │    │ name            │
│ full_name       │    │    │ breed           │
│ avatar_url      │    │    │ age             │
│ phone           │    │    │ gender          │
│ location        │    │    │ size            │
│ preferences     │    │    │ color           │
│ is_admin        │    │    │ personality     │
│ created_at      │    │    │ description     │
│ updated_at      │    │    │ images          │
└─────────────────┘    │    │ location        │
                       │    │ contact_info    │
                       │    │ adoption_status │
                       │    │ owner_id (FK)   │
                       │    │ created_at      │
                       │    │ updated_at      │
                       │    └─────────────────┘
                       │             │
                       │             │
┌─────────────────┐    │    ┌─────────────────┐
│ pet_favorites   │    │    │pet_interactions │
├─────────────────┤    │    ├─────────────────┤
│ id (PK)         │    │    │ id (PK)         │
│ user_id (FK)    │────┘    │ user_id (FK)    │
│ pet_id (FK)     │─────────│ pet_id (FK)     │
│ created_at      │         │ interaction_type│
└─────────────────┘         │ created_at      │
                            └─────────────────┘
                                     │
                                     │
┌─────────────────┐                  │
│adoption_applications│              │
├─────────────────┤                  │
│ id (PK)         │                  │
│ pet_id (FK)     │──────────────────┘
│ user_id (FK)    │────┐
│ status          │    │
│ application_data│    │
│ submitted_at    │    │
│ reviewed_at     │    │
│ reviewed_by (FK)│────┘
│ notes           │
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────┐         ┌─────────────────┐
│ai_chat_sessions │         │ai_chat_messages │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │────────→│ id (PK)         │
│ user_id (FK)    │         │ session_id (FK) │
│ session_name    │         │ role            │
│ context         │         │ content         │
│ message_count   │         │ metadata        │
│ created_at      │         │ created_at      │
│ updated_at      │         └─────────────────┘
└─────────────────┘

┌─────────────────┐
│learning_articles│
├─────────────────┤
│ id (PK)         │
│ title           │
│ content         │
│ excerpt         │
│ author          │
│ category        │
│ subcategory     │
│ difficulty      │
│ read_time       │
│ tags            │
│ featured_image  │
│ published       │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### Relationship Definitions

**One-to-Many Relationships:**
- user_profiles → pet_favorites (1:N)
- user_profiles → pet_interactions (1:N)
- user_profiles → adoption_applications (1:N)
- user_profiles → ai_chat_sessions (1:N)
- pets → pet_favorites (1:N)
- pets → pet_interactions (1:N) 
- pets → adoption_applications (1:N)
- ai_chat_sessions → ai_chat_messages (1:N)

**Self-Referencing:**
- user_profiles.reviewed_by → user_profiles.id (admin reviews)

**Constraints:**
- Unique constraints on (user_id, pet_id) for favorites and interactions
- Check constraints for enums (gender, size, status, etc.)
- Foreign key constraints with CASCADE delete where appropriate

---

## Technical Specifications

### Technology Stack
- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Real-time + Authentication)
- **Authentication**: Google OAuth 2.0
- **State Management**: React Hooks + Context
- **Navigation**: Expo Router
- **Animations**: React Native Reanimated
- **UI Components**: Custom components with Lucide icons

### Key Features
1. **Swipe-based Pet Discovery**: Tinder-like interface for browsing pets
2. **Advanced Filtering**: Search by breed, age, size, location
3. **AI Pet Counselor**: Automated chat for pet care advice  
4. **Favorites System**: Save and manage liked pets
5. **Adoption Applications**: Submit and track adoption requests
6. **Learning Hub**: Educational articles about pet care
7. **Real-time Updates**: Live status updates for applications
8. **Offline Support**: Cached data for basic functionality

### Security Features
- Row Level Security (RLS) policies
- JWT-based authentication
- Input validation and sanitization
- Secure image upload and storage
- Role-based access control

### Performance Optimizations
- Image lazy loading and caching
- Database indexing for frequent queries
- Connection pooling
- Batch operations for bulk updates
- Progressive image loading

This SDS provides a comprehensive technical overview of the PawMatch system architecture, covering all major components, data flows, and relationships necessary for development and maintenance.
