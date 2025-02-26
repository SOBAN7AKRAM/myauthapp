// app/_layout.tsx
import { Slot } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  // This file is the root layout. Expo Router automatically wraps your app in a NavigationContainer.
  return <Slot />;
}
