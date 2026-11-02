import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../AuthContext';
import { bottomSpace, colors, radius, spacing } from '../../theme';

function MenuItem({ icon, label, onPress, color = colors.text }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && { backgroundColor: colors.surface }]}
    >
      <Ionicons name={icon} size={22} color={color === colors.text ? colors.primary : color} />
      <Text style={[styles.itemText, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

export default function MaisScreen() {
  const { isLogged, logout } = useAuth();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, bottomSpace]}>
      <Text style={styles.section}>Explorar</Text>
      <View style={styles.group}>
        <MenuItem icon="water-outline" label="Cachoeiras" onPress={() => router.push('/cachoeiras')} />
        <MenuItem icon="sunny-outline" label="Temporada" onPress={() => router.push('/temporada')} />
        <MenuItem icon="leaf-outline" label="Biodiversidade" onPress={() => router.push('/biodiversidade')} />
        <MenuItem icon="search-outline" label="Buscar conteúdos" onPress={() => router.push('/busca')} />
        <MenuItem icon="information-circle-outline" label="Sobre o projeto" onPress={() => router.push('/sobre')} />
      </View>

      <Text style={styles.section}>Administração</Text>
      <View style={styles.group}>
        {isLogged ? (
          <>
            <MenuItem icon="construct-outline" label="Painel administrativo" onPress={() => router.push('/admin')} />
            <MenuItem icon="log-out-outline" label="Sair" color={colors.danger} onPress={logout} />
          </>
        ) : (
          <MenuItem icon="lock-closed-outline" label="Entrar como administrador" onPress={() => router.push('/login')} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.md, gap: spacing.sm },
  section: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginTop: spacing.md },
  group: { backgroundColor: colors.white, borderRadius: radius.md, overflow: 'hidden' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  itemText: { flex: 1, fontSize: 16 },
});
