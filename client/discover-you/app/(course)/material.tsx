import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import MaterialBox from "@/components/course/MaterialBox";
import { ResizeMode, Video } from "expo-av";



export default function Material() {
    const { courseId, materialId } = useLocalSearchParams();
    const [course, setCourse] = useState<any>();
    const [materials, setMaterials] = useState<any[]>([]);
    const [material, setMaterial] = useState<any>();
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const videoUri = `${serverUrl}/course/material/${materialId}`;
    console.log(videoUri);

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
                    setMaterial(data.materials.filter(function (material: any) { return material.id == materialId })[0]);
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
                    <Text style={styles.headerTitle}>Material</Text>
                </View>
            </View>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.gap} />
                {material ?
                    <View style={styles.videoBox}>
                        <Video
                            source={{ uri: videoUri }}
                            style={styles.video}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                        />
                        <View style={styles.videoDetails}>
                            <Text style={styles.title}>{material.name}</Text>
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
                                    return <MaterialBox key={material.id} material={material} isEnrolled={course.is_enrolled} isActive={materialId == material.id} />
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
        paddingHorizontal: 8,
        width: "100%"
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
        resizeMode: "cover",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
    },
    pseudoPreviewImage: {
        width: '100%',
        height: 240,
        borderRadius: 8,
        resizeMode: "cover",
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
        resizeMode: "contain",
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
    videoBox: {
        margin: 8,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 14,
        overflow: "hidden"
    },
    video: {
        width: "100%",
        aspectRatio: 16 / 9,
        borderBottomColor: 'rgba(0,0,0,0.2)',
        borderBottomWidth: 1
    },
    videoDetails: {
        padding: 8
    }
});