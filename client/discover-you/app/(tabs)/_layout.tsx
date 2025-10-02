import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: ({ route }) => (
          <View style={styles.header}>
            <Text style={styles.title}>{getTitle(route.name)}</Text>
            <View style={styles.icons}>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome6 name="magnifying-glass" size={20} color="rgba(0,0,0,0.6)" solid/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome6 name="comment" size={20} color="rgba(0,0,0,0.6)" solid/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome6 name="bell" size={20} color="rgba(0,0,0,0.6)" solid/>
              </TouchableOpacity>
            </View>
          </View>
        ),
        tabBarStyle: {
          height: 72,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFFFFF",
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 6,
        },
        tabBarActiveTintColor: "#ff6600",
        tabBarInactiveTintColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && <View style={styles.activeIndicator} />}
              <FontAwesome6 name="house" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Event"
        options={{
          title: "Event",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && <View style={styles.activeIndicator} />}
              <FontAwesome6 name="calendar-alt" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Course"
        options={{
          title: "Course",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && <View style={styles.activeIndicator} />}
              <FontAwesome6 name="book" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Showcase"
        options={{
          title: "Showcase",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && <View style={styles.activeIndicator} />}
              <FontAwesome6 name="photo-film" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Hiring"
        options={{
          title: "Hiring",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && <View style={styles.activeIndicator} />}
              <FontAwesome6 name="user-tie" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Others"
        options={{
          title: "Others",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && <View style={styles.activeIndicator} />}
              <FontAwesome6 name="bars" size={size} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const getTitle = (name: string) => {
  switch (name) {
    case "index":
      return "Home";
    default:
      return name;
  }
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
    // elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.8)",
  },
  icons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    padding: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIndicator: {
    width: 50,
    height: 5,
    backgroundColor: "#ff6600",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: "absolute",
    top: -14, // adjust to match your tab bar height
  },
});
