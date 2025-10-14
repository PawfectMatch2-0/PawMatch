# Pawfect Match - Figma Design Specifications

## 🎨 Design System

### Color Palette
```
Primary Colors:
- Pink Primary: #E67E9C (Main brand color)
- Blue Secondary: #2FA5C7 (Accent color)
- White: #FFFFFF
- Black: #000000

Gradients:
- Pink Gradient: ['#E67E9C', '#EFA3B8', '#F7C9D4']
- Header Gradient: ['#E67E9C', '#F0A1B5']

Neutral Colors:
- Dark Gray: #333333 (Primary text)
- Medium Gray: #666666 (Secondary text)
- Light Gray: #999999 (Tertiary text)
- Border Gray: #E5E5E5
- Background: #F5F5F5

Success/Status Colors:
- Green: #10B981 (Success, Approved)
- Orange: #F59E0B (Pending, Warning)
- Red: #EF4444 (Error, Rejected)
- Teal: #4ECDC4 (Like indicator)
```

### Typography
```
Font Families:
- Headings: Poppins (Bold, SemiBold, Medium)
- Body Text: Nunito (Regular, SemiBold)

Font Sizes:
- Display: 32px (App name on splash)
- H1: 28px (Page titles)
- H2: 24px (Section headers)
- H3: 20px (Card titles)
- H4: 18px (Subheadings)
- Body Large: 16px (Primary content)
- Body: 14px (Secondary content)
- Caption: 12px (Labels, timestamps)
- Small: 11px (Tab labels)

Font Weights:
- Bold: 700
- SemiBold: 600
- Medium: 500
- Regular: 400
```

### Spacing System
```
4px Grid System:
- XXS: 4px
- XS: 8px
- SM: 12px
- MD: 16px
- LG: 20px
- XL: 24px
- XXL: 32px
- XXXL: 40px
```

### Border Radius
```
- Small: 8px (Tags, chips)
- Medium: 12px (Cards, buttons)
- Large: 16px (Message bubbles)
- XLarge: 20px (Pet cards)
- XXLarge: 25px (Special cards)
- Pill: 30px (Rounded buttons)
- Circle: 50% (Avatar, icons)
```

### Shadows
```
Card Shadow:
- offset: { width: 0, height: 2 }
- opacity: 0.1
- radius: 8
- elevation: 3

Button Shadow:
- offset: { width: 0, height: 4 }
- opacity: 0.15
- radius: 12
- elevation: 5

Header Shadow:
- offset: { width: 0, height: 2 }
- opacity: 0.05
- radius: 4
- elevation: 2
```

---

## 📱 Screen Designs

### 1. Splash Screen (app/index.tsx)
**Dimensions:** 375 x 812 (iPhone X base)

