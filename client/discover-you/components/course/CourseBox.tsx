import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

function CourseBox({ course }: any) {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.courseBox} onPress={()=>{router.push({ pathname: "/(course)/details", params: {courseId: course.id}})}}>
            {
                course.cover_image_url ?
                    <Image
                        source={{ uri: serverUrl + course.cover_image_url }}
                        style={styles.previewImage}
                    /> :
                    <View style={styles.pseudoPreviewImage}>
                        <FontAwesome6 name="book" size={64} color="rgba(0,0,0,0.4)/" />
                    </View>
            }

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
        borderColor: "rgba(0,0,0,0.1)"
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
    },
    previewImage: {
        width: 130,
        height: 130,
        margin: 8,
        borderRadius: 8,
        resizeMode: "contain",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)"
    },
    pseudoPreviewImage: {
        width: 130,
        height: 130,
        margin: 8,
        borderRadius: 8,
        backgroundColor: "rgba(0,0,0,0.1)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)"
    },
    details: {
        marginLeft: 4,
        marginRight: 12,
        flex: 1
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 15,
        resizeMode: "contain",
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
        alignItems: "center"
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
    progressTexts: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
        marginBottom: 4
    },
    progressTitle: {
        fontSize: 11,
        color: 'rgba(0,0,0,0.6)'
    },
    progressPercentage: {
        fontSize: 11,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
    }
})

export default CourseBox;