import { FontAwesome6 } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { getCategoryIcon, serverUrl, categories } from "../constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";

function DoPostBox({
    posts
}: {
    posts: any
}) {
    const [formData, setFormData] = useState({
        content: "",
        category: "Web Development"
    });
    const [showDropdown, setShowDropdown] = useState(false);

    const router = useRouter();

    function handleInputChange(name: string, value: any) {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit() {
        if (!formData.content) {
            ToastAndroid.show('Please write something to post!', ToastAndroid.SHORT);
            return;
        }

        console.log("Submitting form data:", formData);

        fetch(`${serverUrl}/showcase/addPost`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: formData.content,
                category: formData.category
            }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log("Login response data:", data);
                if (data.success) {
                    ToastAndroid.show(("Successfully Posted!"), ToastAndroid.SHORT);
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
            <TextInput
                style={styles.textInput}
                multiline={true}
                placeholder="Write Something..."
                onChangeText={(value) => handleInputChange("content", value)}
            />
            <View style={styles.buttonContainer}>
                <View style={styles.category} >
                    <TouchableOpacity style={styles.categoryTouchable} onPress={()=>{setShowDropdown((value) => !value)}}>
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
                                    <FontAwesome6 name={getCategoryIcon(cat)} style={(cat == formData.category) ? styles.dropdownIconActive : styles.dropdownIcon } solid />                                    
                                    <Text style={(cat == formData.category) ? styles.dropdownTextActive : styles.dropdownText }>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                <View style={styles.iconButtonContainer}>
                    <FontAwesome6 name="image" style={styles.iconButton} />
                    <FontAwesome6 name="video" style={styles.iconButton} />
                    <FontAwesome6 name="microphone" style={styles.iconButton} />
                </View>
            </View>
            <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
                <Text style={styles.postButtonText}>Post</Text>
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
        margin: 10,
        marginHorizontal: 12,
        marginBottom: 0,
        // backgroundColor: 'aqua'
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "center"
    },
    iconButtonContainer: {
        flexDirection: "row",
        paddingHorizontal: 8,
        paddingVertical: 6
    },
    iconButton: {
        width: 34,
        height: 34,
        margin: 4,
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
        margin: 12,
        marginTop: 0,
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
        marginHorizontal: 12,
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
});

export default DoPostBox;