import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import NotFound from "@/components/common/NotFound";
import Header from "@/components/common/Header";
import useAuth from "../authContext";
import Loading from "@/components/common/Loading";

export default function Details() {
    const { hiringId } = useLocalSearchParams();
    const [hiring, setHiring] = useState<any>();
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);

    const router = useRouter();


    function applyHiring() {
        fetch(`${serverUrl}/hiring/enroll`, {
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
                    if (data.success) {
                        setIsEnrolled(true);
                    }
                }
                else {
                    console.log(data);
                }
            })
            .catch(error => {
                console.error("Enrolling error:", error);
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
                    setIsEnrolled(Boolean(data.hiring.is_enrolled));
                    setMaterials(data.materials);
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
                    hiring ?
                        <View style={styles.contentBox}>
                            <Text style={styles.title}>{hiring.name}</Text>
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

                            <View style={styles.jobInfo}>
                                <FontAwesome6 style={styles.jobInfoIcon} name="briefcase" solid />
                                <View style={styles.jobInfoDetails}>
                                    <Text style={styles.jobInfoSemiTitle}>Job Type</Text>
                                    <Text style={styles.jobInfoTitle}>Permanent </Text>
                                </View>
                            </View>
                            <View style={styles.jobInfo}>
                                <FontAwesome6 style={styles.jobInfoIcon} name="house" solid />
                                <View style={styles.jobInfoDetails}>
                                    <Text style={styles.jobInfoSemiTitle}>Working Place</Text>
                                    <Text style={styles.jobInfoTitle}>Remote Job</Text>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.salaryContainer}>
                                <Text style={styles.salaryText}>Salary</Text>
                                <Text style={styles.salaryCount}>
                                    {hiring.salary ? `৳${hiring.salary}` : "Not specified"}
                                </Text>
                            </View>
                        </View>
                        : <></>
                }
                <View style={styles.gap} />
            </ScrollView>
            <View style={styles.enrollContainer}>
                <TouchableOpacity
                    style={styles.enrolledButton}
                    onPress={() => { }}
                >
                    <Text style={styles.enrolledButtonText}>Apply Now</Text>
                </TouchableOpacity>
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
        marginHorizontal: 8,
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
        marginHorizontal: 8,
        marginTop: 6,
        marginBottom: 8,
        alignItems: 'center'
    },
    detail: {
        flex: 1,
        alignItems: 'center'
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
    jobInfo: {
        flexDirection: "row",
        alignItems: "center",
        margin: 6
    },
    jobInfoIcon: {
        fontSize: 20,
        width: 30,
        textAlign: "center",
        color: "rgba(0,0,0,0.6)",
    },
    jobInfoDetails: {
        marginLeft: 10
    },
    jobInfoSemiTitle: {
        fontSize: 14,
        color: "rgba(0,0,0,0.6)",
        fontWeight: 500
    },
    jobInfoTitle: {
        fontWeight: "bold",
        fontSize: 15,
        color: "rgba(0,0,0,0.8)"
    },
    salaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 8
    },
    salaryText: {
        fontSize: 15,
        fontWeight: 500
    } ,
    salaryCount: {
        fontSize: 24,
        fontWeight: 900,
        color: "#FF6600"
    } 
});


                            // <View style={styles.jobInfo}>
                            //     <FontAwesome6 style={styles.jobInfoIcon} name="star" solid />
                            //     <View style={styles.jobInfoDetails}>
                            //         <Text style={styles.jobInfoSemiTitle}>Job Type</Text>
                            //         <Text style={styles.jobInfoTitle}>Pe