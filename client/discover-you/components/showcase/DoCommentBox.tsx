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

export default function DoCommentBox({ postId }: any) {
    const { user, setUpdateShowcase } = useAuth();
    const [formData, setFormData] = useState({
        content: ""
    });
 
    const [isReady, setIsReady] = useState(true);

    function handleInputChange(name: string, value: any) {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit() {
        if (!formData.content) {
            ToastAndroid.show('Please write something to comment!', ToastAndroid.SHORT);
            return;
        }

        fetch(`${serverUrl}/showcase/addComment`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId: postId,
                content: formData.content
            })
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log("Login response data:", data);
                if (data.success) {
                    setUpdateShowcase((old:any)=>old+1);
                    setFormData({
                        content: ""
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
            <TouchableOpacity style={isReady ? styles.postButton : [styles.postButton, {opacity: 0.6}]} onPress={handleSubmit} disabled={!isReady}>
                {
                    isReady ?
                    <Text style={styles.postButtonText}>Comment</Text>
                    :
                    <Text style={styles.postButtonText}>Commenting...</Text>
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
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        padding: 8
    },
    textInput: {
        marginHorizontal: 2,
        flex: 1,
        marginLeft: 4
    },
    postButton: {
        backgroundColor: '#FF6600',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        margin: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8
    },
    postButtonText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 15,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)",
        margin: 6,
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
        margin: 6
    },
    pseudoProfilePictureText: {
        fontSize: 18,
        color: 'rgba(0,0,0,0.6)'
    }
});