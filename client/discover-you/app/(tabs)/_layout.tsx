import { Tabs, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ToastAndroid, Alert, LogBox } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { use, useEffect, useState } from "react";
import { categories, getCategoryIcon, serverUrl } from "@/components/constants";
import useAuth from "../authContext";
import { io } from "socket.io-client";

export default function TabsLayout() {
  const { user, setUser, updateMessage, setUpdateMessage } = useAuth();
  const router = useRouter();

  const [unseenMessages, setUnseenMessages] = useState(0);



  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  // Categories not selected yet
  const unselected = categories.filter((cat) => !selected.includes(cat));

  const handleSelect = (category: string) => {
    setSelected((prev) => {
      if (prev.length >= 3) {
        ToastAndroid.show("You can select up to 3 categories only.", ToastAndroid.SHORT);
        return prev;
      }
      return [...prev, category];
    });
  };

  const handleRemove = (category: string) => {
    setSelected((prev) => prev.filter((item) => item !== category));
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      ToastAndroid.show("Please select at least one category.", ToastAndroid.SHORT);
      return;
    }
    fetch(`${serverUrl}/profile/setInterest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ interests: selected }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShowCategoryModal(false);
          setUser((oldData: any) => ({
            ...oldData,
            interests: selected
          }));
        }
      })
      .catch(function (err) {
        console.log("Course data fetching failed:", err);
      })
      .finally(function () {

      });
  }

  const socket = io(serverUrl);


  useEffect(() => {
    if (user.interests.length == 0) {
      setShowCategoryModal(true);
    }

  }, []);



  useEffect(() => {
    function loadData() {
      fetch(`${serverUrl}/profile/initialData`, {
        method: "GET",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          setUnseenMessages(data.total_unseen_messages || 0);
        })
        .catch(function (err) {
          console.log("Initial data fetching failed:", err);
        });
    }
    loadData();
  }, [updateMessage]);

  useEffect(() => {
    // Register user on socket connection
    socket.emit("register", user.id);

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setUpdateMessage((prev: any) => prev + 1);
    });

    socket.on("register_request", (data) => {
      socket.emit("register", user.id);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <>
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Your Interests</Text>


            <Text style={styles.modalSectionTitle}>Selected Interests</Text>
            {selected.length === 0 ? (
              <View style={styles.emptyCategory}>

                <Text style={styles.emptyCategoryText}>No category selected</Text>
              </View>
            ) : (
              <View style={styles.categoryContainer}>
                {
                  selected.map((category) => (
                    <View key={category} style={styles.category}>
                      <FontAwesome6 name={getCategoryIcon(category)} style={styles.categoryIcon} solid />
                      <Text style={styles.categoryText}>{category}</Text>
                      <TouchableOpacity style={styles.categoryDelete} onPress={() => handleRemove(category)}>
                        <FontAwesome6 name="xmark" style={styles.categoryDeleteIcon} />
                      </TouchableOpacity>
                    </View>
                  ))
                }
              </View>
            )}

            {/* ✅ Unselected Categories */}
            <Text style={styles.modalSectionTitle}>Choose Interests</Text>
            <FlatList
              contentContainerStyle={styles.categoryContainer}
              data={unselected}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.category} onPress={() => handleSelect(item)}>
                  <FontAwesome6 name={getCategoryIcon(item)} style={styles.categoryIcon} solid />

                  <Text numberOfLines={1} style={styles.categoryText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.modalChoiceButton}>
              <Text style={styles.modalChoiceButtonText}>Set Your Interests</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Tabs
        screenOptions={{
          header: ({ route }) => (
            <View style={route.name == "Event" ? styles.header : [styles.header, styles.headerBorder]}>
              <Text style={styles.title}>{getTitle(route.name)}</Text>
              <View style={styles.icons}>
                <TouchableOpacity style={styles.iconButton}
                  onPress={()=>{
                    router.push("/(other)/search")
                  }}
                >
                  <FontAwesome6 name="magnifying-glass" size={20} color="rgba(0,0,0,0.6)" solid />
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
          name="TrackRecords"
          options={{
            title: "My Records",
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{ alignItems: "center" }}>
                {focused && <View style={styles.activeIndicator} />}
                <FontAwesome6 name="chart-line" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="LearnFromOthers"
          options={{
            title: "Learn",
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{ alignItems: "center" }}>
                {focused && <View style={styles.activeIndicator} />}
                <FontAwesome6 name="graduation-cap" size={size} color={color} />
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
    </>
  );
}

const getTitle = (name: string) => {
  switch (name) {
    case "index":
      return "Home";
    case "TrackRecords":
      return "Track Records";
    case "LearnFromOthers":
      return "Learn from Others";
    default:
      return name;
  }
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // elevation: 6,
  },
  headerBorder: {
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
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
    position: "relative"
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
  unseenBox: {
    backgroundColor: "#FF6600",
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginHorizontal: 4,
    marginBottom: 4,
    position: "absolute",
    top: -6,
    right: -6,
    zIndex: 10
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 14,
    width: 330,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    height: 500
  },
  modalChoiceButton: {
    marginTop: 10,
    backgroundColor: "#ff6600",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  modalChoiceButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    margin: 6,
    textAlign: "center",
    color: "rgba(0,0,0,0.8)"
  },
  category: {
    backgroundColor: "rgba(255, 102, 0, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
    maxWidth: '100%',
    margin: 4
  },
  categoryText: {
    color: "#FF6600",
    fontWeight: "bold",
    fontSize: 12
  },
  categoryIcon: {
    fontSize: 14,
    color: "#FF6600"
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: "auto",
    alignItems: "center",
  },
  categoryDelete: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: "#FF6600",
    alignItems: "center",
    justifyContent: "center"
  },
  categoryDeleteIcon: {
    color: "rgba(255,255,255,0.8)"
  },
  modalSectionTitle: {
    marginBottom: 8,
    marginTop: 12,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.6)",
    fontSize: 16,
    textAlign: "center"
  },
  emptyCategory: {
    margin: 6,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: "center"
  },
  emptyCategoryText: {
    color: "rgba(0,0,0,0.6)",
    fontSize: 14
  }
});
