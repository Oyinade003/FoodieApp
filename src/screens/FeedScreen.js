import React, { useState, useMemo } from 'react';
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
import CategoryBar from '../components/CategoryBar';
import RecipeCard from '../components/RecipeCard';
import { colors } from '../theme/colors';

export default function FeedScreen({ navigation }) {
  const { recipes } = useRecipes();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return recipes;
    return recipes.filter(r => r.category === selectedCategory);
  }, [recipes, selectedCategory]);

  const renderHeader = () => (
    <>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.title}>What are you{'\n'}cooking today?</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.iconBtnText}>♥</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, styles.iconBtnOutline]}
            onPress={() => navigation.navigate('MyRecipes')}
          >
            <Text style={[styles.iconBtnText, { color: colors.primary }]}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{recipes.length}</Text>
          <Text style={styles.statLabel}>Recipes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filtered.length}</Text>
          <Text style={styles.statLabel}>Showing</Text>
        </View>
        <View style={styles.statDivider} />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('MyRecipes')}
        >
          <Text style={styles.addBtnText}>+ Add Recipe</Text>
        </TouchableOpacity>
      </View>

      {/* Category Bar */}
      <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'All Recipes' : selectedCategory}
        </Text>
        <Text style={styles.sectionCount}>{filtered.length} found</Text>
      </View>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🍽</Text>
      <Text style={styles.emptyTitle}>No recipes here yet</Text>
      <Text style={styles.emptySubtitle}>
        Try a different category or add your own recipe.
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => navigation.navigate('MyRecipes')}
      >
        <Text style={styles.emptyBtnText}>Add a Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
          />
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 32,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnOutline: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  iconBtnText: {
    fontSize: 16,
    color: colors.white,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  addBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    marginLeft: 8,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});