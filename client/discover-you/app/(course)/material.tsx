import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import { useVideoPlayer, VideoView } from "expo-video";
import InsideMaterialBox from "@/components/course/InsideMaterialBox";
import Header from "@/components/common/Header";
import NotFound from "@/components/common/NotFound";
import useAuth from "../authContext";
import Loading from "@/components/common/Loading";


export default function Material() {
    const { courseId, materialId } = useLocalSearchParams();
    const { user, setUpdateCourseTab } = useAuth();
    const [course, setCourse] = useState<any>();
    const [materials, setMaterials] = useState<any[]>([]);
    const [material, setMaterial] = useState<any>();
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const [videoSource, setVideoSource] = useState(`${serverUrl}/course/material/${courseId}/${materialId}/${user.id}`);
    console.log(videoSource);

    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = true; // Loop the video
        player.play(); // Autoplay the video
    });

    function changeMaterial(materialId: any) {
        setMaterial(materials.filter(function (material: any) { return material.id == materialId })[0]);
        setVideoSource(`${serverUrl}/course/material/${courseId}/${materialId}/${user.id}`)
    }

    useEffect(() => {
        console.log("hrll");
        function loadData() {
            fetch(`${serverUrl}/course/single/${courseId}`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setCourse(data.course);
                    setMaterials(data.materials);
                    setMaterial(data.materials.filter(function (material: any) { return material.id == materialId })[0]);
                    setUpdateCourseTab((old:any)=>old+1);
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

    if(loading) {
        return <Loading/>
    }

    return (
        <View style={styles.container}>
            <Header title="Material" />
            <ScrollView style={styles.contentContainer}>
                <View style={styles.gap} />
                {material && course ?
                    <View style={styles.videoBox}>
                        <VideoView
                            style={styles.video}
                            player={player}
                            fullscreenOptions={
                                {
                                    enable: true,
                                    orientation: 'landscape'
                                }
                            } // Allow fullscreen toggle
                            allowsPictureInPicture // Allow picture-in-picture mode
                            nativeControls // Use native video controls
                        />
                        <View style={styles.videoDetails}>
                            <Text style={styles.title}>{material.name}</Text>
                            <Text style={styles.semiTitle}>{course.name}</Text>
                            <View style={styles.category}>
                                <FontAwesome6 name="video" style={styles.categoryIcon} solid />
                                <Text numberOfLines={1} style={styles.categoryText}>Video Lecture</Text>
                            </View>
                        </View>
                    </View>
                    : <></>
                }
                <View style={styles.contentBox}>
                    <Text style={styles.sectionTitle}>Course Contentos</Text>
                    <View style={styles.divider} />
                    {
                        (course && materials) ?
                            materials.length ?
                                materials.map(function (materialProp) {
                                    return <InsideMaterialBox key={materialProp.id} material={materialProp} isEnrolled={course.is_enrolled} isActive={material.id == materialProp.id} onPressFunction={() => { changeMaterial(materialProp.id) }} />
                                }) :
                                <NotFound title="No Materials" icon="file" />
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
    contentContainer: {
        paddingHorizontal: 8,
        width: "100%"
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 8,
        color: "rgba(0,0,0,0.8)"
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 8,
        marginVertical: 6,
        color: "rgba(0,0,0,0.8)"
    },
    semiTitle: {
        marginHorizontal: 8,
        color: "rgba(0,0,0,0.6)",
        fontSize: 14
    },
    category: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 8,
        overflow: 'hidden',
        maxWidth: '100%',
        margin: 8,
        marginTop: 12
    },
    categoryText: {
        color: "rgba(0,0,0,0.5)",
        fontWeight: "bold",
        fontSize: 12
    },
    categoryIcon: {
        fontSize: 14,
        color: "rgba(0,0,0,0.5)"
    },
    divider: {
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginVertical: 8,
        width: "95%",
        marginHorizontal: 'auto'
    },
    videoBox: {
        margin: 6,
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