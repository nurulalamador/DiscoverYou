import { FontAwesome6 } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl, categories, formatDuration } from "../constants";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { MediaType } from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import useAuth from "@/app/authContext";
import { useVideoPlayer, VideoPlayer, VideoView } from "expo-video";

function DoPostBox({ setUpdatePosts }: any) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        content: "",
        category: "Web Development",
        media: [] as {
            type: "image" | "video" | "audio";
            uri: string;
            duration: any;
        }[]
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [isReady, setIsReady] = useState(true);

    // Pick image
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

    function handleInputChange(name: string, value: any) {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit() {
        if (!formData.content) {
            ToastAndroid.show('Please write something to post!', ToastAndroid.SHORT);
            return;
        }

        const form = new FormData();
        form.append("content", formData.content);
        form.append("category", formData.category);

        formData.media.forEach((m, idx) => {
            form.append("media", {
                uri: m.uri,
                name: `file_${idx}.${m.type === "image" ? "jpg" : m.type === "video" ? "mp4" : "m4a"}`,
                type: m.type === "image" ? "image/jpeg" :
                    m.type === "video" ? "video/mp4" : "audio/m4a"
            } as any);
        });


        fetch(`${serverUrl}/showcase/addPost`, {
            method: "POST",
            credentials: "include",
            body: form
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log("Login response data:", data);
                if (data.success) {
                    ToastAndroid.show(("Successfully Posted!"), ToastAndroid.SHORT);

                    setUpdatePosts((old: any) => old + 1);

                    setFormData({
                        content: "",
                        category: "Web Development",
                        media: []
                    });
                }
                else {
                    ToastAndroid.show((data.message || "Something went wrong."), ToastAndroid.SHORT);
                }
            })
            .catch(error => {
                console.error("Login error:", error);
                ToastAndroid.show(("Something went wrong. Please try again."), ToastAndroid.SHORT);
            });
    }

    return (
        <View style={styles.doPostBox}>
            {/* <FontAwesome6 name="video" style={styles.materialIcon} /> */}
            <View style={styles.inputContainer}>

                {
                    user &&
                        user.profile_picture_url ?
                        <Image
                            source={{ uri: serverUrl + user.profile_picture_url }}
                            style={styles.profilePicture}
                            contentFit="cover"
                        />
                        :
                        <View style={styles.pseudoProfilePicture}>
                            <Text style={styles.pseudoProfilePictureText}>{user.full_name[0]}</Text>
                        </View>
                }

                <TextInput
                    style={styles.textInput}
                    multiline={true}
                    placeholder="Write Something..."
                    onChangeText={(value) => handleInputChange("content", value)}
                    value={formData.content}
                />
            </View>

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
                                ) : (
                                    <>
                                        <FontAwesome6 name="video" style={styles.mediaVideoIcon} solid />
                                        <Text style={styles.mediaVideoText}>{formatDuration(file.duration)}</Text>
                                    </>
                                )}
                            </View>
                        )
                    })}
                </ScrollView>
            }

            <View style={styles.buttonContainer}>
                <View style={styles.category} >
                    <TouchableOpacity style={styles.categoryTouchable} onPress={() => { setShowDropdown((value) => !value) }}>
                        <FontAwesome6 name={getCategoryIcon(formData.category)} style={styles.categoryIcon} solid />
                        <Text numberOfLines={1} style={styles.categoryText}>{formData.category}</Text>
                        <FontAwesome6 name="caret-down" style={styles.categoryDropdownIcon} solid />
                    </TouchableOpacity>

                    {/* Dropdown */}
                    {showDropdown && (
                        <View style={styles.dropdown}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={(cat == formData.category) ? styles.dropdownItemActive : styles.dropdownItem}
                                    onPress={() => {
                                        handleInputChange("category", cat);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <FontAwesome6 name={getCategoryIcon(cat)} style={(cat == formData.category) ? styles.dropdownIconActive : styles.dropdownIcon} solid />
                                    <Text style={(cat == formData.category) ? styles.dropdownTextActive : styles.dropdownText}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                <View style={styles.iconButtonContainer}>
                    <TouchableOpacity onPress={pickImage}>
                        <FontAwesome6 name="image" style={styles.iconButton} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickVideo}>
                        <FontAwesome6 name="video" style={styles.iconButton} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome6 name="microphone" style={styles.iconButton} />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={isReady ? styles.postButton : [styles.postButton, {opacity: 0.6}]} onPress={handleSubmit} disabled={!isReady}>
                {
                    isReady ?
                    <Text style={styles.postButtonText}>Post</Text>
                    :
                    <Text style={styles.postButtonText}>Posting...</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    doPostBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        margin: 6,
        marginHorizontal: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)"
    },
    textInput: {
        marginHorizontal: 2,
        flex: 1,
        marginLeft: 4
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "center",
    },
    iconButtonContainer: {
        flexDirection: "row",
        paddingHorizontal: 6
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
    postButton: {
        backgroundColor: '#FF6600',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    postButtonText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 15,
    },
    category: {
        backgroundColor: "rgba(255, 102, 0, 0.2)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        maxWidth: '100%',
        marginHorizontal: 10,
        borderColor: "rgba(255, 102, 0, 0.4)",
        borderWidth: 1,
        position: "relative"
    },
    categoryTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryText: {
        color: "#FF6600",
        fontWeight: "bold",
        fontSize: 12,
        maxWidth: 120
    },
    categoryIcon: {
        color: "#FF6600",
        fontSize: 14
    },
    categoryDropdownIcon: {
        color: "#FF6600",
        fontSize: 14
    },
    dropdown: {
        position: "absolute",
        top: 30,
        left: 0,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 12,
        zIndex: 999,
        width: 220,
        padding: 8,
        // shadowColor: "#000",
        // shadowOpacity: 0.1,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 4,
        // elevation: 1,
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 2
    },
    dropdownItemActive: {
        backgroundColor: "rgba(255, 102, 0, 0.2)",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 2,
        borderRadius: 8
    },
    dropdownIcon: {
        width: 30,
        textAlign: 'center',
        color: 'rgba(0,0,0,0.6)'
    },
    dropdownIconActive: {
        width: 30,
        textAlign: 'center',
        color: '#FF6600'
    },
    dropdownText: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.8)',
        margin: 2
    },
    dropdownTextActive: {
        fontSize: 13,
        color: '#FF6600',
        fontWeight: 'bold',
        margin: 2
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        paddingBottom: 6
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)",
        margin: 4,
    },
    pseudoProfilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
    },
    pseudoProfilePictureText: {
        fontSize: 18,
        color: 'rgba(0,0,0,0.6)'
    },
    mediaContainer: {
        paddingHorizontal: 8,
        paddingBottom: 6,
        marginBottom: 2,
        marginTop: 2
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
    }
});

export default DoPostBox;