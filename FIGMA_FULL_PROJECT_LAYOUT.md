# Pawfect Match - Complete Figma Project Layout

## 🎨 Full Project Canvas Layout

This document shows you exactly how to arrange ALL screens in your Figma file for the complete Pawfect Match mobile app.

---

## 📐 Canvas Organization (Bird's Eye View)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         PAWFECT MATCH - MOBILE APP                               │
│                         Figma Project Layout                                     │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ROW 1: ONBOARDING & AUTH                                                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                                        │
│  │ Splash  │  │  Auth   │  │ Sign Up │                                        │
│  │ Screen  │  │ Options │  │  Form   │                                        │
│  │ 375x812 │  │ 375x812 │  │ 375x812 │                                        │
│  └─────────┘  └─────────┘  └─────────┘                                        │
│                                                                                  │
│  ROW 2: MAIN APP TABS                                                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │  Home   │  │  Saved  │  │ AI Vet  │  │  Learn  │  │ Services│            │
│  │Discover │  │  Pets   │  │  Chat   │  │  Guide  │  │  Shops  │            │
│  │ 375x812 │  │ 375x812 │  │ 375x812 │  │ 375x812 │  │ 375x812 │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                                                                                  │
│  ROW 3: SECONDARY SCREENS                                                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ Profile │  │ Notific │  │  Search │  │  Pet    │  │Adoption │            │
│  │  Page   │  │ -ations │  │ /Filter │  │ Details │  │ Tracker │            │
│  │ 375x812 │  │ 375x812 │  │ 375x812 │  │ 375x812 │  │ 375x812 │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                                                                                  │
│  ROW 4: COMPONENTS LIBRARY                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  COMPONENTS:                                                              │  │
│  │  [Primary Btn] [Secondary Btn] [Icon Btn] [Input] [Search]              │  │
│  │  [Pet Card] [List Card] [Service Card] [Tab Item] [Badge]               │  │
│  │  [Header] [Avatar] [Message Bubble] [Notification Card] [Status Bar]    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  ROW 5: DESIGN SYSTEM                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  COLORS:       [Pink] [Blue] [Grays] [Status Colors]                    │  │
│  │  TYPOGRAPHY:   Display, H1, H2, H3, H4, Body, Caption                   │  │
│  │  SPACING:      4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px             │  │
│  │  ICONS:        All Lucide icons used in app                             │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘

Total Screens: 13
Total Components: 25+
Canvas Size: ~6000px wide × 4000px tall
```

---

## 📱 Step-by-Step: Create Full Layout in Figma

### **STEP 1: Set Up Your Canvas**

1. **Open Figma** → Create new file
2. **Rename**: "Pawfect Match - Mobile App"
3. **Press F** (Frame tool)
4. Choose **iPhone 14 & 15 Pro** (375 x 812)

---

### **STEP 2: Create All Frames**

#### **Row 1: Onboarding (Y: 0px)**

```
Frame 1: Splash Screen          X: 100,    Y: 0
Frame 2: Auth Options           X: 550,    Y: 0  
Frame 3: Sign Up Form           X: 1000,   Y: 0
```

**What to add:**
- **Splash**: Pink gradient, logo circle, app name, 2 buttons
- **Auth**: Sign in options (Email, Phone, Guest)
- **Sign Up**: Form fields, submit button

---

#### **Row 2: Main Tabs (Y: 1000px)**

```
Frame 4: Home - Discover        X: 100,    Y: 1000
Frame 5: Saved Pets            X: 550,    Y: 1000
Frame 6: AI Vet Chat           X: 1000,   Y: 1000
Frame 7: Learn Guide           X: 1450,   Y: 1000
Frame 8: Pet Services          X: 1900,   Y: 1000
```

**What to add:**
- **Home**: Header with logo, swipeable pet cards, action buttons
- **Saved**: List of saved pets with heart icons
- **AI Chat**: Message bubbles, input field, quick questions
- **Learn**: Category tabs, article cards
- **Services**: Shop categories, service cards with real Dhaka data

---

#### **Row 3: Secondary Screens (Y: 2000px)**

```
Frame 9:  Profile              X: 100,    Y: 2000
Frame 10: Notifications        X: 550,    Y: 2000
Frame 11: Search/Filter        X: 1000,   Y: 2000
Frame 12: Pet Details          X: 1450,   Y: 2000
Frame 13: Adoption Tracker     X: 1900,   Y: 2000
```

**What to add:**
- **Profile**: Gradient header, avatar, stats, menu items
- **Notifications**: Unread banner, notification cards
- **Search**: Search bar, filter chips, results
- **Pet Details**: Full pet info, adoption button
- **Tracker**: Application status with progress bars

---

#### **Row 4: Components (Y: 3000px)**

```
Frame 14: Components Library   X: 100,    Y: 3000,  W: 2000,  H: 800
```

**Create these components:**

1. **Buttons** (X: 100)
   - Primary Button (327×56, pink)
   - Secondary Button (327×56, border)
   - Icon Button (40×40, circle)

2. **Cards** (X: 500)
   - Pet Card Large (345×570)
   - List Card (343×120)
   - Service Card (343×320)

3. **Inputs** (X: 900)
   - Text Input (343×50)
   - Search Input (343×44)

4. **Navigation** (X: 1300)
   - Tab Bar Item Active
   - Tab Bar Item Inactive
   - Header with Logo

5. **Other** (X: 1700)
   - Avatar Circle
   - Badge/Tag
   - Message Bubble
   - Notification Card
   - Status Progress

---

#### **Row 5: Design System (Y: 3900px)**

```
Frame 15: Design System        X: 100,    Y: 3900,  W: 2000,  H: 500
```

**Add:**
- **Color Palette**: All colors with hex codes
- **Typography Scale**: All text styles
- **Spacing System**: Visual spacing guide
- **Icon Set**: All icons used

---

## 🎯 **Quick Setup Commands**

### **Create All Frames at Once:**

1. Press **F** (Frame tool)
2. Create first frame: **iPhone 14 Pro** at **X: 100, Y: 0**
3. Select frame → **Ctrl + D** (Duplicate)
4. Move to **X: 550** (450px spacing)
5. Repeat for all screens

### **Naming Convention:**
```
✅ 01_Splash_Screen
✅ 02_Auth_Options  
✅ 03_Sign_Up
✅ 04_Home_Discover
✅ 05_Saved_Pets
✅ 06_AI_Vet_Chat
✅ 07_Learn_Guide
✅ 08_Pet_Services
✅ 09_Profile
✅ 10_Notifications
✅ 11_Search_Filter
✅ 12_Pet_Details
✅ 13_Adoption_Tracker
✅ Components
✅ Design_System
```

---

## 🎨 **Build Each Screen Content**

### **Screen 1: Splash Screen**

```
1. Rectangle (375×812) → Fill: Linear Gradient
   - Color 1: #E67E9C (Top)
   - Color 2: #F7C9D4 (Bottom)

