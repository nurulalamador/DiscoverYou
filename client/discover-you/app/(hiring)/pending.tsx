import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import MaterialBox from "@/components/course/MaterialBox";
import CourseBox from "@/components/course/CourseBox";
import Header from "@/components/common/Header";
import FilterBox from "@/components/common/FilterBox";
import Loading from "@/components/common/Loading";
import JobBox from "@/components/hiring/JobBox";

export default function PendingApplications() {
    const [hirings, setHirings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/hiring/pending`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setHirings(data.hirings);
                })
                .catch(function (err) {
                    console.log("hiring data fetching failed:", err);
                })
                .finally(function () {
                    setLoading(false);
                });
        }
        loadData();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <View style={styles.container}>
            <Header title="My Applications" />
            <ScrollView style={styles.contentContainer}>
                <View style={styles.gap} />
                {
                    hirings ?
                        hirings.map(function (job) {
                            return <JobBox key={job.id} job={job} showStatus={true}/>
                        })
                        : <></>
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
    header: {
        paddingHorizontal: 18,
        paddingVertical: 14,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
        borderBottomWidth: 1,
        // elevation: 6,
    },
    headerLeftContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    headerBackIcon: {
        fontSize: 20,
        margin: 4,
        marginRight: 16
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "rgba(0, 0, 0, 0.8)",
        margin: 4
    },
    contentContainer: {
        paddingHorizontal: 8
    },
    gap: {
        height: 8
    }
});