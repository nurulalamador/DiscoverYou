import { FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { getCategoryIcon, serverUrl } from "../constants";
import { Image } from "expo-image";

function BrowseCourseBox({ course }: any) {
    return (
        <View style={styles.courseBox}>
            {
                course.cover_image_url ?
                    <Image
                        source={{ uri: serverUrl + course.cover_image_url }}
                        style={styles.previewImage}
                    /> :
                    <View style={styles.pseudoPreviewImage}>
                        <FontAwesome6 name="book" size={64} color="rgba(0,0,0,0.4)/" />
                    </View>
            }

            <View style={styles.details}>

                <Text numberOfLines={2} style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: 'rgba(0,0,0,0.6)',
                }}>{course.name}</Text>
                <View style={{
                    backgroundColor: "rgba(255, 102, 0, 0.2)",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    gap: 8,
                    marginVertical: 8,
                    overflow: 'hidden',
                    maxWidth: '100%'
                }}>
                    <FontAwesome6 name={getCategoryIcon(course.category)} size={14} color="#FF6600" solid />

                    <Text  style={{ color: "#FF6600", fontWeight: "bold", fontSize: 12 }}>{course.category}</Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <View style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: 'red',
                        marginRight: 8
                    }}>

                    </View>
                    <View>
                        <Text style={{
                            color: "#FF6600",
                            fontSize: 11,
                            fontWeight: "bold"
                        }}>
                            Instructed By
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            fontWeight: "bold",
                            color: 'rgba(0,0,0,0.6)'
                        }}
                        >
                            {course.instructor_name}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    courseBox: {
        width: 330,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        margin: 6,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)"
    },
    previewImage: {
        width: 130,
        height: 130,
        margin: 8,
        borderRadius: 8,
        resizeMode: "contain",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)"
    },
    pseudoPreviewImage: {
        width: 130,
        height: 130,
        margin: 8,
        borderRadius: 8,
        backgroundColor: "rgba(0,0,0,0.1)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.2)"
    },
    details: {
        marginLeft: 6,
        marginRight: 12,
        flex: 1
    }
})

export default BrowseCourseBox;