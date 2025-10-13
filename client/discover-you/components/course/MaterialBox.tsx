import { FontAwesome6 } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

function MaterialBox({
  material,
  isEnrolled
}: {
  material: any; 
  isEnrolled: boolean
}) {
    const router = useRouter();

    function goToMaterial(){
        isEnrolled ? 
        router.push({ 
            pathname: "/(course)/material", 
            params: { 
                courseId: material.course_id, 
                materialId: material.id 
            } 
        })
        : 
        Alert.alert("Unenrolled Course", "Please Enroll To Access Materials")
        ; 
    }

    return (
        <TouchableOpacity style={styles.materialBox} onPress={goToMaterial}>
            <FontAwesome6 name="video" style={styles.materialIcon} />
            <View style={styles.materialDetails}>
                <Text style={styles.title}>{material.name}</Text>
                <Text style={styles.semiTitle}>Video Lecture</Text>
            </View>
            {
                material.is_completed == 1?
                    <FontAwesome6 name="circle-check" style={styles.completed} solid/>
                    :
                    <FontAwesome6 name="circle-check" style={styles.notCompleted} />
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    materialBox: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        margin: 2
    },
    materialBoxActive: {
        backgroundColor: "rgba(255, 102, 0, 0.2)",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        margin: 2
    },
    materialIcon: {
        width: 40,
        height: 40,
        borderRadius: 25,
        fontSize: 20,
        backgroundColor: "#FF6600",
        textAlign: "center",
        textAlignVertical: "center",
        color: "#FFFFFF",
    },
    materialDetails: {
        marginLeft: 12,
        flex: 1
    },
    title: {
        fontSize: 15,
        fontWeight: "bold",
        color: "rgba(0,0,0,0.8)"
    },
    semiTitle: {
        fontSize: 14,
        color: "rgba(0,0,0,0.6)"
    },
    completed: {
        color: "#4CAF50",
        fontSize: 24,
        margin: 4
    },
    notCompleted: {
        color: "rgba(0,0,0,0.2)",
        fontSize: 24,
        margin: 4
    }
});

export default MaterialBox;