import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { bottomSpace, colors, font, radius, spacing } from '../theme';

const TEAM = ['Iago Lima Guinossi', 'Wesley de Souza Freire'];

export default function SobreScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, bottomSpace]}>
      <Image source={require('../../assets/logo.jpeg')} style={styles.logo} accessibilityLabel="Logo Terê Verde" />
      <Text style={font.title} accessibilityRole="header">
        Circuito Terê Verde
      </Text>
      <Text style={font.body}>
        Teresópolis é cercada por três unidades de conservação: o Parque Nacional da Serra dos Órgãos, o Parque
        Estadual dos Três Picos e o Parque Natural Municipal Montanhas de Teresópolis. Elas fazem da cidade um destino
        de ecoturismo, com trilhas, escaladas, cachoeiras e muita biodiversidade.
      </Text>
      <Text style={font.body}>
        O Terê Verde Online reúne informações atualizadas sobre trilhas, cachoeiras, eventos e temporadas desses
        espaços protegidos, para que visitantes explorem as belezas naturais de Teresópolis de forma consciente.
      </Text>

      <View style={styles.box}>
        <Text style={font.subtitle}>Objetivos</Text>
        <Text style={font.body}>• Divulgar o ecoturismo e a biodiversidade da região.</Text>
        <Text style={font.body}>• Manter informações sempre atualizadas pelos administradores.</Text>
        <Text style={font.body}>• Oferecer uma navegação simples, no celular ou no computador.</Text>
      </View>

      <View style={styles.box}>
        <Text style={font.subtitle}>Equipe — UNIFESO</Text>
        {TEAM.map((name) => (
          <Text key={name} style={font.body}>
            {name}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  logo: { width: 96, height: 96, borderRadius: 48, alignSelf: 'center' },
  box: { backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs },
});
