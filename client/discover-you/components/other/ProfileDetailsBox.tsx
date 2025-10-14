import { Image } from "expo-image"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getCategoryIcon, serverUrl } from "../constants"
import { FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"

export default function ProfileDetailsBox({ person, self }: { person: any, self: boolean }) {
    const [isFollowed, setIsFollowed] = useState(Boolean(person.is_followed));
    const [followers, setFollowers] = useState(person.followers);
    const router = useRouter();

    function toggleFollow() {
        fetch(`${serverUrl}/profile/toggleFollow`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                personId: person.id
            }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    if (data.status == "followed") {
                        setIsFollowed(true);
                        setFollowers((old: any) => parseInt(old) + 1);
                    }
                    else if (data.status == "unfollowed") {
                        setIsFollowed(false);
                        setFollowers((old: any) => parseInt(old) - 1);
                    }
                }
                else {
                    console.log(data);
                }
            })
            .catch(error => {
                console.error("Login error:", error);
            });
    }
    return (
        <View style={styles.profileDetailBox}>
            <View style={styles.profilePictureContainer}>
                {
                    person.profile_picture_url ?
                        <Image
                            source={{ uri: serverUrl + person.profile_picture_url }}
                            style={styles.profilePicture}
                            contentFit="cover"
                        /> :
                        <View style={styles.pseudoProfilePicture}>
                            <Text style={styles.pseudoProfilePictureText}>{person.full_name[0]}</Text>
                        </View>
                }
                {
                    self &&
                    <TouchableOpacity 
                        style={styles.editPicture}
                        onPress={()=>{
                            router.push("/(setting)/updateProfilePicture")
                        }}
                    >
                        <FontAwesome6 name="pen" style={styles.editPictureIcon} solid />
                    </TouchableOpacity>
                }
            </View>
            <Text style={styles.personName}>{person.full_name}</Text>
            <Text style={styles.personUsername}>@{person.username}</Text>
            <View style={styles.pointBox}>
                <FontAwesome6 name="star" style={styles.pointBoxIcon} solid />
                <Text style={styles.pointBoxCount}>{person.points}</Text>
                <Text style={styles.pointBoxText}>POINTS</Text>
            </View>
            <View style={styles.categoryContainer}>
                {
                    person.interests.map(function (interest: any) {
                        return <View key={interest} style={styles.category}>
                            <FontAwesome6 name={getCategoryIcon(interest)} style={styles.categoryIcon} solid />

                            <Text numberOfLines={1} style={styles.categoryText}>{interest}</Text>
                        </View>
                    })
                }
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.detail}>
                    {/* <FontAwesome6 name="user" style={styles.detailIcon} solid /> */}
                    <Text style={styles.detailTitle}>{followers}</Text>
                    <Text style={styles.detailSemiTitle}>Followers</Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detail}>
                    {/* <FontAwesome6 name="star" style={styles.detailIcon} solid /> */}
                    <Text style={styles.detailTitle}>{person.following}</Text>
                    <Text style={styles.detailSemiTitle}>Following</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                {
                    self ?
                        <TouchableOpacity style={styles.orangeButton} onPress={() => {
                            router.push({
                                pathname: "/(setting)/editProfile",
                                params: {
                                    personId: person.id
                                }
                            })
                        }}>
                            <FontAwesome6 name="user-pen" style={styles.orangeButtonIcon} solid />
                            <Text style={styles.orangeButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                        :
                        <>
                            <TouchableOpacity style={styles.orangeButton} onPress={toggleFollow}>
                                {
                                    isFollowed ?
                                        <>
                                            <FontAwesome6 name="user-check" style={styles.orangeButtonIcon} />
                                            <Text style={styles.orangeButtonText}>Followed</Text>
                                        </> :
                                        <>
                                            <FontAwesome6 name="user-plus" style={styles.orangeButtonIcon} />
                                            <Text style={styles.orangeButtonText}>Follow</Text>
                                        </>
                                }

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.grayButton} onPress={() => {
                                router.push({
                                    pathname: "/(message)/inbox",
                                    params: {
                                        personId: person.id
                                    }
                                })
                            }}>
                                <FontAwesome6 name="message" style={styles.grayButtonIcon} solid />
                                <Text style={styles.grayButtonText}>Message</Text>
                            </TouchableOpacity>
                        </>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    gap: {
        height: 8
    },
    profilePictureContainer: {
        marginTop: -100,
        backgroundColor: "#FFFFFF",
        borderRadius: "100%",
        position: "relative"
    },
    profilePicture: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.4)",
    },
    pseudoProfilePicture: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.2)",
        alignItems: 'center',
        justifyContent: 'center',
    },
    pseudoProfilePictureText: {
        fontSize: 100,
        color: 'rgba(0,0,0,0.6)'
    },
    editPicture: {
        position: "absolute",
        right: 14,
        top: 14,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#FF6600",
        alignItems: "center",
        justifyContent: "center"
    },
    editPictureIcon: {
        color:  "#FFFFFF",
        fontSize: 15
    },
    profileDetailBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        margin: 6,
        marginTop: 110,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)"
    },
    contentBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        margin: 6,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)"
    },
    personName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "rgba(0,0,0,0.8)",
        marginTop: 12,
        marginBottom: 2,
    },
    personUsername: {
        fontSize: 15,
        color: "rgba(0,0,0,0.6)"
    },
    categoryContainer: {
        flexWrap: "wrap",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 4
    },
    category: {
        backgroundColor: "rgba(255, 102, 0, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 8,
        margin: 4,
        overflow: 'hidden',
        maxWidth: '100%'
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
    orangeButton: {
        flex: 1,
        backgroundColor: '#FF6600',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        margin: 4,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    orangeButtonText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 15,
    },
    orangeButtonIcon: {
        color: '#FFFFFF',
        fontSize: 16,
        marginRight: 8
    },
    grayButton: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        margin: 4,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    grayButtonText: {
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.6)',
        fontSize: 15,
    },
    grayButtonIcon: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 16,
        marginRight: 8
    },
    buttonContainer: {
        flexDirection: "row",
        margin: 8
    },
    detailsContainer: {
        flexDirection: "row",
        marginHorizontal: 8,
        marginVertical: 4,
        alignItems: 'center'
    },
    detail: {
        flex: 1,
        alignItems: 'center'
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 2,
        color: 'rgba(0,0,0,0.8)'
    },
    detailSemiTitle: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.6)'
    },
    detailDivider: {
        borderLeftColor: "rgba(0,0,0,0.1)",
        borderLeftWidth: 1,
        height: 40,
        marginHorizontal: 'auto'
    },
    pointBox: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        marginVertical: 12
    },
    pointBoxIcon: {
        marginRight: 2,
        color: "#FF6600"
    },
    pointBoxCount: {
        marginHorizontal: 4,
        fontSize: 16,
        fontWeight: 900,
        color: "#FF6600"
    },
    pointBoxText: {
        fontSize: 14,
        fontWeight: 500,
        color: "#FF6600"
    }
});