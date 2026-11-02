import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, radius } from '../theme';

// Mapa do Google Maps (URL de incorporação salva pela API) — versão para Android/iOS
export function MapEmbed({ url, title, height = 260 }) {
  if (!url) return null;
  return (
    <View style={[styles.box, { height }]} accessibilityLabel={`Mapa de ${title}`}>
      <WebView
        source={{ uri: url }}
        style={styles.map}
        nestedScrollEnabled
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.primaryLight },
  map: { flex: 1, backgroundColor: colors.primaryLight },
});
