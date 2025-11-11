# How to View Expo App Logs on Windows

## ✅ BEST SOLUTION: Remote Debugging (Works on All Platforms)

### Step 1: Enable Remote Debugging in Your Expo App
1. **Open your Expo app** on your device/emulator
2. **Shake your device** (or press `Ctrl+M` on Android emulator / `Cmd+D` on iOS simulator)
3. **Tap "Debug Remote JS"** or "Remote JS Debugging"
4. **Chrome DevTools will open automatically** - this is where your logs will appear!

### Step 2: View Logs in Chrome DevTools
- Go to the **Console** tab in Chrome DevTools
- All `console.log()` statements from your app will appear here
- This is the **easiest and most reliable** way to see logs

---

## Alternative: Expo DevTools (Web Interface)

1. **Open in browser:** `http://localhost:19002`
   - Or run: `npm run devtools` (opens automatically on Windows)
2. This shows:
   - Connection status
   - Logs from connected devices
   - Device information
   - Network requests

---

## For Android: Install ADB (Optional - Advanced)

If you want to use native Android logs:

1. **Install Android SDK Platform Tools:**
   - Download from: https://developer.android.com/studio/releases/platform-tools
   - Extract to a folder (e.g., `C:\platform-tools`)
   - Add to PATH: 
     - Search "Environment Variables" in Windows
     - Edit "Path" variable
     - Add: `C:\platform-tools`

2. **Then you can use:**
   ```bash
   adb logcat | findstr ReactNativeJS
   ```

**Note:** Remote debugging is much easier and doesn't require ADB setup!

---

## Quick Test

Add this to your app code:
```javascript
console.log('🔍 TEST LOG - Check Chrome DevTools Console!');
```

Then:
1. Enable remote debugging in your app
2. Check Chrome DevTools Console tab
3. You should see the log!

---

## Why Remote Debugging is Best

- ✅ Works immediately (no setup needed)
- ✅ Shows all console.log() statements
- ✅ Can inspect variables and network requests
- ✅ Works on both iOS and Android
- ✅ No need to install ADB or other tools

---

## Troubleshooting

**If Chrome DevTools doesn't open:**
- Make sure remote debugging is enabled in your app
- Check if Chrome is your default browser
- Manually open: `chrome://inspect` in Chrome

**If logs still don't show:**
- Make sure the app is fully loaded
- Try reloading the app (shake device → Reload)
- Check that you're looking at the Console tab in DevTools

