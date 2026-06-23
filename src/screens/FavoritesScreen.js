import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRecipes } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { colors } from '../theme/colors';

export default function FavoritesScreen({ navigation }) {
  const { recipes, favorites, toggleFavorite } = useRecipes();

  const favoriteRecipes = recipes.filter((r) => favorites.includes(r.id));

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.titleRow}>
        <Text style={styles.title}>My Favorites</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{favoriteRecipes.length}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        {favoriteRecipes.length > 0
          ? 'Your saved recipes, all in one place.'
          : 'Recipes you favorite will appear here.'}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🤍</Text>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>
        Browse recipes and tap the Favorite button to save them here.
      </Text>
      <TouchableOpacity
        style={styles.browseBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.browseBtnText}>Browse Recipes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <FlatList
        data={favoriteRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <RecipeCard
              recipe={item}
              onPress={() =>
                navigation.navigate('RecipeDetail', { recipeId: item.id })
              }
            />
            {/* Quick unfavorite strip */}
            <TouchableOpacity
              style={styles.unfavRow}
              onPress={() => toggleFavorite(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.unfavText}>♥  Remove from Favorites</Text>
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingBottom: 40,
  },

  // ── Header ──
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  countBadgeText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },

  // ── Quick unfavorite ──
  unfavRow: {
    marginHorizontal: 16,
    marginTop: -10,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  unfavText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.danger,
  },

  // ── Empty state ──
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 28,
  },
  browseBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 12,
  },
  browseBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});