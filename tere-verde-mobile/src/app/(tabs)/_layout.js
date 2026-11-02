import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme';

const icon = (name) =>
  function TabIcon({ color, focused }) {
    return <Ionicons name={focused ? name : `${name}-outline`} size={24} color={color} />;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: { minHeight: 60 },
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', headerShown: false, tabBarIcon: icon('home') }} />
      <Tabs.Screen name="trilhas" options={{ title: 'Trilhas', tabBarIcon: icon('trail-sign') }} />
      <Tabs.Screen name="eventos" options={{ title: 'Eventos', tabBarIcon: icon('calendar') }} />
      <Tabs.Screen name="mais" options={{ title: 'Mais', tabBarIcon: icon('menu') }} />
    </Tabs>
  );
}
