// app/(tabs)/_layout.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
          }}
          
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Ionicons name="home-sharp" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="leaderboard"
            options={{
              title: 'Leaderboard',
              tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="players"
            options={{
              title: 'Players',
              tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              title: 'History',
              tabBarIcon: ({ color }) => <Ionicons name="basketball" size={24} color={color} />,
            }}
          />
        </Tabs>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}