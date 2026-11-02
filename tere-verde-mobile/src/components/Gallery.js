import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, spacing } from '../theme';

// Miniaturas das fotos; ao tocar abre em tela cheia com deslize horizontal
export function Gallery({ images, title }) {
  const [openIndex, setOpenIndex] = useState(null);
  const { width, height } = useWindowDimensions();

  if (!images?.length) {
    return <Text style={styles.empty}>Nenhuma foto cadastrada.</Text>;
  }

  return (
    <>
      <View style={styles.grid}>
        {images.map((img, index) => (
          <Pressable
            key={img.id ?? index}
            accessibilityRole="imagebutton"
            accessibilityLabel={`Abrir foto ${index + 1} de ${images.length}`}
            onPress={() => setOpenIndex(index)}
            style={styles.thumbWrapper}
          >
            <Image source={img.src} style={styles.thumb} contentFit="cover" transition={150} />
          </Pressable>
        ))}
      </View>

      <Modal visible={openIndex !== null} transparent animationType="fade" onRequestClose={() => setOpenIndex(null)}>
        <View style={styles.modal}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            initialScrollIndex={openIndex ?? 0}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            keyExtractor={(img, i) => String(img.id ?? i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Image
                source={item.src}
                style={{ width, height: height * 0.8 }}
                contentFit="contain"
                accessibilityLabel={`${title} — foto ${index + 1}`}
              />
            )}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar galeria"
            onPress={() => setOpenIndex(null)}
            style={styles.close}
          >
            <Ionicons name="close" size={28} color={colors.white} />
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  empty: { color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  thumbWrapper: { width: '31%', aspectRatio: 1, borderRadius: radius.sm, overflow: 'hidden' },
  thumb: { width: '100%', height: '100%', backgroundColor: colors.primaryLight },
  modal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center' },
  close: {
    position: 'absolute',
    top: 48,
    right: spacing.md,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
