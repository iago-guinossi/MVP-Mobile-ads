import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { useAuth } from '../AuthContext';
import { bottomSpace, colors, font, spacing } from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function LoginScreen() {
  const { login, isLogged } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isLogged) return <Redirect href="/admin" />;

  const submit = async () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Informe um e-mail válido.';
    if (!password) next.password = 'Informe a senha.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
      setPassword('');
      router.replace('/admin');
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, bottomSpace]} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/logo.jpeg')} style={styles.logo} accessibilityLabel="Logo Terê Verde" />
        <Text style={[font.title, styles.center]}>Entrar</Text>
        <Text style={[font.small, styles.center]}>Acesso restrito aos administradores do Terê Verde.</Text>

        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="admin@exemplo.com"
          error={errors.email}
        />
        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          placeholder="Sua senha"
          onSubmitEditing={submit}
          error={errors.password}
        />
        {errors.form && (
          <Text style={styles.formError} accessibilityLiveRegion="polite">
            {errors.form}
          </Text>
        )}
        <Button title="Entrar" icon="log-in-outline" onPress={submit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, maxWidth: 480, width: '100%', alignSelf: 'center' },
  logo: { width: 96, height: 96, borderRadius: 48, alignSelf: 'center', marginTop: spacing.lg },
  center: { textAlign: 'center' },
  formError: { color: colors.danger, textAlign: 'center' },
});
