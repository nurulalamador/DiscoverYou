import { serverUrl } from "@/components/constants";
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from "react-native";
import useAuth from "../authContext";
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import styles from "@/components/styles/SettingStyles";

export default function Others() {
  const { user, setIsAuthenticated } = useAuth();

  const router = useRouter();

  function handleLogout() {
    fetch(`${serverUrl}/auth/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log("Login response data:", data);
        if (data.success) {
          setIsAuthenticated(false);
        }
      })
      .catch(error => {
        console.error("Login error:", error);
        // setErrorMessage("Something went wrong. Please try again.");
      });
  }

  return (
    <ScrollView>
      <View style={styles.gap}></View>
      <View style={styles.profileSection}>
        {
          user?.profile_picture_url ?
            <Image
              source={{ uri: serverUrl + user.profile_picture_url }}
              style={styles.profilePicture}
              contentFit="cover"
            /> :
            <View style={styles.pseudoProfilePicture}>
              <Text style={styles.pseudoProfilePictureText}>{user.full_name[0]}</Text>
            </View>
        }
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{user.full_name}</Text>
          <Text style={styles.profileUsername}>@{user.username}</Text>
          <TouchableOpacity style={styles.viewProfileButton} 
            onPress={() => router.push({
              pathname: "/(other)/profile",
              params: {personId: user.id}
            })}
          >
            <Text style={styles.viewProfileButtonText}>View Profile</Text>
            <FontAwesome6 name="chevron-right" style={styles.viewProfileButtonIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome6 name="file" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>My Resume</Text>
        </TouchableOpacity>
        <View style={styles.divider}></View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(setting)/settings")}
        >
          <FontAwesome6 name="gear" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        <View style={styles.divider}></View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(other)/leaderboard")}
        >
          <FontAwesome6 name="list-ol" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Leaderboard</Text>
        </TouchableOpacity>
        <View style={styles.divider}></View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <FontAwesome6 name="right-from-bracket" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gap}></View>
    </ScrollView>
  );
}