2. Circle (140×140) → Fill: White
   - Position: Center X, Y: 240
   - Shadow: 0px 8px 16px rgba(0,0,0,0.2)
   - Add logo image inside (120×120)

3. Text: "Pawfect Match"
   - Font: Poppins Bold, 32px
   - Color: White
   - Position: Center X, Y: 450

4. Text: "Find your perfect furry friend"
   - Font: Nunito Regular, 16px
   - Color: White 70%
   - Position: Center X, Y: 490

5. Button 1: "Start Browsing Pets"
   - Size: 327×56, Radius: 12px
   - Fill: White
   - Text: Pink (#E67E9C), Poppins SemiBold 16px
   - Position: Center X, Y: 580

6. Button 2: "Sign In Options"
   - Size: 327×56, Radius: 12px
   - Border: 2px White
   - Text: White, Poppins SemiBold 16px
   - Position: Center X, Y: 650
```

---

### **Screen 2: Home - Discover**

```
HEADER (Pink Gradient):
1. Rectangle (375×140) → Gradient: #E67E9C to #F0A1B5
   
2. Logo circle (48×48) → X: 24, Y: 60
   - White background, logo inside

3. Text: "Pawfect Match"
   - Poppins SemiBold 20px, White
   - X: 85, Y: 58

4. Text: "Find Your Perfect Pet"
   - Nunito Regular 13px, White 80%
   - X: 85, Y: 82

5. Icon Buttons (40×40 circles):
   - Filter: X: 250, Y: 50
   - Bell: X: 295, Y: 50  
   - Profile: X: 315, Y: 50

PET CARD:
6. Rectangle (345×570) → Radius: 25px
   - Position: Center X, Y: 260
   - Fill: Pet image
   - Gradient overlay (bottom 60%)

7. Text: Pet name (28px Poppins Bold, White)
8. Text: Breed (16px Nunito, White 90%)
9. Text: Location + Stars
10. Tags: [Playful] [Friendly]

ACTION BUTTONS:
11. Circle (60×60) → X Pass icon (left)
12. Circle (60×60) → Heart icon (right)
```

Continue for all 13 screens...

---

## 🔗 **Connect Screens with Prototyping**

### **Add Interactions:**

1. **Splash → Home**
   - Select "Start Browsing" button
   - Click **Prototype** tab (right panel)
   - Click **+** → Drag to Home screen
   - Interaction: **Tap** → **Navigate to** → **Instant**

2. **Home → Pet Details**
   - Select pet card
   - Prototype: Tap → Navigate → Slide in from right

3. **Tab Bar Navigation**
   - Each tab icon links to its screen
   - Interaction: **Tap** → **Navigate to** → **Instant**

---

## 📤 **Export & Share**

### **For Developers:**
1. Select all screens
2. **File** → **Export** → **PDF**
3. Or use **Dev Mode** (Share link with developers)

### **For Presentation:**
1. **Prototype** tab → **Present**
2. Full interactive prototype
3. Share link: **Share** → **Copy link**

---

## ✅ **Checklist**

- [ ] Created all 13 screen frames
- [ ] Applied pink/blue color scheme throughout
- [ ] Used Poppins for headings, Nunito for body
- [ ] Created reusable components
- [ ] Added tab bar navigation to all main screens
- [ ] Connected screens with prototype links
- [ ] Added design system documentation
- [ ] Named all layers properly
- [ ] Organized layers into groups
- [ ] Added real Dhaka pet service data
- [ ] Tested prototype flow
- [ ] Exported for development

---

## 🎓 **Pro Tips**

### **Speed Up Your Workflow:**
- **Alt + Drag** = Duplicate element
- **Ctrl + D** = Duplicate (remembers spacing)
- **Ctrl + G** = Group selection
- **Ctrl + Shift + K** = Create component
- **Shift + A** = Auto Layout

### **Maintain Consistency:**
- Use **Styles** for all colors
- Use **Components** for repeated elements
- Use **Auto Layout** for responsive designs
- Use **Constraints** for proper resizing

---

You now have the complete blueprint to build the entire Pawfect Match app in Figma! 🎉

Each screen is detailed in **DESIGN_MOCKUPS.md** with exact layouts and measurements.
