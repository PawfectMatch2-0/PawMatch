// Load environment variables
require('dotenv').config();

module.exports = {
  expo: {
    name: "PawfectMatch",
    slug: "pawmatch",
    version: "2.1.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pawfectmatch",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.pawfectmatch.app",
      associatedDomains: [
        "applinks:pawfectmatch.app",
        "applinks:pawfectmatch.app"
      ]
    },
    android: {
      package: "com.pawfectmatch.app",
      versionCode: 2,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#FFFFFF"
      },
      permissions: [
        "android.permission.INTERNET",
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ],
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "pawfectmatch"
            },
            {
              scheme: "pawfectmatch",
              host: "oauth"
            },
            {
              scheme: "pawfectmatch",
              host: "auth"
            },
            {
              scheme: "https",
              host: "*.pawfectmatch.app",
              pathPrefix: "/"
            }
          ],
          category: [
            "BROWSABLE",
            "DEFAULT"
          ]
        }
      ]
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/favicon.png",
      staticDirectory: "assets",
      build: {
        babel: {
          include: [
            "@supabase/auth-helpers-react"
          ]
        }
      }
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
            networkSecurityConfig: "./network_security_config.xml"
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "e3440742-7963-4ec8-ad47-9436b05b5079"
      },
      // Inject environment variables here
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_ADMIN_EMAIL: process.env.EXPO_PUBLIC_ADMIN_EMAIL,
      EXPO_PUBLIC_DEBUG_AUTH: process.env.EXPO_PUBLIC_DEBUG_AUTH,
      EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      APP_ENV: process.env.APP_ENV
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/80e3026e-6bcf-423a-b1eb-fb5a6095dc4e"
    },
    owner: "mr_swapnil"
  }
};
