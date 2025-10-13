# OAuth Redirect URLs for PawMatch App

## For Supabase Auth (Mobile App)

Based on your pawfectmatch.expo.app domain, your app's redirect URLs should be:

### Development
```
exp://localhost:8083/--/auth/callback
exp://192.168.68.106:8083/--/auth/callback
```

### Production (when deployed to Expo)
```
https://pawfectmatch.expo.app/--/auth/callback
pawfectmatch://auth/callback
```

### Preview Deployments
```
https://pawfectmatch--[build-id].expo.app/--/auth/callback
```

## Google OAuth Configuration

In your **Google Cloud Console** → **OAuth 2.0 Client IDs** → **Authorized redirect URIs**, add:

1. **For Development:**
   - `exp://localhost:8083/--/auth/callback` (simulator)
   - `exp://192.168.68.106:8083/--/auth/callback` (your device)

2. **For Production:**
   - `https://pawfectmatch.expo.app/--/auth/callback`
   - `pawfectmatch://auth/callback`

## Supabase Configuration

In your **Supabase Dashboard** → **Authentication** → **URL Configuration**, set:

### Site URL
```
https://pawfectmatch.expo.app
```

### Additional Redirect URLs  
```
exp://localhost:8083/--/auth/callback
exp://192.168.68.106:8083/--/auth/callback
https://pawfectmatch.expo.app/--/auth/callback
pawfectmatch://auth/callback
```

## Current App Configuration

Your `app.json` already has the correct scheme:
```json
{
  "expo": {
    "scheme": "pawmatch"
  }
}
```

And your auth callback handler is at: `app/auth/callback.tsx`

## Testing OAuth Flow

1. **Simulator**: Use `exp://localhost:8083/--/auth/callback`
2. **Physical Device**: Use `exp://192.168.68.106:8083/--/auth/callback`
3. **Production Web**: Use `https://pawfectmatch.expo.app/--/auth/callback`
4. **Production Mobile**: Use `pawfectmatch://auth/callback`

## For Admin Panel (Separate - JWT)

Since you mentioned using JWT for admin, you can use standard web URLs:
```
http://localhost:3000/auth/callback    # Development
https://your-admin-domain.com/auth/callback  # Production
```

## Notes

- The `--/` prefix is Expo's deep linking format for dev builds
- Make sure your `app/auth/callback.tsx` handles the OAuth response correctly
- Test both simulator and physical device during development
