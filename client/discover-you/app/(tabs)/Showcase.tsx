import FilterBox from "@/components/common/FilterBox";
import DoPostBox from "@/components/showcase/DoPostBox";
import ForYouPosts from "@/components/showcase/ForYouPosts";
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Showcase() {
  const [updatePosts, setUpdatePosts] = useState(0);

  return (
    <ScrollView>
      <View style={styles.gap}></View>
      <DoPostBox setUpdatePosts={setUpdatePosts}/>
      <FilterBox sort={["Newest First", "Most Liked"]}/>
      <ForYouPosts updatePosts={updatePosts}/>
      <View style={styles.gap}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gap: {
    height: 8
  },
});