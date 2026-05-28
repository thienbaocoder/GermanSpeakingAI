import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Core Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import PracticeScreen from '../screens/PracticeScreen';
import EvaluationScreen from '../screens/EvaluationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReviewScreen from '../screens/ReviewScreen';
import VocabularyScreen from '../screens/VocabularyScreen';
import WritingScreen from '../screens/WritingScreen';
import WritingHistoryScreen from '../screens/WritingHistoryScreen';
import WritingResultScreen from '../screens/WritingResultScreen';
import GrammarScreen from '../screens/GrammarScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminTopicsScreen from '../screens/admin/AdminTopicsScreen';
import AdminVocabularyScreen from '../screens/admin/AdminVocabularyScreen';
import AdminWritingScreen from '../screens/admin/AdminWritingScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminGrammarScreen from '../screens/admin/AdminGrammarScreen';

import { COLORS } from '../components/Theme';

const Stack = createStackNavigator();

const navTheme = {
  dark: true,
  colors: {
    primary: COLORS.primary,
    background: 'transparent',
    card: 'transparent',
    text: COLORS.text,
    border: COLORS.glassBorder,
    notification: COLORS.secondary,
  },
};

export default function RootNavigator({ isLoggedIn }) {
  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'Home' : 'Login'}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        gestureEnabled: true,
      }}
    >
      {/* Auth Stack */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      {/* App Stack */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Practice" component={PracticeScreen} />
      <Stack.Screen name="Evaluation" component={EvaluationScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
      <Stack.Screen name="Writing" component={WritingScreen} />
      <Stack.Screen name="WritingHistory" component={WritingHistoryScreen} />
      <Stack.Screen name="WritingResult" component={WritingResultScreen} />
      <Stack.Screen name="Grammar" component={GrammarScreen} />

      {/* Admin Stack */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminTopics" component={AdminTopicsScreen} />
      <Stack.Screen name="AdminVocabulary" component={AdminVocabularyScreen} />
      <Stack.Screen name="AdminWriting" component={AdminWritingScreen} />
      <Stack.Screen name="AdminGrammar" component={AdminGrammarScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
    </Stack.Navigator>
  );
}

export { navTheme };
