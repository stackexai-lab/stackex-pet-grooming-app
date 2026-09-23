import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'PawCare',
  slug: 'stackex-pet-grooming',
  scheme: 'stackex-pet-grooming',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
    },
  },
  splash: {
    image: './assets/splash-icon.png',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  userInterfaceStyle: 'automatic',
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
