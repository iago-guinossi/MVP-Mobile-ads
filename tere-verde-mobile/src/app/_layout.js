import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../AuthContext';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontWeight: '700' },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Início' }} />
        <Stack.Screen name="cachoeiras" options={{ title: 'Cachoeiras' }} />
        <Stack.Screen name="temporada" options={{ title: 'Temporada' }} />
        <Stack.Screen name="biodiversidade" options={{ title: 'Biodiversidade' }} />
        <Stack.Screen name="sobre" options={{ title: 'Sobre o projeto' }} />
        <Stack.Screen name="busca" options={{ title: 'Busca' }} />
        <Stack.Screen name="detalhe/[tipo]/[id]" options={{ headerTransparent: true, title: '' }} />
        <Stack.Screen name="login" options={{ title: 'Área administrativa' }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
