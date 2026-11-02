import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from '../api';
import { colors, radius, spacing } from '../theme';

const warn = (message) => (Platform.OS === 'web' ? window.alert(message) : Alert.alert('Imagem inválida', message));

// Cada item é { src, rawSrc } (foto já salva na API) ou { src, asset } (foto nova escolhida no aparelho)
export function ImagePickerField({ images, onChange, max = 5, label = 'Fotos', error }) {
  const pick = async () => {
    // A galeria só é aberta quando o administrador toca em "Adicionar foto"
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: max - images.length > 1,
      selectionLimit: max - images.length,
      quality: 0.8,
    });
    if (result.canceled) return;

    const valid = [];
    for (const asset of result.assets) {
      if (asset.mimeType && !IMAGE_TYPES.includes(asset.mimeType)) {
        warn('Use imagens JPG, PNG ou WEBP.');
        continue;
      }
      if (asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES) {
        warn('Cada imagem deve ter no máximo 5 MB.');
        continue;
      }
      valid.push({ src: asset.uri, asset });
    }
    onChange([...images, ...valid].slice(0, max));
  };

  const removeAt = (index) => onChange(images.filter((_, i) => i !== index));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label} ({images.length}/{max})
      </Text>
      <View style={styles.grid}>
        {images.map((img, index) => (
          <View key={img.src + index} style={styles.thumbWrapper}>
            <Image source={img.src} style={styles.thumb} contentFit="cover" accessibilityLabel={`Foto ${index + 1}`} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remover foto ${index + 1}`}
              onPress={() => removeAt(index)}
              style={styles.remove}
              hitSlop={8}
            >
              <Ionicons name="close" size={16} color={colors.white} />
            </Pressable>
          </View>
        ))}
        {images.length < max && (
          <Pressable accessibilityRole="button" accessibilityLabel="Adicionar foto" onPress={pick} style={styles.add}>
            <Ionicons name="add" size={28} color={colors.primary} />
            <Text style={styles.addText}>Adicionar</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.hint}>JPG, PNG ou WEBP, até 5 MB cada.</Text>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  thumbWrapper: { width: 96, height: 96, borderRadius: radius.sm, overflow: 'hidden' },
  thumb: { width: '100%', height: '100%' },
  remove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    width: 96,
    height: 96,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  hint: { fontSize: 12, color: colors.textMuted },
  error: { color: colors.danger, fontSize: 13 },
});
