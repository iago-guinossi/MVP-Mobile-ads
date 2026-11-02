import { ScrollView, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import { bottomSpace, colors, font, radius, spacing } from '../theme';

// Conteúdo estático, o mesmo da página Biodiversidade do site
const PARAGRAPHS = [
  'Teresópolis, localizada na Região Serrana do Rio de Janeiro, é um verdadeiro santuário ecológico. Seus parques naturais abrigam uma das maiores riquezas da Mata Atlântica, um dos biomas mais biodiversos — e ameaçados — do planeta. Entre os destaques estão o Parque Nacional da Serra dos Órgãos, o Parque Estadual dos Três Picos e o Parque Natural Municipal Montanhas de Teresópolis, que juntos formam um corredor ecológico vital para a conservação da fauna e flora da região.',
  'No Parque Natural Montanhas de Teresópolis, por exemplo, é possível encontrar espécies raras como o gato-do-mato-pequeno (Leopardus guttulus), o cachorro-do-mato (Cerdocyon thous) e até a imponente sussuarana (Puma concolor). A avifauna também é um espetáculo à parte, com espécies como o tucano-de-bico-preto, a araponga e o tangará, encantando observadores de aves e pesquisadores.',
  'Já o Parque Estadual dos Três Picos, com seus mais de 65 mil hectares, abriga o maior índice de biodiversidade do estado do Rio de Janeiro. A variação de altitude — que vai de 100 até mais de 2.300 metros — cria microclimas que favorecem a presença de espécies endêmicas e ameaçadas, além de proteger importantes nascentes e cursos d’água.',
  'Esses parques não são apenas refúgios para a vida selvagem, mas também espaços de educação ambiental, lazer e conexão com a natureza. Preservá-los é garantir que futuras gerações possam continuar se encantando com a beleza e a diversidade que fazem de Teresópolis um dos tesouros ecológicos do Brasil.',
];

export default function BiodiversidadeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, bottomSpace]}>
      <Image
        source={require('../../assets/hero.jpg')}
        style={styles.image}
        contentFit="cover"
        accessibilityLabel="Mata Atlântica na Serra dos Órgãos"
      />
      <Text style={font.title} accessibilityRole="header">
        A biodiversidade exuberante dos parques de Teresópolis
      </Text>
      {PARAGRAPHS.map((p, i) => (
        <Text key={i} style={font.body}>
          {p}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  image: { width: '100%', height: 200, borderRadius: radius.md },
});
