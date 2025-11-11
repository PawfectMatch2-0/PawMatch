# How to View Expo App Logs

## Problem
Logs from your Expo app (iOS/Android) don't automatically show in the terminal, even though the app is running.

## Solutions

### Solution 1: Enable Remote Debugging (Recommended)
1. **In your Expo app** (on device/emulator):
   - Shake your device (or press `Cmd+D` on iOS / `Cmd+M` on Android)
   - Tap "Debug Remote JS" or "Remote JS Debugging"
   - This opens Chrome DevTools where you'll see all console logs

2. **View logs in Chrome DevTools:**
   - A new Chrome tab will open automatically
   - Go to the "Console" tab
   - All `console.log()` statements will appear here

### Solution 2: Use Expo DevTools
1. Open in browser: `http://localhost:19002`
2. This shows:
   - Connection status
   - Logs from connected devices
   - Device information

### Solution 3: Use Native Log Commands

**For Android:**
```bash
npx react-native log-android
# OR
adb logcat | grep -i "ReactNativeJS"
```

**For iOS (Mac only):**
```bash
npx react-native log-ios
# OR
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "Expo"'
```

### Solution 4: Check Connection Status
In the Expo terminal, you should see:
- `Metro waiting on exp://...`
- When app connects: `Connected to exp://...`
- If you see "No apps connected", the app isn't connected

### Solution 5: Use React Native Debugger (Advanced)
1. Install: `npm install -g react-native-debugger`
2. Open React Native Debugger
3. Enable remote debugging in your app
4. All logs will appear in the debugger

## Quick Test
Add this to your app code to test:
```javascript
console.log('🔍 TEST LOG - Can you see this?');
```

Then check:
- Chrome DevTools (if remote debugging enabled)
- Expo DevTools (http://localhost:19002)
- Native log commands

## Why This Happens
- Web logs show in terminal because they run in Node.js
- Native app logs run on the device and need to be forwarded
- Remote debugging creates a bridge to forward logs to Chrome DevTools

