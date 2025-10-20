import { StyleSheet } from "react-native";

const FormStyle = StyleSheet.create({
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

export default FormStyle;