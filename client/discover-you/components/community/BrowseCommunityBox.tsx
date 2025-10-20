import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import useAuth from "@/app/authContext";
import { useState } from "react";

function BrowseCommunityBox({ community }: any) {
    const router = useRouter();
    const [isJoined, setIsJoined] = useState(false);
    const { setUpdateMessage } = useAuth();

    function joinCommunity() {
        fetch(`${serverUrl}/community/join`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                communityId: community.id
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    setIsJoined(true);
                    setUpdateMessage((prev: any) => prev + 1);
                }
            })
            .catch(function (err) {
                console.log("Joining community failed:", err);
            });
    }

    return (
        <View style={styles.communityBox}>
            <View style={styles.details}>

                <Text numberOfLines={2} style={styles.title}>{community.name}</Text>
                <View style={styles.category}>
                    <FontAwesome6 name={getCategoryIcon(community.category)} size={14} color="#FF6600" solid />

                    <Text numberOfLines={1} style={styles.categoryText}>{community.category}</Text>
                </View>
                <View style={styles.instructorContainer}>
                    {
                        community.creator_profile_picture_url ?
                            <Image
                                source={{ uri: serverUrl + community.creator_profile_picture_url }}
                                style={styles.profilePicture}
                                contentFit="cover"
                            /> :
                            <View style={styles.pseudoProfilePicture}>
                                <Text style={styles.pseudoProfilePictureText}>{community.creator_name[0]}</Text>
                            </View>
                    }


                    <View>
                        <Text style={styles.instructorSemiTitle}>
                            Created By
                        </Text>
                        <Text style={styles.instructorTitle}>
                            {community.creator_name}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.joinContainer}>
                {isJoined ?
                    <Text style={{padding: 6, color: "#FF6600", fontWeight: "bold"}}>Joined</Text>
                    :
                    <TouchableOpacity style={styles.joinButton} onPress={joinCommunity}>
                        <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    communityBox: {
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
        width: 124,
        height: 124,
        margin: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)"
    },
    pseudoPreviewImage: {
        width: 124,
        height: 124,
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
        marginBottom: 12,
        overflow: 'hidden',
        maxWidth: '100%'
    },
    categoryText: {
        color: "#FF6600",
        fontWeight: "bold",
        fontSize: 12,
        maxWidth: 120
    },
    instructorContainer: {
        flexDirection: "row",
        alignItems: "center"
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
    joinContainer: {
        margin: 6
    },
    joinButton: {
        backgroundColor: '#FF6600',
        padding: 14,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        margin: 2,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    joinButtonText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 15,
    }
})

export default BrowseCommunityBox;