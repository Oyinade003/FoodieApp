import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockRecipes } from '../data/mockRecipes';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [favorites, setFavorites] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      const savedUserRecipes = await AsyncStorage.getItem('userRecipes');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedUserRecipes) {
        const parsed = JSON.parse(savedUserRecipes);
        setUserRecipes(parsed);
        setRecipes([...mockRecipes, ...parsed]);
      }
    } catch (e) {
      console.error('Failed to load data', e);
    }
  };

  const toggleFavorite = async (recipeId) => {
    const updated = favorites.includes(recipeId)
      ? favorites.filter(id => id !== recipeId)
      : [...favorites, recipeId];
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const addUserRecipe = async (recipe) => {
    const newRecipe = { ...recipe, id: Date.now().toString(), isUserRecipe: true };
    const updated = [...userRecipes, newRecipe];
    setUserRecipes(updated);
    setRecipes([...mockRecipes, ...updated]);
    await AsyncStorage.setItem('userRecipes', JSON.stringify(updated));
  };

  const editUserRecipe = async (updatedRecipe) => {
    const updated = userRecipes.map(r =>
      r.id === updatedRecipe.id ? updatedRecipe : r
    );
    setUserRecipes(updated);
    setRecipes([...mockRecipes, ...updated]);
    await AsyncStorage.setItem('userRecipes', JSON.stringify(updated));
  };

  const deleteUserRecipe = async (recipeId) => {
    const updated = userRecipes.filter(r => r.id !== recipeId);
    const updatedFavs = favorites.filter(id => id !== recipeId);
    setUserRecipes(updated);
    setFavorites(updatedFavs);
    setRecipes([...mockRecipes, ...updated]);
    await AsyncStorage.setItem('userRecipes', JSON.stringify(updated));
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavs));
  };

  return (
    <RecipeContext.Provider value={{
      recipes,
      favorites,
      userRecipes,
      toggleFavorite,
      addUserRecipe,
      editUserRecipe,
      deleteUserRecipe,
    }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipeContext);