import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { list, remove, RESOURCES } from '../../api';
import { useApi } from '../../useApi';
import { confirmAction, firstImage, notify } from '../../utils';
import { bottomSpace, colors, radius, shadow, spacing } from '../../theme';
import { StateView } from '../../components/StateView';
import { Button } from '../../components/Button';

// Lista administrativa de trilhas, cachoeiras ou eventos com editar/excluir
export default function AdminList() {
  const { recurso } = useLocalSearchParams();
  const config = RESOURCES[recurso];
  const { data, error, loading, refreshing, refresh, retry } = useApi(() => list(recurso), [recurso]);
  const [deleting, setDeleting] = useState(null);

  if (!config || recurso === 'temporada') return <StateView error={new Error('Seção não encontrada.')} />;

  const handleDelete = async (item) => {
    const ok = await confirmAction(`Excluir ${config.singular.toLowerCase()}?`, `"${item.name}" será removido(a) permanentemente.`);
    if (!ok) return;
    setDeleting(item.id);
    try {
      await remove(recurso, item.id);
      refresh();
    } catch (err) {
      notify('Não foi possível excluir', err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: config.label }} />
      <FlatList
        data={data || []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.list, bottomSpace]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
        ListHeaderComponent={
          <Button
            title={`Adicionar ${config.singular.toLowerCase()}`}
            icon="add"
            onPress={() => router.push({ pathname: '/admin/form', params: { recurso } })}
          />
        }
        ListEmptyComponent={<StateView loading={loading} error={error} onRetry={retry} empty emptyText="Nada cadastrado ainda." />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={firstImage(item)} style={styles.thumb} contentFit="cover" />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Editar ${item.name}`}
              onPress={() => router.push({ pathname: '/admin/form', params: { recurso, id: item.id } })}
              style={styles.action}
            >
              <Ionicons name="create-outline" size={22} color={colors.primary} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Excluir ${item.name}`}
              onPress={() => handleDelete(item)}
              disabled={deleting === item.id}
              style={styles.action}
            >
              <Ionicons name="trash-outline" size={22} color={deleting === item.id ? colors.textMuted : colors.danger} />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.md, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.sm,
    ...shadow,
  },
  thumb: { width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.primaryLight },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.textMuted },
  action: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
