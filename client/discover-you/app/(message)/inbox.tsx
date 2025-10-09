import { serverUrl } from "@/components/constants";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Inbox() {
    const [content, setContent] = useState<string>("");
    const { personId } = useLocalSearchParams();
    const [messages, setMessages] = useState<any>([]);
    const [person, setPerson] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updateFlag, setUpdateFlag] = useState(0);

    const router = useRouter();

    useEffect(() => {
        function loadMessages() {
            fetch(`${serverUrl}/messaging/inbox/${personId}`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setMessages(data.messages);
                    setPerson(data.person);
                    setLoading(false);
                })
                .catch(function (err) {
                    console.log("Messages data fetching failed:", err);
                    setLoading(false);
                });
        }
        loadMessages();
    }, [updateFlag]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    function sendMessage() {
        fetch(`${serverUrl}/messaging/send`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                person_id: personId,
                content: content
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMessages((prevMessages: any) => [...prevMessages, data.message]);
                    setContent("");
                    setUpdateFlag(prev => prev + 1);
                }
            })
            .catch(function (err) {
                console.log("Message sending failed:", err);
            });
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            {
                person &&
                <View style={styles.header}>
                    <View style={styles.headerLeftContainer}>
                        <TouchableOpacity onPress={() => { router.back() }}>
                            <FontAwesome6 name="arrow-left" style={styles.headerBackIcon} />
                        </TouchableOpacity>
                        {
                            person?.profile_picture_url ?
                                <Image
                                    source={{ uri: serverUrl + person.profile_picture_url }}
                                    style={styles.profilePicture}
                                    contentFit="cover"
                                /> :
                                <View style={styles.pseudoProfilePicture}>
                                    <Text style={styles.pseudoProfilePictureText}>{person.full_name[0]}</Text>
                                </View>
                        }
                        <View style={styles.headerDetails}>
                            <Text style={styles.personName}>{person.full_name}</Text>
                            <Text style={styles.personActive}>1h ago</Text>
                        </View>
                    </View>
                </View>
            }
            <ScrollView contentContainerStyle={{ padding: 10, flexGrow: 1, flexDirection: 'column-reverse' }}>
                {
                    messages &&
                        messages.length ?
                        messages.map(function (msg: any) {

                            return msg.sent_by_me ? <View key={msg.id} style={styles.otherMessageBox}>
                                <Text style={styles.otherMessageText}>{msg.content}</Text>
                            </View>
                                : <View key={msg.id} style={styles.ownMessageBox}>
                                    <Text style={styles.ownMessageText}>{msg.content}</Text>
                                </View>
                        })
                        : <View style={{ padding: 12 }}><Text>No Messages</Text></View>
                }
            </ScrollView>
            <View style={styles.messageInputContainer}>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    style={styles.messageInput}
                    placeholder="Type a message..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                    <FontAwesome6 name="paper-plane" style={styles.sendButtonIcon} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE"
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
        borderBottomWidth: 1,
        // elevation: 6,
    },
    headerLeftContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    headerBackIcon: {
        fontSize: 18,
        margin: 4,
        marginRight: 16
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "rgba(0, 0, 0, 0.8)",
        margin: 4
    },
    profilePicture: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)"
    },
    pseudoProfilePicture: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center'
    },
    pseudoProfilePictureText: {
        fontSize: 22,
        color: 'rgba(0,0,0,0.6)'
    },
    headerDetails: {
        marginLeft: 12
    },
    personName: {
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.8)',
        fontSize: 15
    },
    personActive: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.6)',
        marginTop: 1
    },
    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 8,
        borderTopColor: "rgba(0,0,0,0.1)",
        borderTopWidth: 1
    },
    messageInput: {
        flex: 1,
        height: 40,
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(0,0,0,0.1)',
        margin: 6
    },
    sendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6600',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        margin: 6
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginRight: 6
    },
    sendButtonIcon: {
        color: '#FFFFFF',
        fontSize: 16
    },
    ownMessageBox: {
        alignSelf: 'flex-end',
        backgroundColor: '#FF6600',
        padding: 10,
        borderRadius: 10,
        marginVertical: 4,
        paddingHorizontal: 14,
    },
    otherMessageBox: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    ownMessageText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 500
    },
    otherMessageText: {
        color: '#000000',
        fontSize: 14,
    }
});