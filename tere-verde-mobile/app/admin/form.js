import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { appendImage, FIELD_LABELS, getOne, RESOURCES, save } from '../../api';
import { extractMapUrl, notify } from '../../utils';
import { bottomSpace, colors, font, spacing } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ImagePickerField } from '../../components/ImagePickerField';
import { StateView } from '../../components/StateView';
import { MapEmbed } from '../../components/MapEmbed';

const PLACEHOLDERS = {
  name: 'Ex.: Pedra do Sino',
  location: 'Ex.: Parque Nacional da Serra dos Órgãos',
  distance: 'Ex.: 4,5 km',
  date: 'Ex.: 14 a 16 de Agosto 2025',
  summary: 'Conte um pouco sobre o lugar ou evento',
};

// Formulário de cadastro/edição (trilhas, cachoeiras e eventos)
export default function AdminForm() {
  const { recurso, id } = useLocalSearchParams();
  const config = RESOURCES[recurso];
  const [values, setValues] = useState({});
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!!id);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOne(recurso, id)
      .then((item) => {
        setValues({ ...Object.fromEntries(config.fields.map((f) => [f, item[f] || ''])), map: item.mapUrl || '' });
        setImages(item.images || []);
      })
      .catch(setLoadError)
      .finally(() => setLoading(false));
  }, [recurso, id, config]);

  if (!config?.fields) return <StateView error={new Error('Seção não encontrada.')} />;
  if (loading || loadError) return <StateView loading={loading} error={loadError} />;

  const setField = (field) => (text) => {
    setValues((v) => ({ ...v, [field]: text }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const submit = async () => {
    const next = {};
    config.fields.forEach((f) => {
      if (!values[f]?.trim()) next[f] = `Preencha o campo ${FIELD_LABELS[f].toLowerCase()}.`;
    });
    if (!images.length) next.images = 'Adicione pelo menos uma foto.';
    // O mapa é opcional, mas se preenchido precisa ser o HTML de incorporação do Google Maps
    if (extractMapUrl(values.map) === undefined) {
      next.map = 'Cole o HTML de incorporação do Google Maps (Compartilhar → Incorporar um mapa).';
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      const formData = new FormData();
      config.fields.forEach((f) => formData.append(f, values[f].trim()));
      // Sempre enviado: vazio remove o mapa; a API recorta a URL do HTML
      formData.append('map', (values.map || '').trim());
      // Fotos já salvas que devem continuar (as que não forem enviadas são apagadas pela API)
      images.filter((img) => img.rawSrc).forEach((img) => formData.append('imagesMantidas', img.rawSrc));
      for (const img of images.filter((i) => i.asset)) {
        await appendImage(formData, 'images', img.asset);
      }
      await save(recurso, id, formData);
      notify(id ? 'Alterações salvas!' : 'Cadastro realizado!');
      if (router.canGoBack()) router.back();
      else router.replace(`/admin/${recurso}`);
    } catch (err) {
      if (err.status === 401) router.replace('/login');
      else notify('Não foi possível salvar', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: `${id ? 'Editar' : 'Adicionar'} ${config.singular.toLowerCase()}` }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {config.fields.map((f) => (
          <Input
            key={f}
            label={FIELD_LABELS[f]}
            value={values[f] || ''}
            onChangeText={setField(f)}
            placeholder={PLACEHOLDERS[f]}
            multiline={f === 'summary'}
            error={errors[f]}
          />
        ))}
        <View style={styles.mapField}>
          <Input
            label="Mapa (HTML do Google Maps) — opcional"
            value={values.map || ''}
            onChangeText={setField('map')}
            placeholder='<iframe src="https://www.google.com/maps/embed?..."></iframe>'
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.map}
          />
          <Text style={font.small}>No Google Maps: Compartilhar → Incorporar um mapa → Copiar HTML. Deixe vazio para não exibir mapa.</Text>
          <MapEmbed url={extractMapUrl(values.map)} title={values.name || 'local'} height={200} />
        </View>
        <ImagePickerField
          images={images}
          onChange={(next) => {
            setImages(next);
            setErrors((e) => ({ ...e, images: undefined }));
          }}
          max={config.maxImages}
          error={errors.images}
        />
        <Button title={id ? 'Salvar alterações' : 'Cadastrar'} icon="checkmark" onPress={submit} loading={saving} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, gap: spacing.md, backgroundColor: colors.surface, ...bottomSpace },
  mapField: { gap: spacing.sm },
});
