import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, shadow, spacing } from '../theme';

export function SearchBar({ value, onChangeText, onSubmit, placeholder = 'Buscar trilhas, eventos, lugares...' }) {
  return (
    <View style={styles.bar}>
      <Ionicons name="search" size={20} color={colors.textMuted} />
      <TextInput
        accessibilityLabel="Campo de busca"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        style={styles.input}
      />
      {!!value && (
        <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" onPress={() => onChangeText('')} hitSlop={12}>
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: spacing.sm },
});
