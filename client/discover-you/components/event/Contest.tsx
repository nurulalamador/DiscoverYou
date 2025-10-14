import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { serverUrl } from "../constants";
import ExploreContestBox from "../contest/ExploreContestBox";
import Loading from "../common/Loading";

export default function Contest() {
    const [ongoingContests, setOngoingContests] = useState<any[]>([]);
    const [upcomingContests, setUpcomingContests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/contest/all`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setOngoingContests(data.ongoing);
                    setUpcomingContests(data.upcoming);
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
            <Text style={styles.title}>Ongoing Contests</Text>
            <ScrollView horizontal style={{ width: "100%", flexDirection: "row" }} contentContainerStyle={{ paddingHorizontal: 8 }}>
                {
                    ongoingContests ?
                        ongoingContests.map(function (contest) {
                            return <ExploreContestBox key={contest.id} contest={contest} ongoing={true}/>
                        })
                        : <></>
                }
            </ScrollView>

            <View style={styles.divider} />
            <Text style={styles.title}>Upcoming Contests</Text>
            <ScrollView horizontal style={{ width: "100%", flexDirection: "row" }} contentContainerStyle={{ paddingHorizontal: 8 }}>
                {
                    upcomingContests ?
                        upcomingContests.map(function (contest) {
                            return <ExploreContestBox key={contest.id} contest={contest} ongoing={false}/>
                        })
                        : <></>
                }
            </ScrollView>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.allButton} onPress={() => { }}>
                <Text style={styles.allButtonText}>See Previous Contests</Text>
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