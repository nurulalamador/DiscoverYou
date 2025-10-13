import { ActivityIndicator, View } from "react-native";

export default function Loading() {
    return (
        <View style={{ flex: 1, minHeight: 300, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size={60} color="#FF6600" />
        </View>
    );
}