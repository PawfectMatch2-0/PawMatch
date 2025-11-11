# 🔍 Email Confirmation Debugging Guide

## Current Error
```
AuthApiError: Invalid Refresh Token: Refresh Token Not Found
```

This happens when the app tries to confirm the email but can't find valid tokens in the URL.

---

## ✅ What I Just Fixed

I updated `app/auth/confirm.tsx` to:
1. ✅ Handle multiple URL formats (query params, hash params, token format)
2. ✅ Add detailed logging to see what's in the URL
3. ✅ Try multiple confirmation methods (`setSession` and `verifyOtp`)
4. ✅ Better error messages

---

## 🔍 Debug Steps

### Step 1: Check Console Logs

When you click the confirmation link, check your browser/Expo console. You should see:

```
📧 [Email Confirm] Received params: {...}
📧 [Email Confirm] Extracted: { hasAccessToken: true/false, ... }
```

**This will tell us what tokens are actually in the URL.**

### Step 2: Check the Actual Email Link

Look at the confirmation link in your email. It should look like:

```
https://afxkliyukojjymvfwiyp.supabase.co/auth/v1/verify?token=...&type=signup&redirect_to=http://localhost:8081/auth/confirm
```

**Important:** The `redirect_to` parameter must match a URL you added to Supabase!

### Step 3: Verify Supabase Configuration

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Make sure you added:
   ```
   http://localhost:8081/auth/confirm
   ```
   (Use your actual port number)

3. **Site URL** should be:
   ```
   http://localhost:8081
   ```

4. Click **Save** ✅

---

## 🎯 How Supabase Email Confirmation Works

1. User clicks link in email
2. Supabase verifies the token on their server
3. Supabase redirects to your `emailRedirectTo` URL
4. The redirect includes `access_token` and `refresh_token` in the URL
5. Your app extracts these tokens and creates a session

**The problem:** If the redirect URL isn't in Supabase's allowed list, the tokens won't be passed correctly!

---

## 🧪 Test After Fix

1. **Restart your dev server:**
   ```bash
   npx expo start --clear
   ```

2. **Sign up with a new email**

3. **Check your email** and click the confirmation link

4. **Watch the console** - you should see:
   ```
   📧 [Email Confirm] Received params: {...}
   📧 [Email Confirm] Using setSession method
   ✅ [Email Confirm] Email confirmed successfully
   ```

5. **If you see errors**, check what params were received and share them!

---

## 🚨 Common Issues

### Issue 1: "No valid tokens found in URL"
**Cause:** Redirect URL not configured in Supabase  
**Fix:** Add the redirect URL to Supabase Dashboard → URL Configuration

### Issue 2: "Invalid Refresh Token"
**Cause:** Tokens expired or redirect URL mismatch  
**Fix:** 
- Make sure redirect URL in code matches Supabase config
- Request a new confirmation email (links expire after 1 hour)

### Issue 3: "Email address not found"
**Cause:** Using `verifyOtp` method but email not in URL  
**Fix:** The updated code now handles this - should use `setSession` instead

---

## 📋 Quick Checklist

- [ ] Added redirect URL to Supabase Dashboard
- [ ] Restarted dev server with `--clear`
- [ ] Checked console logs when clicking confirmation link
- [ ] Verified the redirect URL in code matches Supabase config
- [ ] Requested a new confirmation email (if old one expired)

---

## 💡 Next Steps

1. **Click the confirmation link again**
2. **Check the console logs** - they'll show exactly what's happening
3. **Share the console output** if it's still not working

The new logging will help us see exactly what's going wrong! 🔍

