import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { list, RESOURCES } from '../api';
import { useApi } from '../useApi';
import { matches } from '../utils';
import { bottomSpace, colors, spacing } from '../theme';
import { ContentCard } from './ContentCard';
import { SearchBar } from './SearchBar';
import { Chips } from './Chips';
import { StateView } from './StateView';

// Listagem pública reutilizada por Trilhas, Cachoeiras e Eventos (busca + filtro por localização)
export function ResourceList({ resource }) {
  const { singular, label } = RESOURCES[resource];
  const { data, error, loading, refreshing, refresh, retry } = useApi(() => list(resource));
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('all');
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 2 : 1;

  const locations = useMemo(() => {
    const unique = new Map();
    (data || []).forEach((item) => {
      const key = item.location?.trim().toLowerCase();
      if (key && !unique.has(key)) unique.set(key, item.location.trim());
    });
    return [{ value: 'all', label: 'Todos' }, ...[...unique].map(([value, text]) => ({ value, label: text }))];
  }, [data]);

  const filtered = (data || []).filter(
    (item) => matches(item, query) && (location === 'all' || item.location?.trim().toLowerCase() === location)
  );

  return (
    <View style={styles.screen}>
      <View style={styles.search}>
        <SearchBar value={query} onChangeText={setQuery} placeholder={`Buscar ${label.toLowerCase()}...`} />
      </View>
      {locations.length > 2 && <Chips options={locations} value={location} onChange={setLocation} />}

      <FlatList
        key={columns}
        numColumns={columns}
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.list, bottomSpace]}
        columnWrapperStyle={columns > 1 ? styles.columns : undefined}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
        ListEmptyComponent={
          <StateView
            loading={loading}
            error={error}
            onRetry={retry}
            empty
            emptyText={query || location !== 'all' ? 'Nenhum resultado para essa busca.' : `Nenhum(a) ${singular.toLowerCase()} cadastrado(a).`}
          />
        }
        renderItem={({ item }) => (
          <ContentCard
            item={item}
            badge={singular}
            style={columns > 1 ? styles.half : undefined}
            onPress={() => router.push(`/detalhe/${resource}/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  search: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  list: { padding: spacing.md, gap: spacing.md, flexGrow: 1 },
  columns: { gap: spacing.md },
  half: { flex: 1 },
});
