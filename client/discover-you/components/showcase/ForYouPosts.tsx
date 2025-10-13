import { StyleSheet, Text, View } from "react-native";
import { serverUrl } from "../constants";
import { useEffect, useState } from "react";
import PostBox from "./PostBox";
import useAuth from "@/app/authContext";
import Loading from "../common/Loading";

export default function ForYouPosts() {
    const [posts, setPosts] = useState<any[]>([]);
    const {updateShowcaseTab} = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/showcase/posts`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setPosts(data.posts);
                })
                .catch(function (err) {
                    console.log("Posts data fetching failed:", err);
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
        <View style={styles.postContainer}>
            {
                posts.map(function(post){
                    return (
                        <PostBox key={post.id} post={post}/>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        marginHorizontal: 8
    }
});