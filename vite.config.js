import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const raw = loadEnv(mode, process.cwd(), "");

  // Explicit allowlist to avoid leaking private variables to the browser bundle.
  const publicEnv = {
    APP_ENV: raw.APP_ENV,
    APP_BASE_URL: raw.APP_BASE_URL,
    APPWRITE_ENDPOINT: raw.APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID: raw.APPWRITE_PROJECT_ID,
    APPWRITE_DB_ID: raw.APPWRITE_DB_ID,
    APPWRITE_COL_PROFILES_ID: raw.APPWRITE_COL_PROFILES_ID,
    APPWRITE_COL_PROPERTY_TYPES_ID: raw.APPWRITE_COL_PROPERTY_TYPES_ID,
    APPWRITE_COL_RENT_RECURRENCIES_ID: raw.APPWRITE_COL_RENT_RECURRENCIES_ID,
    APPWRITE_COL_PROPERTIES_ID: raw.APPWRITE_COL_PROPERTIES_ID,
    APPWRITE_COL_RENTAL_PROPOSALS_ID: raw.APPWRITE_COL_RENTAL_PROPOSALS_ID,
    APPWRITE_COL_RENTAL_PAYMENTS_ID: raw.APPWRITE_COL_RENTAL_PAYMENTS_ID,
    APPWRITE_COL_EMAIL_VERIFICATIONS_ID: raw.APPWRITE_COL_EMAIL_VERIFICATIONS_ID,
    APPWRITE_BUCKET_USER_AVATARS_ID: raw.APPWRITE_BUCKET_USER_AVATARS_ID,
    APPWRITE_BUCKET_PROPERTY_PHOTOS_ID: raw.APPWRITE_BUCKET_PROPERTY_PHOTOS_ID,
    APPWRITE_BUCKET_USER_DOCUMENTS_ID: raw.APPWRITE_BUCKET_USER_DOCUMENTS_ID,
    APPWRITE_FUNCTION_SYNC_PROFILE_ID: raw.APPWRITE_FUNCTION_SYNC_PROFILE_ID,
    APPWRITE_FUNCTION_EMAIL_VERIFICATION_ID:
      raw.APPWRITE_FUNCTION_EMAIL_VERIFICATION_ID,
    APPWRITE_FUNCTION_ENSURE_PROFILE_ID:
      raw.APPWRITE_FUNCTION_ENSURE_PROFILE_ID,
    EMAIL_VERIFICATION_TTL_MINUTES: raw.EMAIL_VERIFICATION_TTL_MINUTES,
    FEATURE_VERBOSE_LOGS: raw.FEATURE_VERBOSE_LOGS,
  };

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "web/favicon.ico",
          "web/apple-touch-icon.png",
          "web/icon-192.png",
          "web/icon-192-maskable.png",
          "web/icon-512.png",
          "web/icon-512-maskable.png",
        ],
        manifest: {
          name: "Rentas24",
          short_name: "Rentas24",
          description:
            "Rentas24: publica, administra y encuentra propiedades en renta.",
          theme_color: "#0b1528",
          background_color: "#f5f9fc",
          display: "standalone",
          scope: "/",
          start_url: "/",
          orientation: "portrait-primary",
          icons: [
            {
              src: "/web/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/web/icon-192-maskable.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "/web/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/web/icon-512-maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/appwrite\.racoondevs\.com\/v1\/.*$/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "appwrite-api",
                networkTimeoutSeconds: 8,
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 5,
                },
              },
            },
            {
              urlPattern: /^https:\/\/images\.unsplash\.com\/.*$/i,
              handler: "CacheFirst",
              options: {
                cacheName: "unsplash-images",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    define: {
      __R24_ENV__: JSON.stringify(publicEnv),
    },
  };
});
