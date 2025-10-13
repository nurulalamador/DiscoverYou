import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

function JobBox({ job }: any) {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.courseBox} onPress={() => { }}>
            <View style={styles.details}>
                <Text numberOfLines={2} style={styles.title}>{job.name}</Text>
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
            <View style={styles.salary}>
                <Text style={styles.salaryText}>৳{parseFloat(job.salary)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    courseBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        margin: 6,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        padding: 8
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
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
        padding: 8
    },
    salaryText: {
        color: "#FF6600",
        fontSize: 20,
        fontWeight: "bold"
    }
})

export default JobBox;