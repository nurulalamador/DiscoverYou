import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const CircularProgress = ({ progress }:any) => {
  const size = 90;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View style={styles.container}>
      {/* SVG + Center Text */}
      <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
        <Svg width={size} height={size}>
          <Circle
            stroke="rgba(0,0,0,0.1)"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke="#4CAF50"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        {/* Center text (overlay) */}
        <View style={styles.centerOverlay}>
          <Text style={styles.centerText}>{parseInt(progress)}%</Text>
        </View>
      </View>
    </View>
  );
};

export default CircularProgress;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressTexts: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "bold",
  },
  centerOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  centerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
