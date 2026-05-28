import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { COLORS } from './src/components/Theme';
import GermanyBackground from './src/components/GermanyBackground';
import RootNavigator, { navTheme } from './src/navigation/RootNavigator';

import { supabase } from './src/database/supabaseClient';
import { initSupabase } from './src/database/services';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await initSupabase();

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth check error:', error);
          setIsLoggedIn(false);
          return;
        }

        setIsLoggedIn(!!data.session);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoggedIn === null) {
    return (
      <GermanyBackground>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </GermanyBackground>
    );
  }

  return (
    <SafeAreaProvider>
      <GermanyBackground>
        <StatusBar style="light" backgroundColor={COLORS.backgroundDeep} />
        <SafeAreaView style={styles.safeArea}>
          <NavigationContainer key={isLoggedIn ? 'signed-in' : 'signed-out'} theme={navTheme}>
            <RootNavigator isLoggedIn={isLoggedIn} />
          </NavigationContainer>
        </SafeAreaView>
      </GermanyBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
});
