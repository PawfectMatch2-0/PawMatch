# How to Import Design Files into Figma

## 📁 Files Provided

1. **design-tokens.json** - Design system tokens
2. **figma-components.svg** - UI component templates
3. **FIGMA_DESIGN_SPECS.md** - Complete specifications
4. **DESIGN_MOCKUPS.md** - Visual mockups

---

## 🎨 Method 1: Import Design Tokens (RECOMMENDED)

### Step 1: Install Figma Plugin
1. Open Figma
2. Go to **Plugins** → **Browse plugins in Community**
3. Search for **"Tokens Studio for Figma"** (formerly Figma Tokens)
4. Click **Install**

### Step 2: Import design-tokens.json
1. In Figma, right-click → **Plugins** → **Tokens Studio**
2. Click **Settings** (gear icon)
3. Select **Import** → **From File**
4. Upload `design-tokens.json`
5. Click **Apply to Document**

✅ This will automatically create:
- Color styles for all colors
- Text styles for typography
- Effect styles for shadows
- All spacing values

---

## 🖼️ Method 2: Import SVG Components

### Step 1: Import SVG File
1. Open Figma
2. Click **File** → **Import**
3. Select `figma-components.svg`
4. Choose **Import as: Vector**

### Step 2: Create Components
1. Select each imported element
2. Right-click → **Create Component** (or Ctrl/Cmd + Alt + K)
3. Name components:
   - Button/Primary
   - Button/Secondary
   - Card/Pet-Large
   - Card/List
   - Tab/Active
   - Tab/Inactive
   - etc.

---

## 📱 Method 3: Manual Setup from Specs

### Step 1: Create Artboards
1. Press **F** (Frame tool)
2. Choose **iPhone 14 & 15 Pro** (375 x 812)
3. Name it according to screen (e.g., "Splash Screen", "Home - Discover")

### Step 2: Set Up Color Styles
1. Open **FIGMA_DESIGN_SPECS.md**
2. In Figma, click color icon → **+** → **Create Style**
3. Add colors:
   - Name: `Primary/Pink` → Value: `#E67E9C`
   - Name: `Primary/Blue` → Value: `#2FA5C7`
   - Continue for all colors in spec

### Step 3: Set Up Text Styles
1. Click **Text** tool (T)
2. Create text → Select it
3. In **Text** panel → **...** → **Create Style**
4. Add text styles:
   - `Heading/Display` - Poppins Bold 32px
   - `Heading/H1` - Poppins Bold 28px
   - `Body/Large` - Nunito Regular 16px
   - Continue for all text styles

### Step 4: Create Components
Manually recreate components using the SVG templates and specs.

---

## 🔧 Method 4: Use Figma Community File (Best for Beginners)

### Alternative: Start from Mobile UI Kit
1. Go to Figma Community
2. Search for **"Mobile UI Kit"** or **"iOS UI Kit"**
3. Duplicate a free kit to your drafts
4. Customize colors, fonts, and components using our specs

### Recommended Kits:
- **iOS 17 UI Kit** (Community)
- **Material Design 3** (Community)
- **Mobile Design System** (Community)

Then replace:
- Colors with our pink/blue theme
- Fonts with Poppins/Nunito
- Icons with our design

---

## 📋 Quick Setup Checklist

### Colors to Add:
- [ ] Primary Pink: #E67E9C
- [ ] Secondary Blue: #2FA5C7
- [ ] Gray 900: #333333
- [ ] Gray 700: #666666
- [ ] Gray 500: #999999
- [ ] Gray 300: #E5E5E5
- [ ] Gray 100: #F5F5F5
- [ ] Success: #10B981
- [ ] Warning: #F59E0B
- [ ] Error: #EF4444

### Gradients to Create:
- [ ] Pink Gradient: #E67E9C → #EFA3B8 → #F7C9D4
- [ ] Header Gradient: #E67E9C → #F0A1B5

### Text Styles to Create:
- [ ] Display (Poppins Bold 32px)
- [ ] H1 (Poppins Bold 28px)
- [ ] H2 (Poppins SemiBold 24px)
- [ ] H3 (Poppins SemiBold 20px)
- [ ] Body Large (Nunito Regular 16px)
- [ ] Body (Nunito Regular 14px)
- [ ] Caption (Nunito Regular 12px)

### Components to Create:
- [ ] Button/Primary (Pink BG, white text)
- [ ] Button/Secondary (Border, pink text)
- [ ] Button/Icon (40x40 circle)
- [ ] Card/Pet (Large card with image)
- [ ] Card/List (Horizontal list item)
- [ ] Card/Service (Shop/service card)
- [ ] Input/Text (Text input field)
- [ ] Input/Search (Search bar)
- [ ] Tab/Item (Tab bar navigation)
- [ ] Badge/Tag (Category badge)
- [ ] Header/Gradient (App header)
- [ ] Avatar/Circle (Profile picture)

