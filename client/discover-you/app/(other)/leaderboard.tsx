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
import Loading from "@/components/common/Loading";
import LeaderboardBox from "@/components/other/LeaderboardBox";


export default function Leaderboard() {
    const router = useRouter();

    const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'communities'>('inbox');
    const [leaderboard, setLeaderboard] = useState<any>();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/profile/leaderboard`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setLeaderboard(data.leaderboard);
                })
                .catch(function (err) {
                    console.log("Leaderboard data fetching failed:", err);
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
            <Header title="Leaderboard" />
            <View style={styles.subTabContainer}>
                <TouchableOpacity style={styles.subTab} onPress={() => setActiveSubTab('inbox')}>
                    <Text style={activeSubTab == 'inbox' ? styles.activeSubTabText : styles.subTabText}>All Time</Text>
                    {activeSubTab == 'inbox' ? <View style={styles.subTabIndicator} /> : null}
                </TouchableOpacity>
                <TouchableOpacity style={styles.subTab} onPress={() => setActiveSubTab('communities')}>
                    <Text style={activeSubTab == 'communities' ? styles.activeSubTabText : styles.subTabText}>Monthly</Text>
                    {activeSubTab == 'communities' ? <View style={styles.subTabIndicator} /> : null}
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.gap} />
                <View style={styles.contentBox}>
                    {
                        leaderboard ?
                            leaderboard.map(function (user: any, rank: any) {
                                return <View key={user.id}>
                                    {
                                        rank ? <View style={styles.divider} /> : null
                                    }
                                    <LeaderboardBox user={user} rank={rank + 1} />
                                </View>
                            }) : null
                    }
                </View>
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
    },
    contentBox: {
        margin: 6,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 14,
        padding: 8
    },
    divider: {
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginVertical: 6,
        width: "95%",
        marginHorizontal: 'auto'
    },
        subTabContainer: {
        backgroundColor: "#FFFFFF",
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 8,
        marginTop: -6
    },
    subTab: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        position: 'relative',
    },
    subTabText: {
        fontSize: 15,
        color: 'rgba(0,0,0,0.6)',
        padding: 6,
        fontWeight: 500
    },
    activeSubTabText: {
        fontSize: 15,
        color: '#FF6600',
        fontWeight: 800,
        padding: 6
    },
    subTabIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 4,
        width: '80%',
        backgroundColor: '#FF6600',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
});