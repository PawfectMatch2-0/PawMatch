# 📧 Email Confirmation Setup Guide

## Overview
This guide walks you through enabling email confirmation for new sign-ups in PawfectMatch. Your app is already configured to handle this - you just need to enable it in Supabase!

---

## ✅ STEP 1: Enable Email Confirmation in Supabase Dashboard

### 1.1 Access Authentication Settings
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your PawfectMatch project
3. Click **Authentication** in the left sidebar
4. Go to **Providers** → **Email**

### 1.2 Enable Confirm Email
- Toggle **"Confirm email"** switch to **ON** ✅
- This ensures new users must verify their email before signing in

![Screenshot: Navigate to Email Providers](https://imgur.com/a/supabase-email-toggle)

---

## ✅ STEP 2: Configure Email Sending Method

### Option A: Use Supabase's Built-in Email (FREE - Recommended)

**Default Supabase Email:**
- 100 emails per day (free)
- No configuration needed
- Sender: noreply@supabase.io

**To verify it's set up:**
1. Go to **Authentication → Email Templates**
2. Ensure email templates are enabled ✅
3. Check **Settings** → scroll to **Email**
4. Verify sender email is set

### Option B: Use Custom SMTP (Gmail, SendGrid, Custom Server)

#### Gmail Setup:
1. Go to **Authentication → Settings**
2. Scroll down to **Email Settings**
3. Click **Custom SMTP**
4. Enter:
   - **SMTP Host:** `smtp.gmail.com`
   - **SMTP Port:** `587`
   - **SMTP User:** your-email@gmail.com
   - **SMTP Password:** [Your Gmail App Password - NOT your regular password!](https://support.google.com/accounts/answer/185833)
   - **From Email Address:** your-email@gmail.com
   - **From Name:** Pawfect Match
5. Click **Save**

#### SendGrid Setup:
1. Create free account at [sendgrid.com](https://sendgrid.com)
2. Get API Key from Settings → API Keys
3. In Supabase:
   - **SMTP Host:** `smtp.sendgrid.net`
   - **SMTP Port:** `587`
   - **SMTP User:** `apikey`
   - **SMTP Password:** Your SendGrid API Key
   - **From Email:** verified-sender@yourdomain.com

#### Firebase Email Setup:
1. Go to Firebase Console → Authentication
2. Go to **Templates** → Customize email template
3. Copy custom template URL
4. In Supabase → **Email Templates**, paste custom URL

---

## ✅ STEP 3: Verify Your Code is Ready

Your app already has email confirmation built-in! ✅

**In `lib/enhanced-auth.ts` (Line 249):**
```typescript
const { data: authData, error } = await supabase!.auth.signUp({
  email: data.email,
  password: data.password,
  options: {
    data: {
      full_name: data.fullName,
      phone: data.phone,
    },
    emailRedirectTo: redirectUrl  // ← This sends confirmation link!
  }
})
```

**In `app/auth-enhanced.tsx` (Line 153):**
```tsx
if (result.requiresEmailConfirmation) {
  setMode('email-confirm')  // Shows "Check your email" screen
}
```

---

## ✅ STEP 4: Test Email Confirmation

### Development Testing:
1. Go to your app's sign-up screen
2. Create account with test email (e.g., test@example.com)
3. Check inbox for confirmation email from Supabase
4. Click **"Confirm your email"** button in email
5. You'll be redirected to app confirmation page
6. ✅ Account is now verified!

### Common Issues:

| Issue | Solution |
|-------|----------|
| ❌ "Email not sent" error | Enable SMTP in Supabase or disable email confirmation temporarily |
| ❌ Email not arriving | Check spam folder, verify email is valid |
| ❌ Redirect link not working | Ensure `emailRedirectTo` URL is correct in auth code |
| ❌ Unconfirmed user can sign in | This is normal - Supabase allows this by default |

---

## ✅ STEP 5: Customize Email Template (Optional)

1. Go to **Authentication → Email Templates**
2. Select **"Confirm signup"** template
3. Customize:
   - Subject line
   - Email body
   - Button text
   - Branding/logo

**Example Template:**
```
Hi {{ .ConfirmationURL }},

Welcome to Pawfect Match! 🐾

Please confirm your email by clicking the button below:

[CONFIRM EMAIL]

If you didn't create this account, please ignore this email.

Best regards,
The Pawfect Match Team
```

---

## ✅ STEP 6: Handle Unconfirmed Users (Optional Security)

To prevent unconfirmed users from accessing the app:

**In `lib/enhanced-auth.ts`:**
```typescript
// After sign-up, check if email is verified
if (authData.user && !authData.user.email_confirmed_at) {
  return {
    success: true,
    requiresEmailConfirmation: true,
    message: 'Please confirm your email to continue'
  }
}
```

---

## 📱 User Experience Flow

```
Sign Up Form
    ↓
Enter Email & Password
    ↓
[Server] Create Account
    ↓
[Email Sent] ← Confirmation email sent
    ↓
User sees: "Check your email to confirm"
    ↓
User clicks link in email
    ↓
Account Activated ✅
    ↓
User can sign in normally
```

---

## 🔧 Troubleshooting Checklist

- [ ] Email confirmation toggle is **ON** in Supabase
- [ ] SMTP settings are configured (or using default)
- [ ] Test email was sent successfully
- [ ] Confirmation link is clickable
- [ ] Redirect URL matches your app domain
- [ ] App shows "email-confirm" screen after signup
- [ ] Clicking confirmation link activates account

---

## 📞 Support Resources

- [Supabase Email Docs](https://supabase.com/docs/guides/auth/auth-email)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)

---

## ✨ Next Steps After Setup

1. **Test thoroughly** with real email account
2. **Customize email template** with your branding
3. **Monitor signup flow** for issues
4. **Consider adding:**
   - Resend confirmation email button
   - Email verification reminder after 24 hours
   - Login attempts tracking for unconfirmed accounts

---

**Last Updated:** November 9, 2025
**Status:** ✅ Ready to implement
