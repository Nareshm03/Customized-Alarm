import React from 'react';
import { Redirect } from 'expo-router';

// Redirect to the tabs layout as the main entry point
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}