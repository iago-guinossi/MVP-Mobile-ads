import { ActivityIndicator, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../AuthContext';
import { colors } from '../../theme';

// Toda a área /admin exige login; sem token válido o usuário volta para a tela de login
export default function AdminLayout() {
  const { ready, isLogged } = useAuth();

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }
  if (!isLogged) return <Redirect href="/login" />;

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.surface },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Painel administrativo' }} />
      <Stack.Screen name="temporada" options={{ title: 'Editar temporada' }} />
      <Stack.Screen name="form" options={{ title: 'Cadastro' }} />
    </Stack>
  );
}
