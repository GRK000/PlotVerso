import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'PlotVerso',
  slug: 'plotverso',
  scheme: 'plotverso',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  platforms: ['android', 'web'],
  splash: {
    backgroundColor: '#F7F3EC',
    resizeMode: 'contain'
  },
  android: {
    package: 'com.plotverso.app'
  },
  web: {
    bundler: 'metro',
    output: 'single'
  },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {},
  extra: {
    eas: {
      projectId: '00000000-0000-0000-0000-000000000000'
    }
  }
};

export default config;
