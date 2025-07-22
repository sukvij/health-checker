// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

export default function RootLayout() {
  return (
    // Wrap the entire navigation stack with GestureHandlerRootView
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        {/* Defines the 'index' screen as the initial route */}
        <Stack.Screen name='index' options={{ headerShown: false }} />
        {/* Defines the '(screens)' group, hiding its header */}
        <Stack.Screen name='(screens)' options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
