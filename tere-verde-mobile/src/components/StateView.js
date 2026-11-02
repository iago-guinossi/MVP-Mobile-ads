import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, spacing } from '../theme';
import { Button } from './Button';

// Estados padronizados de carregamento, erro e lista vazia
export function StateView({ loading, error, empty, emptyText = 'Nenhum conteúdo encontrado.', onRetry }) {
  if (loading) {
    return (
      <View style={styles.container} accessibilityLabel="Carregando">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Carregando...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
        <Text style={styles.text}>{error.message || 'Algo deu errado.'}</Text>
        {onRetry && <Button title="Tentar novamente" icon="refresh" variant="outline" onPress={onRetry} />}
      </View>
    );
  }
  if (empty) {
    return (
      <View style={styles.container}>
        <Ionicons name="leaf-outline" size={48} color={colors.textMuted} />
        <Text style={styles.text}>{emptyText}</Text>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  text: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
});