**Layout:**
```
┌─────────────────────────────────┐
│   LINEAR GRADIENT BACKGROUND    │
│   (#E67E9C → #F7C9D4)          │
│                                 │
│          [LOGO CIRCLE]          │
│       (140x140, white bg)       │
│        [Logo Image 120x120]     │
│                                 │
│      "Pawfect Match"            │
│      (32px, Poppins Bold)       │
│                                 │
│   "Find your perfect furry      │
│        friend"                  │
│   (16px, Nunito Regular)        │
│                                 │
│                                 │
│   ┌──────────────────────┐     │
│   │  Start Browsing Pets │     │
│   │  (White BG, Pink text)│    │
│   └──────────────────────┘     │
│                                 │
│   ┌──────────────────────┐     │
│   │   Sign In Options    │     │
│   │  (Border, White text)│    │
│   └──────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

**Components:**
- Logo Container: Center, 140x140px white circle, elevation 12
- Logo Image: 120x120px, contain mode
- App Name: White, 32px, Poppins Bold
- Tagline: White 70% opacity, 16px
- Primary Button: White background, pink text, shadow
- Secondary Button: Transparent, 2px white border

---

### 2. Home Screen - Discover (app/(tabs)/index.tsx)
**Layout:**
```
┌─────────────────────────────────┐
│ ┌──────── HEADER ─────────┐    │
│ │ [Logo] Pawfect Match     │    │
│ │ Find Your Perfect Pet    │    │
│ │ [Filter][Bell][Profile]  │    │
│ └─────────────────────────┘    │
│                                 │
│   ┌─────────────────────┐      │
│   │                     │      │
│   │    PET CARD         │      │
│   │   [Pet Image]       │      │
│   │                     │      │
│   │   Name, Age         │      │
│   │   Breed, Location   │      │
│   │   ★★★★★             │      │
│   │   [Personality]     │      │
│   │                     │      │
│   └─────────────────────┘      │
│                                 │
│   [❌ Pass]    [❤️ Like]        │
│                                 │
└─────────────────────────────────┘
```

**Specifications:**
- Header Gradient: Pink gradient, 24px padding
- Logo: 48x48px circular container
- Title: 20px Poppins SemiBold, white
- Subtitle: 13px Nunito Regular, white 80%
- Action Buttons: 40x40 circle, pink/blue tint
- Pet Card: Width: screen-30px, Height: 70% screen
- Card Border Radius: 25px
- Image: Full card, cover mode
- Gradient Overlay: Bottom 60%, black to transparent
- Info Padding: 25px
- Pet Name: 28px Poppins Bold, white
- Details: 16px Nunito Regular, white 90%
- Star Rating: Yellow #FFD700
- Action Buttons: 60x60 circle, bottom center

---

### 3. Saved Pets (app/(tabs)/saved.tsx)
**Layout:**
```
┌─────────────────────────────────┐
│      Saved Pets (H1)            │
│                                 │
│ ┌─────────────────────────┐    │
│ │[IMG] Name      [Heart]  │    │
│ │     Breed, Age          │    │
│ │     Location ★★★★       │    │
│ └─────────────────────────┘    │
│                                 │
│ ┌─────────────────────────┐    │
│ │[IMG] Name      [Heart]  │    │
│ │     Breed, Age          │    │
│ │     Location ★★★★       │    │
│ └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Specifications:**
- List Item Height: 120px
- Card Padding: 16px
- Image: 90x90px, rounded 12px
- Card Border Radius: 12px
- Card Shadow: Elevation 2
- Spacing Between Cards: 12px

---

### 4. AI Vet Chat (app/(tabs)/ai.tsx)
**Layout:**
```
┌─────────────────────────────────┐
│  [<] AI Pet Counselor           │
│                                 │
│  ┌────────────────────┐         │
│  │ AI: How can I help?│         │
│  │ [Bot Icon]         │         │
│  └────────────────────┘         │
│                                 │
│         ┌──────────────┐        │
│         │ User: Question│       │
│         │ [User Icon]   │       │
│         └──────────────┘        │
│                                 │
│  Quick Questions:               │
│  [How to adopt?][Pet care?]    │
│                                 │
│ ┌───────────────────────┐      │
│ │ Type message...  [>]  │      │
│ └───────────────────────┘      │
└─────────────────────────────────┘
```

**Specifications:**
- AI Bubble: White background, left aligned, 80% width
- User Bubble: Pink background, right aligned, 80% width
- Bubble Border Radius: 16px
- Icon Size: 16px
- Padding: 12px
- Send Button: 36x36 circle, pink background
- Quick Question Chips: Pink border, rounded pill

---

### 5. Learn (app/(tabs)/learn.tsx)
**Layout:**
```
┌─────────────────────────────────┐
│        Pet Care Guide           │
│                                 │
│  Categories:                    │
│  [All][Dogs][Cats][Birds]      │
│                                 │
│ ┌─────────────────────────┐    │
│ │ [Article Image]         │    │
│ │ Title of Article        │    │
│ │ Short description...    │    │
│ │ [5 min read]           │    │
│ └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Specifications:**
- Category Tabs: Horizontal scroll, pill shape
- Article Card: 16px margin, 12px border radius
- Image Height: 200px
- Title: 18px Poppins SemiBold
- Description: 14px Nunito Regular, 2 lines max
- Reading Time: 12px, gray

---

### 6. Pet Services (app/(tabs)/shops.tsx)
**Layout:**
```
┌─────────────────────────────────┐
│      Pet Services               │
│                                 │
│  [All][Stores][Vets][Hotels]   │
│                                 │
│ ┌─────────────────────────┐    │
│ │ [Image] Furryghor       │    │
│ │         Pet Store       │    │
│ │         📍 Mirpur       │    │
│ │         ★★★★★ 4.8      │    │
│ │         📞 +880...      │    │
│ └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Specifications:**
- Service Card: White background, 12px radius
- Image: 100%, 180px height
- Name: 18px Poppins SemiBold
- Category: 14px, colored badge
- Rating: Yellow stars, 14px
- Icons: 16px, gray

