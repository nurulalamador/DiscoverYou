import { serverUrl } from "@/components/constants";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Inbox() {
    const [content, setContent] = useState<string>("");
    const { personId } = useLocalSearchParams();
    const [messages, setMessages] = useState<any>([]);
    const [person, setPerson] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updateFlag, setUpdateFlag] = useState(0);

    const scrollViewRef = useRef<ScrollView>(null);

    const router = useRouter();

    useEffect(() => {
        let intervalId: any;

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
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                })
                .catch(function (err) {
                    console.log("Messages data fetching failed:", err);
                    setLoading(false);
                });
        }

        loadMessages();
        intervalId = setInterval(loadMessages, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [updateFlag]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    function sendMessage() {
        console.log("Sending message:", content);

        fetch(`${serverUrl}/messaging/send`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                receiverId: personId,
                content: content
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
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
        <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}
            keyboardVerticalOffset={40}
        >
            <View style={styles.header}>
                <View style={styles.headerLeftContainer}>
                    <TouchableOpacity onPress={() => { router.back() }}>
                        <FontAwesome6 name="arrow-left" style={styles.headerBackIcon} />
                    </TouchableOpacity>
                    {
                        person &&
                        <>
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
                        </>
                    }
                </View>
            </View>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.messageContainer}
            >
                {
                    person &&
                    <View style={styles.personDetails}>
                        {
                            person?.profile_picture_url ?
                                <Image
                                    source={{ uri: serverUrl + person.profile_picture_url }}
                                    style={styles.bigProfilePicture}
                                    contentFit="cover"
                                /> :
                                <View style={styles.bigPseudoProfilePicture}>
                                    <Text style={styles.bigPseudoProfilePictureText}>{person.full_name[0]}</Text>
                                </View>
                        }
                        <Text style={styles.personBigName}>{person.full_name}</Text>
                        <TouchableOpacity style={styles.viewProfileButton}
                            onPress={() => {
                                router.push({
                                    pathname: "/(other)/profile",
                                    params: { personId: personId }
                                })
                            }}
                        >
                            <Text style={styles.viewProfileText}>View Profile</Text>
                            <FontAwesome6 name="chevron-right" style={styles.viewProfileIcon} />
                        </TouchableOpacity>
                    </View>
                }
                {
                    messages &&
                        messages.length ?
                        messages.map(function (msg: any) {

                            return msg.sent_by_me ? <View key={msg.id} style={styles.ownMessageBox}>
                                <Text style={styles.ownMessageText}>{msg.content}</Text>
                            </View>
                                : <View key={msg.id} style={styles.otherMessageBox}>
                                    <Text style={styles.otherMessageText}>{msg.content}</Text>
                                </View>
                        })
                        : <></>
                }
            </ScrollView>
            <View style={styles.messageInputContainer}>
                <View style={styles.iconButtonContainer}>
                    <TouchableOpacity onPress={() => { }}>
                        <FontAwesome6 name="image" style={styles.iconButton} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }}>
                        <FontAwesome6 name="video" style={styles.iconButton} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome6 name="microphone" style={styles.iconButton} />
                    </TouchableOpacity>
                </View>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    style={styles.messageInput}
                    placeholder="Type a message..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Ionicons name="send" style={styles.sendButtonIcon} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 14,
        backgroundColor: 'rgba(0,0,0,0.1)',
        margin: 6,
        marginVertical: 4
    },
    sendButton: {
        margin: 8
    },
    sendButtonIcon: {
        color: '#FF6600',
        fontSize: 28
    },
    ownMessageBox: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(255, 102, 0, 1)',
        padding: 10,
        borderRadius: 10,
        margin: 4,
        paddingHorizontal: 14
    },
    otherMessageBox: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        margin: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    ownMessageText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 500
    },
    otherMessageText: {
        color: '#000000',
        fontSize: 15,
    },
    messageContainer: {
        flexGrow: 1,
        padding: 10,
        justifyContent: 'flex-end',
    },
    iconButtonContainer: {
        flexDirection: "row",
        paddingHorizontal: 2
    },
    iconButton: {
        width: 34,
        height: 34,
        marginHorizontal: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        backgroundColor: "rgba(0,0,0,0.1)",
        color: "rgba(0,0,0,0.6)",
    },
    personDetails: {
        alignItems: 'center',
        marginBottom: 18
    },
    bigProfilePicture: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.4)"
    },
    bigPseudoProfilePicture: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center'
    },
    bigPseudoProfilePictureText: {
        fontSize: 100,
        color: 'rgba(0,0,0,0.6)'
    },
    personBigName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.8)',
        marginTop: 16
    },
    viewProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8
    },
    viewProfileText: {
        fontSize: 15,
        color: '#FF6600',
        fontWeight: '600'
    },
    viewProfileIcon: {
        fontSize: 15,
        color: '#FF6600',
        marginLeft: 8
    }
});