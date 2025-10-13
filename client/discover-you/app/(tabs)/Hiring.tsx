import FilterBox from "@/components/common/FilterBox";
import { serverUrl } from "@/components/constants";
import JobBox from "@/components/hiring/JobBox";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Hiring() {
  const [hiring, setHiring] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadData() {
      fetch(`${serverUrl}/hiring/all`, {
        method: "GET",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          setHiring(data.hiring);
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

  return (
    <ScrollView>
      <View style={styles.gap}/>
      <FilterBox sort={["Newest First", "Highest Salary"]}/>
      <View style={styles.jobBoxContainer}>
      {hiring &&
        hiring.map(function(job){
          return(
            <JobBox key={job.id} job={job}/>
          )
        })
      }
      </View>
      <View style={styles.gap}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  jobBoxContainer: {
    paddingHorizontal: 8
  },
  gap: {
    height: 8
  }
});