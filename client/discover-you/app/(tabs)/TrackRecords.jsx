import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, Alert, ToastAndroid } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { serverUrl, timeAgo } from "@/components/constants";
import useAuth from "../authContext";
import Loading from "@/components/common/Loading";
import NotFound from "@/components/common/NotFound";
import { Audio } from 'expo-av';
import Svg, { Circle, Line, Text as SvgText, Rect } from 'react-native-svg';
import React from 'react';

export default function TrackRecordsOfMine() {
  const { user } = useAuth();
  const router = useRouter();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [showAddEmotion, setShowAddEmotion] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);
  const [emotionLabel, setEmotionLabel] = useState("");
  const [emotionIntensity, setEmotionIntensity] = useState("");
  const [emotionNote, setEmotionNote] = useState("");
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Audio recording permission is required');
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });
    })();
  }, []);

  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri);
    setRecording(null);
  };

  const playAudio = async (uri) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  };

  const MindMap = ({ experience, emotions, assessments }) => {
    return (
      <Svg height="600" width="400">
        {/* Center Node */}
        <Rect x="150" y="250" width="100" height="50" fill="#007bff" rx="10" />
        <SvgText x="200" y="280" textAnchor="middle" fill="#fff" fontSize="12">{experience.title}</SvgText>

        {/* Event Branch */}
        <Line x1="200" y1="275" x2="100" y2="200" stroke="#000" strokeWidth="2" />
        <Rect x="50" y="180" width="100" height="40" fill="#28a745" rx="5" />
        <SvgText x="100" y="200" textAnchor="middle" fill="#fff" fontSize="10">Event</SvgText>
        <SvgText x="100" y="220" textAnchor="middle" fill="#000" fontSize="8">{experience.event_date || 'N/A'}</SvgText>

        {/* Emotions Branch */}
        <Line x1="200" y1="275" x2="300" y2="200" stroke="#000" strokeWidth="2" />
        <Rect x="250" y="180" width="100" height="40" fill="#ffc107" rx="5" />
        <SvgText x="300" y="200" textAnchor="middle" fill="#000" fontSize="10">Emotions ({emotions.length})</SvgText>
        {emotions.slice(0, 3).map((emo, i) => (
          <React.Fragment key={emo.id}>
            <Line x1="300" y1="200" x2="350" y2={150 + i * 30} stroke="#000" strokeWidth="1" />
            <Circle cx="360" cy={150 + i * 30} r="15" fill="#ffc107" />
            <SvgText x="360" y={155 + i * 30} textAnchor="middle" fill="#000" fontSize="8">{emo.label}</SvgText>
          </React.Fragment>
        ))}

        {/* Assessments Branch */}
        <Line x1="200" y1="275" x2="200" y2="150" stroke="#000" strokeWidth="2" />
        <Rect x="150" y="130" width="100" height="40" fill="#dc3545" rx="5" />
        <SvgText x="200" y="150" textAnchor="middle" fill="#fff" fontSize="10">Assessments ({assessments.length})</SvgText>
        {assessments.slice(0, 2).map((ass, i) => (
          <React.Fragment key={ass.id}>
            <Line x1="200" y1="150" x2="200" y2={100 + i * 30} stroke="#000" strokeWidth="1" />
            <Rect x="170" y={85 + i * 30} width="60" height="20" fill="#dc3545" rx="3" />
            <SvgText x="200" y={95 + i * 30} textAnchor="middle" fill="#fff" fontSize="6">Dep: {ass.depression_score}</SvgText>
          </React.Fragment>
        ))}
      </Svg>
    );
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = () => {
    fetch(`${serverUrl}/experiences/mine`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setExperiences(data.data || []);
      })
      .catch(err => {
        console.log("Error loading experiences:", err);
        ToastAndroid.show("Failed to load experiences", ToastAndroid.SHORT);
      })
      .finally(() => setLoading(false));
  };

  const openExperience = (exp) => {
    setSelectedExperience(exp);
    setShowModal(true);
    loadEmotions(exp.id);
    loadAssessments(exp.id);
  };

  const loadEmotions = (expId) => {
    fetch(`${serverUrl}/experiences/${expId}/emotions`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setEmotions(data.data || []);
      })
      .catch(err => console.log("Error loading emotions:", err));
  };

  const loadAssessments = (expId) => {
    fetch(`${serverUrl}/experiences/${expId}/assessments`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setAssessments(data.data || []);
      })
      .catch(err => console.log("Error loading assessments:", err));
  };

  const addEmotion = () => {
    if (!emotionLabel.trim() || !emotionIntensity.trim()) {
      Alert.alert("Error", "Label and intensity are required");
      return;
    }
    const intensity = parseFloat(emotionIntensity);
    if (isNaN(intensity) || intensity < 0 || intensity > 10) {
      Alert.alert("Error", "Intensity must be between 0 and 10");
      return;
    }

    fetch(`${serverUrl}/experiences/${selectedExperience.id}/emotions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        label: emotionLabel,
        intensity,
        note: emotionNote || null
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Emotion entry added") {
          ToastAndroid.show("Emotion added", ToastAndroid.SHORT);
          setEmotionLabel("");
          setEmotionIntensity("");
          setEmotionNote("");
          setShowAddEmotion(false);
          loadEmotions(selectedExperience.id);
        } else {
          Alert.alert("Error", data.message);
        }
      })
      .catch(err => {
        console.log("Error adding emotion:", err);
        Alert.alert("Error", "Failed to add emotion");
      });
  };

  const createAssessment = () => {
    fetch(`${serverUrl}/experiences/${selectedExperience.id}/assessments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type: "self_checkin" })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Assessment created") {
          ToastAndroid.show("Assessment created", ToastAndroid.SHORT);
          loadAssessments(selectedExperience.id);
        } else {
          Alert.alert("Error", data.message);
        }
      })
      .catch(err => {
        console.log("Error creating assessment:", err);
        Alert.alert("Error", "Failed to create assessment");
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Experiences</Text>
      {experiences.length === 0 ? (
        <NotFound message="No experiences yet. Start sharing your experiences!" />
      ) : (
        <FlatList
          data={experiences}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.experienceBox} onPress={() => openExperience(item)}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
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
      {/* Modal for Experience Details */}
<Modal
  visible={showModal}
  animationType="slide"
  onRequestClose={() => setShowModal(false)}
>
  <ScrollView style={styles.modalContainer}>
    <View style={styles.modalHeader}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
        <FontAwesome6 name="xmark" size={24} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mindMapButton}
        onPress={() => setShowMindMap((prev) => !prev)}
      >
        <FontAwesome6 name="diagram-project" size={18} color="#007bff" />
        <Text style={styles.mindMapButtonText}>
          {showMindMap ? "Show Details" : "Show Mind Map"}
        </Text>
      </TouchableOpacity>
    </View>

    {!selectedExperience ? (
      <NotFound message="No experience selected." />
    ) : showMindMap ? (
      <MindMap
        experience={selectedExperience}
        emotions={emotions}
        assessments={assessments}
      />
    ) : (
      <>
        <Text style={styles.modalTitle}>{selectedExperience.title}</Text>
        <Text style={styles.modalSummary}>{selectedExperience.summary}</Text>

        {selectedExperience.details ? (
          <Text style={styles.details}>{selectedExperience.details}</Text>
        ) : null}

        {selectedExperience.response_taken ? (
          <Text style={styles.response}>
            Response Taken: {selectedExperience.response_taken}
          </Text>
        ) : null}

        <Text style={styles.wrongness}>
          Perceived Wrongness: {selectedExperience.perceived_wrongness}/10
        </Text>

        {/* Emotions Section */}
        <Text style={styles.sectionTitle}>Emotions</Text>
        {emotions.length === 0 ? (
          <Text style={{ color: "#777" }}>No emotion entries yet.</Text>
        ) : (
          emotions.map((emo) => (
            <View key={emo.id} style={styles.emotionItem}>
              <Text style={styles.emotionLabel}>
                {emo.label} - {emo.intensity}/10
              </Text>

              {emo.note ? <Text style={styles.emotionNote}>{emo.note}</Text> : null}

              {!!emo.audio_url && (
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => playAudio(emo.audio_url)}
                >
                  <FontAwesome6 name="play" size={16} color="#007bff" />
                  <Text style={styles.playButtonText}>Play Audio</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.time}>{timeAgo(emo.created_at)}</Text>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddEmotion(true)}>
          <Text style={styles.addButtonText}>Add Emotion Entry</Text>
        </TouchableOpacity>

        {/* Assessments Section */}
        <Text style={styles.sectionTitle}>Assessments</Text>
        {assessments.length === 0 ? (
          <Text style={{ color: "#777" }}>No assessments yet.</Text>
        ) : (
          assessments.map((ass) => (
            <View key={ass.id} style={styles.assessmentItem}>
              <Text>Depression: {ass.depression_score}/100</Text>
              <Text>Stress: {ass.stress_score}/100</Text>
              <Text>Emotional Damage: {ass.emotional_damage_score}/100</Text>
              {ass.explanation ? (
                <Text style={styles.explanation}>{ass.explanation}</Text>
              ) : null}
              <Text style={styles.time}>{timeAgo(ass.created_at)}</Text>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addButton} onPress={createAssessment}>
          <Text style={styles.addButtonText}>Create Assessment</Text>
        </TouchableOpacity>
      </>
    )}
  </ScrollView>
</Modal>


      {/* Add Emotion Modal */}
      <Modal visible={showAddEmotion} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.addEmotionContainer}>
            <Text style={styles.addEmotionTitle}>Add Emotion</Text>
            <TextInput
              style={styles.input}
              placeholder="Emotion Label (e.g., Sad, Angry)"
              value={emotionLabel}
              onChangeText={setEmotionLabel}
            />
            <TextInput
              style={styles.input}
              placeholder="Intensity (0-10)"
              value={emotionIntensity}
              onChangeText={setEmotionIntensity}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Note (optional)"
              value={emotionNote}
              onChangeText={setEmotionNote}
              multiline
            />
            <View style={styles.audioContainer}>
              <Text style={styles.audioTitle}>Record Audio (optional)</Text>
              {!isRecording ? (
                <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
                  <FontAwesome6 name="microphone" size={20} color="#fff" />
                  <Text style={styles.recordButtonText}>Start Recording</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.recordButton, styles.stopButton]} onPress={stopRecording}>
                  <FontAwesome6 name="stop" size={20} color="#fff" />
                  <Text style={styles.recordButtonText}>Stop Recording</Text>
                </TouchableOpacity>
              )}
              {audioUri && (
                <TouchableOpacity style={styles.playButton} onPress={() => playAudio(audioUri)}>
                  <FontAwesome6 name="play" size={16} color="#007bff" />
                  <Text style={styles.playButtonText}>Play Recorded Audio</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddEmotion(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={addEmotion}>
                <Text style={styles.submitButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    marginBottom: 16,
    color: "#333",
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  mindMapButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  mindMapButtonText: {
    color: "#007bff",
    marginLeft: 4,
    fontSize: 14,
  },
  modalSummary: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  response: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emotionItem: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  emotionLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emotionNote: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  assessmentItem: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  explanation: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  addEmotionContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  addEmotionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  audioContainer: {
    marginTop: 12,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  recordButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 8,
  },
  stopButton: {
    backgroundColor: "#dc3545",
  },
  recordButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    justifyContent: "center",
  },
  playButtonText: {
    color: "#007bff",
    marginLeft: 8,
  },
});