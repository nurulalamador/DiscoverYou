import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import CircularProgress from "../common/CircularProgress";

function EnrolledCourseBoxAlt({ course }: any) {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.courseBox} onPress={() => { router.push({ pathname: "/(course)/details", params: { courseId: course.id } }) }}>
            <View style={styles.details}>

                <Text numberOfLines={2} style={styles.title}>{course.name}</Text>
                <View style={styles.category}>
                    <FontAwesome6 name={getCategoryIcon(course.category)} style={styles.categoryIcon} solid />

                    <Text numberOfLines={1} style={styles.categoryText}>{course.category}</Text>
                </View>
                <View style={styles.instructorContainer}>
                    {
                        course.profile_picture_url ?
                            <Image
                                source={{ uri: serverUrl + course.profile_picture_url }}
                                style={styles.profilePicture}
                                contentFit="cover"
                            /> :
                            <View style={styles.pseudoProfilePicture}>
                                <Text style={styles.pseudoProfilePictureText}>{course.instructor_name[0]}</Text>
                            </View>
                    }


                    <View>
                        <Text style={styles.instructorSemiTitle}>
                            Instructed By
                        </Text>
                        <Text style={styles.instructorTitle}>
                            {course.instructor_name}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.circularContainer}>
                <CircularProgress progress={course.completed} />
                <Text style={styles.completedTitle}>Completed</Text>
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
        borderColor: "rgba(0,0,0,0.4)"
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
        margin: 6,
        flex: 1
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)",
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
        marginTop: 8
    },
    instructorSemiTitle: {
        color: "#FF6600",
        fontSize: 11,
        fontWeight: 600
    },
    instructorTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
    },
    circularContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 8
    },
    completedTitle: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: 500,
        color: 'rgba(0,0,0,0.6)'
    }
})

export default EnrolledCourseBoxAlt;