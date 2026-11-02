import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { appendImage, list, save } from '../../api';
import { useApi } from '../../useApi';
import { notify } from '../../utils';
import { bottomSpace, spacing } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ImagePickerField } from '../../components/ImagePickerField';
import { StateView } from '../../components/StateView';

// Como no site, existe uma única temporada: edita a primeira ou cria se não houver
export default function AdminTemporada() {
  const [text, setText] = useState(null);
  const [images, setImages] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const { data, error: loadError, loading, retry } = useApi(() =>
    list('temporada').then((items) => {
      const current = items[0] || null;
      setText((t) => t ?? current?.text ?? '');
      setImages((i) => i ?? (current?.image ? [{ src: current.image, rawSrc: current.rawImage }] : []));
      return { current };
    })
  );

  if (!data) return <StateView loading={loading} error={loadError} onRetry={retry} />;
  const current = data.current;

  const submit = async () => {
    if (!text?.trim()) {
      setError('Escreva o texto da temporada.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('text', text.trim());
      const newImage = images.find((img) => img.asset);
      if (newImage) await appendImage(formData, 'image', newImage.asset);
      await save('temporada', current?.id, formData);
      notify('Temporada salva!');
      if (router.canGoBack()) router.back();
      else router.replace('/admin');
    } catch (err) {
      if (err.status === 401) router.replace('/login');
      else notify('Não foi possível salvar', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.content, bottomSpace]} keyboardShouldPersistTaps="handled">
      <Input label="Texto" value={text} onChangeText={setText} multiline error={error} placeholder="Descreva a temporada atual" />
      <ImagePickerField label="Banner" images={images} onChange={setImages} max={1} />
      <Button title="Salvar temporada" icon="checkmark" onPress={submit} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.md },
});
