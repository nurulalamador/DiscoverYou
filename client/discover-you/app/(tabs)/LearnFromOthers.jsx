import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, Alert, ToastAndroid } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { serverUrl, timeAgo } from "@/components/constants";
import useAuth from "../authContext";
import Loading from "@/components/common/Loading";
import NotFound from "@/components/common/NotFound";

export default function LearnFromOthersExperience() {
  const { user } = useAuth();
  const router = useRouter();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [empathyRating, setEmpathyRating] = useState(0);
  const [didLearn, setDidLearn] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    loadPublicExperiences();
  }, []);

  const loadPublicExperiences = () => {
    fetch(`${serverUrl}/feed`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setExperiences(data.data || []);
      })
      .catch(err => {
        console.log("Error loading public experiences:", err);
        ToastAndroid.show("Failed to load experiences", ToastAndroid.SHORT);
      })
      .finally(() => setLoading(false));
  };

  const openExperience = (exp) => {
    setSelectedExperience(exp);
    setShowModal(true);
    setEmpathyRating(0);
    setDidLearn(false);
    setNote("");
  };

  const logView = () => {
    if (!selectedExperience) return;

    fetch(`${serverUrl}/feed/${selectedExperience.id}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        dwell_seconds: 30, // placeholder
        did_learn: didLearn,
        empathy_rating: empathyRating,
        note: note || null
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "View logged") {
          ToastAndroid.show("Thank you for learning!", ToastAndroid.SHORT);
          setShowModal(false);
        } else {
          Alert.alert("Error", data.message);
        }
      })
      .catch(err => {
        console.log("Error logging view:", err);
        Alert.alert("Error", "Failed to log view");
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Learn from Others' Experiences</Text>
      <Text style={styles.subHeader}>Understand microaggressions and emotional experiences through shared stories.</Text>
      {experiences.length === 0 ? (
        <NotFound message="No public experiences available yet." />
      ) : (
        <FlatList
          data={experiences}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.experienceBox} onPress={() => openExperience(item)}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.summary} numberOfLines={3}>{item.summary}</Text>
              <View style={styles.meta}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
              </View>
              <Text style={styles.wrongness}>Perceived Wrongness: {item.perceived_wrongness}/10</Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      )}

      {/* Modal for Experience Details */}
      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <ScrollView style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
            <FontAwesome6 name="xmark" size={24} color="#333" />
          </TouchableOpacity>
          {selectedExperience && (
            <>
              <Text style={styles.modalTitle}>{selectedExperience.title}</Text>
              <Text style={styles.modalSummary}>{selectedExperience.summary}</Text>
              <Text style={styles.wrongness}>Perceived Wrongness: {selectedExperience.perceived_wrongness}/10</Text>
              <Text style={styles.sectionTitle}>What did you learn?</Text>
              <TouchableOpacity
                style={[styles.checkbox, didLearn && styles.checkboxChecked]}
                onPress={() => setDidLearn(!didLearn)}
              >
                <FontAwesome6 name={didLearn ? "check-square" : "square"} size={20} color={didLearn ? "#007bff" : "#ccc"} />
                <Text style={styles.checkboxText}>I learned something from this experience</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>Empathy Rating (0-10)</Text>
              <View style={styles.ratingContainer}>
                {[0,1,2,3,4,5,6,7,8,9,10].map((num) => (
                  <TouchableOpacity key={num} onPress={() => setEmpathyRating(num)}>
                    <Text style={[styles.rating, empathyRating === num && styles.ratingSelected]}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.sectionTitle}>Note (optional)</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Share your thoughts..."
                value={note}
                onChangeText={setNote}
                multiline
              />
              <TouchableOpacity style={styles.logButton} onPress={logView}>
                <Text style={styles.logButtonText}>Log My Learning</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  experienceBox: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  summary: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  category: {
    fontSize: 12,
    color: "#999",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  wrongness: {
    fontSize: 12,
    color: "#f00",
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  modalSummary: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxChecked: {
    // additional style if needed
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  rating: {
    fontSize: 18,
    margin: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  ratingSelected: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    height: 80,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  logButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});