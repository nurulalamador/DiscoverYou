import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header({ title }: any) {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <View style={styles.headerLeftContainer}>
                <TouchableOpacity onPress={() => { router.back() }}>
                    <FontAwesome6 name="arrow-left" style={styles.headerBackIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE"
    },
    header: {
        paddingHorizontal: 18,
        paddingVertical: 14,
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
        fontSize: 20,
        margin: 4,
        marginRight: 16
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "rgba(0, 0, 0, 0.8)",
        margin: 4
    }
});