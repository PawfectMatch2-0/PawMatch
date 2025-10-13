# 🔧 Fix Redirect URI Mismatch - PawMatch

## ⚠️ Current Issue
You're getting "Error 400: redirect uri mismatch" because your Supabase project doesn't have the correct redirect URIs configured.

## 🚀 Quick Fix Steps

### Step 1: Configure Supabase Redirect URIs

1. **Open Supabase Dashboard**: https://supabase.com/dashboard/project/afxkliyukojjymvfwiyp
2. **Go to Authentication > URL Configuration**
3. **Set PRIMARY Site URL to**: `http://localhost:8082`

4. **Add these Redirect URLs** (one per line in the "Redirect URLs" field):

```
http://localhost:8082/auth-callback
http://localhost:8081/auth-callback  
http://localhost:8083/auth-callback
http://localhost:3000/auth-callback
https://auth.expo.io/@yousuf_fahim/pawmatch
pawmatch://auth-callback
pawmatch://auth/callback
exp://192.168.68.106:8082/--/auth/callback
```

**⚠️ IMPORTANT**: Make sure `http://localhost:8082` is the PRIMARY Site URL, not `pawfectmatch.expo.app`

### Step 2: Test the Fix

1. **Open your app in browser**: http://localhost:8082
2. **Try signing in with Google**
3. **Check the console** for debug information (I've enabled debug mode for you)

## 📱 Current Configuration

Your environment is now configured with:
- **Development URL**: `http://localhost:8082/auth-callback`
- **Mobile URL**: `pawmatch://auth-callback`
- **Debug Mode**: Enabled (shows all possible URLs in console)

## 🚨 **URGENT: Fix Current Issue**

You're seeing "No worker deployment was found" because Supabase is redirecting to `pawfectmatch.expo.app` instead of localhost.

**IMMEDIATE ACTION REQUIRED:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to: `http://localhost:8082`
3. Remove or move `pawfectmatch.expo.app` to the bottom of the list
4. The first/primary URL must be your localhost for development

## 🔍 Debug Information

With debug mode enabled, you'll see all possible redirect URIs in your browser console when the app loads. Use these to verify your Supabase configuration.

## 🛠 Files Updated

✅ `.env.local` - Updated ports and URLs  
✅ `lib/auth-config.ts` - New helper for redirect URI management  
✅ `lib/auth.ts` - Improved error handling and configuration

## 🧪 Testing Different Platforms

- **Web Browser**: Should redirect to `http://localhost:8082/auth-callback`
- **Expo Go (Mobile)**: Should use Expo's auth flow
- **Production Build**: Will use `pawmatch://` scheme

## ❓ Still Having Issues?

1. **Clear browser cache** and reload
2. **Check Supabase logs** in dashboard > Logs
3. **Verify Google OAuth** is configured in Supabase > Authentication > Providers
4. **Check console output** for detailed debug information

---

*The configuration should now work correctly. The redirect URI mismatch should be resolved once you add the URLs to your Supabase project.*