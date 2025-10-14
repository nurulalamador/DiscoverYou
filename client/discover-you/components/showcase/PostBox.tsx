import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl, timeAgo } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";

function PostBox({ post }: any) {
    const router = useRouter();

    const [isReacted, setIsReacted] = useState<any>(post.is_reacted);
    const [totalReaction, setTotalReaction] = useState(post.total_reactions)

    function toggleLike() {
        fetch(`${serverUrl}/showcase/toggleLike`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postId: post.id
            }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    if (data.message == "liked") {
                        setIsReacted(true);
                        setTotalReaction((old: any) => parseInt(old) + 1);
                    }
                    else if (data.message == "unliked") {
                        setIsReacted(false);
                        setTotalReaction((old: any) => parseInt(old) - 1);
                    }
                }
                else {
                    console.log(data);
                }
            })
            .catch(error => {
                console.error("Login error:", error);
            });
    }

    return (
        <View style={styles.postBox} >
            <TouchableOpacity
                style={styles.creatorContainer}
                onPress={() => {
                    router.push({
                        pathname: "/(other)/profile",
                        params: {
                            personId: post.creator_id
                        }
                    })
                }}
            >
                {
                    post.creator_profile_picture_url ?
                        <Image
                            source={{ uri: serverUrl + post.creator_profile_picture_url }}
                            style={styles.profilePicture}
                            contentFit="cover"
                        /> :
                        <View style={styles.pseudoProfilePicture}>
                            <Text style={styles.pseudoProfilePictureText}>{post.creator_name[0]}</Text>
                        </View>
                }


                <View style={styles.creatorTitleContainer}>
                    <Text style={styles.creatorTitle}>
                        {post.creator_name}
                    </Text>
                    <Text style={styles.postTime}>
                        {timeAgo(post.created_at)}
                    </Text>
                </View>

            </TouchableOpacity>
            <Text style={styles.postContent}>
                {post.content}
            </Text>
            {
                post.media.length ?
                    <View style={styles.mediaContainer}>
                        {
                            post.media.map(function (medium: any, index: any) {
                                let mediaType = medium.type.split("/")[0];
                                let mediaUrl = serverUrl + medium.url;

                                return (
                                    <View key={index}>
                                        {mediaType === "image" ? (
                                            <Image
                                                source={{ uri: mediaUrl }}
                                                style={styles.postImage}
                                                contentFit="contain"
                                            />
                                        ) : mediaType === "video" ? (
                                            <VideoView
                                                style={styles.postVideo}
                                                player={useVideoPlayer(mediaUrl, player => {
                                                    player.loop = false;
                                                    player.play();
                                                })}
                                                fullscreenOptions={
                                                    {
                                                        enable: true,
                                                        orientation: 'landscape'
                                                    }
                                                }
                                                allowsPictureInPicture
                                                nativeControls
                                            />
                                        ) : null}
                                    </View>
                                )
                            })
                        }
                    </View>
                    : <></>
            }
            <View style={styles.detailsContainer}>
                <View style={styles.details}>
                    <Text style={styles.detailsText}>{totalReaction} Like</Text>
                    <FontAwesome6 style={styles.detailsDivider} name="circle" solid />
                    <Text style={styles.detailsText}>{post.total_comments} Comment</Text>
                </View>
                <View style={styles.category}>
                    <FontAwesome6 name={getCategoryIcon(post.category)} style={styles.categoryIcon} solid />

                    <Text numberOfLines={1} style={styles.categoryText}>{post.category}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
                    {
                        isReacted ?
                            <>
                                <FontAwesome6 style={styles.actionButtonIconActive} name="heart" solid />
                                <Text style={styles.actionButtonTextActive}>Liked</Text>
                            </>
                            :
                            <>
                                <FontAwesome6 style={styles.actionButtonIcon} name="heart" solid />
                                <Text style={styles.actionButtonText}>Like</Text>
                            </>
                    }
                </TouchableOpacity>
                <View style={styles.buttonDivider} />
                <TouchableOpacity style={styles.actionButton}
                    onPress={() => router.push({ pathname: "/(showcase)/post", params: { postId: post.id } })}
                >
                    <FontAwesome6 style={styles.actionButtonIcon} name="comment" solid />
                    <Text style={styles.actionButtonText}>Comment</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    postBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        margin: 6,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        padding: 8
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)"
    },
    pseudoProfilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center'
    },
    pseudoProfilePictureText: {
        fontSize: 20,
        color: 'rgba(0,0,0,0.6)'
    },
    creatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 6
    },
    postTime: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 13,
        marginTop: 2
    },
    creatorTitleContainer: {
        marginLeft: 12
    },
    creatorTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
    },
    postContent: {
        padding: 8,
        fontSize: 15
    },
    mediaContainer: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        height: 300,
        margin: 6,
        borderRadius: 8,
        overflow: "hidden",
    },
    postImage: {
        width: "100%",
        height: "100%",
    },
    postVideo: {
        width: '100%',
        height: "100%",
        backgroundColor: '#000',
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 6,

    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: "rgba(255, 102, 0, 0.2)",
        borderRadius: 8,
        margin: 2,
        marginVertical: 4,
        padding: 2
    },
    actionButtonText: {
        fontSize: 14,
        marginLeft: 8,
        color: 'rgba(0,0,0,0.6)',
        fontWeight: 500
    },
    actionButtonIcon: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 15
    },
    actionButtonTextActive: {
        fontSize: 14,
        marginLeft: 8,
        color: '#FF6600',
        fontWeight: 800
    },
    actionButtonIconActive: {
        color: '#FF6600',
        fontSize: 15
    },
    divider: {
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginBottom: 6,
        width: "97%",
        marginHorizontal: 'auto'
    },
    buttonDivider: {
        borderLeftColor: "rgba(0,0,0,0.1)",
        borderLeftWidth: 1,
        height: 24,
        marginHorizontal: 'auto'
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
    detailsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 6,
        marginBottom: 10,
        marginTop: 4
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    detailsDivider: {
        fontSize: 4,
        marginHorizontal: 6,
        color: 'rgba(0,0,0,0.6)'
    },
    detailsText: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.6)'
    },

    // title: {
    //     fontSize: 17,
    //     fontWeight: "bold",
    //     color: 'rgba(0,0,0,0.6)'
    // },
    // previewImage: {
    //     width: 130,
    //     height: 130,
    //     margin: 8,
    //     borderRadius: 8,
    //     borderWidth: 1,
    //     borderColor: "rgba(0,0,0,0.2)"
    // },
    // pseudoPreviewImage: {
    //     width: 130,
    //     height: 130,
    //     margin: 8,
    //     borderRadius: 8,
    //     backgroundColor: "rgba(0,0,0,0.1)",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     borderWidth: 1,
    //     borderColor: "rgba(0,0,0,0.2)"
    // },
    // details: {
    //     marginLeft: 4,
    //     marginRight: 12,
    //     flex: 1
    // },
    // progressTexts: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     marginTop: 6,
    //     marginBottom: 4
    // },
    // progressTitle: {
    //     fontSize: 11,
    //     color: 'rgba(0,0,0,0.6)'
    // },
    // progressPercentage: {
    //     fontSize: 11,
    //     fontWeight: "bold",
    //     color: 'rgba(0,0,0,0.6)'
    // }
})

export default PostBox;