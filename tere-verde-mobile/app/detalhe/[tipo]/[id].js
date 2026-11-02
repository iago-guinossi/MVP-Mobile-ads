import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getOne, RESOURCES } from '../../../api';
import { useApi } from '../../../useApi';
import { firstImage } from '../../../utils';
import { bottomSpace, colors, font, radius, spacing } from '../../../theme';
import { StateView } from '../../../components/StateView';
import { Gallery } from '../../../components/Gallery';
import { MapEmbed } from '../../../components/MapEmbed';

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// Detalhe genérico de trilha, cachoeira ou evento
export default function DetailScreen() {
  const { tipo, id } = useLocalSearchParams();
  const config = RESOURCES[tipo];
  const { data: item, error, loading, retry } = useApi(() => getOne(tipo, id), [tipo, id]);
  const [tab, setTab] = useState('sobre');
  const { height } = useWindowDimensions();

  if (!config || !item) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerTransparent: false, title: config?.singular || '', headerTintColor: colors.primary }} />
        <StateView loading={!!config && loading} error={config ? error : new Error('Conteúdo não encontrado.')} onRetry={retry} />
      </View>
    );
  }

  const cover = firstImage(item);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={bottomSpace}>
      <Stack.Screen options={{ headerTransparent: true, title: '', headerTintColor: colors.white }} />
      <View style={[styles.hero, { height: Math.min(380, height * 0.45) }]}>
        {cover ? (
          <Image source={cover} style={styles.cover} contentFit="cover" accessibilityLabel={`Foto de ${item.name}`} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.primaryDark }]} />
        )}
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{config.singular}</Text>
          </View>
          <Text style={styles.title} accessibilityRole="header">
            {item.name}
          </Text>
          {[
            ['footsteps-outline', item.distance],
            ['calendar-outline', item.date],
            ['location-outline', item.location],
          ]
            .filter(([, value]) => value)
            .map(([icon, value]) => (
              <View key={icon} style={styles.heroMetaRow}>
                <Ionicons name={icon} size={16} color={colors.white} />
                <Text style={styles.heroMeta}>{value}</Text>
              </View>
            ))}
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.tabs} accessibilityRole="tablist">
          {[
            { key: 'sobre', label: 'Sobre' },
            { key: 'fotos', label: `Fotos (${item.images?.length || 0})` },
          ].map((t) => (
            <Pressable
              key={t.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t.key }}
              onPress={() => setTab(t.key)}
              style={[styles.tab, tab === t.key && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'sobre' ? (
          <View style={{ gap: spacing.lg }}>
            <Text style={font.body}>{item.summary || 'Sem descrição cadastrada.'}</Text>
            <View>
              <Text style={[font.subtitle, { marginBottom: spacing.sm }]}>Informações</Text>
              <InfoRow icon="footsteps-outline" label="Distância" value={item.distance} />
              <InfoRow icon="calendar-outline" label="Data" value={item.date} />
              <InfoRow icon="location-outline" label="Local" value={item.location} />
            </View>
            {item.mapUrl && (
              <View>
                <Text style={[font.subtitle, { marginBottom: spacing.sm }]}>Localização no mapa</Text>
                <MapEmbed url={item.mapUrl} title={item.name} />
              </View>
            )}
          </View>
        ) : (
          <Gallery images={item.images} title={item.name} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', backgroundColor: colors.background },
  hero: { justifyContent: 'flex-end', overflow: 'hidden' },
  cover: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  heroContent: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.xs },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  title: { color: colors.white, fontSize: 28, fontWeight: '800' },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heroMeta: { flex: 1, color: colors.white, fontSize: 15 },
  sheet: {
    marginTop: -spacing.lg,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, minHeight: 48 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '600' },
  tabTextActive: { color: colors.primary },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: { color: colors.textMuted, fontSize: 14 },
  infoValue: { flex: 1, textAlign: 'right', color: colors.text, fontSize: 14, fontWeight: '600' },
});
