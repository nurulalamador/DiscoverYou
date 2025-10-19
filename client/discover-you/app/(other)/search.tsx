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
import ProfileDetailsBox from "@/components/other/ProfileDetailsBox";
import Loading from "@/components/common/Loading";
import LeaderboardBox from "@/components/other/LeaderboardBox";
import NotFound from "@/components/common/NotFound";


export default function Search() {
    const router = useRouter();
            const [query, setQuery] = useState<string>("");
    const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'communities'>('inbox');
    const [leaderboard, setLeaderboard] = useState<any>();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/profile/leaderboard`, {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    setLeaderboard(data.leaderboard);
                })
                .catch(function (err) {
                    console.log("Leaderboard data fetching failed:", err);
                })
                .finally(function () {
                    setLoading(false);
                });
        }
        loadData();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <View style={styles.container}>
            <Header title="Search" />
            <>
                <View style={styles.contentContainer}>
                    <View style={localStyles.searchRow}>
                        <View style={localStyles.searchBox}>
                            <FontAwesome6 name="magnifying-glass" size={18} color="#888" />
                            <TextInput
                                style={localStyles.input}
                                placeholder="Search people, courses, communities"
                                placeholderTextColor="rgba(0,0,0,0.45)"
                                value={query}
                                onChangeText={setQuery}
                                returnKeyType="search"
                                onSubmitEditing={() => {
                                    // handle submit (navigate or filter). Example:
                                    // router.push({ pathname: '/search/results', params: { q: query } });
                                }}
                            />
                            {query.length > 0 && (
                                <TouchableOpacity onPress={() => setQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                    <FontAwesome6 name="xmark" size={18} color="#666" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TouchableOpacity
                            style={localStyles.filterButton}
                            onPress={() => {
                                // open filter modal or navigate to filter screen
                            }}
                        >
                            <FontAwesome6 name="sliders" size={20} color="#FF6600" />
                        </TouchableOpacity>
                    </View>

                    <View style={localStyles.suggestions}>
                        <Text style={localStyles.suggestionTitle}>Quick searches</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6 }}>
                            {["People", "Courses", "Communities", "Nearby"].map((item) => (
                                <Pressable
                                    key={item}
                                    onPress={() => setQuery(item)}
                                    style={({ pressed }) => [
                                        localStyles.chip,
                                        pressed && { opacity: 0.8 }
                                    ]}
                                >
                                    <Text style={localStyles.chipText}>{item}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                <View style={{ height: 8 }} />

                <ScrollView contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}>
                    <View style={styles.contentBox}>
                        <Text style={{ color: "rgba(0,0,0,0.6)" }}>
                            {query ? `Showing results for “${query}”` : "Start typing to search across people, courses and communities."}
                        </Text>
                    </View>
                </ScrollView>

                {/* local styles used by the search UI */}
                <>{/* keep JSX parser happy for localStyles definition below */}</>
                {null}
            </>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE"
    },
    contentContainer: {
        marginHorizontal: 8
    },
    gap: {
        height: 8
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
    subTabContainer: {
        backgroundColor: "#FFFFFF",
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 8,
        marginTop: -6
    },
    subTab: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        position: 'relative',
    },
    subTabText: {
        fontSize: 15,
        color: 'rgba(0,0,0,0.6)',
        padding: 6,
        fontWeight: 500
    },
    activeSubTabText: {
        fontSize: 15,
        color: '#FF6600',
        fontWeight: 800,
        padding: 6
    },
    subTabIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 4,
        width: '80%',
        backgroundColor: '#FF6600',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
});

            const localStyles = StyleSheet.create({
                searchRow: {
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 12,
                    marginHorizontal: 8
                },
                searchBox: {
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.06)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 6,
                    elevation: 2
                },
                input: {
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 15,
                    color: "#111",
                    paddingVertical: 0
                },
                filterButton: {
                    marginLeft: 10,
                    backgroundColor: "#fff",
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.06)"
                },
                suggestions: {
                    marginTop: 12,
                    marginHorizontal: 2
                },
                suggestionTitle: {
                    fontSize: 13,
                    color: "rgba(0,0,0,0.55)",
                    marginBottom: 6,
                    marginLeft: 6
                },
                chip: {
                    backgroundColor: "#FFF",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.06)"
                },
                chipText: {
                    color: "rgba(0,0,0,0.7)",
                    fontSize: 13,
                    fontWeight: "500"
                }
            });