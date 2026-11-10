import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hanyang.dosirak',
  appName: '한양도시락',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
