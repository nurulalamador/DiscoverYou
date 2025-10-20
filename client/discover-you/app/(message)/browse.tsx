import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import Header from "@/components/common/Header";
import FilterBox from "@/components/common/FilterBox";
import Loading from "@/components/common/Loading";
import BrowseCommunityBox from "@/components/community/BrowseCommunityBox";

export default function BrowseCommunity() {
    const [communities, setCommunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/community/all`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setCommunities(data.exploreCommunities);
                })
                .catch(function (err) {
                    console.log("Community data fetching failed:", err);
                })
                .finally(function () {
                    setLoading(false);
                });
        }
        loadData();
    }, []);

    if(loading) {
        return <Loading/>
    }

    return (
        <View style={styles.container}>
            <Header title="Browse Communities" />

            <View style={styles.gap} />
            <FilterBox sort={["Newest First", "Lowest Price"]} />
            <ScrollView style={styles.contentContainer}>
                {
                    communities ?
                        communities.map(function (community) {
                            return <BrowseCommunityBox key={community.id} community={community} />
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