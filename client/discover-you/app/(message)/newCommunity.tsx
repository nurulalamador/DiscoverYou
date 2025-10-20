import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import MaterialBox from "@/components/course/MaterialBox";
import CourseBox from "@/components/course/CourseBox";
import Header from "@/components/common/Header";
import FormStyle from "@/components/styles/FormStyles";


export default function ChangePassword() {
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNo: "",
        address: "false",
    });

    const styles = FormStyle;

    function handleInputChange(name: string, value: string) {
        setFormData(prev => ({ ...prev, [name]: value }));
    }


    return (
        <View style={styles.container}>
            <Header title="New Community" />
            <ScrollView>
                <View style={styles.gap}></View>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create New Communitiy</Text>
                    <View style={styles.label}>
                        <Text style={styles.labelTitle}>Community Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter community name"
                            placeholderTextColor="#888"
                            keyboardType="default"
                            autoCapitalize="none"
                            nativeID="currentPassword"
                            onChangeText={(value) => handleInputChange("currentPassword", value)}
                        />
                    </View>
                    <View style={styles.label}>
                        <Text style={styles.labelTitle}>Community Category</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter community category"
                            placeholderTextColor="#888"
                            keyboardType="default"
                            autoCapitalize="none"
                            nativeID="currentPassword"
                            onChangeText={(value) => handleInputChange("currentPassword", value)}
                        />
                    </View>
                    <View style={styles.label}>
                        <Text style={styles.labelTitle}>Community Description</Text>
                        <TextInput
                            style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                            placeholder="Enter community description"
                            placeholderTextColor="#888"
                            keyboardType="default"
                            autoCapitalize="none"
                            nativeID="currentPassword"
                            onChangeText={(value) => handleInputChange("currentPassword", value)}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Create Community</Text>
                </TouchableOpacity>
                <View style={styles.gap}></View>
            </ScrollView>
        </View>
    );
}