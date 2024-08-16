import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";

const OPTIONS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
];

const ChartFilter = (props) => {
  const [fontsLoaded] = useCustomFonts();
  const [visible, setVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Filters");

  const handleFilterChange = (filter, label) => {
    setSelectedFilter(label);
    props.filterChange(filter);
    setVisible(false);
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => handleFilterChange(item.value, item.label)}
    >
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={styles.button}
      >
        <Ionicons name="funnel-outline" style={styles.icon} />
        <Text style={styles.buttonText}>{selectedFilter}</Text>
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropdown}>
          <FlatList
            data={OPTIONS}
            renderItem={renderOption}
            keyExtractor={(item) => item.value}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    margin: 10,
    position: "relative",
  },
  icon: {
    fontSize: 14,
    color: "#012970",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 10,
    fontFamily: "merriweather-regular",
    color: "#012970",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    width: 85,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 8,
    elevation: 5,
    zIndex: 1,
  },
  option: {
    paddingVertical: 5,
  },
  optionText: {
    fontSize: 10,
    fontFamily: "merriweather-regular",
    color: "#012970",
  },
});

export default ChartFilter;
