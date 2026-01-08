import { StyleSheet, Text, View } from "react-native";
import { serverUrl } from "../constants";
import { useEffect, useState } from "react";
import PostBox from "./PostBox";
import useAuth from "@/app/authContext";
import Loading from "../common/Loading";
import FilterBox from "../common/FilterBox";
import NotFound from "../common/NotFound";

export default function ForYouPosts() {
    const [posts, setPosts] = useState<any[]>([]);
    const [originalPosts, setOriginalPosts] = useState<any[]>([]);
    const { updateShowcase } = useAuth();
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
                    setOriginalPosts(data.posts || []);
                })
                .catch(function (err) {
                    console.log("Posts data fetching failed:", err);
                })
                .finally(function () {
                    setLoading(false);
                });
        }
        loadData();
    }, [updateShowcase]);

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <FilterBox sort={["Newest First", "Most Liked"]} setData={setPosts} from="showcase" originalData={originalPosts} />
            <View style={styles.postContainer}>
                {
                    posts.length ?
                    posts.map(function (post) {
                        return (
                            <PostBox key={post.id} post={post} />
                        )
                    })
                    : <NotFound title="No Post Found" icon="photo-film"/>
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        marginHorizontal: 8
    }
});