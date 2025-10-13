import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl, timeAgo } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";

function CommentBox({ comment }: any) {
    const router = useRouter();

    return (
        <View style={styles.commentBox} >
            <View style={styles.creatorContainer}>
                {
                    comment.commenter_profile_picture_url ?
                        <Image
                            source={{ uri: serverUrl + comment.commenter_profile_picture_url }}
                            style={styles.profilePicture}
                            contentFit="cover"
                        /> :
                        <View style={styles.pseudoProfilePicture}>
                            <Text style={styles.pseudoProfilePictureText}>{comment.commenter_name[0]}</Text>
                        </View>
                }


                <View style={styles.creatorTitleContainer}>
                    <View>
                        <Text style={styles.creatorTitle}>
                            {comment.commenter_name}
                        </Text>
                        <Text style={styles.commentContent}>
                            {comment.content}
                        </Text>
                    </View>
                    <Text style={styles.commentTime}>
                        {timeAgo(comment.commented_at)}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    commentBox: {
        margin: 4,
        marginVertical: 6
    },
    profilePicture: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)"
    },
    pseudoProfilePicture: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center'
    },
    pseudoProfilePictureText: {
        fontSize: 18,
        color: 'rgba(0,0,0,0.6)'
    },
    creatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 6
    },
    commentTime: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 12,
        margin: 2
    },
    creatorTitleContainer: {
        flex: 1,
        marginLeft: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    creatorTitle: {
        fontSize: 13,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
    },
    commentContent: {
        fontSize: 15,
        marginTop: 2
    },
})

export default CommentBox;