import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { serverUrl } from "../constants";
import ExploreWebinarBox from "../webinar/ExploreWebinarBox";
import Loading from "../common/Loading";
import { useRouter } from "expo-router";


export default function Webinar() {
    const router = useRouter();
    const [ongoingWebinars, setOngoingWebinars] = useState<any[]>([]);
    const [upcomingWebinars, setUpcomingWebinars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/webinar/all`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setOngoingWebinars(data.ongoing);
                    setUpcomingWebinars(data.upcoming);
                })
                .catch(function (err) {
                    console.log("Course data fetching failed:", err);
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
        <ScrollView>
            <View style={styles.gap}></View>
            <Text style={styles.title}>Ongoing Webinars</Text>
            <ScrollView horizontal style={{ width: "100%", flexDirection: "row" }} contentContainerStyle={{ paddingHorizontal: 8 }}>
                {
                    ongoingWebinars ?
                        ongoingWebinars.map(function (webinar) {
                            return <ExploreWebinarBox key={webinar.id} webinar={webinar} ongoing={true}/>
                        })
                        : <></>
                }
            </ScrollView>

            <View style={styles.divider} />
            <Text style={styles.title}>Upcoming Webinars</Text>
            <ScrollView horizontal style={{ width: "100%", flexDirection: "row" }} contentContainerStyle={{ paddingHorizontal: 8 }}>
                {
                    upcomingWebinars ?
                        upcomingWebinars.map(function (webinar) {
                            return <ExploreWebinarBox key={webinar.id} webinar={webinar} ongoing={false}/>
                        })
                        : <></>
                }
            </ScrollView>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.allButton} onPress={() => {
                router.push('/(webinar)/previous');
             }}>
                <Text style={styles.allButtonText}>See Previous Webinars</Text>
                <FontAwesome6 name="arrow-right" style={styles.allButtonIcon} />
            </TouchableOpacity>
            <View style={styles.gap}></View>
        </ScrollView>
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