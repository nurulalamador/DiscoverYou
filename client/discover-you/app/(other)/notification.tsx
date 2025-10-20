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
import NotFound from "@/components/common/NotFound";


export default function Notifications() {
    const router = useRouter();

    const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'communities'>('inbox');
    const [notifications, setNotifications] = useState<any>();
    const [loading, setLoading] = useState(true);
    const { user, setUpdateMessage } = useAuth();

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/profile/notification`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setUpdateMessage((prev:any) => prev + 1);
                })
                .catch(function (err) {
                    console.log("notifications data fetching failed:", err);
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
            <Header title="Notifcation" />
            {notifications && notifications.length ?
                <View style={styles.contentBox}>
                    {notifications.map((notification: any, index: number) => (
                        <View key={notification.id}>
                            {index !== 0 ? <View style={styles.divider} /> : null}
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 , paddingHorizontal: 4}}>
                                <FontAwesome6 name="bell" style={{ height: 46, width: 46, borderRadius: 23, backgroundColor: "#FF6600", color: "#FFFFFF", textAlign: "center", textAlignVertical: "center", fontSize: 26 }} solid />
                                <View style={{ flex: 1, flexDirection: "column", gap: 2 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "rgba(0,0,0,0.8)" }}>{notification.title}</Text>

                                    <Text style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.6)" }}>{notification.description}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View> :
                <View style={{ flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                    <NotFound title="No Notifications!" icon="bell" />
                </View>
            }
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
        margin: 14,
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