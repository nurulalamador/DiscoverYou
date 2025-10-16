import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { formatDate, getCategoryIcon, serverUrl } from "@/components/constants";
import NotFound from "@/components/common/NotFound";
import Header from "@/components/common/Header";
import useAuth from "../authContext";
import Loading from "@/components/common/Loading";

export default function Details() {
    const { hiringId } = useLocalSearchParams();
    const [hiring, setHiring] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [isApplied, setIsApplied] = useState(false);
    const [isReady, setIsReady] = useState(true);
    const [totalApplicants, setTotalApplicants] = useState<number>(0);

    const router = useRouter();


    function applyHiring() {
        setIsReady(false);
        fetch(`${serverUrl}/hiring/toggleApply`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hiringId: hiringId
            }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    if (data.message == "unapplied") {
                        setTotalApplicants((prev: number) => prev - 1);
                        setIsApplied(false);
                    }
                    else if (data.message == "applied") {
                        setTotalApplicants((prev: number) => prev + 1);
                        setIsApplied(true);
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

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/hiring/single/${hiringId}`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setHiring(data.hiring);
                    setTotalApplicants(Number(data.hiring.total_applicants));
                    setIsApplied(Boolean(data.hiring.is_applied));
                })
                .catch(function (err) {
                    console.log("Hiring data fetching failed:", err);
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
            <Header title="Hiring Details" />
            <ScrollView style={styles.contentContainer}>
                <View style={styles.gap} />
                {
                    hiring && isApplied ?
                        <View style={styles.contentBox}>
                            <View style={styles.statusContainer}>
                                <Text style={styles.statusTitle}>Application Status</Text>
                                {
                                    hiring.application_status == "accepted" ?
                                        <Text style={styles.statusAccepted}>Accepted</Text> :
                                        hiring.application_status == "rejected" ?
                                            <Text style={styles.statusRejected}>Rejected</Text>
                                            :
                                            <Text style={styles.statusPending}>Pending</Text>
                                }
                            </View>
                        </View>
                        : <></>
                }
                {
                    hiring ?
                        <View style={styles.contentBox}>
                            <Text style={styles.title}>{hiring.name}</Text>
                            <Text style={styles.company}>{hiring.company}</Text>
                            <View style={styles.category}>
                                <FontAwesome6 name={getCategoryIcon(hiring.category)} style={styles.categoryIcon} solid />
                                <Text numberOfLines={1} style={styles.categoryText}>{hiring.category}</Text>
                            </View>
                            <Text style={styles.description}>
                                {hiring.description}
                            </Text>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                style={styles.instructorContainer}
                                onPress={() => {
                                    router.push({
                                        pathname: "/(other)/profile",
                                        params: {
                                            personId: hiring.hirer_id
                                        }
                                    })
                                }}
                            >
                                {
                                    hiring.hirer_profile_picture_url ?
                                        <Image
                                            source={{ uri: serverUrl + hiring.hirer_profile_picture_url }}
                                            style={styles.profilePicture}
                                            contentFit="cover"
                                        /> :
                                        <View style={styles.pseudoProfilePicture}>
                                            <Text style={styles.pseudoProfilePictureText}>{hiring.hirer_name[0]}</Text>
                                        </View>
                                }


                                <View>
                                    <Text style={styles.instructorSemiTitle}>
                                        Hiring By
                                    </Text>
                                    <Text style={styles.instructorTitle}>
                                        {hiring.hirer_name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <View style={styles.detailsContainer}>
                                <View style={styles.jobInfoContainer}>
                                    <View style={styles.jobInfo}>
                                        <FontAwesome6 style={styles.jobInfoIcon} name="briefcase" solid />
                                        <View style={styles.jobInfoDetails}>
                                            <Text style={styles.jobInfoSemiTitle}>Job Type</Text>
                                            <Text style={styles.jobInfoTitle}>{hiring.type} </Text>
                                        </View>
                                    </View>
                                    <View style={styles.jobInfo}>
                                        <FontAwesome6 style={styles.jobInfoIcon} name="calendar-alt" solid />
                                        <View style={styles.jobInfoDetails}>
                                            <Text style={styles.jobInfoSemiTitle}>Deadline</Text>
                                            <Text style={styles.jobInfoTitle}>{formatDate(hiring.last_date)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.jobInfoContainer}>
                                    <View style={styles.jobInfo}>
                                        <FontAwesome6 style={styles.jobInfoIcon} name={hiring.work_location == "Remote" ? "house" : "building"} solid />
                                        <View style={styles.jobInfoDetails}>
                                            <Text style={styles.jobInfoSemiTitle}>Work Location</Text>
                                            <Text style={styles.jobInfoTitle}>{hiring.work_location}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.jobInfo}>
                                        <FontAwesome6 style={styles.jobInfoIcon} name="users" solid />
                                        <View style={styles.jobInfoDetails}>
                                            <Text style={styles.jobInfoSemiTitle}>Total Applicants</Text>
                                            <Text style={styles.jobInfoTitle}>{totalApplicants + ""}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.salaryContainer}>
                                <View>
                                    <Text style={styles.salaryTextTitle}>Salary</Text>
                                    <Text style={styles.salaryTextSemiTitle}>({hiring.type == "Contructual" ? "One-Time" : "Per Month"})</Text>
                                </View>
                                <Text style={styles.salaryCount}>
                                    ৳{hiring.salary}
                                </Text>
                            </View>
                        </View>
                        : <></>
                }
                <View style={styles.gap} />
            </ScrollView>
            <View style={styles.enrollContainer}>
                {
                    isApplied ?
                        <View style={styles.registeredContainer}>
                            <View style={styles.registrationStatus}>
                                <FontAwesome6 name="circle-check" style={styles.registrationStatusIcon} solid />
                                <Text style={styles.registrationStatusText}>Applied</Text>
                            </View>
                            <TouchableOpacity
                                style={isReady ? styles.enrolledButton : [styles.enrolledButton, { opacity: 0.6 }]}
                                onPress={applyHiring}
                            >
                                <Text style={styles.enrolledButtonText}>Cancel Application</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity
                            style={isReady ? styles.enrolledButton : [styles.enrolledButton, { opacity: 0.6 }]}
                            onPress={applyHiring}
                        >
                            {isReady ?
                                <Text style={styles.enrolledButtonText}>Apply Now</Text>
                                :
                                <Text style={styles.enrolledButtonText}>Loading...</Text>

                            }
                        </TouchableOpacity>
                }

            </View>
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
    company: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 8,
        marginTop: 0,
        color: "#FF6600"
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
    hiringPrice: {
        marginHorizontal: 10,
        marginRight: 24,
    },
    hiringPriceSemiTitle: {
        color: 'rgba(0,0,0,0.6)',
        fontWeight: 500
    },
    hiringPriceTitle: {
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
    salaryContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10
    },
    salaryTextTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "rgba(0,0,0,0.6)"
    },
    salaryTextSemiTitle: {
        fontSize: 12,
        color: "rgba(0,0,0,0.4)",
        fontWeight: 500,
        fontStyle: "italic",
        marginTop: 2
    },
    salaryCount: {
        fontSize: 22,
        fontWeight: 900,
        color: "#FF6600"
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
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    statusTitle: {
        fontSize: 14,
        fontWeight: 500,
        padding: 8
    },
    statusPending: {
        fontSize: 15,
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 0.8)",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        margin: 4
    },
    statusAccepted: {
        fontSize: 15,
        fontWeight: "bold",
        color: "rgba(70, 170, 100, 1)",
        backgroundColor: "rgba(70, 170, 100, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        margin: 4
    },
    statusRejected: {
        fontSize: 15,
        fontWeight: "bold",
        color: "rgba(225, 50, 50, 1)",
        backgroundColor: "rgba(225, 50, 50, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        margin: 4
    }
});


// <View style={styles.jobInfo}>
//     <FontAwesome6 style={styles.jobInfoIcon} name="star" solid />
//     <View style={styles.jobInfoDetails}>
//         <Text style={styles.jobInfoSemiTitle}>Job Type</Text>
//         <Text style={styles.jobInfoTitle}>Pe