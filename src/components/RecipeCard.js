import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { useRecipes } from '../context/RecipeContext';

export default function RecipeCard({ recipe, onPress }) {
  const { favorites } = useRecipes();
  const isFav = favorites.includes(recipe.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: recipe.image }}
        style={styles.image}
        resizeMode="cover"
      />
      {/* Favorite badge */}
      {isFav && (
        <View style={styles.favBadge}>
          <Text style={styles.favBadgeText}>♥</Text>
        </View>
      )}
      {/* Difficulty tag */}
      <View style={[
        styles.difficultyTag,
        recipe.difficulty === 'Easy' && { backgroundColor: '#22C55E' },
        recipe.difficulty === 'Medium' && { backgroundColor: '#F59E0B' },
        recipe.difficulty === 'Hard' && { backgroundColor: colors.danger },
      ]}>
        <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{recipe.name}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>⏱ {recipe.prepTime}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>🍽 {recipe.servings} servings</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>🔥 {recipe.calories} cal</Text>
        </View>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{recipe.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  favBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favBadgeText: {
    color: colors.primary,
    fontSize: 16,
  },
  difficultyTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  info: {
    padding: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: colors.textLight,
  },
  metaDot: {
    color: colors.border,
    fontSize: 12,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
});