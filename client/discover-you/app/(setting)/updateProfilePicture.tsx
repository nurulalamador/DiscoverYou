import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import MaterialBox from "@/components/course/MaterialBox";
import CourseBox from "@/components/course/CourseBox";
import Header from "@/components/common/Header";
import useAuth from "../authContext";
import * as ImagePicker from "expo-image-picker";


export default function updateProfilePicture() {
    const { user } = useAuth();
    const [profilePicture, setProfilePicture] = useState(null as any);

    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    }


    return (
        <View style={styles.container}>
            <Header title="Update Profile Picture" />
            <ScrollView>
                <View style={styles.gap}></View>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Update Your Profile Picture</Text>
                    {
                        profilePicture ?
                            <Image
                                source={{ uri: profilePicture }}
                                style={styles.profilePicture}
                                contentFit="cover"
                            /> :
                            user?.profile_picture_url ?
                            <Image
                                source={{ uri: serverUrl + user.profile_picture_url }}
                                style={styles.profilePicture}
                                contentFit="cover"
                            /> :
                            <View style={styles.pseudoProfilePicture}>
                                <Text style={styles.pseudoProfilePictureText}>{user.full_name[0]}</Text>
                            </View>
                    }

                    <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
                        <FontAwesome6 name="image" style={styles.imageUploadButtonIcon} />
                        <Text style={styles.imageUploadButtonText}>Upload Image</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Update Your Profile Picture</Text>
                </TouchableOpacity>
                <View style={styles.gap}></View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE"
    },
    formContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        marginVertical: 6,
        marginHorizontal: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    label: {
        width: '100%',
        margin: 4,
    },
    labelTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginHorizontal: 4,
        color: 'rgba(0,0,0,0.6)',
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        padding: 12,
        paddingHorizontal: 14,
        marginVertical: 6,
        fontSize: 15,
        color: '#222',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
    },
    inputEye: {
        position: "absolute",
        right: 12,
        top: 22,
        padding: 2,
    },
    loginButton: {
        backgroundColor: '#FF6600',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 14,
    },
    loginButtonText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 16,
    },
    errorMessage: {
        backgroundColor: 'rgba(220,0,0,0.2)',
        width: '100%',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 12
    },
    errorMessageText: {
        color: 'rgba(220,0,0,1)'
    },
    gap: {
        height: 8
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        width: '100%',
        marginVertical: 10,
        paddingHorizontal: 4,
        color: 'rgba(0,0,0,0.8)',
    },

    profilePicture: {
        width: 240,
        height: 240,
        borderRadius: 120,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.2)",
        margin: 12
    },
    pseudoProfilePicture: {
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 12
    },
    pseudoProfilePictureText: {
        fontSize: 120,
        color: 'rgba(0,0,0,0.6)'
    },
    imageUploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginVertical: 10
    },
    imageUploadButtonIcon: {
        fontSize: 18,
        color: 'rgba(0,0,0,0.6)',
        marginRight: 10,
    },
    imageUploadButtonText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)',
        fontWeight: '600',
    }
});