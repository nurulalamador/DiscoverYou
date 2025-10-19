import FilterBox from "@/components/common/FilterBox";
import Loading from "@/components/common/Loading";
import { serverUrl } from "@/components/constants";
import JobBox from "@/components/hiring/JobBox";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export default function Hiring() {
  const router = useRouter();
  const [hirings, setHirings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    function loadData() {
      fetch(`${serverUrl}/hiring/all`, {
        method: "GET",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          setHirings(data.hirings);
          console.log(data.pending);
          setPending(data.pending);
        })
        .catch(function (err) {
          console.log("Hiring data fetching failed:", err);
        })
        .finally(function () {
          setLoading(false);
        });
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <Loading/>
    )
  }
  
  return (
    <ScrollView>
      {
        pending > 0 ?
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingText}>
              {pending} job application{pending > 1 ? "s" : ""} pending.
            </Text>
            <TouchableOpacity style={styles.pendingButton} onPress={() => {
              router.push("/(hiring)/pending");
            }}>
              <Text style={styles.pendingButtonText}>
                View Applications
              </Text>
              <FontAwesome6 name="chevron-right" style={styles.pendingButtonIcon} />
            </TouchableOpacity>
          </View>
          : <></>
      }

      <View style={styles.gap} />
      <FilterBox sort={["Newest First", "Highest Salary"]} />
      <View style={styles.jobBoxContainer}>
        {hirings &&
          hirings.map(function (job) {
            return (
              <JobBox key={job.id} job={job} />
            )
          })
        }
      </View>
      <View style={styles.gap} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  jobBoxContainer: {
    paddingHorizontal: 8
  },
  gap: {
    height: 8
  },
  divider: {
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    marginVertical: 12,
    width: "80%",
    marginHorizontal: 'auto'
  },
  pendingContainer: {
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
  },
  pendingText: {
    fontSize: 13,
    margin: 8,
    color: "rgba(0,0,0,0.8)"
  },
  pendingButton: {
    flexDirection: "row",
    alignItems: "center",
    margin: 8
  },
  pendingButtonText: {
    fontWeight: 700,
    // color: "rgba(0,0,0,0.8)",
    color: "#FF6600",
  },
  pendingButtonIcon: {
    fontSize: 15,
    // color: "rgba(0,0,0,0.8)",
    color: "#FF6600",
    marginLeft: 8
  }
});