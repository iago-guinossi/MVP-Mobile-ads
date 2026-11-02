import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RESOURCES } from '../../api';
import { useAuth } from '../../AuthContext';
import { bottomSpace, colors, font, radius, shadow, spacing } from '../../theme';
import { Button } from '../../components/Button';

const SECTIONS = [
  { key: 'trilhas', href: '/admin/trilhas' },
  { key: 'cachoeiras', href: '/admin/cachoeiras' },
  { key: 'eventos', href: '/admin/eventos' },
  { key: 'temporada', href: '/admin/temporada' },
];

export default function AdminHome() {
  const { logout } = useAuth();

  const exit = async () => {
    await logout();
    router.replace('/mais');
  };

  return (
    <ScrollView contentContainerStyle={[styles.content, bottomSpace]}>
      <Text style={font.body}>Escolha o que deseja gerenciar:</Text>
      <View style={styles.grid}>
        {SECTIONS.map(({ key, href }) => (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={`Gerenciar ${RESOURCES[key].label}`}
            onPress={() => router.push(href)}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
          >
            <Ionicons name={RESOURCES[key].icon} size={32} color={colors.primary} />
            <Text style={styles.cardText}>{RESOURCES[key].label}</Text>
          </Pressable>
        ))}
      </View>
      <Button title="Sair" icon="log-out-outline" variant="outline" onPress={exit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    flexBasis: '45%',
    flexGrow: 1,
    minHeight: 110,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadow,
  },
  cardText: { fontSize: 16, fontWeight: '700', color: colors.text },
});
