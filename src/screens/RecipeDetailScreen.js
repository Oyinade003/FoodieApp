import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRecipes } from '../context/RecipeContext';
import { colors } from '../theme/colors';

const META_ITEMS = (recipe) => [
  { icon: '⏱', label: 'Prep Time', value: recipe.prepTime },
  { icon: '🍽', label: 'Servings',  value: `${recipe.servings}` },
  { icon: '🔥', label: 'Calories',  value: `${recipe.calories}` },
  { icon: '📊', label: 'Difficulty', value: recipe.difficulty },
];

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const { recipes, favorites, toggleFavorite } = useRecipes();

  const recipe = recipes.find((r) => r.id === recipeId);
  const isFav = favorites.includes(recipeId);

  const handleFavorite = useCallback(() => {
    toggleFavorite(recipeId);
  }, [recipeId, toggleFavorite]);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorState}>
          <Text style={styles.errorIcon}>🍽</Text>
          <Text style={styles.errorTitle}>Recipe not found</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* ── Hero Image ── */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Gradient overlay so nav buttons are always readable */}
          <View style={styles.heroOverlay} />

          {/* Nav buttons floating over image */}
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.navBtnText}>← Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, styles.favBtn, isFav && styles.favBtnActive]}
              onPress={handleFavorite}
              activeOpacity={0.8}
            >
              <Text style={[styles.navBtnText, isFav && styles.favBtnActiveText]}>
                {isFav ? '♥  Saved' : '♡  Favorite'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category chip over image */}
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{recipe.category}</Text>
          </View>
        </View>

        {/* ── Content Card ── */}
        <View style={styles.contentCard}>

          {/* Title */}
          <Text style={styles.recipeName}>{recipe.name}</Text>

          {/* Meta grid */}
          <View style={styles.metaGrid}>
            {META_ITEMS(recipe).map((item) => (
              <View key={item.label} style={styles.metaBox}>
                <Text style={styles.metaIcon}>{item.icon}</Text>
                <Text style={styles.metaValue}>{item.value}</Text>
                <Text style={styles.metaLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Ingredients ── */}
          <Section title="Ingredients" emoji="🛒">
            {recipe.ingredients.map((ingredient, i) => (
              <View key={i} style={styles.ingredientRow}>
                <View style={styles.ingredientBullet} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </Section>

          {/* ── Instructions ── */}
          <Section title="Instructions" emoji="📋">
            {recipe.instructions.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </Section>

          {/* Bottom spacer */}
          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Reusable section wrapper ── */
function Section({ title, emoji, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEmoji}>{emoji}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },

  // ── Hero ──
  heroContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  navRow: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 16 : 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  navBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  favBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  favBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  favBtnActiveText: {
    color: colors.white,
  },
  categoryChip: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryChipText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.4,
  },

  // ── Content Card ──
  contentCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  recipeName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
    lineHeight: 32,
  },

  // ── Meta grid ──
  metaGrid: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  metaBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 20,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  metaLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
  },

  // ── Sections ──
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionEmoji: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: colors.border,
    borderRadius: 1,
    marginBottom: 14,
  },

  // ── Ingredients ──
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  ingredientBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 5,
    flexShrink: 0,
  },
  ingredientText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },

  // ── Instructions ──
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumberText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 23,
  },

  // ── Error state ──
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorIcon: { fontSize: 48 },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});