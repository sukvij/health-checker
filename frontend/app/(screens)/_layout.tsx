// app/screen/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function ScreenLayout() {
  return (
    <Stack>
        <Stack.Screen name='login' />
        <Stack.Screen name='signup' />
    </Stack>
  );
}