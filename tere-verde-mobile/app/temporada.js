import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { list } from '../api';
import { useApi } from '../useApi';
import { bottomSpace, colors, font, radius, spacing } from '../theme';
import { StateView } from '../components/StateView';

export default function TemporadaScreen() {
  const { data, error, loading, refreshing, refresh, retry } = useApi(() => list('temporada'));
  const temporada = data?.[0];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, bottomSpace]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
    >
      <Text style={font.title} accessibilityRole="header">
        Temporada atual
      </Text>
      {!temporada ? (
        <StateView loading={loading} error={error} onRetry={retry} empty emptyText="Nenhuma temporada cadastrada." />
      ) : (
        <View style={{ gap: spacing.md }}>
          {temporada.image && (
            <Image
              source={temporada.image}
              style={styles.image}
              contentFit="cover"
              transition={200}
              accessibilityLabel="Banner da temporada atual"
            />
          )}
          <Text style={font.body}>{temporada.text}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  image: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.md, backgroundColor: colors.primaryLight },
});
