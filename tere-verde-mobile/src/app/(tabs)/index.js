import { useState } from 'react';
import { ImageBackground, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { list } from '../../api';
import { useApi } from '../../useApi';
import { bottomSpace, colors, font, radius, spacing } from '../../theme';
import { ContentCard } from '../../components/ContentCard';
import { SearchBar } from '../../components/SearchBar';
import { SectionHeader } from '../../components/SectionHeader';
import { StateView } from '../../components/StateView';
import { Button } from '../../components/Button';

const SHORTCUTS = [
  { label: 'Trilhas', icon: 'trail-sign-outline', href: '/trilhas' },
  { label: 'Cachoeiras', icon: 'water-outline', href: '/cachoeiras' },
  { label: 'Eventos', icon: 'calendar-outline', href: '/eventos' },
  { label: 'Temporada', icon: 'sunny-outline', href: '/temporada' },
  { label: 'Biodiversidade', icon: 'leaf-outline', href: '/biodiversidade' },
  { label: 'Sobre', icon: 'information-circle-outline', href: '/sobre' },
];

async function loadHome() {
  const [trilhas, eventos, cachoeiras] = await Promise.all([list('trilhas'), list('eventos'), list('cachoeiras')]);
  return { trilhas, eventos, cachoeiras };
}

function HorizontalSection({ title, items, resource, badge, seeAll }) {
  if (!items?.length) return null;
  return (
    <>
      <SectionHeader title={title} onSeeAll={() => router.push(seeAll)} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            badge={badge}
            compact
            onPress={() => router.push(`/detalhe/${resource}/${item.id}`)}
          />
        ))}
      </ScrollView>
    </>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { data, error, loading, refreshing, refresh, retry } = useApi(loadHome);

  const search = () => {
    if (query.trim()) router.push({ pathname: '/busca', params: { q: query.trim() } });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={bottomSpace}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
      keyboardShouldPersistTaps="handled"
    >
      <ImageBackground
        source={require('../../../assets/hero.jpg')}
        style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
        accessibilityLabel="Montanhas da Serra dos Órgãos em Teresópolis"
      >
        <View style={styles.heroOverlay} />
        <Image source={require('../../../assets/logo.jpeg')} style={styles.logo} accessibilityLabel="Logo Terê Verde" />
        <View style={styles.heroText}>
          <Text style={styles.heroTitle} accessibilityRole="header">
            Descubra a natureza de Teresópolis
          </Text>
          <Text style={styles.heroSubtitle}>Trilhas, cachoeiras, eventos e muito mais</Text>
        </View>
        <SearchBar value={query} onChangeText={setQuery} onSubmit={search} />
      </ImageBackground>

      <View style={styles.shortcuts}>
        {SHORTCUTS.map((s) => (
          <Pressable
            key={s.label}
            accessibilityRole="button"
            accessibilityLabel={s.label}
            onPress={() => router.push(s.href)}
            style={({ pressed }) => [styles.shortcut, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name={s.icon} size={28} color={colors.primary} />
            <Text style={styles.shortcutText} numberOfLines={1}>
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {!data ? (
        <StateView loading={loading} error={error} onRetry={retry} />
      ) : (
        <>
          <SectionHeader title="Destaques" onSeeAll={() => router.push('/trilhas')} />
          <View style={styles.featured}>
            {data.trilhas.slice(0, 3).map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                badge="Trilha"
                onPress={() => router.push(`/detalhe/trilhas/${item.id}`)}
              />
            ))}
            {!data.trilhas.length && <StateView empty emptyText="Nenhuma trilha cadastrada ainda." />}
          </View>
          <HorizontalSection title="Próximos eventos" items={data.eventos} resource="eventos" badge="Evento" seeAll="/eventos" />
          <HorizontalSection title="Cachoeiras" items={data.cachoeiras} resource="cachoeiras" badge="Cachoeira" seeAll="/cachoeiras" />
        </>
      )}

      <View style={styles.bio}>
        <Text style={font.subtitle}>Biodiversidade de Teresópolis</Text>
        <Text style={font.body}>
          Os parques de Teresópolis abrigam uma das maiores riquezas da Mata Atlântica, um dos biomas mais biodiversos —
          e ameaçados — do planeta.
        </Text>
        <Button title="Saiba mais" variant="outline" onPress={() => router.push('/biodiversidade')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hero: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    minHeight: 340,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  logo: { position: 'absolute', top: 48, left: spacing.md, width: 64, height: 64, borderRadius: 32 },
  heroText: { gap: spacing.xs, marginTop: 80 },
  heroTitle: { color: colors.white, fontSize: 30, fontWeight: '800', lineHeight: 36 },
  heroSubtitle: { color: colors.white, fontSize: 16 },
  shortcuts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  shortcut: {
    flexBasis: '31%',
    flexGrow: 1,
    minHeight: 84,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  shortcutText: { color: colors.primaryDark, fontSize: 13, fontWeight: '600' },
  featured: { paddingHorizontal: spacing.md, gap: spacing.md },
  horizontal: { paddingHorizontal: spacing.md, gap: spacing.md, paddingBottom: spacing.sm },
  bio: {
    margin: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    gap: spacing.md,
  },
});
