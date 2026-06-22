import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import FeedScreen from '../screens/FeedScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MyRecipesScreen from '../screens/MyRecipesScreen';
import AddEditRecipeScreen from '../screens/AddEditRecipeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="MyRecipes" component={MyRecipesScreen} />
        <Stack.Screen name="AddEditRecipe" component={AddEditRecipeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}