import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import CountdownTimer from "../common/Countdown";

function ContestBox({ contest }: any) {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.contestBox} onPress={() => {
            router.push({
                pathname: '/(contest)/details',
                params: { contestId: contest.id }
            })
        }}>
            <View style={styles.details}>

                <Text numberOfLines={2} style={styles.title}>{contest.name}</Text>
                <View style={styles.category}>
                    <FontAwesome6 name={getCategoryIcon(contest.category)} size={14} color="#FF6600" solid />

                    <Text numberOfLines={1} style={styles.categoryText}>{contest.category}</Text>
                </View>
                <View style={styles.instructorContainer}>
                    {
                        contest.organizer_profile_picture_url ?
                            <Image
                                source={{ uri: serverUrl + contest.organizer_profile_picture_url }}
                                style={styles.profilePicture}
                                contentFit="cover"
                            /> :
                            <View style={styles.pseudoProfilePicture}>
                                <Text style={styles.pseudoProfilePictureText}>{contest.organizer_name[0]}</Text>
                            </View>
                    }


                    <View>
                        <Text style={styles.instructorSemiTitle}>
                            Organized By
                        </Text>
                        <Text style={styles.instructorTitle}>
                            {contest.organizer_name}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    contestBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        margin: 6,
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
        overflow: 'hidden'
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
        fontWeight: "600"
    },
    instructorTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: 'rgba(0,0,0,0.6)'
    },
    countdownBox: {
        backgroundColor: "rgba(0,0,0,0.15)",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        margin: 4,
        marginTop: 8
    },
    countdownBoxText: {
        fontSize: 13,
        color: "rgba(0,0,0,0.6)"
    },
    countdownBoxCount: {
        fontWeight: "bold",
        color: "rgba(0,0,0,0.6)"
    }
})

export default ContestBox;