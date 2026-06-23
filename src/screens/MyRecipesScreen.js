import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useRecipes } from '../context/RecipeContext';
import { colors } from '../theme/colors';

export default function MyRecipesScreen({ navigation }) {
  const { userRecipes, deleteUserRecipe } = useRecipes();

  const handleDelete = (recipe) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteUserRecipe(recipe.id),
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>My Recipes</Text>
          <Text style={styles.subtitle}>
            {userRecipes.length === 0
              ? 'Your creations will appear here.'
              : `${userRecipes.length} recipe${userRecipes.length > 1 ? 's' : ''} added`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddEditRecipe', { recipe: null })}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnIcon}>+</Text>
          <Text style={styles.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>👨‍🍳</Text>
      <Text style={styles.emptyTitle}>No recipes yet</Text>
      <Text style={styles.emptySubtitle}>
        Share your favorite dishes with the world. Add your first recipe to get started.
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => navigation.navigate('AddEditRecipe', { recipe: null })}
      >
        <Text style={styles.emptyBtnText}>+ Add Your First Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Image */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {/* Difficulty tag */}
        <View style={[
          styles.difficultyTag,
          item.difficulty === 'Easy' && { backgroundColor: '#22C55E' },
          item.difficulty === 'Medium' && { backgroundColor: '#F59E0B' },
          item.difficulty === 'Hard' && { backgroundColor: colors.danger },
        ]}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⏱ {item.prepTime}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>🍽 {item.servings} servings</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>🔥 {item.calories} cal</Text>
        </View>

        {/* Counts */}
        <View style={styles.countsRow}>
          <View style={styles.countItem}>
            <Text style={styles.countNumber}>{item.ingredients.length}</Text>
            <Text style={styles.countLabel}>Ingredients</Text>
          </View>
          <View style={styles.countDivider} />
          <View style={styles.countItem}>
            <Text style={styles.countNumber}>{item.instructions.length}</Text>
            <Text style={styles.countLabel}>Steps</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
            activeOpacity={0.8}
          >
            <Text style={styles.viewBtnText}>View Recipe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('AddEditRecipe', { recipe: item })}
            activeOpacity={0.8}
          >
            <Text style={styles.editBtnText}>✏️ Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteBtnText}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <FlatList
        data={userRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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
    paddingBottom: 8,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },

  // ── Recipe card ──
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
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
  cardBody: {
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  categoryChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    flexShrink: 0,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: colors.textLight,
  },
  metaDot: {
    color: colors.border,
    fontSize: 12,
  },

  // ── Counts ──
  countsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    alignItems: 'center',
  },
  countItem: {
    flex: 1,
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  countLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  countDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },

  // ── Action buttons ──
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  viewBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  editBtn: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  editBtnText: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.text,
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 15,
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
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});