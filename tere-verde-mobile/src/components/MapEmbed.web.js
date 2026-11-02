import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';

// Mapa do Google Maps — versão web (o WebView não existe no navegador, então usa um iframe)
export function MapEmbed({ url, title, height = 260 }) {
  if (!url) return null;
  return (
    <View style={[styles.box, { height }]}>
      <iframe
        src={url}
        title={`Mapa de ${title}`}
        style={{ border: 0, width: '100%', height: '100%' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.primaryLight },
});
