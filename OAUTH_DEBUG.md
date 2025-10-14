## 🔧 OAuth Debug Guide

Based on the logs, your OAuth flow starts correctly but the callback isn't reaching your app. Here's how to fix it:

## 🎯 **Root Cause**
The Google Console redirect URIs are not properly configured for Expo Go development.

## 📋 **Google Console Setup Steps**

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Navigate to your project (the one with your OAuth client)

### 2. Configure OAuth Client
- Go to **APIs & Credentials** → **Credentials**
- Click on your OAuth 2.0 Client ID
- In **Authorized redirect URIs**, add EXACTLY these URIs:

```
https://auth.expo.io/@yousuf_fahim/pawmatch
exp://192.168.68.106:8082/--/oauth/callback
```

### 3. Save and Wait
- Click **SAVE**
- Wait 5-10 minutes for changes to propagate

## 🧪 **Test Again**
After updating Google Console:
1. Restart your Expo app (`r` in terminal)
2. Try OAuth sign-in again
3. You should see callback logs like:
   ```
   🔗 [OAuth Callback] Processing OAuth callback with params
   🔑 [Auth] Extracted tokens from URL
   ✅ [Auth] Session established successfully
   ```

## 🚨 **If Still Failing**
Check these common issues:

1. **Wrong Project**: Make sure you're editing the correct Google Cloud project
2. **Client Type**: Ensure you're using **Web application** type (not Android/iOS)
3. **Case Sensitivity**: URIs must match exactly (no typos)
4. **Propagation**: Wait 10+ minutes after saving changes

## 📝 **Verification**
The OAuth should work when you see these logs in sequence:
- `🚀 [Auth] OAuth URL: ...` ✅ (Working)
- `🔗 [OAuth Callback] Processing OAuth callback...` ❌ (Missing - this is the issue)
- `✅ [Auth] Session established successfully` ❌ (Missing)