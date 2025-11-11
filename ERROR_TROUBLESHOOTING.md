# "Something Went Wrong" Error - Troubleshooting Guide

## Common Causes & Solutions

### 1. **Environment Variables Not Loaded**
**Symptom:** App crashes on startup, especially when accessing Supabase

**Solution:**
```bash
# Stop the server (Ctrl+C)
# Restart with clear cache
npx expo start --clear
```

**Check:** Make sure `.env` file exists in project root with:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 2. **Font Loading Error**
**Symptom:** Error related to fonts not loading

**Solution:**
- Check if fonts are properly installed
- Try clearing cache: `npx expo start --clear`
- Check `app/_layout.tsx` for font loading

### 3. **Missing Dependencies**
**Symptom:** Module not found errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
# Or on Windows:
rmdir /s node_modules
npm install
```

### 4. **Supabase Connection Error**
**Symptom:** Cannot connect to Supabase, authentication errors

**Solution:**
1. Verify Supabase URL and key in `.env`
2. Check if Supabase project is active
3. Verify network connection
4. Check Supabase dashboard for any service issues

### 5. **React Native Reanimated Error**
**Symptom:** Animation-related errors

**Solution:**
```bash
# Clear cache and reinstall
npx expo start --clear
# If using development build, rebuild:
npx expo prebuild --clean
```

### 6. **Navigation Error**
**Symptom:** Route not found, navigation errors

**Solution:**
- Check if route exists in `app/` directory
- Verify route names match exactly
- Clear navigation cache

## How to See the Actual Error

### Method 1: Enable Remote Debugging
1. Shake device → "Debug Remote JS"
2. Open Chrome DevTools Console
3. See full error message and stack trace

### Method 2: Check Terminal
- Look for red error messages in Expo terminal
- Check for build errors or warnings

### Method 3: Use Error Boundary
- The app now has an error boundary (`app/_error.tsx`)
- It will show the error message and stack trace
- Click "Try Again" to retry

## Quick Fixes to Try

### Fix 1: Clear Everything and Restart
```bash
# Stop server (Ctrl+C)
# Clear cache
npx expo start --clear
```

### Fix 2: Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

### Fix 3: Check Environment Variables
```bash
# Verify .env file exists
cat .env
# Or on Windows:
type .env

# Make sure it has:
# EXPO_PUBLIC_SUPABASE_URL=...
# EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

### Fix 4: Reset Metro Bundler
```bash
# Stop server
# Clear Metro cache
npx expo start --clear --reset-cache
```

## Get More Details

**To see the exact error:**
1. Enable remote debugging (shake device → Debug Remote JS)
2. Check Chrome DevTools Console
3. Look for red error messages
4. Check the error boundary screen in the app

**Common Error Messages:**
- `Cannot read property 'X' of undefined` → Missing data/null check
- `Network request failed` → Supabase connection issue
- `Module not found` → Missing dependency
- `Font not found` → Font loading issue

## Still Not Working?

1. **Check the exact error message** (use remote debugging)
2. **Share the error** - copy the full error message and stack trace
3. **Check recent changes** - did you modify any files recently?
4. **Try web version** - press `w` in terminal to test on web

## Your Current Setup

- ✅ Environment variables are configured
- ✅ Dependencies are installed
- ✅ Error boundary is added

**Next Step:** Enable remote debugging to see the exact error message!

