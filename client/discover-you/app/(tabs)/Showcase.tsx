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
      <View style={styles.gap}></View>
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