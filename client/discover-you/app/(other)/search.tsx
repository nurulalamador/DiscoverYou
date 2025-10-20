import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { categories, getCategoryIcon, serverUrl } from "@/components/constants";
import MaterialBox from "@/components/course/MaterialBox";
import CourseBox from "@/components/course/CourseBox";
import Header from "@/components/common/Header";
import useAuth from "../authContext";
import ProfileDetailsBox from "@/components/other/ProfileDetailsBox";
import Loading from "@/components/common/Loading";
import LeaderboardBox from "@/components/other/LeaderboardBox";
import NotFound from "@/components/common/NotFound";
import JobBox from "@/components/hiring/JobBox";
import ExploreWebinarBox from "@/components/webinar/ExploreWebinarBox";
import ExploreContestBox from "@/components/contest/ExploreContestBox";
import ExploreCourseBox from "@/components/course/ExploreCourseBox";
import PostBoxAlt from "@/components/showcase/PostBoxAlt";
import ExploreContestBoxAlt from "@/components/contest/ExploreContestBoxAlt";
import ExploreWebinarBoxAlt from "@/components/webinar/ExploreWebinarBoxAlt";


export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState<string>("");
    const [category, setCategory] = useState<string>("All Category");
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    const [contests, setContests] = useState<any[]>([]);
    const [webinars, setWebinars] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [hiring, setHiring] = useState<any[]>([]);
    const [showcase, setShowcase] = useState<any[]>([]);

    useEffect(() => {
        function loadData() {
            fetch(`${serverUrl}/profile/search`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: query,
                    category: category
                })
            })
                .then(res => res.json())
                .then(data => {
                    setContests(data.contests);
                    setWebinars(data.webinars);
                    setCourses(data.courses);
                    setHiring(data.hiring);
                    setShowcase(data.showcase);
                })
                .catch(function (err) {
                    console.log("Leaderboard data fetching failed:", err);
                })
                .finally(function () {
                    setLoading(false);
                });
        }
        loadData();
    }, [query, category]);

    if (loading) {
        return <Loading />
    }

    return (
        <View style={styles.container}>
            <Header title="Search" />
            <View style={styles.contentContainer}>
                <View style={styles.gap} />
                <View style={styles.searchRow}>
                    <View style={styles.searchBox}>
                        <FontAwesome6 name="magnifying-glass" size={16} color="#888" />
                        <TextInput
                            style={styles.input}
                            placeholder="Search people, courses, events"
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

                    <View style={styles.category} >
                        <TouchableOpacity style={styles.categoryTouchable} onPress={() => { setShowDropdown((value) => !value) }}>
                            <FontAwesome6 name={getCategoryIcon(category)} style={styles.categoryIcon} solid />
                            <Text numberOfLines={1} style={styles.categoryText}>{category}</Text>
                            <FontAwesome6 name="caret-down" style={styles.categoryDropdownIcon} solid />
                        </TouchableOpacity>

                        {/* Dropdown */}
                        {showDropdown && (
                            <View style={styles.dropdown}>
                                {["All Category", ...categories].map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={(cat == category) ? styles.dropdownItemActive : styles.dropdownItem}
                                        onPress={() => {
                                            setCategory(cat);;
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <FontAwesome6 name={getCategoryIcon(cat)} style={(cat == category) ? styles.dropdownIconActive : styles.dropdownIcon} solid />
                                        <Text style={(cat == category) ? styles.dropdownTextActive : styles.dropdownText}>{cat}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
                {
                    (query == "") ?
                        <View style={{ flexGrow: 1, flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                            <NotFound title="Write Something to Search!" icon="magnifying-glass" />
                        </View> :
                        <ScrollView>
                            <View style={styles.divider} />
                            <Text style={styles.title}>Showcase Results</Text>
                            {
                                showcase.length ?
                                    <ScrollView horizontal style={{ width: "100%", flexDirection: "row" }} contentContainerStyle={{ paddingHorizontal: 8 }}>
                                        {
                                            showcase.map(function (post: any) {
                                                return <PostBoxAlt key={post.id} post={post} />
                                            })
                                        }
                                    </ScrollView>
                                    : <NotFound title="No Showcase Posts Found" icon="photo-film" />
                            }

                            <View style={styles.divider} />
                            <Text style={styles.title}>Course Results</Text>
                            {
                                courses.length ?
                                    <ScrollView horizontal style={{ width: "100%", flexDirection: "row" }} contentContainerStyle={{ paddingHorizontal: 8 }}>
                                        {
                                            courses.map(function (course: any) {
                                                return <ExploreCourseBox key={course.id} course={course} />
                                            })}
                                    </ScrollView>
                                    : <NotFound title="No Courses Found" icon="book-open" />
                            }
                            <View style={styles.divider} />
                            <Text style={styles.title}>Contest Results</Text>
                            {
                                contests.length ?
                                    <ScrollView horizontal style={{ width: "100%", flexDirection: "row" }} contentContainerStyle={{ paddingHorizontal: 8 }}>
                                        {
                                            contests.map(function (contest: any) {
                                                return <ExploreContestBoxAlt key={contest.id} contest={contest} />
                                            })
                                        }
                                    </ScrollView>
                                    : <NotFound title="No Contests Found" icon="trophy" />
                            }
                            <View style={styles.divider} />
                            <Text style={styles.title}>Webinar Results</Text>
                            {
                                webinars.length ?
                                    <ScrollView horizontal style={{ width: "100%", flexDirection: "row" }} contentContainerStyle={{ paddingHorizontal: 8 }}>
                                        {
                                            webinars.map(function (webinar: any) {
                                                return <ExploreWebinarBoxAlt key={webinar.id} webinar={webinar} />
                                            })
                                        }
                                    </ScrollView>
                                    : <NotFound title="No Webinars Found" icon="video" />
                            }
                            <View style={styles.divider} />
                            <Text style={styles.title}>Hiring Results</Text>
                            <View style={{ marginHorizontal: 8 }}>
                                {
                                    hiring.length ?
                                        hiring.map(function (hiring: any) {
                                            return <JobBox key={hiring.id} job={hiring} />
                                        })
                                        : <NotFound title="No Hiring Found" icon="briefcase" />
                                }
                            </View>
                            <View style={styles.gap} />
                        </ScrollView>
                }

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE"
    },
    contentContainer: {
        flex: 1
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
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 6,
        paddingHorizontal: 14,
        gap: 10
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
        borderColor: "rgba(0,0,0,0.06)"
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: "rgba(0,0,0,0.8)",
        textAlignVertical: "center",
        paddingVertical: 0
    },

    category: {
        backgroundColor: "rgba(255, 102, 0, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        maxWidth: '100%',
        borderColor: "rgba(255, 102, 0, 0.4)",
        borderWidth: 1,
        position: "relative"
    },
    categoryTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryText: {
        color: "#FF6600",
        fontWeight: "bold",
        fontSize: 12,
        maxWidth: 120
    },
    categoryIcon: {
        color: "#FF6600",
        fontSize: 14
    },
    categoryDropdownIcon: {
        color: "#FF6600",
        fontSize: 14
    },
    dropdown: {
        position: "absolute",
        top: 30,
        right: 0,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 12,
        zIndex: 999,
        width: 220,
        padding: 8,
        // shadowColor: "#000",
        // shadowOpacity: 0.1,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 4,
        // elevation: 1,
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 2
    },
    dropdownItemActive: {
        backgroundColor: "rgba(255, 102, 0, 0.2)",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 2,
        borderRadius: 8
    },
    dropdownIcon: {
        width: 30,
        textAlign: 'center',
        color: 'rgba(0,0,0,0.6)'
    },
    dropdownIconActive: {
        width: 30,
        textAlign: 'center',
        color: '#FF6600'
    },
    dropdownText: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.8)',
        margin: 2
    },
    dropdownTextActive: {
        fontSize: 13,
        color: '#FF6600',
        fontWeight: 'bold',
        margin: 2
    },
    title: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.6)'
    },
});