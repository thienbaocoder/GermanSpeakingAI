import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

// Themes & Screens
import { COLORS } from './src/components/Theme';
import GermanyBackground from './src/components/GermanyBackground';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import EvaluationScreen from './src/screens/EvaluationScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import VocabularyScreen from './src/screens/VocabularyScreen';
import WritingScreen from './src/screens/WritingScreen';
import WritingHistoryScreen from './src/screens/WritingHistoryScreen';
import WritingResultScreen from './src/screens/WritingResultScreen';
import { getCurrentUser } from './src/utils/storage';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
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
          <NavigationContainer theme={navTheme}>
            <Stack.Navigator 
              initialRouteName={isLoggedIn ? 'Home' : 'Login'}
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: 'transparent' },
                gestureEnabled: true,
              }}
            >
              {/* Auth Stack - Always registered */}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              
              {/* App Stack - Always registered */}
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Practice" component={PracticeScreen} />
              <Stack.Screen name="Evaluation" component={EvaluationScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Review" component={ReviewScreen} />
              <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
              <Stack.Screen name="Writing" component={WritingScreen} />
              <Stack.Screen name="WritingHistory" component={WritingHistoryScreen} />
              <Stack.Screen name="WritingResult" component={WritingResultScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </GermanyBackground>
    </SafeAreaProvider>
  );
}

// Custom navigation theme mapping to maintain consistent dark mode styling
const navTheme = {
  dark: true,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.text,
    border: COLORS.glassBorder,
    notification: COLORS.secondary,
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
