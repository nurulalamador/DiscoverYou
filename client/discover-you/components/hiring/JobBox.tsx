import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

function JobBox({ job, showStatus }: { job: any, showStatus?: boolean }) {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.courseBox} onPress={() => {
            router.push({
                pathname: "/(hiring)/details",
                params: { hiringId: job.id }
            })
        }}>
            <View style={styles.informationContainer}>
                <View style={styles.information}>
                    <Text numberOfLines={2} style={styles.title}>{job.name}</Text>
                    <Text numberOfLines={1} style={styles.companyName}>{job.company}</Text>
                    <View style={styles.category}>
                        <FontAwesome6 name={getCategoryIcon(job.category)} style={styles.categoryIcon} solid />

                        <Text numberOfLines={1} style={styles.categoryText}>{job.category}</Text>
                    </View>
                    <View style={styles.instructorContainer}>
                        {
                            job.hirer_profile_picture_url ?
                                <Image
                                    source={{ uri: serverUrl + job.hirer_profile_picture_url }}
                                    style={styles.profilePicture}
                                    contentFit="cover"
                                /> :
                                <View style={styles.pseudoProfilePicture}>
                                    <Text style={styles.pseudoProfilePictureText}>{job.hirer_name[0]}</Text>
                                </View>
                        }

                        <View>
                            <Text style={styles.instructorSemiTitle}>
                                Hiring By
                            </Text>
                            <Text style={styles.instructorTitle}>
                                {job.hirer_name}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.details}>
                    <View style={styles.detail}>
                        <FontAwesome6 name="briefcase" style={styles.detailIcon} solid />
                        <View style={styles.detailText}>
                            <Text style={styles.jobDetailSemiTitle}>Job Type</Text>
                            <Text style={styles.jobDetailTitle}>{job.type}</Text>
                        </View>
                    </View>
                    <View style={styles.detail}>
                        <FontAwesome6 name={job.work_location == "Remote" ? "house" : "building"} style={styles.detailIcon} solid />
                        <View style={styles.detailText}>
                            <Text style={styles.jobDetailSemiTitle}>Work Location</Text>
                            <Text style={styles.jobDetailTitle}>{job.work_location}</Text>
                        </View>
                    </View>
                    <View style={styles.salary}>
                        <Text style={styles.salaryText}>৳{job.salary}</Text>
                    </View>
                </View>
            </View>
            {showStatus && job.application_status ?
                <>
                    <View style={styles.divider}/>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusTitle}>Application Status</Text>
                        {
                            job.application_status == "accepted" ?
                                <Text style={styles.statusAccepted}>Accepted</Text> :
                                job.application_status == "rejected" ?
                                    <Text style={styles.statusRejected}>Rejected</Text>
                                    :
                                    <Text style={styles.statusPending}>Pending</Text>
                        }
                    </View>
                </>
                : <></>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    courseBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        margin: 6,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        padding: 8
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
    },
    companyName: {
        fontSize: 13,
        color: "#FF6600",
        fontWeight: 600,
        marginVertical: 2,
    },
    previewImage: {
        width: 152,
        height: 152,
        margin: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)"
    },
    pseudoPreviewImage: {
        width: 152,
        height: 152,
        margin: 8,
        borderRadius: 8,
        backgroundColor: "rgba(0,0,0,0.1)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)"
    },
    details: {
        flex: 1,
        margin: 6
    },
    informationContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    information: {
        flex: 1.5,
        margin: 6
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        marginRight: 8
    },
    pseudoProfilePicture: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginRight: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center'
    },
    pseudoProfilePictureText: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.6)'
    },
    category: {
        backgroundColor: "rgba(255, 102, 0, 0.2)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 8,
        marginVertical: 8,
        overflow: 'hidden',
        maxWidth: '100%'
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
    instructorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4
    },
    instructorSemiTitle: {
        color: "#FF6600",
        fontSize: 11,
        fontWeight: "bold"
    },
    instructorTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
    },
    salary: {
        paddingHorizontal: 8,
        marginVertical: 2,
        marginTop: 4
    },
    salaryText: {
        color: "#FF6600",
        fontSize: 20,
        fontWeight: "bold"
    },
    jobDetailSemiTitle: {
        color: "rgba(0,0,0,0.6)",
        fontSize: 11
    },
    jobDetailTitle: {
        fontWeight: "bold",
        fontSize: 12,
        marginBottom: 4,
        color: 'rgba(0,0,0,0.6)'
    },
    detail: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 2
    },
    detailIcon: {
        fontSize: 18,
        color: "rgba(0,0,0,0.6)",
        marginRight: 8,
        width: 24,
        textAlign: "center"
    },
    detailText: {
        flex: 1
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    statusTitle: {
        fontSize: 13,
        fontWeight: 500,
        padding: 8
    },
    statusPending: {
        fontSize: 14,
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 0.8)",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        margin: 4
    },
    statusAccepted: {
        fontSize: 14,
        fontWeight: "bold",
        color: "rgba(70, 170, 100, 1)",
        backgroundColor: "rgba(70, 170, 100, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        margin: 4
    },
    statusRejected: {
        fontSize: 14,
        fontWeight: "bold",
        color: "rgba(225, 50, 50, 1)",
        backgroundColor: "rgba(225, 50, 50, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        margin: 4
    },
    divider: {
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginVertical: 8,
        width: "95%",
        marginHorizontal: 'auto'
    },
})

export default JobBox;