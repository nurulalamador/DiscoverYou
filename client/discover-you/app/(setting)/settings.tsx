import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { getCategoryIcon, serverUrl } from "@/components/constants";
import MaterialBox from "@/components/course/MaterialBox";
import CourseBox from "@/components/course/CourseBox";
import Header from "@/components/common/Header";


export default function Settings() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Header title="Settings" />
            <ScrollView>
                <View style={styles.gap}></View>
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem}
                        onPress={()=> router.push("/(setting)/editProfile")}
                    >
                        <FontAwesome6 name="user" style={styles.menuItemIcon} solid />
                        <Text style={styles.menuItemText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <View style={styles.divider}></View>
                    <TouchableOpacity style={styles.menuItem}
                        onPress={()=> router.push("/(setting)/updateProfilePicture")}
                    >
                        <FontAwesome6 name="image" style={styles.menuItemIcon} solid />
                        <Text style={styles.menuItemText}>Update Profile Picture</Text>
                    </TouchableOpacity>
                    <View style={styles.divider}></View>
                    <TouchableOpacity style={styles.menuItem}
                        onPress={()=> router.push("/(setting)/changePassword")}
                    >
                        <FontAwesome6 name="key" style={styles.menuItemIcon} />
                        <Text style={styles.menuItemText}>Change Password</Text>
                    </TouchableOpacity>
                    <View style={styles.divider}></View>
                    <TouchableOpacity style={styles.menuItem}>
                        <FontAwesome6 name="trash" style={styles.menuItemIconRed} />
                        <Text style={styles.menuItemTextRed}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
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
    menuContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        marginVertical: 6,
        marginHorizontal: 14,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        padding: 8
    },
    divider: {
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginVertical: 4,
        width: "95%",
        marginHorizontal: 'auto'
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    menuItemIcon: {
        fontSize: 18,
        color: "rgba(0,0,0,0.6)",
        width: 30,
        textAlign: "center",
        marginRight: 12
    },
    menuItemText: {
        fontSize: 15,
        color: "rgba(0,0,0,0.8)",
        fontWeight: 500
    },
    menuItemIconRed: {
        fontSize: 18,
        color: "rgba(250,0,0,0.6)",
        width: 30,
        textAlign: "center",
        marginRight: 12
    },
    menuItemTextRed: {
        fontSize: 15,
        color: "rgba(250,0,0,0.8)",
        fontWeight: 500
    },
    gap: {
        height: 8
    }
});