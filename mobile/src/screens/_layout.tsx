/**
 * Real Me Scanner - Root Stack Layout
 * Dark-themed navigation with animated transitions
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors, typography } from '../constants';

const HEADER_STYLE = {
  backgroundColor: colors.dark[800],
  shadowColor: colors.neon.blue,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4,
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors.border,
};

const HEADER_TITLE_STYLE = {
  color: colors.text.primary,
  fontFamily: 'SpaceGrotesk-SemiBold',
  fontSize: typography.fontSize.lg,
};

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: HEADER_STYLE,
        headerTitleStyle: HEADER_TITLE_STYLE,
        headerTintColor: colors.neon.blue,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        contentStyle: styles.content,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      {/* Splash / Welcome — no header */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />

      {/* Auth screens */}
      <Stack.Screen
        name="login"
        options={{
          title: 'Sign In',
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Create Account',
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />

      {/* Main app screens */}
      <Stack.Screen
        name="home"
        options={{
          title: 'Real Me',
          headerShown: false,
          animation: 'fade',
        }}
      />

      {/* Scan flow */}
      <Stack.Screen
        name="scan-guide"
        options={{
          title: 'Scan Guide',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerStyle: {
            ...HEADER_STYLE,
            backgroundColor: colors.dark[900],
          },
        }}
      />
      <Stack.Screen
        name="body-scan"
        options={{
          title: 'Body Scan',
          headerShown: false,
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="face-scan"
        options={{
          title: 'Face Scan',
          headerShown: false,
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="scan-processing"
        options={{
          title: 'Processing',
          headerShown: false,
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="scan-results"
        options={{
          title: 'Your Results',
          animation: 'slide_from_bottom',
          headerStyle: {
            ...HEADER_STYLE,
            backgroundColor: colors.dark[900],
          },
        }}
      />

      {/* Profile & Settings */}
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.background,
  },
});
