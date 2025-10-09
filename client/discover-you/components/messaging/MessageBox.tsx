import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { serverUrl, timeAgo } from "../constants";
import { useRouter } from "expo-router";

export default function MessageBox({ message }: { message: any }) {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.messageBox}
            onPress={()=>{
                router.push({
                    pathname: '/(message)/inbox',
                    params: { personId: message.person_id }
                });
            }}
        >
            {
                message.person_profile_picture_url ?
                    <Image
                        source={{ uri: serverUrl + message.person_profile_picture_url }}
                        style={styles.profilePicture}
                        contentFit="cover"
                    /> :
                    <View style={styles.pseudoProfilePicture}>
                        <Text style={styles.pseudoProfilePictureText}>{message.person_name[0]}</Text>
                    </View>
            }
            <View style={styles.messageContent}>
                <Text style={styles.personName}>{message.person_name}</Text>
                <Text style={styles.messageText} numberOfLines={1} ellipsizeMode="tail">
                    <Text style={{fontWeight: 600}}>{message.sent_by_me ? "You: " : ""}</Text>
                    {message.content}
                </Text>
            </View>
            <View>
                <Text style={styles.timeAgo}>{timeAgo(message.send_at)}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    messageBox: {
        margin: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePicture: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)"
    },
    pseudoProfilePicture: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center'
    },
    pseudoProfilePictureText: {
        fontSize: 24,
        color: 'rgba(0,0,0,0.6)'
    },
    messageContent: {
        marginLeft: 12,
        flex: 1
    },
    personName: {
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.8)',
        fontSize: 15
    },
    messageText: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 14,
        marginTop: 2
    },
    timeAgo: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.4)',
        margin: 4
    }
});