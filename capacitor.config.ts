import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'tech.illuminatiai.mahabharatkatha',
  appName: 'Mahabharat Katha',
  webDir: 'dist',
  android: { allowMixedContent: false },
  plugins: {
    SplashScreen: { launchShowDuration: 800, backgroundColor: '#7a1f1f', showSpinner: false },
    StatusBar: { style: 'DARK', backgroundColor: '#7a1f1f' }
  }
}

export default config
