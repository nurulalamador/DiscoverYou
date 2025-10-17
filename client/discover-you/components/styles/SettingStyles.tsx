import { StyleSheet } from "react-native";

const SettingStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE"
    },
    gap: {
        height: 8
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
        padding: 8,
        paddingVertical: 10
    },
    menuItemIcon: {
        fontSize: 18,
        color: "rgba(0,0,0,0.6)",
        width: 24,
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
        width: 24,
        textAlign: "center",
        marginRight: 12
    },
    menuItemTextRed: {
        fontSize: 15,
        color: "rgba(250,0,0,0.8)",
        fontWeight: 500
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 6,
        marginHorizontal: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 14
    },
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.4)",
        margin: 14
    },
    pseudoProfilePicture: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16
    },
    pseudoProfilePictureText: {
        fontSize: 40,
        color: 'rgba(0,0,0,0.6)'
    },
    profileDetails: {
        flex: 1
    },
    profileName: {
        fontSize: 18,
        fontWeight: "600",
    },
    profileUsername: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.6)',
        marginTop: 2
    },
    viewProfileButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8
    },
    viewProfileButtonText: {
        fontSize: 14,
        color: '#FF6600',
        fontWeight: "600",
    },
    viewProfileButtonIcon: {
        fontSize: 14,
        color: '#FF6600',
        marginLeft: 6
    }
});

export default SettingStyles;