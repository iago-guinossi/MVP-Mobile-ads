import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { list, RESOURCES } from '../api';
import { useApi } from '../useApi';
import { matches } from '../utils';
import { bottomSpace, colors, font, spacing } from '../theme';
import { SearchBar } from '../components/SearchBar';
import { ContentCard } from '../components/ContentCard';
import { StateView } from '../components/StateView';

const TYPES = ['trilhas', 'cachoeiras', 'eventos'];

async function loadAll() {
  const results = await Promise.all(TYPES.map((t) => list(t)));
  return Object.fromEntries(TYPES.map((t, i) => [t, results[i]]));
}

// Busca em trilhas, cachoeiras e eventos ao mesmo tempo
export default function BuscaScreen() {
  const params = useLocalSearchParams();
  const [query, setQuery] = useState(params.q || '');
  const { data, error, loading, retry } = useApi(loadAll);

  const groups = data
    ? TYPES.map((t) => ({ type: t, items: data[t].filter((item) => matches(item, query)) })).filter((g) => g.items.length)
    : [];

  return (
    <View style={styles.screen}>
      <View style={styles.search}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, bottomSpace]} keyboardShouldPersistTaps="handled">
        {!data ? (
          <StateView loading={loading} error={error} onRetry={retry} />
        ) : !query.trim() ? (
          <StateView empty emptyText="Digite o nome de uma trilha, cachoeira, evento ou lugar." />
        ) : !groups.length ? (
          <StateView empty emptyText={`Nada encontrado para "${query}".`} />
        ) : (
          groups.map((g) => (
            <View key={g.type} style={{ gap: spacing.md }}>
              <Text style={font.subtitle}>
                {RESOURCES[g.type].label} ({g.items.length})
              </Text>
              {g.items.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  badge={RESOURCES[g.type].singular}
                  onPress={() => router.push(`/detalhe/${g.type}/${item.id}`)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  search: { padding: spacing.md },
  content: { padding: spacing.md, paddingTop: 0, gap: spacing.lg },
});
