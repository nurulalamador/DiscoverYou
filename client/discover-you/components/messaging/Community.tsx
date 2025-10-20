import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { serverUrl } from "../constants";
import ExploreCommunityBox from "../community/ExploreCommunityBox";
import Loading from "../common/Loading";
import { useRouter } from "expo-router";
import NotFound from "../common/NotFound";
import JoinedCommunityBox from "../community/JoinedCommunityBox";
import useAuth from "@/app/authContext";

export default function Community() {
    const router = useRouter();
    const [joinedCommunities, setJoinedCommunities] = useState<any[]>([]);
    const [exploreCommunities, setExploreCommunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { updateMessage } = useAuth();

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/community/all`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setJoinedCommunities(data.joinedCommunities);
                    setExploreCommunities(data.exploreCommunities);
                })
                .catch(function (err) {
                    console.log("Course data fetching failed:", err);
                })
                .finally(function () {
                    setLoading(false);
                });
        }
        loadData();
    }, [updateMessage]);

    if (loading) {
        return <Loading />
    }

    return (
        <View style={{ flex: 1 }}>

            <ScrollView style={{ flex: 1 }}>
                <View style={styles.gap}></View>
                <Text style={styles.title}>Explore Communities</Text>
                <ScrollView horizontal style={{ width: "100%", flexDirection: "row" }} contentContainerStyle={{ paddingHorizontal: 8 }}>
                    {
                        exploreCommunities ?
                            exploreCommunities.map(function (community) {
                                return <ExploreCommunityBox key={community.id} community={community} joined={false} />
                            })
                            : <></>
                    }
                </ScrollView>
                <TouchableOpacity style={styles.allButton} onPress={() => {
                    router.push('/(message)/browse');
                }}>
                    <Text style={styles.allButtonText}>Browse All Communities</Text>
                    <FontAwesome6 name="arrow-right" style={styles.allButtonIcon} />
                </TouchableOpacity>

                <View style={styles.divider} />
                <Text style={styles.title}>Joined Communities</Text>
                {
                    joinedCommunities.length ?
                        <View style={{ paddingHorizontal: 8 }}>
                            {
                                joinedCommunities.map(function (community) {
                                    return <JoinedCommunityBox key={community.id} community={community} joined={false} />
                                })
                            }
                        </View>
                        : <NotFound title="No Community Joined" icon="users" />
                }
                <View style={styles.gap}></View>
            </ScrollView>
            <TouchableOpacity 
                onPress={()=>{
                    router.push('/(message)/newCommunity');  
                }}
            style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 999, height: 60, width: 60, borderRadius: 30, backgroundColor: '#FF6600', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome6 name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.6)'
    },
    gap: {
        height: 8
    },
    divider: {
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginVertical: 12,
        width: "80%",
        marginHorizontal: 'auto'
    },
    allButton: {
        backgroundColor: '#FF6600',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    allButtonText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 15,
    },
    allButtonIcon: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 10
    },
})