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


export default function EditProfile() {
    const {user} = useAuth();
    const [formData, setFormData] = useState({
        fullName: user?.full_name || "",
        mobileNo: user?.mobile_no || "",
        address:  user?.address || "",
    });

    function handleInputChange(name: string, value: string) {
        setFormData(prev => ({ ...prev, [name]: value }));
    }


    return (
        <View style={styles.container}>
            <Header title="Edit Profile" />
            <ScrollView>
                <View style={styles.gap}></View>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Edit Your Profile</Text>
                    <View style={styles.label}>
                        <Text style={styles.labelTitle}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor="#888"
                            keyboardType="default"
                            autoCapitalize="none"
                            nativeID="fullName"
                            onChangeText={(value) => handleInputChange("fullName", value)}
                            value={formData.fullName}
                        />
                    </View>
                    <View style={styles.label}>
                        <Text style={styles.labelTitle}>Mobile No</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your mobile number"
                            placeholderTextColor="#888"
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            nativeID="mobileNo"
                            onChangeText={(value) => handleInputChange("mobileNo", value)}
                            value={formData.mobileNo}
                        />
                    </View>
                    <View style={styles.label}>
                        <Text style={styles.labelTitle}>Address</Text>
                        <TextInput
                            style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                            placeholder="Enter your address"
                            placeholderTextColor="#888"
                            keyboardType="default"
                            autoCapitalize="none"
                            nativeID="mobileNo"
                            onChangeText={(value) => handleInputChange("address", value)}
                            value={formData.address}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Update Your Profile</Text>
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
    }
});