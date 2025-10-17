import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { formatDate, formatTime, getCategoryIcon, serverUrl } from "@/components/constants";
import NotFound from "@/components/common/NotFound";
import Header from "@/components/common/Header";
import useAuth from "../authContext";
import Loading from "@/components/common/Loading";
import CountdownTimer from "@/components/common/Countdown";
import ParticipantBox from "@/components/webinar/ParticipantBox";

export default function Details() {
    const { contestId } = useLocalSearchParams();
    const [contest, setContest] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isReady, setIsReady] = useState(true);
    const [totalParticipants, setTotalParticipants] = useState<number>(0);
    const [participants, setParticipants] = useState<any[]>([]);

    const router = useRouter();


    function registerContest() {
        setIsReady(false);
        fetch(`${serverUrl}/contest/toggleRegister`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contestId: contestId
            }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    if (data.message == "unregistered") {
                        setTotalParticipants((prev: number) => prev - 1);
                        setIsRegistered(false);
                    }
                    else if (data.message == "registered") {
                        setTotalParticipants((prev: number) => prev + 1);
                        setIsRegistered(true);
                    }
                }
                else {
                    console.log(data);
                }
            })
            .catch(error => {
                console.error("Enrolling error:", error);
            })
            .finally(() => {
                setIsReady(true);
            });
    }

    function addSubmission() {
        if (isRegistered) {

        }
        else {
            Alert.alert("Not Registered", "You are not registered for this contest.");
        }
    }

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/contest/single/${contestId}`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setContest(data.contest);
                    setParticipants(data.participants);
                    setTotalParticipants(Number(data.contest.total_participants));
                    setIsRegistered(Boolean(data.contest.is_participated));
                })
                .catch(function (err) {
                    console.log("Contest data fetching failed:", err);
                })
                .finally(function () {
                    setLoading(false);
                });
        }
        loadData();
    }, [totalParticipants]);

    if (loading) {
        return <Loading />
    }

    return (
        <View style={styles.container}>
            <Header title="Contest Details" />
            <ScrollView style={styles.contentContainer}>
                <View style={styles.gap} />
                {
                    contest ?
                        <View style={styles.contentBox}>
                            <Text style={styles.title}>{contest.name}</Text>
                            <View style={styles.category}>
                                <FontAwesome6 name={getCategoryIcon(contest.category)} style={styles.categoryIcon} solid />
                                <Text numberOfLines={1} style={styles.categoryText}>{contest.category}</Text>
                            </View>
                            <Text style={styles.description}>
                                {contest.description}
                            </Text>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                style={styles.instructorContainer}
                                onPress={() => {
                                    router.push({
                                        pathname: "/(other)/profile",
                                        params: {
                                            personId: contest.organizer_id
                                        }
                                    })
                                }}
                            >
                                {
                                    contest.organizer_profile_picture_url ?
                                        <Image
                                            source={{ uri: serverUrl + contest.organizer_profile_picture_url }}
                                            style={styles.profilePicture}
                                            contentFit="cover"
                                        /> :
                                        <View style={styles.pseudoProfilePicture}>
                                            <Text style={styles.pseudoProfilePictureText}>{contest.organizer_name[0]}</Text>
                                        </View>
                                }


                                <View>
                                    <Text style={styles.instructorSemiTitle}>
                                        Organized By
                                    </Text>
                                    <Text style={styles.instructorTitle}>
                                        {contest.organizer_name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <View style={styles.detailsContainer}>
                                <View style={styles.jobInfoContainer}>
                                    <View style={styles.jobInfo}>
                                        <FontAwesome6 style={styles.jobInfoIcon} name="calendar-alt" solid />
                                        <View style={styles.jobInfoDetails}>
                                            <Text style={styles.jobInfoSemiTitle}>Starting Time</Text>
                                            <Text style={styles.jobInfoTitle}>
                                                {formatDate(contest.start_time)}
                                            </Text>
                                            <Text style={styles.jobInfoSubTitle}>({formatTime(contest.start_time)})</Text>
                                        </View>
                                    </View>
                                    <View style={styles.jobInfo}>
                                        <FontAwesome6 style={styles.jobInfoIcon} name="door-open" solid />
                                        <View style={styles.jobInfoDetails}>
                                            <Text style={styles.jobInfoSemiTitle}>Access</Text>
                                            <Text style={styles.jobInfoTitle}>Open for All</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.jobInfoContainer}>
                                    <View style={styles.jobInfo}>
                                        <FontAwesome6 style={styles.jobInfoIcon} name="calendar-alt" solid />
                                        <View style={styles.jobInfoDetails}>
                                            <Text style={styles.jobInfoSemiTitle}>Ending Time</Text>
                                            <Text style={styles.jobInfoTitle}>{formatDate(contest.ending_time)}</Text>
                                            <Text style={styles.jobInfoSubTitle}>({formatTime(contest.ending_time)})</Text>
                                        </View>
                                    </View>
                                    <View style={styles.jobInfo}>
                                        <FontAwesome6 style={styles.jobInfoIcon} name="users" solid />
                                        <View style={styles.jobInfoDetails}>
                                            <Text style={styles.jobInfoSemiTitle}>Total Participants</Text>
                                            <Text style={styles.jobInfoTitle}>{totalParticipants + ""}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            {
                                (contest.type == "ongoing") ?
                                    <View style={styles.countdownBox}>
                                        <Text style={styles.countdownBoxText}>Ending in</Text>
                                        <CountdownTimer initialSeconds={contest.ending_in} style={styles.countdownBoxCount} />
                                    </View>
                                    :
                                    (contest.type == "upcoming") ?
                                        <View style={styles.countdownBox}>
                                            <Text style={styles.countdownBoxText}>Starting in</Text>
                                            <CountdownTimer initialSeconds={contest.starting_in} style={styles.countdownBoxCount} />
                                        </View>
                                        :
                                        <View style={styles.countdownBox}>
                                            <Text style={styles.countdownBoxTextEnd}>Contest Ended</Text>
                                        </View>
                            }
                        </View>
                        : <></>
                }
                {
                    (contest && contest.type == "ongoing") &&
                    <View style={styles.contentBox}>
                        <Text style={styles.sectionTitle}>Submission</Text>
                        <View style={styles.divider} />
                        <NotFound title="No Submission Added" icon="photo-film" />

                        <TouchableOpacity
                            style={isRegistered ? styles.submissionButton : [styles.submissionButton, { opacity: 0.6 }]}
                            onPress={addSubmission}
                        >
                            <Text style={styles.submissionButtonText}>Add Submission</Text>
                        </TouchableOpacity>
                    </View>
                }
                <View style={styles.contentBox}>
                    <Text style={styles.sectionTitle}>Contest Participants</Text>
                    <View style={styles.divider} />
                    {
                        (contest && participants) ?
                            participants.length ?
                                participants.map(function (participant) {
                                    return <ParticipantBox key={participant.id} participant={participant} />
                                }) :
                                <NotFound title="No Participants" icon="users" />
                            : <></>
                    }
                </View>
                <View style={styles.gap} />
            </ScrollView>
            {
                contest && contest.type != "previous" &&
                <View style={styles.enrollContainer}>
                    {
                        contest.type == "upcoming" ?
                            isRegistered ?
                                <View style={styles.registeredContainer}>
                                    <View style={styles.registrationStatus}>
                                        <FontAwesome6 name="circle-check" style={styles.registrationStatusIcon} solid />
                                        <Text style={styles.registrationStatusText}>Registered</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={isReady ? styles.enrolledButton : [styles.enrolledButton, { opacity: 0.6 }]}
                                        onPress={registerContest}
                                    >
                                        <Text style={styles.enrolledButtonText}>Unregister</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity
                                    style={isReady ? styles.enrolledButton : [styles.enrolledButton, { opacity: 0.6 }]}
                                    onPress={registerContest}
                                >
                                    {isReady ?
                                        <Text style={styles.enrolledButtonText}>Register</Text>
                                        :
                                        <Text style={styles.enrolledButtonText}>Loading...</Text>

                                    }
                                </TouchableOpacity>
                            :
                            <></>
                    }

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
        paddingHorizontal: 8
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
    previewImage: {
        height: 320,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)",
        margin: 4
    },
    pseudoPreviewImage: {
        height: 320,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        backgroundColor: "rgba(0,0,0,0.1)",
        alignItems: "center",
        justifyContent: "center",
        margin: 4
    },
    pseudoPreviewImageIcon: {
        fontSize: 100,
        color: 'rgba(0,0,0,0.4)'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 8,
        color: "rgba(0,0,0,0.8)"
    },
    category: {
        backgroundColor: "rgba(255, 102, 0, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 8,
        overflow: 'hidden',
        maxWidth: '100%',
        marginHorizontal: 8,
        marginVertical: 4
    },
    categoryText: {
        color: "#FF6600",
        fontWeight: "bold",
        fontSize: 12
    },
    categoryIcon: {
        fontSize: 14,
        color: "#FF6600"
    },
    description: {
        fontSize: 13,
        margin: 8,
        marginHorizontal: 10,
        textAlign: 'justify',
        color: "rgba(0,0,0,0.6)"
    },
    instructorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 8,
        marginVertical: 4
    },
    instructorSemiTitle: {
        color: "#FF6600",
        fontSize: 12,
        fontWeight: 600
    },
    instructorTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)",
        marginRight: 12
    },
    pseudoProfilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginRight: 12,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center'
    },
    pseudoProfilePictureText: {
        fontSize: 18,
        color: 'rgba(0,0,0,0.6)'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 8,
        color: "rgba(0,0,0,0.8)"
    },
    divider: {
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginVertical: 8,
        width: "95%",
        marginHorizontal: 'auto'
    },
    detailsContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 4
    },
    detail: {
        alignItems: 'center',
        margin: 2
    },
    detailTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
        color: 'rgba(0,0,0,0.8)'
    },
    detailSemiTitle: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.6)'
    },
    detailDivider: {
        borderLeftColor: "rgba(0,0,0,0.1)",
        borderLeftWidth: 1,
        height: 40,
        marginHorizontal: 'auto'
    },
    enrollContainer: {
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.1)",
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8
    },
    contestPrice: {
        marginHorizontal: 10,
        marginRight: 24,
    },
    contestPriceSemiTitle: {
        color: 'rgba(0,0,0,0.6)',
        fontWeight: 500
    },
    contestPriceTitle: {
        color: '#FF6600',
        fontWeight: 900,
        fontSize: 20
    },
    enrolledButton: {
        flex: 1,
        backgroundColor: '#FF6600',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        margin: 8,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    enrolledButtonText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 15,
    },
    jobInfoContainer: {
        flex: 1,
    },
    jobInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        margin: 4,
        marginVertical: 6
    },
    jobInfoIcon: {
        fontSize: 20,
        width: 30,
        marginHorizontal: 4,
        textAlign: "center",
        color: "rgba(0,0,0,0.6)",
    },
    jobInfoDetails: {
        marginLeft: 6
    },
    jobInfoSemiTitle: {
        fontSize: 12,
        color: "rgba(0,0,0,0.6)",
        fontWeight: 500
    },
    jobInfoTitle: {
        fontWeight: "bold",
        fontSize: 14,
        color: "rgba(0,0,0,0.8)"
    },
    jobInfoSubTitle: {
        fontSize: 13,
        color: "rgba(0,0,0,0.6)",
        fontWeight: 700
    },
    registeredContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1
    },
    registrationStatus: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        marginRight: 16,
    },
    registrationStatusIcon: {
        fontSize: 20,
        color: "#4CAF50"
    },
    registrationStatusText: {
        color: "rgba(0,0,0,0.6)",
        fontWeight: "bold",
        fontSize: 15,
        marginLeft: 8
    },
    countdownBox: {
        backgroundColor: "rgba(0,0,0,0.15)",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        margin: 4,
        marginTop: 8
    },
    countdownBoxText: {
        fontSize: 13,
        color: "rgba(0,0,0,0.6)"
    },
    countdownBoxTextEnd: {
        flex: 1,
        fontSize: 14,
        color: "rgba(0,0,0,0.6)",
        marginVertical: 2,
        alignSelf: "center",
        textAlign: "center",
        fontStyle: "italic"
    },
    countdownBoxCount: {
        fontWeight: "bold",
        color: "rgba(0,0,0,0.6)"
    },
    submissionButton: {
        flex: 1,
        backgroundColor: '#FF6600',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        margin: 6,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    submissionButtonText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 15,
    },
});
