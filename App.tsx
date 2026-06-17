import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';
import {initDatabase, getUser} from './src/database';
import {initI18n} from './src/locales/i18n';
import {useUserStore} from './src/store/userStore';
import {useModuleStore} from './src/store/moduleStore';
import AppNavigator from './src/navigation/AppNavigator';
import {Colors, FontFamily, FontSize} from './src/theme';

function BootLoader() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {loadUser} = useUserStore();
  const {loadModules} = useModuleStore();

  useEffect(() => {
    async function boot() {
      try {
        await initDatabase();

        const user = await getUser();
        const savedLang = user?.language ?? undefined;
        initI18n(savedLang);

        await Promise.all([loadUser(), loadModules()]);

        setReady(true);
      } catch (e) {
        console.error('Boot error', e);
        setError(String(e));
      } finally {
        // Hide the native splash now that the UI is ready.
        BootSplash.hide({fade: true}).catch(() => {});
      }
    }
    boot();
  }, []);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!ready) {
    return <View style={styles.splash} />;
  }

  return <AppNavigator />;
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.textPrimary,
    border: Colors.border,
    primary: Colors.terracotta,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <BootLoader />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.error,
    textAlign: 'center',
  },
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
