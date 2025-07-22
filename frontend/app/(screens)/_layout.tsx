// app/(screens)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function ScreenLayout() {
  return (
    <Stack>
      <Stack.Screen name='login' options={{ title: 'Login' }} />
      <Stack.Screen name='signup' options={{ title: 'Sign Up' }} />
      <Stack.Screen name='profile' options={{ title: 'Profile' }} />
      {/* New Screens Added */}
      <Stack.Screen name='dashboard' options={{ title: 'Dashboard' }} />
      <Stack.Screen name='report_form' options={{ title: 'Submit Report' }} />
      <Stack.Screen name='report_list' options={{ title: 'My Reports' }} />
      <Stack.Screen name='chat_ai' options={{ title: 'AI Chat' }} />
    </Stack>
  );
}
