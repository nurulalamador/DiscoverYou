import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity, ScrollView, TextInput, ToastAndroid } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { categories, getCategoryIcon, serverUrl } from "@/components/constants";
import MaterialBox from "@/components/course/MaterialBox";
import CourseBox from "@/components/course/CourseBox";
import Header from "@/components/common/Header";
import useAuth from "../authContext";


export default function ChangePassword() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNo: "",
        address: "false",
    });

    const [selected, setSelected] = useState<string[]>(user.interests);

    const unselected = categories.filter((cat) => !selected.includes(cat));


    function handleInputChange(name: string, value: string) {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleRemove = (category: string) => {
        setSelected((prev) => prev.filter((item) => item !== category));
    };

    const handleSelect = (category: string) => {
        setSelected((prev) => {
            if (prev.length >= 3) {
                ToastAndroid.show("You can select up to 3 categories only.", ToastAndroid.SHORT);
                return prev;
            }
            return [...prev, category];
        });
    };


    return (
        <View style={styles.container}>
            <Header title="Change Interest" />
            <ScrollView>
                <View style={styles.gap}></View>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Update Your Interests</Text>

                    <Text style={styles.modalSectionTitle}>Selected Interests</Text>
                    {selected.length === 0 ? (
                        <View style={styles.emptyCategory}>

                            <Text style={styles.emptyCategoryText}>No category selected</Text>
                        </View>
                    ) : (
                        <View style={styles.categoryContainer}>
                            {
                                selected.map((category) => (
                                    <View key={category} style={styles.category}>
                                        <FontAwesome6 name={getCategoryIcon(category)} style={styles.categoryIcon} solid />
                                        <Text style={styles.categoryText}>{category}</Text>
                                        <TouchableOpacity style={styles.categoryDelete} onPress={() => handleRemove(category)}>
                                            <FontAwesome6 name="xmark" style={styles.categoryDeleteIcon} />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }
                        </View>
                    )}

                    {/* ✅ Unselected Categories */}
                    <Text style={styles.modalSectionTitle}>Choose Interests</Text>
                    <FlatList
                        scrollEnabled={false}
                        contentContainerStyle={styles.categoryContainer}
                        data={unselected}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.category} onPress={() => handleSelect(item)}>
                                <FontAwesome6 name={getCategoryIcon(item)} style={styles.categoryIcon} solid />

                                <Text numberOfLines={1} style={styles.categoryText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <View style={styles.gap}></View>
                </View>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Change Password</Text>
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
    modalTitle: {
        fontWeight: "bold",
        fontSize: 20,
        margin: 6,
        textAlign: "center",
        color: "rgba(0,0,0,0.8)"
    },
    category: {
        backgroundColor: "rgba(255, 102, 0, 0.2)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 8,
        overflow: 'hidden',
        maxWidth: '100%',
        margin: 4
    },
    categoryText: {
        color: "#FF6600",
        fontWeight: "bold",
        fontSize: 12
    },
    categoryIcon: {
        fontSize: 14,
        color: "#FF6600"
    },
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        height: "auto",
        alignItems: "center",
    },
    categoryDelete: {
        width: 16,
        height: 16,
        borderRadius: 10,
        backgroundColor: "#FF6600",
        alignItems: "center",
        justifyContent: "center"
    },
    categoryDeleteIcon: {
        color: "rgba(255,255,255,0.8)"
    },
    modalSectionTitle: {
        marginBottom: 8,
        marginTop: 12,
        fontWeight: "bold",
        color: "rgba(0,0,0,0.6)",
        fontSize: 16,
        textAlign: "center"
    },
    emptyCategory: {
        margin: 6,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: "center"
    },
    emptyCategoryText: {
        color: "rgba(0,0,0,0.6)",
        fontSize: 14
    }
});