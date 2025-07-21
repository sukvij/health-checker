// app/(screens)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function ScreenLayout() {
  return (
    <Stack>
      {/* Defines the 'login' screen within this group */}
      <Stack.Screen name='login' options={{ title: 'Login' }} />
      {/* Defines the 'signup' screen within this group */}
      <Stack.Screen name='signup' options={{ title: 'Sign Up' }} />
      {/* Defines the 'profile' screen within this group */}
      <Stack.Screen name='profile' options={{ title: 'Profile' }} />
    </Stack>
  );
}
