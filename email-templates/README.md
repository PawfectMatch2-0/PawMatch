# Email Templates Setup Guide

## 📧 Beautiful Email Templates Created

I've created two stunning, modern email templates for your PawfectMatch app:

1. **`signup-confirmation.html`** - For email verification after signup
2. **`password-reset.html`** - For password reset requests

### ✨ Features:
- 🎨 Modern gradient design matching your app's coral (#FF6B6B) theme
- 📱 Fully responsive (mobile-friendly)
- 🔒 Security notices and expiration warnings
- 🐾 Branded with PawfectMatch logo and identity
- 💫 Animated elements and smooth transitions
- 📋 Alternative plain text link for accessibility
- 🔗 Social media links section

---

## 🚀 How to Upload to Supabase

### Step 1: Open Supabase Email Templates
1. Go to: https://supabase.com/dashboard/project/afxkliyukojjymvfwiyp/auth/templates
2. You'll see a list of email templates

### Step 2: Update Confirmation Email
1. Click on **"Confirm signup"** template
2. Replace the entire HTML content with the code from `signup-confirmation.html`
3. Click **Save**

### Step 3: Update Password Reset Email
1. Click on **"Reset password"** template
2. Replace the entire HTML content with the code from `password-reset.html`
3. Click **Save**

---

## 🎯 Template Variables (DO NOT REMOVE)

These Supabase variables are automatically replaced:
- `{{ .ConfirmationURL }}` - The actual confirmation/reset link
- These MUST remain in the template exactly as shown

---

## 🎨 Customization Options

Want to personalize further? You can modify:

### Colors:
```css
/* Primary gradient (currently coral) */
background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);

/* Change to any color you prefer */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Logo:
```html
<!-- Currently using emoji -->
<div class="logo">🐾</div>

<!-- Replace with your image -->
<img src="https://your-cdn.com/logo.png" alt="PawfectMatch" width="80" height="80">
```

### Social Links:
```html
<div class="social-links">
    <a href="https://facebook.com/yourpage">📘</a>
    <a href="https://instagram.com/yourpage">📷</a>
    <a href="https://twitter.com/yourpage">🐦</a>
</div>
```

### Contact Email:
```html
<!-- Update support email -->
<a href="mailto:support@pawfectmatch.com">support@pawfectmatch.com</a>
```

---

## 📝 Testing Your Templates

### Test Signup Email:
1. Delete test user from Supabase dashboard
2. Sign up again with test email
3. Check your inbox - you'll see the beautiful new template!

### Test Password Reset Email:
1. Go to "Forgot Password" in your app
2. Enter your email
3. Check inbox for the new styled reset email

---

## ⚠️ Important Notes

1. **Mobile Preview**: Always test on mobile devices - the templates are fully responsive
2. **Email Client Compatibility**: These templates work in Gmail, Outlook, Apple Mail, etc.
3. **Loading Images**: If you add custom images, host them on a CDN for fast loading
4. **Spam Filters**: Avoid excessive use of promotional language to prevent spam filtering
5. **Accessibility**: Alternative plain text links are included for compatibility

---

## 🔧 Troubleshooting

**Template not showing?**
- Make sure you saved the template in Supabase
- Clear your browser cache
- Check if SMTP is configured (if using custom SMTP)

**Link not working?**
- Verify `{{ .ConfirmationURL }}` is exactly as shown
- Check redirect URLs are configured in Supabase Auth settings

**Styling looks broken?**
- Some email clients strip certain CSS
- The templates use inline styles + `<style>` tags for maximum compatibility
- Gmail app works best for viewing these templates

---

## 📞 Support

If you encounter any issues:
1. Check Supabase logs: https://supabase.com/dashboard/project/afxkliyukojjymvfwiyp/logs
2. Test with different email providers (Gmail, Outlook, etc.)
3. Verify SMTP configuration if using custom email service

---

## 🎉 Next Steps

1. Upload templates to Supabase
2. Configure SMTP (if not already done)
3. Test with real email addresses
4. Customize colors/branding to match your exact design
5. Add your actual social media links

**Your users will love these beautiful, professional emails!** 🐾✨
