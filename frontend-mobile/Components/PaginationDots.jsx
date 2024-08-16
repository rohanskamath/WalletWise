import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

const PaginationDots = ({ currentIndex, data }) => {
  return (
    <View style={styles.dotsContainer}>
      {data.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.dot, currentIndex === index && styles.activeDot]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 0,
  },
  dot: {
    marginTop: -15,
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#012970",
  },
});

export default PaginationDots;
