// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' />
      <Stack.Screen name='(screens)' options={{headerShown: false}}/>
    </Stack>
  );
}