---

## 🎯 Screen-by-Screen Build Guide

### 1. Splash Screen (Easiest to Start)
```
1. Create 375x812 frame
2. Add gradient background (pink)
3. Add circle (140x140) - white
4. Add logo image (120x120)
5. Add text "Pawfect Match" (32px Poppins Bold)
6. Add subtitle (16px Nunito)
7. Add primary button
8. Add secondary button
```

### 2. Home - Discover
```
1. Create 375x812 frame
2. Add gradient header (pink)
3. Add logo + title
4. Add action buttons (filter, bell, profile)
5. Add large pet card (345x570)
   - Image layer
   - Gradient overlay
   - Text content
6. Add action buttons (pass/like)
```

### 3. Continue for Other Screens
Use **DESIGN_MOCKUPS.md** for visual reference of each screen.

---

## 🔤 Fonts Installation

### Download Fonts:
1. **Poppins**: https://fonts.google.com/specimen/Poppins
   - Download: Regular, Medium, SemiBold, Bold
2. **Nunito**: https://fonts.google.com/specimen/Nunito
   - Download: Regular, SemiBold

### Install in System:
**Windows:**
1. Download font files (.ttf)
2. Right-click → Install
3. Restart Figma

**Mac:**
1. Download font files (.ttf)
2. Open Font Book
3. Add fonts
4. Restart Figma

---

## 🎨 Auto Layout Tips

### For Buttons:
1. Create text
2. Select → **Auto Layout** (Shift + A)
3. Set padding: 16px vertical, 32px horizontal
4. Set fill: Pink (#E67E9C)
5. Set corner radius: 12px

### For Cards:
1. Create rectangle
2. Add **Auto Layout**
3. Set direction: Vertical
4. Set spacing: 12px
5. Set padding: 16px
6. Add shadow effect

---

## 🖼️ Asset Export Settings

### For Development:
1. Select element
2. **Export** panel → **+**
3. Add exports:
   - iOS: @1x, @2x, @3x (PNG)
   - Android: mdpi, hdpi, xhdpi, xxhdpi (PNG)
   - Web: SVG

### Icon Export:
- Format: SVG
- Size: 24x24 or 20x20

---

## 🎬 Video Tutorial Alternative

### YouTube Search:
1. "Figma mobile app design tutorial"
2. "Import design tokens Figma"
3. "Create mobile UI kit Figma"
4. "Design system setup Figma"

### Recommended Channels:
- DesignCourse
- Figma Official
- Flux Academy

---

## 🆘 Troubleshooting

### Fonts Not Showing?
- Restart Figma after installing fonts
- Clear Figma cache
- Use browser version if desktop fails

### Colors Not Matching?
- Use hex codes exactly as provided
- Check color profile (RGB)
- Ensure no opacity unless specified

### SVG Import Issues?
- Try "Place Image" instead of "Import"
- Open SVG in text editor, copy code
- Paste directly into Figma (Ctrl/Cmd + V)

---

## 📚 Additional Resources

### Figma Learning:
- Figma Official Tutorial: https://help.figma.com/
- Figma Community: https://www.figma.com/community
- Figma YouTube: https://www.youtube.com/c/Figmadesign

### Design System References:
- Material Design: https://m3.material.io/
- iOS Human Interface: https://developer.apple.com/design/
- Ant Design: https://ant.design/

---

## ✅ Final Steps After Creating Figma File

1. **Organize Layers**
   - Group related elements
   - Name layers clearly
   - Use frames for screens

2. **Create Master Components**
   - Turn reusable elements into components
   - Create variants for different states
   - Use component properties

3. **Set Up Prototype**
   - Link screens with interactions
   - Add animations (optional)
   - Set device frame

4. **Share for Development**
   - Export design specs
   - Generate style guide
   - Share link with developers

---

## 🎁 Bonus: Figma Plugins to Install

1. **Tokens Studio** - Import design tokens
2. **Unsplash** - Add placeholder images
3. **Iconify** - Search and add icons
4. **Lorem Ipsum** - Generate text
5. **Stark** - Check accessibility
6. **Autoflow** - Create user flows
7. **Content Reel** - Add realistic data

---

You now have everything needed to recreate the entire Pawfect Match design in Figma! Start with Method 1 (design tokens) for the fastest setup, or Method 3 (manual) for full control.
