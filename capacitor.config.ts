import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.globalvet.app',
  appName: 'GlobalVet',
  webDir: 'dist/gv-app',
  /*server: {
    androidScheme: 'https'
  }*/
  bundledWebRuntime: false
};

export default config;
