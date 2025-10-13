# 🚨 Supabase 500 Error - Quick Fix Guide

## Current Error
```json
{
  "code": 500,
  "error_code": "unexpected_failure", 
  "msg": "Unexpected failure, please check server logs for more information"
}
```

## What This Means
✅ **Google OAuth worked** - You successfully authenticated with Google
❌ **Supabase internal error** - Something in Supabase configuration is wrong

## 🔧 Immediate Fix Steps

### Step 1: Simplify Supabase Configuration
Go to: https://supabase.com/dashboard/project/afxkliyukojjymvfwiyp/auth/url-configuration

**Replace ALL URLs with just these two:**

**Site URL:**
```
http://localhost:8082
```

**Redirect URLs:**
```
http://localhost:8082/auth-callback
pawmatch://auth-callback
```

**❌ Remove all other URLs temporarily** (including expo.app, other ports, etc.)

### Step 2: Check Google OAuth Configuration
Go to: https://supabase.com/dashboard/project/afxkliyukojjymvfwiyp/auth/providers

Verify Google OAuth has:
- ✅ **Client ID** configured
- ✅ **Client Secret** configured  
- ✅ **Provider enabled**

### Step 3: Check Supabase Project Health
Go to: https://supabase.com/dashboard/project/afxkliyukojjymvfwiyp

Look for:
- ⚠️ Any warnings or alerts
- 🔴 Project status issues
- 📊 Resource usage problems

### Step 4: Check Auth Logs
Go to: https://supabase.com/dashboard/project/afxkliyukojjymvfwiyp/logs/auth-logs

Look for:
- 🔍 Recent error messages
- 📝 Specific failure reasons
- ⏰ Timestamp matching your authentication attempt

## 🧪 Test Configuration

1. **Save** the simplified Supabase configuration
2. **Clear browser cache** and cookies
3. **Go to**: http://localhost:8082  
4. **Try Google sign-in again**

## 📋 Common Causes of 500 Errors

1. **Google OAuth Misconfiguration**
   - Missing or incorrect Client ID/Secret
   - Google Console redirect URIs don't match Supabase

2. **Supabase URL Mismatch** 
   - Too many redirect URLs causing conflicts
   - Wrong primary Site URL

3. **Project Resource Issues**
   - Supabase project paused or suspended
   - Database connection problems

4. **CORS Issues**
   - Cross-origin request blocking
   - Incorrect domain configuration

## 🔄 Alternative: Reset Auth Configuration

If the above doesn't work:

1. **Disable Google OAuth** in Supabase temporarily
2. **Clear all redirect URLs**
3. **Set only**: Site URL = `http://localhost:8082`
4. **Re-enable Google OAuth**
5. **Add only**: Redirect URL = `http://localhost:8082/auth-callback`

## 📞 Need Help?

If error persists:
1. Check the diagnostic tool at: http://localhost:8082/supabase-error-diagnosis.html
2. Copy exact error messages from Supabase logs
3. Verify Google Cloud Console OAuth configuration matches Supabase

---
*The 500 error should be resolved by simplifying the redirect URL configuration and ensuring Google OAuth is properly set up.*