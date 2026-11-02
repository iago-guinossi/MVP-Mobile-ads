import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, font, spacing } from '../theme';

export function SectionHeader({ title, onSeeAll }) {
  return (
    <View style={styles.row}>
      <Text style={font.subtitle} accessibilityRole="header">
        {title}
      </Text>
      {onSeeAll && (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Ver todos: ${title}`}
          onPress={onSeeAll}
          style={styles.link}
          hitSlop={8}
        >
          <Text style={styles.linkText}>Ver todos</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  link: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 44 },
  linkText: { color: colors.primary, fontWeight: '600' },
});
