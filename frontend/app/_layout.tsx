// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      {/* Defines the 'index' screen as the initial route */}
      <Stack.Screen name='index' options={{ headerShown: false }} /> 
      {/* Defines the '(screens)' group, hiding its header */}
      <Stack.Screen name='(screens)' options={{ headerShown: false }} />
    </Stack>
  );
}
