import { serverUrl } from "@/components/constants";
import BrowseCourseBox from "@/components/course/BrowseCourseBox";
import EnrolledCourseBox from "@/components/course/EnrolledCourseBox";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

type Course = {
  id: number,
  name: string,
  description: string,
  category: string
}

export default function Course() {
  const router = useRouter();

  const [exploreCourses, setExploreCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadData() {
      fetch(`${serverUrl}/course/all`, {
        method: "GET",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          setExploreCourses(data.exploreCourses);
          setEnrolledCourses(data.enrolledCourses);
        })
        .catch(function (err) {
          console.log("Course data fetching failed:", err);
        })
        .finally(function () {
          setLoading(false);
        });
    }
    loadData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.gap}></View>
      <Text style={styles.title}>Explore Courses</Text>
      <ScrollView horizontal style={{ width: "100%", flexDirection: "row" }} contentContainerStyle={{ paddingHorizontal: 8 }}>
        {
          exploreCourses.map(function (course) {
            return <BrowseCourseBox key={course.id} course={course} />
          })
        }
      </ScrollView>
      <TouchableOpacity style={styles.allButton} onPress={() => {router.push("/(course)/browse")}}>
        <Text style={styles.allButtonText}>Browse All Courses</Text>
        <FontAwesome6 name="arrow-right" style={styles.allButtonIcon} />
      </TouchableOpacity>
      <View style={styles.divider} />
      <Text style={styles.title}>Enrolled Courses</Text>
      <View style={{paddingHorizontal: 8}}>
        {
          enrolledCourses.map(function (course) {
            return <EnrolledCourseBox key={course.id} course={course} />
          })
        }
      </View>
      <View style={styles.gap}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)'
  },
  gap: {
    height: 8
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
    marginLeft: 8
  },
  divider: {
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    marginVertical: 12,
    width: "80%",
    marginHorizontal: 'auto'
  }
})