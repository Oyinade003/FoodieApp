import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { CATEGORIES } from '../data/mockRecipes';

export default function CategoryBar({ selected, onSelect }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelect(cat)}
              style={[styles.pill, isActive && styles.pillActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    paddingVertical: 4,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  pillTextActive: {
    color: colors.white,
  },
});