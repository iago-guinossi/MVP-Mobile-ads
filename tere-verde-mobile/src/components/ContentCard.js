import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, shadow, spacing } from '../theme';
import { firstImage, parseEventDate } from '../utils';

function Meta({ icon, text }) {
  if (!text) return null;
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} size={14} color={colors.textMuted} />
      <Text style={styles.metaText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

// Cartão de trilha, cachoeira ou evento: imagem, selo, título e informações resumidas
export function ContentCard({ item, badge, onPress, compact, style }) {
  const date = item.date ? parseEventDate(item.date) : null;
  const image = firstImage(item);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${badge ? badge + ': ' : ''}${item.name}`}
      accessibilityHint="Abre os detalhes"
      onPress={onPress}
      style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed, style]}
    >
      <View>
        {image ? (
          <Image
            source={image}
            style={[styles.image, compact && styles.imageCompact]}
            contentFit="cover"
            transition={200}
            accessibilityLabel={`Foto de ${item.name}`}
          />
        ) : (
          <View style={[styles.image, compact && styles.imageCompact, styles.placeholder]}>
            <Ionicons name="image-outline" size={32} color={colors.primary} />
          </View>
        )}
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        {date && (
          <View style={styles.dateBadge}>
            <Text style={styles.dateDays}>{date.days}</Text>
            <Text style={styles.dateMonth}>{date.month}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.metaRow}>
            <Meta icon="footsteps-outline" text={item.distance} />
            {!date && <Meta icon="calendar-outline" text={item.date} />}
            <Meta icon="location-outline" text={item.location} />
          </View>
        </View>
        {!compact && <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.md, overflow: 'hidden', ...shadow },
  compact: { width: 240 },
  pressed: { opacity: 0.85 },
  image: { width: '100%', height: 150, backgroundColor: colors.primaryLight },
  imageCompact: { height: 120 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  body: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  info: { flex: 1, gap: spacing.xs },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  metaRow: { gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText: { flex: 1, fontSize: 13, color: colors.textMuted },
  dateBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    minWidth: 56,
  },
  dateDays: { color: colors.white, fontWeight: '700', fontSize: 15 },
  dateMonth: { color: colors.white, fontSize: 12, fontWeight: '600' },
});
