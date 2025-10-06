import { Stack } from "expo-router";

export default function CourseLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="settings" />
      <Stack.Screen name="editProfile" />
      <Stack.Screen name="changePassword" />
      <Stack.Screen name="updateProfilePicture" />
    </Stack>
  );
}
