import { serverUrl } from "@/components/constants";
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from "react-native";
import useAuth from "../authContext";
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Image } from "expo-image";

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
            onPress={() => router.push("/(other)/profile")}
          >
            <Text style={styles.viewProfileButtonText}>View Profile</Text>
            <FontAwesome6 name="chevron-right" style={styles.viewProfileButtonIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome6 name="store" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Marketplace</Text>
        </TouchableOpacity>
        <View style={styles.divider}></View>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome6 name="note-sticky" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Smart Notes</Text>
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

const styles = StyleSheet.create({
  gap: {
    height: 8
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginVertical: 6,
    marginHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    padding: 8
  },
  divider: {
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    marginVertical: 4,
    width: "95%",
    marginHorizontal: 'auto'
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  menuItemIcon: {
    fontSize: 18,
    color: "rgba(0,0,0,0.6)",
    width: 30,
    textAlign: "center",
    marginRight: 12
  },
  menuItemText: {
    fontSize: 15,
    color: "rgba(0,0,0,0.8)",
    fontWeight: 500
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    marginHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 14
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.2)",
    margin: 16
  },
  pseudoProfilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },
  pseudoProfilePictureText: {
    fontSize: 40,
    color: 'rgba(0,0,0,0.6)'
  },
  profileDetails: {
    flex: 1
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileUsername: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 2
  },
  viewProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6
  },
  viewProfileButtonText: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: "600",
  },
  viewProfileButtonIcon: {
    fontSize: 14,
    color: '#FF6600',
    marginLeft: 6
  }
});