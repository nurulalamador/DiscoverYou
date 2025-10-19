import Loading from "@/components/common/Loading";
import { formatDuration, serverUrl } from "@/components/constants";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useAuth from "../authContext";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from 'expo-document-picker';

export default function Inbox() {
    const [content, setContent] = useState<string>("");
    const { personId } = useLocalSearchParams();
    const [messages, setMessages] = useState<any>([]);
    const [person, setPerson] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updateFlag, setUpdateFlag] = useState(0);

    const [formData, setFormData] = useState({
        content: "",
        category: "Web Development",
        media: [] as {
            type: "image" | "video" | "audio";
            uri: string;
            duration: any;
        }[]
    });

    const { setUpdateMessage, updateMessage } = useAuth();

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                media: [...prev.media, { type: "image", uri: result.assets[0].uri, duration: null }]
            }));
        }
    }

    // Pick video
    async function pickVideo() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                media: [...prev.media, {
                    type: "video",
                    uri: result.assets[0].uri,
                    duration: result.assets[0].duration ? Math.round(result.assets[0].duration / 1000) : 0
                }]
            }));
        }
    }

    async function pickAudio() {
        let result = await DocumentPicker.getDocumentAsync({
            type: 'audio/*',
            copyToCacheDirectory: true
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {

            setFormData(prev => ({
                ...prev,
                media: [...prev.media, {
                    type: "audio",
                    uri: result.assets[0].uri,
                    duration: null,
                    // name: result.assets[0].name,
                    // mimeType: result.assets[0].mimeType,
                    // size: result.assets[0].size
                }]
            }));
        }
    }

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
                    setUpdateMessage((prev: any) => prev + 1);
                    // if (scrollViewRef.current) {
                    //     scrollViewRef.current.scrollToEnd({ animated: true });
                    // }
                })
                .catch(function (err) {
                    console.log("Messages data fetching failed:", err);
                    setLoading(false);
                });
        }

        loadMessages();
    }, [updateFlag, updateMessage]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
            setKeyboardVisible(true);
        });

        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    if (loading || !scrollViewRef) {
        return (
            <Loading />
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
                receiverId: personId,
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
        <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}
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
                                <Text style={styles.personActive}>Online</Text>
                            </View>
                        </>
                    }
                </View>
            </View>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.messageContainer}
                onContentSizeChange={() =>
                    scrollViewRef.current?.scrollToEnd({ animated: false })
                }
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
                        messages.map(function (msg: any, index: any) {

                            return <View key={index}
                                style={msg.sent_by_me ? styles.ownMessageBox : styles.otherMessageBox}>
                                <Text style={msg.sent_by_me ? styles.ownMessageText : styles.otherMessageText}>{msg.content}</Text>
                            </View>
                        })
                        : <></>
                }
            </ScrollView>
            <View style={isKeyboardVisible ? [styles.messageInputContainer, { marginBottom: 40 }] : styles.messageInputContainer}>
                {
                    formData.media.length > 0 &&
                    <ScrollView
                        style={styles.mediaContainer}
                        horizontal
                    >
                        {formData.media.map((file, index) => {
                            return (
                                <View key={index} style={styles.mediaBox}>
                                    <TouchableOpacity
                                        style={styles.mediaDelete}
                                        onPress={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                media: prev.media.filter((_, i) => i !== index)
                                            }));
                                        }}
                                    >
                                        <FontAwesome6 name="xmark" style={styles.mediaDeleteIcon} solid />
                                    </TouchableOpacity>
                                    {file.type === "image" ? (
                                        <Image
                                            source={{ uri: file.uri }}
                                            style={styles.mediaImage}
                                            contentFit="cover"
                                        />
                                    ) : file.type === "video" ? (
                                        <>
                                            <FontAwesome6 name="video" style={styles.mediaVideoIcon} solid />
                                            <Text style={styles.mediaVideoText}>{formatDuration(file.duration)}</Text>
                                        </>
                                    ) : file.type === "audio" ? (
                                        <>
                                            <FontAwesome6 name="microphone" style={styles.mediaVideoIcon} solid />
                                            <Text style={styles.mediaVideoText}>Audio</Text>
                                        </>
                                    ) : <></>
                                    }
                                </View>
                            )
                        })}
                    </ScrollView>
                }
                <View style={styles.inputContainer}>
                    <View style={styles.iconButtonContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            <FontAwesome6 name="image" style={styles.iconButton} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickVideo}>
                            <FontAwesome6 name="video" style={styles.iconButton} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickAudio}>
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
        borderColor: "rgba(0,0,0,0.4)",
        marginTop: 12
    },
    bigPseudoProfilePicture: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12
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
    },
    gap: {
        height: 8
    },
        mediaContainer: {
        paddingHorizontal: 2,
        paddingBottom: 4,
        marginBottom: 2,
        marginTop: 8
    },
    mediaBox: {
        width: 100,
        height: 100,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.1)",
        position: "relative",
        alignItems: 'center',
        justifyContent: 'center'
    },
    mediaDelete: {
        position: "absolute",
        right: 6,
        top: 6,
        zIndex: 99,
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)",
        backgroundColor: "rgba(255,255,255,0.8)",
        justifyContent: 'center',
        alignItems: 'center'
    },
    mediaDeleteIcon: {
        color: "rgba(0,0,0,0.8)",
    },

    mediaVideoText: {
        position: "absolute",
        left: 6,
        bottom: 6,
        fontSize: 12,
        marginTop: 6,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 8,
        paddingVertical: 2,
        color: "rgba(255,255,255,0.8)",
        borderRadius: 10
    },
    mediaVideoIcon: {
        fontSize: 32,
        color: "rgba(0,0,0,0.4)",
    },
    mediaImage: {
        width: "100%",
        height: "100%"
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center"
    }
});