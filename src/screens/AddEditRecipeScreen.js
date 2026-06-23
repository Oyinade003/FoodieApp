import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRecipes } from '../context/RecipeContext';
import { colors } from '../theme/colors';
import { CATEGORIES } from '../data/mockRecipes';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const EMPTY_FORM = {
  name: '',
  category: 'Breakfast',
  image: '',
  prepTime: '',
  servings: '',
  calories: '',
  difficulty: 'Easy',
  ingredients: [''],
  instructions: [''],
};

export default function AddEditRecipeScreen({ route, navigation }) {
  const { recipe } = route.params;
  const isEditing = !!recipe;
  const { addUserRecipe, editUserRecipe } = useRecipes();

  const [form, setForm] = useState(
    isEditing
      ? {
          ...recipe,
          servings: String(recipe.servings),
          calories: String(recipe.calories),
          ingredients: [...recipe.ingredients],
          instructions: [...recipe.instructions],
        }
      : EMPTY_FORM
  );

  // ── Helpers ──
  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const setListItem = (key, index, value) => {
    const updated = [...form[key]];
    updated[index] = value;
    setField(key, updated);
  };

  const addListItem = (key) => setField(key, [...form[key], '']);

  const removeListItem = (key, index) => {
    if (form[key].length === 1) return; // keep at least one row
    setField(key, form[key].filter((_, i) => i !== index));
  };

  // ── Image picker ──
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access to upload an image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setField('image', result.assets[0].uri);
    }
  };

  // ── Validation ──
  const validate = () => {
    if (!form.name.trim()) return 'Recipe name is required.';
    if (!form.image) return 'Please add a photo of your dish.';
    if (!form.prepTime.trim()) return 'Prep time is required.';
    if (!form.servings || isNaN(Number(form.servings))) return 'Enter a valid number of servings.';
    if (!form.calories || isNaN(Number(form.calories))) return 'Enter a valid calorie count.';
    if (form.ingredients.some((i) => !i.trim())) return 'Please fill in all ingredient fields.';
    if (form.instructions.some((s) => !s.trim())) return 'Please fill in all instruction steps.';
    return null;
  };

  // ── Save ──
  const handleSave = () => {
    const error = validate();
    if (error) {
      Alert.alert('Missing info', error);
      return;
    }

    const payload = {
      ...form,
      servings: Number(form.servings),
      calories: Number(form.calories),
      ingredients: form.ingredients.map((i) => i.trim()),
      instructions: form.instructions.map((s) => s.trim()),
    };

    if (isEditing) {
      editUserRecipe({ ...recipe, ...payload });
      Alert.alert('Updated!', 'Your recipe has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      addUserRecipe(payload);
      Alert.alert('Recipe saved!', 'Your recipe is now in My Recipes.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Top nav ── */}
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>
                {isEditing ? '💾  Update' : '💾  Save'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Title ── */}
          <Text style={styles.screenTitle}>
            {isEditing ? 'Edit Recipe' : 'New Recipe'}
          </Text>
          <Text style={styles.screenSubtitle}>
            {isEditing
              ? 'Update your recipe details below.'
              : 'Fill in the details and share your creation.'}
          </Text>

          {/* ── Photo upload ── */}
          <SectionLabel>📸 Dish Photo</SectionLabel>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
            {form.image ? (
              <Image source={{ uri: form.image }} style={styles.imagePreview} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>🖼</Text>
                <Text style={styles.imagePlaceholderText}>Tap to upload a photo</Text>
                <Text style={styles.imagePlaceholderSub}>JPG or PNG · 4:3 ratio</Text>
              </View>
            )}
          </TouchableOpacity>
          {form.image ? (
            <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          ) : null}

          {/* ── Basic info ── */}
          <SectionLabel>📝 Basic Info</SectionLabel>
          <View style={styles.card}>
            <FieldLabel>Recipe Name</FieldLabel>
            <TextInput
              style={styles.input}
              placeholder="e.g. Creamy Garlic Pasta"
              placeholderTextColor={colors.textLight}
              value={form.name}
              onChangeText={(v) => setField('name', v)}
            />

            <FieldLabel>Prep Time</FieldLabel>
            <TextInput
              style={styles.input}
              placeholder="e.g. 30 mins"
              placeholderTextColor={colors.textLight}
              value={form.prepTime}
              onChangeText={(v) => setField('prepTime', v)}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <FieldLabel>Servings</FieldLabel>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 4"
                  placeholderTextColor={colors.textLight}
                  keyboardType="numeric"
                  value={form.servings}
                  onChangeText={(v) => setField('servings', v)}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <FieldLabel>Calories</FieldLabel>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 420"
                  placeholderTextColor={colors.textLight}
                  keyboardType="numeric"
                  value={form.calories}
                  onChangeText={(v) => setField('calories', v)}
                />
              </View>
            </View>
          </View>

          {/* ── Category ── */}
          <SectionLabel>🏷 Category</SectionLabel>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillRow}
          >
            {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, form.category === cat && styles.pillActive]}
                onPress={() => setField('category', cat)}
              >
                <Text style={[styles.pillText, form.category === cat && styles.pillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Difficulty ── */}
          <SectionLabel>📊 Difficulty</SectionLabel>
          <View style={styles.difficultyRow}>
            {DIFFICULTIES.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.difficultyBtn,
                  form.difficulty === d && styles.difficultyBtnActive,
                  d === 'Easy' && form.difficulty === d && { backgroundColor: '#22C55E', borderColor: '#22C55E' },
                  d === 'Medium' && form.difficulty === d && { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
                  d === 'Hard' && form.difficulty === d && { backgroundColor: colors.danger, borderColor: colors.danger },
                ]}
                onPress={() => setField('difficulty', d)}
              >
                <Text style={[
                  styles.difficultyBtnText,
                  form.difficulty === d && { color: colors.white },
                ]}>
                  {d === 'Easy' ? '😊 Easy' : d === 'Medium' ? '😤 Medium' : '🔥 Hard'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Ingredients ── */}
          <SectionLabel>🛒 Ingredients</SectionLabel>
          <View style={styles.card}>
            {form.ingredients.map((item, i) => (
              <View key={i} style={styles.listRow}>
                <View style={styles.listBullet}>
                  <Text style={styles.listBulletText}>{i + 1}</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.listInput]}
                  placeholder={`Ingredient ${i + 1}`}
                  placeholderTextColor={colors.textLight}
                  value={item}
                  onChangeText={(v) => setListItem('ingredients', i, v)}
                />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeListItem('ingredients', i)}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addRowBtn}
              onPress={() => addListItem('ingredients')}
            >
              <Text style={styles.addRowBtnText}>+ Add Ingredient</Text>
            </TouchableOpacity>
          </View>

          {/* ── Instructions ── */}
          <SectionLabel>📋 Instructions</SectionLabel>
          <View style={styles.card}>
            {form.instructions.map((step, i) => (
              <View key={i} style={styles.listRow}>
                <View style={[styles.listBullet, { backgroundColor: colors.primary }]}>
                  <Text style={styles.listBulletText}>{i + 1}</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.listInput, styles.stepInput]}
                  placeholder={`Step ${i + 1}`}
                  placeholderTextColor={colors.textLight}
                  value={step}
                  onChangeText={(v) => setListItem('instructions', i, v)}
                  multiline
                />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeListItem('instructions', i)}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addRowBtn}
              onPress={() => addListItem('instructions')}
            >
              <Text style={styles.addRowBtnText}>+ Add Step</Text>
            </TouchableOpacity>
          </View>

          {/* ── Save button (bottom) ── */}
          <TouchableOpacity style={styles.saveBtnLarge} onPress={handleSave}>
            <Text style={styles.saveBtnLargeText}>
              {isEditing ? '💾  Update Recipe' : '💾  Save Recipe'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Small helper components ──
function SectionLabel({ children }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function FieldLabel({ children }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // ── Nav ──
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },

  // ── Screen title ──
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 24,
  },

  // ── Section labels ──
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
    marginTop: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 4,
    marginTop: 10,
  },

  // ── Image picker ──
  imagePicker: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderIcon: { fontSize: 36 },
  imagePlaceholderText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  imagePlaceholderSub: {
    fontSize: 12,
    color: colors.textLight,
  },
  changePhotoBtn: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  changePhotoText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },

  // ── Card wrapper ──
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Inputs ──
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },

  // ── Category pills ──
  pillRow: {
    gap: 8,
    paddingBottom: 12,
    paddingTop: 2,
  },
  pill: {
    paddingHorizontal: 16,
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

  // ── Difficulty ──
  difficultyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  difficultyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  difficultyBtnActive: {
    borderWidth: 0,
  },
  difficultyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
  },

  // ── Dynamic list rows ──
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  listBullet: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexShrink: 0,
  },
  listBulletText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  listInput: {
    flex: 1,
    marginBottom: 0,
  },
  stepInput: {
    minHeight: 60,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  removeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexShrink: 0,
  },
  removeBtnText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '800',
  },
  addRowBtn: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addRowBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },

  // ── Bottom save button ──
  saveBtnLarge: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnLargeText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
});