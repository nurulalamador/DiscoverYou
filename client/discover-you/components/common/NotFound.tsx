import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function NotFound(
    { title, icon }: { title: string, icon: string }
) {
    return (
        <View style={styles.notFound}>
            <FontAwesome6 name={icon} style={styles.notFoundIcon} solid />
            <Text style={styles.notFoundTitle}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
        notFound: {
        minHeight: 200,
        alignItems: "center",
        justifyContent: "center"
    },
    notFoundIcon: {
        fontSize: 80,
        color: 'rgba(0,0,0,0.6)'
    },
    notFoundTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.6)',
        marginTop: 24
    }
})