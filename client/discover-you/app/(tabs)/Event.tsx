import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Contest from "@/components/event/Contest";
import Webinar from "@/components/event/Webinar";

export default function Event() {
  const [activeSubTab, setActiveSubTab] = useState<'contest' | 'webinar'>('contest');
  return (
    <View style={styles.container}>
      <View style={styles.subTabContainer}>
        <TouchableOpacity style={styles.subTab} onPress={() => setActiveSubTab('contest')}>
          <Text style={activeSubTab == 'contest' ? styles.activeSubTabText : styles.subTabText}>Contest</Text>
          {activeSubTab == 'contest' ? <View style={styles.subTabIndicator} /> : null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.subTab} onPress={() => setActiveSubTab('webinar')}>
          <Text style={activeSubTab == 'webinar' ? styles.activeSubTabText : styles.subTabText}>Webinar</Text>
          {activeSubTab == 'webinar' ? <View style={styles.subTabIndicator} /> : null}
        </TouchableOpacity>
      </View>
      {
        activeSubTab == 'contest' && <Contest />
      }
      {
        activeSubTab == 'webinar' && <Webinar/>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE"
  },
  subTabContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
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
})