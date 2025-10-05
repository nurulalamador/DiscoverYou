import DoPostBox from "@/components/showcase/DoPostBox";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Showcase() {
  return (
    <ScrollView>
      <View style={styles.gap}></View>
      <DoPostBox posts={null}/>
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
});