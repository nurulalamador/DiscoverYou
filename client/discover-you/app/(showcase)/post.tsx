import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import MaterialBox from "@/components/course/MaterialBox";
import CourseBox from "@/components/course/CourseBox";
import Header from "@/components/common/Header";
import useAuth from "../authContext";
import PostBox from "@/components/showcase/PostBox";
import NotFound from "@/components/common/NotFound";
import DoCommentBox from "@/components/showcase/DoCommentBox";
import CommentBox from "@/components/showcase/CommentBox";
import Loading from "@/components/common/Loading";


export default function Post() {
    const { postId } = useLocalSearchParams();
    const {updateShowcaseTab} = useAuth();

    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/showcase/post/${postId}`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setPost(data.post);
                })
                .catch(function (err) {
                    console.log("Showcase data fetching failed:", err);
                })
                .finally(function () {
                    setLoading(false);
                });
        }
        loadData();
    }, [updateShowcaseTab]);

    if(loading) {
        return <Loading/>
    }

    return (
        <View style={styles.container}>
            <Header title="Post" />
            <View style={styles.gap} />
            {
                post &&
                <ScrollView style={styles.postContainer}>
                    <PostBox post={post} />
                    <DoCommentBox postId={post.id} />
                    <View style={styles.sectionBox}>
                        <Text style={styles.sectionTitle}>Comments</Text>
                        <View style={styles.divider} />
                        {
                            post.comments.length ?
                                post.comments.map(function (comment: any) {
                                    return <CommentBox key={comment.id} comment={comment} />
                                })
                                :
                                <NotFound title="No Comments Yet" icon="comments" />
                        }
                    </View>
                    <View style={styles.gap} />
                </ScrollView>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE"
    },
    postContainer: {
        marginHorizontal: 8
    },
    gap: {
        height: 8
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 8,
        color: "rgba(0,0,0,0.8)"
    },
    sectionBox: {
        margin: 6,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 14,
        padding: 8
    },
    divider: {
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginVertical: 8,
        width: "95%",
        marginHorizontal: 'auto'
    },
});