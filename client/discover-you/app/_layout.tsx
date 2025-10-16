import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useAuth, { AuthProvider } from "./authContext";
import { serverUrl } from "../components/constants";
import { Stack, useRouter, useSegments } from "expo-router";
import Loading from "@/components/common/Loading";

function RootLayoutInner() {
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    function checkAuth() {
      fetch(`${serverUrl}/auth`, {
        method: "GET",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          setIsAuthenticated(data.isAuthenticate);
          setUser(data.user);
        })
        .catch(function (err) {
          console.log("Auth check failed:", err);
          setIsAuthenticated(false);
        })
        .finally(function () {
          setLoading(false);
        });
    }
    checkAuth();
  }, []);

  // Handle navigation based on auth state changes
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      // User is authenticated but in auth screens, redirect to tabs
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated but not in auth screens, redirect to login
      router.replace("/(auth)/welcome"); // Change this to your actual auth screen name
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={{ flex: 1 }}>
        {isAuthenticated ? (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
          </Stack>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}