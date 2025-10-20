import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import NotFound from "../common/NotFound";
import { serverUrl } from "../constants";
import MessageBox from "./MessageBox";
import useAuth from "@/app/authContext";
import Loading from "../common/Loading";

export default function Inbox() {
    const [messages, setMessages] = useState<any>([]);
    const {updateMessage} = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function loadMessages() {
            fetch(`${serverUrl}/messaging/inbox`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setMessages(data.messages);
                    setLoading(false);
                })
                .catch(function (err) {
                    console.log("Messages data fetching failed:", err);
                });
        }
        loadMessages();
    }, [updateMessage]);

    if(loading) {
        return <Loading/>
    }

    return (
        <View style={styles.container}>
            {
                messages &&
                    messages.length ?
                    <View style={styles.contentBox}>
                        {
                            messages.map((msg: any, index: number) => (
                                <View key={msg.id}>
                                    {index !== 0 ? <View style={styles.divider} /> : null}
                                    <MessageBox message={msg} />
                                </View>
                            ))
                        }
                    </View>
                    : <NotFound title="No Messages" icon="message" />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
    },
    contentBox: {
        margin: 6,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 14,
        padding: 8
    },
    divider: {
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginVertical: 6,
        width: "95%",
        marginHorizontal: 'auto'
    },
});