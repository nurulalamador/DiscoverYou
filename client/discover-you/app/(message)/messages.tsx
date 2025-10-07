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


export default function Messages() {
    const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'communities'>('inbox');

    const {user} = useAuth();

    return (
        <View style={styles.container}>
            <Header title="Messages" />
            <View style={styles.subTabContainer}>
                <TouchableOpacity style={activeSubTab == 'inbox' ? styles.activeSubTab : styles.subTab} onPress={() => setActiveSubTab('inbox')}>
                    <Text style={activeSubTab == 'inbox' ? styles.activeSubTabText : styles.subTabText}>Inbox</Text>
                </TouchableOpacity>
                <TouchableOpacity style={activeSubTab == 'communities' ? styles.activeSubTab : styles.subTab} onPress={() => setActiveSubTab('communities')}>
                    <Text style={activeSubTab == 'communities' ? styles.activeSubTabText : styles.subTabText}>Communities</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE"
    },
    subTabContainer: {  
        flexDirection: 'row',
        margin: 10
    },
    subTab: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 8,
        borderRadius: 8,
        margin: 4,
    },
    activeSubTab: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 102, 0, 0.2)',
        padding: 8,
        borderRadius: 8,
        margin: 4,
        borderWidth: 1,
        borderColor: '#FF6600'
    },
    subTabText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)'
    },
    activeSubTabText: {
        fontSize: 15,
        color: '#FF6600',
        fontWeight: 'bold'
    }
        
    // formContainer: {
    //     backgroundColor: "#FFFFFF",
    //     borderRadius: 14,
    //     marginVertical: 6,
    //     marginHorizontal: 14,
    //     borderWidth: 1,
    //     borderColor: "rgba(0,0,0,0.1)",
    //     alignItems: 'center',
    //     paddingHorizontal: 16,
    //     paddingVertical: 8,
    // },
    // label: {
    //     width: '100%',
    //     margin: 4,
    // },
    // labelTitle: {
    //     fontSize: 14,
    //     fontWeight: '600',
    //     marginHorizontal: 4,
    //     color: 'rgba(0,0,0,0.6)',
    // },
    // input: {
    //     width: '100%',
    //     backgroundColor: 'rgba(0,0,0,0.05)',
    //     borderRadius: 8,
    //     padding: 12,
    //     paddingHorizontal: 14,
    //     marginVertical: 6,
    //     fontSize: 15,
    //     color: '#222',
    //     borderColor: 'rgba(0,0,0,0.1)',
    //     borderWidth: 1,
    // },
    // inputEye: {
    //     position: "absolute",
    //     right: 12,
    //     top: 22,
    //     padding: 2,
    // },
    // loginButton: {
    //     backgroundColor: '#FF6600',
    //     padding: 14,
    //     borderRadius: 8,
    //     alignItems: 'center',
    //     marginVertical: 10,
    //     marginHorizontal: 14,
    // },
    // loginButtonText: {
    //     fontWeight: 'bold',
    //     color: '#FFFFFF',
    //     fontSize: 16,
    // },
    // errorMessage: {
    //     backgroundColor: 'rgba(220,0,0,0.2)',
    //     width: '100%',
    //     borderRadius: 8,
    //     paddingHorizontal: 16,
    //     paddingVertical: 10,
    //     marginBottom: 12
    // },
    // errorMessageText: {
    //     color: 'rgba(220,0,0,1)'
    // },
    // gap: {
    //     height: 8
    // },
    // title: {
    //     fontSize: 20,
    //     fontWeight: '600',
    //     width: '100%',
    //     marginVertical: 10,
    //     paddingHorizontal: 4,
    //     color: 'rgba(0,0,0,0.8)',
    // }.
});