import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import useAuth from "../authContext";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { serverUrl } from "@/components/constants";
import ExploreContestBox from "@/components/contest/ExploreContestBox";
import Loading from "@/components/common/Loading";
import JobBox from "@/components/hiring/JobBox";
import EnrolledCourseBox from "@/components/course/EnrolledCourseBox";
import EnrolledCourseBoxAlt from "@/components/course/EnrolledCourseBoxAlt";
import ExploreCourseBox from "@/components/course/ExploreCourseBox";
import PostBox from "@/components/showcase/PostBox";
import PostBoxAlt from "@/components/showcase/PostBoxAlt";

export default function Home() {
  const { user, updateMessage, updateCourse } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<any>([]);
  const [exploreCourses, setExploreCourses] = useState<any>([]);
  const [upcomingContests, setUpcomingContests] = useState<any>([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState<any>([]);
  const [topHiring, setTopHiring] = useState<any>([]);
  const [currentPosition, setCurrentPosition] = useState<any>("");
  const [topShowcase, setTopShowcase] = useState<any>([]);

  const getGreeting = (date: Date = new Date()): string => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 16) return "Good Morning";
    if (hour >= 16 && hour < 18) return "Good Afternoon";
    if (hour >= 18 && hour < 20) return "Good Evening";
    return "Hello";
  };

  const greeting = getGreeting();

  useEffect(() => {
    function loadData() {
      fetch(`${serverUrl}/profile/homepage`, {
        method: "GET",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          setUpcomingContests(data.upcomingContests);
          setUpcomingWebinars(data.upcomingWebinars);
          setTopHiring(data.topHiring);
          setTopShowcase(data.topShowcase);
          setExploreCourses(data.browseCourses);
          setEnrolledCourses(data.enrolledCourses);
          setCurrentPosition(data.currentPosition);
        })
        .catch(function (err) {
          console.log("Course data fetching failed:", err);
        })
        .finally(function () {
          setLoading(false);
        });
    }
    loadData();
  }, [updateMessage, updateCourse]);

  if (loading) {
    return <Loading />
  }

  if (!user || !exploreCourses || !enrolledCourses || !upcomingContests || !upcomingWebinars || !topHiring || !topShowcase) {
    return <Loading />
  }

  return (
    <ScrollView>
      <View style={styles.gap} />
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeSemiTitle}>{greeting}</Text>
        <Text style={styles.welcomeTitle}>{user.full_name}</Text>
        <Image
          source={require("../../assets/images/welcomeScreen3.png")}
          style={styles.slideImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.gap} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gap: {
    height: 8
  },
  contentBox: {
    margin: 6,
    marginHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 14,
    padding: 8,
    position: 'relative',
    overflow: 'hidden'
  },
  welcomeBox: {
    margin: 6,
    marginHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 14,
    padding: 8,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 100,
    justifyContent: "center"
  },
  welcomeSemiTitle: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    margin: 8,
    marginBottom: 0,
    fontWeight: 500
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#FF6600',
    margin: 8,
    marginTop: 2
  },
  slideImage: {
    width: 180,
    height: 180,
    position: 'absolute',
    right: 0,
    bottom: -68,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 14,
  },
  pointsBox: {
    margin: 6,
    marginHorizontal: 12,
    backgroundColor: "#FF6600",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 14,
    padding: 8,
    position: 'relative',
    overflow: 'hidden'
  },
  pointsBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  points: {
    flexDirection: "row",
    alignItems: 'center',
  },
  pointsIcon: {
    color: "rgba(255, 255, 0, 0.8)",
    fontSize: 20
  },
  pointsCount: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: 800,
    marginLeft: 6
  },
  pointsTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    fontWeight: 600,
    marginTop: 2
  },
  pointsContainer: {
    margin: 8,
    alignItems: "center"
  },
  pointsDetails: {
    margin: 8,
  },
  pointsDetailsTitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 18,
    fontWeight: 800,

  },
  pointsDetailsSemiTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: 500,
  },
  leaderboardButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 4,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  leaderboardButtonText: {
    fontWeight: 'bold',
    color: '#FF6600',
    fontSize: 15,
  },
  leaderboardButtonIcon: {
    color: '#FF6600',
    fontSize: 16,
    marginLeft: 10
  },
  divider: {
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    marginVertical: 12,
    width: "80%",
    marginHorizontal: 'auto'
  },
  title: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)'
  },

  allButton: {
    backgroundColor: '#FF6600',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  allButtonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 15,
  },
  allButtonIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10
  },
});