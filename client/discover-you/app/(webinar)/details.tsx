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
    const { webinarId } = useLocalSearchParams();
    const [webinar, setWebinar] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isReady, setIsReady] = useState(true);
    const [totalParticipants, setTotalParticipants] = useState<number>(0);
    const [participants, setParticipants] = useState<any[]>([]);

    const router = useRouter();


    function registerWebinar() {
        setIsReady(false);
        fetch(`${serverUrl}/webinar/toggleRegister`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                webinarId: webinarId
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

    function joinWebinar() {
        if (isRegistered) {
            (async () => {
                try {
                    const raw = webinar?.meeting_link;
                    if (!raw) {
                        Alert.alert("No Link", "No meeting link available for this webinar.");
                        return;
                    }
                    const url = raw.match(/^https?:\/\//i) ? raw : `https://${raw}`;
                    const canOpen = await Linking.canOpenURL(url);
                    if (canOpen) {
                        await Linking.openURL(url);
                    } else {
                        Alert.alert("Cannot Open Link", "The meeting link cannot be opened on this device.");
                    }
                } catch (err) {
                    console.error("Failed to open webinar link:", err);
                    Alert.alert("Error", "Unable to open the meeting link.");
                }
            })();
        }
        else {
            Alert.alert("Not Registered", "You are not registered for this webinar.");
        }
    }

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/webinar/single/${webinarId}`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setWebinar(data.webinar);
                    setParticipants(data.participants);
                    setTotalParticipants(Number(data.webinar.total_participants));
                    setIsRegistered(Boolean(data.webinar.is_participated));
                })
                .catch(function (err) {
                    console.log("Webinar data fetching failed:", err);
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
            <Header title="Webinar Details" />
            <ScrollView style={styles.contentContainer}>
                <View style={styles.gap} />
                {
                    webinar ?
                        <View style={styles.contentBox}>
                            <Text style={styles.title}>{webinar.name}</Text>
                            <View style={styles.category}>
                                <FontAwesome6 name={getCategoryIcon(webinar.category)} style={styles.categoryIcon} solid />
                                <Text numberOfLines={1} style={styles.categoryText}>{webinar.category}</Text>
                            </View>
                            <Text style={styles.description}>
                                {webinar.description}
                            </Text>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                style={styles.instructorContainer}
                                onPress={() => {
                                    router.push({
                                        pathname: "/(other)/profile",
                                        params: {
                                            personId: webinar.organizer_id
                                        }
                                    })
                                }}
                            >
                                {
                                    webinar.organizer_profile_picture_url ?
                                        <Image
                                            source={{ uri: serverUrl + webinar.organizer_profile_picture_url }}
                                            style={styles.profilePicture}
                                            contentFit="cover"
                                        /> :
                                        <View style={styles.pseudoProfilePicture}>
                                            <Text style={styles.pseudoProfilePictureText}>{webinar.organizer_name[0]}</Text>
                                        </View>
                                }


                                <View>
                                    <Text style={styles.instructorSemiTitle}>
                                        Organized By
                                    </Text>
                                    <Text style={styles.instructorTitle}>
                                        {webinar.organizer_name}
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
                                                {formatDate(webinar.start_time)}
                                            </Text>
                                            <Text style={styles.jobInfoSubTitle}>({formatTime(webinar.start_time)})</Text>
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
                                            <Text style={styles.jobInfoTitle}>{formatDate(webinar.ending_time)}</Text>
                                            <Text style={styles.jobInfoSubTitle}>({formatTime(webinar.ending_time)})</Text>
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
                                (webinar.type == "ongoing") ?
                                    <View style={styles.countdownBox}>
                                        <Text style={styles.countdownBoxText}>Ending in</Text>
                                        <CountdownTimer initialSeconds={webinar.ending_in} style={styles.countdownBoxCount} />
                                    </View>
                                    :
                                    (webinar.type == "upcoming") ?
                                        <View style={styles.countdownBox}>
                                            <Text style={styles.countdownBoxText}>Starting in</Text>
                                            <CountdownTimer initialSeconds={webinar.starting_in} style={styles.countdownBoxCount} />
                                        </View>
                                        :
                                        <View style={styles.countdownBox}>
                                            <Text style={styles.countdownBoxTextEnd}>Webinar Ended</Text>
                                        </View>
                            }
                        </View>
                        : <></>
                }
                <View style={styles.contentBox}>
                    <Text style={styles.sectionTitle}>Webinar Participants</Text>
                    <View style={styles.divider} />
                    {
                        (webinar && participants) ?
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
                webinar && webinar.type != "previous" &&
                <View style={styles.enrollContainer}>
                    {
                        webinar.type == "upcoming" ?
                            isRegistered ?
                                <View style={styles.registeredContainer}>
                                    <View style={styles.registrationStatus}>
                                        <FontAwesome6 name="circle-check" style={styles.registrationStatusIcon} solid />
                                        <Text style={styles.registrationStatusText}>Registered</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={isReady ? styles.enrolledButton : [styles.enrolledButton, { opacity: 0.6 }]}
                                        onPress={registerWebinar}
                                    >
                                        <Text style={styles.enrolledButtonText}>Unregister</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity
                                    style={isReady ? styles.enrolledButton : [styles.enrolledButton, { opacity: 0.6 }]}
                                    onPress={registerWebinar}
                                >
                                    {isReady ?
                                        <Text style={styles.enrolledButtonText}>Register</Text>
                                        :
                                        <Text style={styles.enrolledButtonText}>Loading...</Text>

                                    }
                                </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={isRegistered ? styles.enrolledButton : [styles.enrolledButton, { opacity: 0.6 }]}
                                onPress={joinWebinar}
                            >
                                <Text style={styles.enrolledButtonText}>Join Webinar</Text>
                            </TouchableOpacity>
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
    webinarPrice: {
        marginHorizontal: 10,
        marginRight: 24,
    },
    webinarPriceSemiTitle: {
        color: 'rgba(0,0,0,0.6)',
        fontWeight: 500
    },
    webinarPriceTitle: {
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
    }
});


// <View style={styles.jobInfo}>
//     <FontAwesome6 style={styles.jobInfoIcon} name="star" solid />
//     <View style={styles.jobInfoDetails}>
//         <Text style={styles.jobInfoSemiTitle}>Job Type</Text>
//         <Text style={styles.jobInfoTitle}>Pe