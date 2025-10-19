import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl, timeAgo } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";

function LeaderboardBox({ user, rank }: { user: any, rank?: number }) {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.userBox}
            onPress={() => {
                router.push({
                    pathname: '/(other)/profile',
                    params: { personId: user.id }
                })
            }}
        >
            <View style={styles.creatorContainer}>
                {
                    user.profile_picture_url ?
                        <Image
                            source={{ uri: serverUrl + user.profile_picture_url }}
                            style={styles.profilePicture}
                            contentFit="cover"
                        /> :
                        <View style={styles.pseudoProfilePicture}>
                            <Text style={styles.pseudoProfilePictureText}>{user.full_name[0]}</Text>
                        </View>
                }


                <View style={styles.creatorTitleContainer}>
                    <View>
                        <Text style={styles.creatorTitle}>
                            {user.full_name}
                        </Text>
                        <View style={styles.pointBox}>
                            <FontAwesome6 name="star" style={styles.pointBoxIcon} solid />
                            <Text style={styles.pointBoxCount}>{user.points}</Text>
                            <Text style={styles.pointBoxText}>POINTS</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.resultContainer}>
                <Text style={rank == 1 ? styles.resultText1st : rank == 2 ? styles.resultText2nd : rank == 3 ? styles.resultText3rd : styles.resultText}>{rank}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    userBox: {
        margin: 4,
        flexDirection: "row",
        alignItems: "center",
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
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 6
    },
    userTime: {
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
        fontSize: 14,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
    },
    userContent: {
        fontSize: 15,
        marginTop: 2
    },
    viewProfileBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4
    },
    viewProfileIcon: {
        marginLeft: 6,
        color: "#FF6600",
        fontSize: 13,
    },
    viewProfileText: {
        fontSize: 13,
        fontWeight: 600,
        color: "#FF6600"
    },
    resultContainer: {
        margin: 6
    },
    resultText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "rgba(0,0,0,0.4)",
        width: 26,
        textAlign: "center"
    },
    resultText1st: {
        fontSize: 14,
        fontWeight: "bold",
        backgroundColor: "#ffbb00",
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 3,
        color: "#FFFFFF",
        width: 26,
        textAlign: "center"
    },
    resultText2nd: {
        fontSize: 14,
        fontWeight: "bold",
        backgroundColor: "#C0C0C0",
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 3,
        color: "#FFFFFF",
        width: 26,
        textAlign: "center"
    },
    resultText3rd: {
        fontSize: 14,
        fontWeight: "bold",
        backgroundColor: "#CD7F32",
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 3,
        color: "#FFFFFF",
        width: 26,
        textAlign: "center"
    },
    pointBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 3
    },
    pointBoxIcon: {
        marginRight: 2,
        color: "#FF6600",
        fontSize: 12
    },
    pointBoxCount: {
        marginHorizontal: 4,
        fontSize: 14,
        fontWeight: 900,
        color: "#FF6600"
    },
    pointBoxText: {
        fontSize: 13,
        fontWeight: 500,
        color: "#FF6600"
    }
})

export default LeaderboardBox;