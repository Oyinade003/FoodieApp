import 'react-native-reanimated';
import React from 'react';
import { RecipeProvider } from './src/context/RecipeContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <RecipeProvider>
      <AppNavigator />
    </RecipeProvider>
  );
}