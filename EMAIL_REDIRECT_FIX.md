# 🔧 Fix Email Confirmation Redirect Error

## Problem
When clicking the email confirmation link, you see:
> "No worker deployment was found matching the current domain"

This happens because the redirect URL `https://pawfectmatch.expo.app/auth/callback` doesn't exist or isn't configured.

---

## ✅ Solution: Configure Redirect URLs in Supabase

### Step 1: Add Redirect URLs to Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**

### Step 2: Add These Redirect URLs

**For Development (Add ALL of these):**
```
http://localhost:8081
http://localhost:8081/auth/confirm
http://localhost:19006
http://localhost:19006/auth/confirm
exp://localhost:8081
exp://localhost:8081/auth/confirm
```

**For Production (When you deploy):**
```
https://pawfectmatch.expo.app
https://pawfectmatch.expo.app/auth/confirm
pawmatch://auth/confirm
```

### Step 3: Set Site URL

**For Development:**
```
http://localhost:8081
```

**For Production:**
```
https://pawfectmatch.expo.app
```

### Step 4: Click "Save" ✅

---

## 🔍 Find Your Correct Port

The port might be different. Check your terminal when you run `npm run dev`:

```
Web: http://localhost:8081
```

Use whatever port number you see there!

---

## 🧪 Test After Configuration

1. **Restart your dev server:**
   ```bash
   npx expo start --clear
   ```

2. **Sign up with a new email**

3. **Check your email** and click the confirmation link

4. **Should now redirect properly!** ✅

---

## 📱 For Mobile (Expo Go)

If testing on mobile with Expo Go:

1. Make sure you add:
   ```
   exp://localhost:8081/auth/confirm
   ```

2. When you click the email link on your phone, it should open Expo Go and confirm your email.

---

## 🚨 Still Not Working?

### Check 1: Verify the Redirect URL in Code
When you sign up, check your terminal. You should see:
```
🔐 [Auth] Sign up with email redirect: http://localhost:8081/auth/confirm
```

If it shows a different URL, that's the one you need to add to Supabase!

### Check 2: Make Sure URLs Match Exactly
- The URL in Supabase must match EXACTLY (including `/auth/confirm`)
- No trailing slashes
- Use `http://` for localhost (not `https://`)

### Check 3: Restart Everything
1. Stop your dev server (Ctrl+C)
2. Clear cache: `npx expo start --clear`
3. Restart the app on your device/emulator

---

## 🎯 Quick Reference

**Supabase Settings Location:**
```
Dashboard → Your Project → Authentication → URL Configuration
```

**Files to Check:**
- `lib/enhanced-auth.ts` - Contains redirect URL logic
- `.env` - May contain `EXPO_PUBLIC_AUTH_REDIRECT_URL`

**Common Ports:**
- Expo Web: `8081` or `19006`
- Expo Dev Client: `8081`

---

## ✨ After Fix

Once configured correctly:
1. User signs up → Gets email
2. User clicks confirmation link
3. Redirects to `http://localhost:8081/auth/confirm` (or your configured URL)
4. Email is confirmed ✅
5. User can now sign in!

