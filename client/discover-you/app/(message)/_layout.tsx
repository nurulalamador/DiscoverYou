import { Stack } from "expo-router";

export default function CourseLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="messages" />
      <Stack.Screen name="inbox" />
      <Stack.Screen name="browse" />
      <Stack.Screen name="community" />
      <Stack.Screen name="newCommunity" />
    </Stack>
  );
}
