import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', headerShown: false }}>
      {/* Define your modal screens here */}
      <Stack.Screen name="AddPlayer" />
      <Stack.Screen name="Game" />
      {/* Add more modal screens as needed */}
    </Stack>
  );
}