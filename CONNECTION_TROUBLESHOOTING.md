# Expo Connection Troubleshooting Guide

## Problem: QR Code Not Opening App

### Solution 1: Manual Connection (Most Reliable)

1. **In Expo Terminal**, look for the connection URL:
   ```
   exp://192.168.0.100:8081
   ```

2. **In Expo Go App:**
   - Open Expo Go app
   - Tap "Enter URL manually" (usually at the bottom)
   - Type: `exp://192.168.0.100:8081`
   - Tap "Connect"

### Solution 2: Check Network Connection

**Requirements:**
- ✅ Phone and computer on **same Wi-Fi network**
- ✅ No VPN active on either device
- ✅ Not using a guest network (may block local connections)

**Test:**
- Make sure both devices can see each other on the network
- Try pinging your phone from computer (if you know phone's IP)

### Solution 3: Try Tunnel Mode

If LAN mode doesn't work, tunnel mode works over the internet:

```bash
npm run dev
# This uses --tunnel flag
```

**Note:** Tunnel mode is slower but works across different networks.

### Solution 4: Check Firewall Settings

**Windows Firewall:**
1. Open "Windows Defender Firewall"
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Find "Node.js" and check both "Private" and "Public"
4. If Node.js isn't listed, click "Allow another app" and add it

**Or temporarily disable firewall to test:**
- If it works with firewall off, you know that's the issue
- Then re-enable and properly configure firewall rules

### Solution 5: Use Web Version (Quick Test)

If mobile connection is problematic, test on web first:

1. In Expo terminal, press `w`
2. App opens in browser at `http://localhost:8081`
3. This confirms the app is working

### Solution 6: Check Expo Go App

**Make sure:**
- ✅ Expo Go app is updated to latest version
- ✅ Camera permissions are enabled (for QR scanning)
- ✅ Try restarting Expo Go app

### Solution 7: Alternative Connection Methods

**Method A: Share via Email/Link**
- In Expo terminal, look for "Share" option
- Send the link to yourself
- Open link on phone

**Method B: Use Expo DevTools**
- Open: `http://localhost:19002`
- Shows connection options and QR code
- Can also share link from there

## Quick Checklist

- [ ] Phone and computer on same Wi-Fi
- [ ] No VPN active
- [ ] Firewall allows Node.js
- [ ] Expo Go app is updated
- [ ] Tried manual URL entry
- [ ] Tried tunnel mode
- [ ] Tried web version (press `w`)

## Still Not Working?

1. **Check Expo terminal for errors**
2. **Try restarting both:**
   - Expo server (Ctrl+C, then restart)
   - Expo Go app (close and reopen)
3. **Check if port 8081 is available:**
   ```bash
   netstat -ano | findstr :8081
   ```
4. **Try a different port:**
   ```bash
   npx expo start --port 8082
   ```

## Your Current Setup

- **Computer IP:** 192.168.0.100
- **Expected URL:** `exp://192.168.0.100:8081`
- **Web URL:** `http://localhost:8081`

Try the manual connection method first - it's the most reliable!