---

### 7. Profile (app/profile/index.tsx)
**Layout:**
```
┌─────────────────────────────────┐
│   LINEAR GRADIENT HEADER        │
│   [Avatar Circle]               │
│   User Name                     │
│   user@email.com                │
│                                 │
│  [12 Saved][8 Matches][24 Fav] │
│                                 │
│ ┌─────────────────────────┐    │
│ │ Edit Profile       [>]  │    │
│ │ My Applications    [>]  │    │
│ │ Adoption History   [>]  │    │
│ │ Settings           [>]  │    │
│ │ Logout             [>]  │    │
│ └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Specifications:**
- Header Gradient: Pink gradient, 200px height
- Avatar: 100x100px circle, white border 4px
- Stats: 3 columns, colored circles
- Menu Items: White cards, 60px height
- Icon: 24px, right arrow

---

### 8. Notifications (app/notifications/index.tsx)
**Layout:**
```
┌─────────────────────────────────┐
│  [<] Notifications  [✓✓]       │
│                                 │
│  You have 3 unread notifications│
│                                 │
│ ┌─────────────────────────┐    │
│ │[Icon] Adoption Approved │ ●  │
│ │       Your application  │    │
│ │       2 hours ago      │    │
│ └─────────────────────────┘    │
│                                 │
│ ┌─────────────────────────┐    │
│ │[Icon] New Message       │    │
│ │       From shelter     │    │
│ │       1 day ago        │    │
│ └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Specifications:**
- Unread Card: Pink left border 4px
- Icon: 20px, colored by type
- Title: 16px Poppins SemiBold
- Message: 14px Nunito Regular
- Time: 12px gray
- Unread Dot: 8px pink circle

---

### 9. Chat/Messages (app/chat/index.tsx)
**Layout:**
```
┌─────────────────────────────────┐
│  [<] AI Pet Counselor           │
│                                 │
│  ┌────────────────────┐         │
│  │ [Bot] AI Message   │         │
│  │ How can I help?    │         │
│  └────────────────────┘         │
│                                 │
│         ┌──────────────┐        │
│         │ Your message │        │
│         │ [User]       │        │
│         └──────────────┘        │
│                                 │
│ ┌───────────────────────┐      │
│ │ Type here...     [>]  │      │
│ └───────────────────────┘      │
└─────────────────────────────────┘
```

**Specifications:**
- AI Bubble: White, left, 80% max width
- User Bubble: Pink, right, 80% max width
- Border Radius: 16px
- Padding: 12px
- Input: 100% width, 16px padding
- Send Button: 36x36 pink circle

---

## 🔘 Tab Navigation

**Tab Bar Specifications:**
```
Height: 65px
Background: White
Border Top: 1px #E5E5E5
Padding: 10px top, 8px bottom

Icons:
- Discover: Sparkles (24px)
- Saved: Bookmark (24px)
- AI Vet: Bot (28px)
- Learn: BookOpen (24px)
- Services: Store (24px)

Active Color: #E67E9C (Pink)
Inactive Color: #999999 (Gray)

Labels:
- Font: Nunito SemiBold
- Size: 11px
- Margin Top: 2px
```

---

## 📐 Component Library

### Buttons

**Primary Button:**
- Background: #E67E9C (Pink)
- Text: White, 16px Poppins SemiBold
- Padding: 16px vertical, 32px horizontal
- Border Radius: 12px
- Shadow: Elevation 5

**Secondary Button:**
- Background: Transparent
- Border: 2px #E67E9C
- Text: #E67E9C, 16px Poppins SemiBold
- Padding: 14px vertical, 32px horizontal
- Border Radius: 12px

**Icon Button:**
- Size: 40x40px circle
- Background: rgba(255,255,255,0.2)
- Icon: 24px
- Tint: Pink or Blue

### Cards

