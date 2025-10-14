# 🎨 PawMatch Design Customization Guide
## Branch: dev/swapnil

This guide shows you where to make design changes for the PawMatch app.

---

## 📱 **Current Design System**

### **Primary Colors**
- **Primary Brand**: `#FF6B6B` (Coral Red)
- **Primary Light**: `#FF8E8E`
- **Primary Lighter**: `#FFB3B3`
- **Secondary**: `#4A90E2` (Blue)

### **App Icon & Splash**
- **Icon Location**: `./assets/images/icon.png`
- **Favicon**: `./assets/images/favicon.png`
- **Splash Background**: `#FF6B6B`

---

## 🎯 **Files to Customize**

### 1. **Color Theme** 
**File**: `constants/theme.ts`

```typescript
export const COLORS = {
  primary: '#FF6B6B',        // 👈 Change main brand color
  primaryLight: '#FF8E8E',    // 👈 Change light variant
  secondary: '#4A90E2',       // 👈 Change secondary color
  // ... more colors
}
```

**Common Changes**:
- Change `primary` to your preferred main color
- Update `primaryLight`, `primaryLighter`, `primaryDark` to match
- Modify `secondary` for accent colors

### 2. **App Icon & Branding**
**File**: `app.json`

```json
{
  "expo": {
    "name": "PawMatch",           // 👈 Change app name
    "icon": "./assets/images/icon.png",  // 👈 Replace icon file
    "splash": {
      "backgroundColor": "#FF6B6B"  // 👈 Change splash color
    }
  }
}
```

**To Change Icon**:
1. Create a 1024x1024px PNG icon
2. Replace `assets/images/icon.png`
3. Replace `assets/images/favicon.png` (web)

### 3. **Typography**
**File**: `constants/theme.ts`

```typescript
export const TYPOGRAPHY = {
  fontPrimary: 'Poppins-Regular',      // 👈 Headings font
  fontSecondary: 'Nunito-Regular',     // 👈 Body text font
  
  h1: {
    fontSize: 28,    // 👈 Adjust sizes
    lineHeight: 34,
  },
  // ... more styles
}
```

### 4. **Spacing & Layout**
**File**: `constants/theme.ts`

```typescript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,    // 👈 Adjust padding/margins
  lg: 24,
  xl: 32,
}

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,    // 👈 Change roundness of cards/buttons
  xl: 16,
}
```

---

## 🎨 **Quick Design Changes**

### **Change Color Scheme to Blue**
```typescript
// constants/theme.ts
export const COLORS = {
  primary: '#3B82F6',        // Blue
  primaryLight: '#60A5FA',
  primaryLighter: '#93C5FD',
  primaryDark: '#2563EB',
  // Keep other colors same
}
```

### **Change to Purple Theme**
```typescript
// constants/theme.ts
export const COLORS = {
  primary: '#8B5CF6',        // Purple
  primaryLight: '#A78BFA',
  primaryLighter: '#C4B5FD',
  primaryDark: '#7C3AED',
}
```

### **Change to Green (Nature)**
```typescript
// constants/theme.ts
export const COLORS = {
  primary: '#10B981',        // Emerald Green
  primaryLight: '#34D399',
  primaryLighter: '#6EE7B7',
  primaryDark: '#059669',
}
```

---

## 🖼️ **Icon Design Recommendations**

### **App Icon Requirements**
- **Size**: 1024x1024px (PNG with transparency)
- **Style**: Simple, recognizable at small sizes
- **Colors**: Match your primary brand color
- **Elements**: Consider paw print, heart, pet silhouette

### **Icon Ideas**:
1. **Heart + Paw Print** - Love for pets
2. **Dog & Cat Silhouette** - Pet adoption theme
3. **House + Paw** - Finding home for pets
4. **Minimalist Paw** - Simple and clean

### **Tools to Create Icons**:
- Figma (free)
- Canva (free templates)
- Adobe Illustrator
- IconScout (icon resources)

---

## 🎭 **Component Styles**

### **Splash Screen** 
**File**: `app/index.tsx`

Line 83-85: Change gradient colors
```typescript
<LinearGradient
  colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']}  // 👈 Change colors
  style={styles.container}
>
```

### **Pet Cards**
**File**: `app/(tabs)/index.tsx`

The swipeable pet cards use theme colors automatically.
To customize, search for `styles.petCard` and modify.

### **Buttons**
**File**: Various files

Buttons use `COLORS.primary` from theme.
Change theme.ts to update all buttons.

---

## 📝 **Step-by-Step Customization**

### **Example: Change to Blue Theme with New Icon**

1. **Update Colors**:
```bash
# Edit constants/theme.ts
# Change COLORS.primary to '#3B82F6'
# Change COLORS.primaryLight to '#60A5FA'
# etc.
```

2. **Update Splash Background**:
```bash
# Edit app.json
# Change splash.backgroundColor to '#3B82F6'
```

3. **Create New Icon**:
```bash
# Create 1024x1024px blue-themed icon
# Save as assets/images/icon.png
# Save favicon as assets/images/favicon.png
```

4. **Update Gradients** (Optional):
```bash
# Edit app/index.tsx
# Change gradient colors in LinearGradient components
```

5. **Test Changes**:
```bash
# App will hot-reload automatically
# Check colors in browser at http://localhost:8081
```

6. **Commit Changes**:
```bash
git add .
git commit -m "Update color theme to blue and new icon"
```

---

## 🚀 **Apply Changes**

After making changes:

1. **Save files** - Hot reload will update app automatically
2. **Check browser** - http://localhost:8081
3. **Test on mobile** - Scan QR code with Expo Go
4. **Commit to git**:
   ```bash
   git add .
   git commit -m "Design updates: [describe changes]"
   git push origin dev/swapnil
   ```

---

## 📱 **Preview Your Changes**

The development server is running at:
- **Web**: http://localhost:8081
- **Mobile**: Scan QR code in terminal

Any file changes will automatically refresh the app!

---

## 💡 **Tips**

1. **Use consistent colors** - Stick to your color palette
2. **Test on multiple devices** - Check mobile and web
3. **Keep accessibility in mind** - Ensure good contrast
4. **Update all variants** - primary, primaryLight, primaryDark
5. **Commit frequently** - Save your work often

---

## 📚 **Resources**

- **Color Palette Generator**: https://coolors.co/
- **Material Design Colors**: https://m2.material.io/design/color/
- **Tailwind Colors**: https://tailwindcss.com/docs/customizing-colors
- **Icon Design**: https://www.figma.com/community/
- **Paw Print Icons**: https://www.flaticon.com/search?word=paw

---

Happy Customizing! 🎨✨

**Current Branch**: `dev/swapnil`
**Your changes won't affect the main branch until you merge them.**
