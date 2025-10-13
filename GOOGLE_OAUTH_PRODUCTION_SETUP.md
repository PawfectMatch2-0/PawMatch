# 🔐 Google OAuth Configuration for PawMatch Production

## 🎯 **Your Live App URLs**
- **Production Web**: https://pawfectmatch.expo.app/
- **Auth Callback**: https://pawfectmatch.expo.app/auth/callback
- **HTML Callback**: https://pawfectmatch.expo.app/assets/web/auth-callback.html

## 📋 **Google Console Configuration**

### **Step 1: Go to Google Cloud Console**
1. Visit: https://console.cloud.google.com/
2. Select your project (or create a new one)
3. Go to **APIs & Services** > **Credentials**

### **Step 2: Configure OAuth 2.0 Client**
1. Click on your **Web application** OAuth client ID
2. In the **Authorized redirect URIs** section, add these URLs:

#### **Production URLs (Required for Live App):**
```
https://pawfectmatch.expo.app/auth/callback
https://pawfectmatch.expo.app/assets/web/auth-callback.html
```

#### **Development URLs (Keep for Local Testing):**
```
http://localhost:8081/auth/callback
http://localhost:8081/assets/web/auth-callback.html
http://localhost:8082/auth/callback
http://localhost:8082/assets/web/auth-callback.html
```

#### **Mobile Deep Links (For APK/App Store):**
```
pawmatch://oauth/callback
```

### **Step 3: Save Configuration**
1. Click **Save** at the bottom
2. Wait for the changes to propagate (usually instant)

## ✅ **Testing Your Live Authentication**

### **Test the Production Flow:**
1. **Open**: https://pawfectmatch.expo.app/
2. **Click**: "Continue with Google" 
3. **Complete**: Google OAuth flow
4. **Verify**: You're redirected back to the main app

### **Expected Flow:**
1. `pawfectmatch.expo.app` → Click auth button
2. `Google OAuth` → User signs in 
3. `pawfectmatch.expo.app/assets/web/auth-callback.html` → Processes tokens
4. `pawfectmatch.expo.app/(tabs)` → Main app with user signed in

## 🚨 **Troubleshooting**

### **If OAuth Fails:**
1. **Check Console Errors**: Open browser dev tools
2. **Verify Redirect URLs**: Must match Google Console exactly
3. **Clear Browser Cache**: OAuth tokens might be cached
4. **Check Network Tab**: See if requests are failing

### **Common Issues:**
- **"redirect_uri_mismatch"**: Add the exact URL to Google Console
- **"Invalid request"**: Check if URLs have trailing slashes
- **"Access blocked"**: Verify OAuth consent screen is configured

## 📱 **Mobile App Testing**

Once your APK build completes, you can:
1. Download and install the APK
2. Test the `pawmatch://oauth/callback` deep link
3. Verify OAuth works on mobile devices

## 🔄 **Rebuild After URL Changes**

If you update any URLs, rebuild your web app:
```bash
cd /Users/fahim/PawMatch
APP_ENV=production npx expo export --platform web
```

Then upload the new `dist/` folder to your hosting provider or let Expo handle the deployment.

---

**Your app is live and ready for OAuth testing at**: https://pawfectmatch.expo.app/ 🚀

**Current Client ID**: `784287108471-n4ntobip5umh4hs6f375ritsr1d2nfce.apps.googleusercontent.com`