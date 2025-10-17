import { Stack } from "expo-router";

export default function WebinarLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="details" />
    </Stack>
  );
}
