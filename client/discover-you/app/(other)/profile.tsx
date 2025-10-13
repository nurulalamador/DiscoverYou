import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import MaterialBox from "@/components/course/MaterialBox";
import CourseBox from "@/components/course/CourseBox";
import Header from "@/components/common/Header";
import useAuth from "../authContext";
import ProfileDetailsBox from "@/components/other/ProfileDetailsBox";


export default function Profile() {
    const { personId } = useLocalSearchParams();

    const router = useRouter();

    const [person, setPerson] = useState<any>();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/profile/${personId}`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setPerson(data.user);
                })
                .catch(function (err) {
                    console.log("Profile data fetching failed:", err);
                })
                .finally(function () {
                    setLoading(false);
                });
        }
        loadData();
    }, []);

    return (
        <View style={styles.container}>
            <Header title="Profile" />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.gap} />
                {
                    person && <ProfileDetailsBox person={person} />
                }
                <View style={styles.gap} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE"
    },
    contentContainer: {
        marginHorizontal: 8
    },
    gap: {
        height: 8
    }
});