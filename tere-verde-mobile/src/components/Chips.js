import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../theme';

// Linha horizontal de filtros; a opção selecionada fica destacada em verde
export function Chips({ options, value, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Filtrar: ${option.label}`}
            onPress={() => onChange(option.value)}
            style={[styles.chip, selected && styles.selected]}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Sem isso a lista abaixo "esmaga" a linha de filtros e os botões ficam cortados
  scroll: { flexGrow: 0, flexShrink: 0 },
  row: { gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, alignItems: 'center' },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.text, fontSize: 14 },
  textSelected: { color: colors.white, fontWeight: '600' },
});