**Pet Card (Large):**
- Width: Screen - 30px
- Height: 70% screen height
- Border Radius: 25px
- Shadow: Elevation 20
- Image: Full height, cover
- Gradient Overlay: Bottom 60%

**Service Card:**
- Width: 100%
- Height: Auto
- Border Radius: 12px
- Shadow: Elevation 2
- Image: 100% width, 180px height

**List Card:**
- Width: 100%
- Height: 120px
- Border Radius: 12px
- Shadow: Elevation 2
- Padding: 16px

### Input Fields

**Text Input:**
- Height: 50px
- Border: 1px #E5E5E5
- Border Radius: 12px
- Padding: 16px
- Font: 16px Nunito Regular
- Focus Border: #E67E9C

**Search Input:**
- Height: 44px
- Background: #F5F5F5
- Border Radius: 22px
- Padding: 12px 16px
- Icon: 20px gray, left

### Badges & Tags

**Category Badge:**
- Height: 32px
- Padding: 8px 16px
- Border Radius: 16px
- Font: 14px Nunito SemiBold
- Background: Category color 20%
- Text: Category color

**Personality Tag:**
- Height: 28px
- Padding: 6px 12px
- Border Radius: 14px
- Font: 12px Nunito Regular
- Background: White 20%
- Text: White

### Status Indicators

**Adoption Status:**
- Pending: Orange circle
- Approved: Green circle
- Rejected: Red circle
- Completed: Blue circle

---

## 🎭 Interactions & Animations

### Swipe Cards:
- Swipe Left: Fade out left, scale 0.8
- Swipe Right: Fade out right, scale 0.8
- Return: Spring animation, scale 1.0
- Next Card: Scale from 0.95 to 1.0

### Button Press:
- Scale: 0.95
- Duration: 100ms
- Spring: Yes

### Card Tap:
- Opacity: 0.8
- Duration: 150ms

### Modal:
- Enter: Slide up from bottom
- Exit: Slide down
- Duration: 300ms

---

## 📱 Responsive Breakpoints

```
Mobile Small: 320px - 374px
Mobile Medium: 375px - 413px
Mobile Large: 414px - 767px
Tablet: 768px - 1023px
Desktop: 1024px+
```

---

## 🎨 Figma Instructions

### Setup:
1. Create new Figma file: "Pawfect Match Mobile App"
2. Set up Color Styles with exact hex codes
3. Create Text Styles for all typography
4. Set up Component Library for reusable elements
5. Create Auto Layout frames for responsive design

### Frames:
- Create frame: 375 x 812 (iPhone X)
- Use Auto Layout for all containers
- Apply constraints: Left/Right for full width

### Components to Create:
1. Button/Primary
2. Button/Secondary
3. Button/Icon
4. Card/Pet
5. Card/Service
6. Card/List
7. Input/Text
8. Input/Search
9. Badge/Category
10. Tag/Personality
11. Navigation/TabBar
12. Header/Gradient
13. Avatar/Circle
14. Icon/Action

### Export Settings:
- iOS: @1x, @2x, @3x
- Android: ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi
- Format: PNG for images, SVG for icons

---

## 📋 Design Checklist

- [ ] All screens designed at 375x812
- [ ] Color styles applied consistently
- [ ] Text styles match specifications
- [ ] Components are reusable
- [ ] Auto Layout used for responsiveness
- [ ] Shadows match elevation specs
- [ ] Icons are 24x24 or 20x20
- [ ] Spacing follows 4px grid
- [ ] Border radius is consistent
- [ ] Interactive states defined
- [ ] Loading states designed
- [ ] Empty states designed
- [ ] Error states designed

---

## 🔗 Assets Needed

### Icons:
- Sparkles (Discover tab)
- Bookmark (Saved tab)
- Bot (AI Vet tab)
- BookOpen (Learn tab)
- Store (Services tab)
- Heart (Like)
- X (Pass)
- Filter, Bell, User
- MapPin, Star, Phone
- Send, ArrowLeft, Check

### Images:
- Pawfect Match Logo (120x120)
- Pet placeholder images
- Service location images
- Avatar placeholders

### Fonts:
- Poppins: Bold, SemiBold, Medium
- Nunito: SemiBold, Regular

---

This document contains all specifications needed to recreate the entire app design in Figma!
