import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl, timeAgo } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";

function ParticipantBox({ participant }: any) {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.participantBox} 
            onPress={() => {
                router.push({
                    pathname: '/(other)/profile',
                    params: { personId: participant.id }
                })
            }}
        >
            <View style={styles.creatorContainer}>
                {
                    participant.profile_picture_url ?
                        <Image
                            source={{ uri: serverUrl + participant.profile_picture_url }}
                            style={styles.profilePicture}
                            contentFit="cover"
                        /> :
                        <View style={styles.pseudoProfilePicture}>
                            <Text style={styles.pseudoProfilePictureText}>{participant.full_name[0]}</Text>
                        </View>
                }


                <View style={styles.creatorTitleContainer}>
                    <View>
                        <Text style={styles.creatorTitle}>
                            {participant.full_name}
                        </Text>
                        <View style={styles.pointBox}>
                            <FontAwesome6 name="star" style={styles.pointBoxIcon} solid />
                            <Text style={styles.pointBoxCount}>{participant.points}</Text>
                            <Text style={styles.pointBoxText}>POINTS</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    participantBox: {
        margin: 4
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
    participantTime: {
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
    participantContent: {
        fontSize: 15,
        marginTop: 2
    },
    pointBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2
    },
    pointBoxIcon: {
        marginRight: 2,
        color: "#FF6600",
        fontSize: 12,
    },
    pointBoxCount: {
        marginHorizontal: 4,
        fontSize: 15,
        fontWeight: 900,
        color: "#FF6600"
    },
    pointBoxText: {
        fontSize: 13,
        fontWeight: 500,
        color: "#FF6600"
    }
})

export default ParticipantBox;