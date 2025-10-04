import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import MaterialBox from "@/components/course/MaterialBox";



export default function Details() {
    const { courseId } = useLocalSearchParams();
    const [course, setCourse] = useState<any>();
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/course/single/${courseId}`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setCourse(data.course[0]);
                    setMaterials(data.materials);
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



    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeftContainer}>
                    <TouchableOpacity onPress={() => { router.back() }}>
                        <FontAwesome6 name="arrow-left" style={styles.headerBackIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Course</Text>
                </View>
            </View>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.gap} />
                {
                    course ?
                        <View style={styles.contentBox}>
                            {
                                course.cover_image_url ?
                                    <Image
                                        source={{ uri: serverUrl + course.cover_image_url }}
                                        style={styles.previewImage}
                                        contentFit="cover"
                                    /> :
                                    <View style={styles.pseudoPreviewImage}>
                                        <FontAwesome6 name="book" style={styles.pseudoPreviewImageIcon} />
                                    </View>
                            }
                            <Text style={styles.title}>{course.name}</Text>
                            <View style={styles.category}>
                                <FontAwesome6 name={getCategoryIcon(course.category)} style={styles.categoryIcon} solid />
                                <Text numberOfLines={1} style={styles.categoryText}>{course.category}</Text>
                            </View>
                            <Text style={styles.description}>
                                {course.description}
                            </Text>
                            <View style={styles.divider} />
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
                            <View style={styles.divider} />
                            <View style={styles.detailsContainer}>
                                <View style={styles.detail}>
                                    {/* <FontAwesome6 name="user" style={styles.detailIcon} solid /> */}
                                    <Text style={styles.detailTitle}>45</Text>
                                    <Text style={styles.detailSemiTitle}>Students</Text>
                                </View>
                                <View style={styles.detailDivider} />
                                <View style={styles.detail}>
                                    {/* <FontAwesome6 name="video" style={styles.detailIcon} solid /> */}
                                    <Text style={styles.detailTitle}>32</Text>
                                    <Text style={styles.detailSemiTitle}>Materials</Text>
                                </View>
                                <View style={styles.detailDivider} />
                                <View style={styles.detail}>
                                    {/* <FontAwesome6 name="star" style={styles.detailIcon} solid /> */}
                                    <Text style={styles.detailTitle}>5.0</Text>
                                    <Text style={styles.detailSemiTitle}>Ratings</Text>
                                </View>
                            </View>
                        </View>
                        : <></>
                }
                <View style={styles.contentBox}>
                    <Text style={styles.materialTitle}>Course Contents</Text>
                    <View style={styles.divider} />
                    {
                        (course && materials) ?
                            materials.length ?
                                materials.map(function (material) {
                                    return <MaterialBox key={material.id} material={material} isEnrolled={course.is_enrolled} />
                                }) :
                                <View style={styles.notFound}>
                                    <FontAwesome6 name="file" style={styles.notFoundIcon} solid />
                                    <Text style={styles.notFoundTitle}>No Materials</Text>
                                </View>
                            : <></>
                    }
                </View>
                <View style={styles.gap} />
            </ScrollView>
            {
                course &&
                !course.is_enrolled &&
                <View style={styles.enrollContainer}>
                    <View style={styles.coursePrice}>
                        <Text style={styles.coursePriceSemiTitle}>Course Fee</Text>
                        <Text style={styles.coursePriceTitle}>৳100</Text>
                    </View>
                    <TouchableOpacity style={styles.enrolledButton}>
                        <Text style={styles.enrolledButtonText}>Enroll</Text>
                    </TouchableOpacity>
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
    header: {
        paddingHorizontal: 18,
        paddingVertical: 14,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
        borderBottomWidth: 1,
        // elevation: 6,
    },
    headerLeftContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    headerBackIcon: {
        fontSize: 20,
        margin: 4,
        marginRight: 16
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "rgba(0, 0, 0, 0.8)",
        margin: 4
    },
    contentContainer: {
        paddingHorizontal: 8
    },
    gap: {
        height: 8
    },
    contentBox: {
        margin: 8,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 14,
        padding: 8
    },
    previewImage: {
        width: '100%',
        height: 240,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
    },
    pseudoPreviewImage: {
        width: '100%',
        height: 240,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        backgroundColor: "rgba(0,0,0,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    pseudoPreviewImageIcon: {
        fontSize: 100,
        color: 'rgba(0,0,0,0.4)'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 8,
        marginVertical: 12,
        color: "rgba(0,0,0,0.8)"
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
        overflow: 'hidden',
        maxWidth: '100%',
        marginHorizontal: 8,
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
        marginHorizontal: 8,
        textAlign: 'justify',
        marginTop: 12,
        color: "rgba(0,0,0,0.6)"
    },
    instructorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 8,
    },
    instructorSemiTitle: {
        color: "#FF6600",
        fontSize: 12,
        fontWeight: "bold"
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
        borderColor: "rgba(0,0,0,0.2)",
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
    divider: {
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginVertical: 12,
        width: "95%",
        marginHorizontal: 'auto'
    },
    detailsContainer: {
        flexDirection: "row",
        marginHorizontal: 8,
        marginBottom: 8,
        alignItems: 'center'
    },
    detail: {
        flex: 1,
        alignItems: 'center'
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 2,
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
    materialTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 8,
        marginVertical: 8,
        marginBottom: 4,
        color: "rgba(0,0,0,0.8)"
    },
    notFound: {
        height: 200,
        alignItems: "center",
        justifyContent: "center"
    },
    notFoundIcon: {
        fontSize: 80,
        color: 'rgba(0,0,0,0.6)'
    },
    notFoundTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.6)',
        marginTop: 10
    },
    enrollContainer: {
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "rgba(0, 0, 0, 0.1)",
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6
    },
    coursePrice: {
        marginHorizontal: 14,
    },
    coursePriceSemiTitle: {
        color: 'rgba(0,0,0,0.6)'
    },
    coursePriceTitle: {
        color: '#FF6600',
        fontWeight: "bold",
        fontSize: 20
    },
    enrolledButton: {
        flex: 1,
        backgroundColor: '#FF6600',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    enrolledButtonText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 15,
    },
});