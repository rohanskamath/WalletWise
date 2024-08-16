import React from "react";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DashCard = ({ title, balance, icon }) => {
  const [fontsLoaded] = useCustomFonts();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardIconContainer}>
          <MaterialCommunityIcons name={icon} size={32} color="white" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.balanceText}>₹{balance}.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 250,
    height: 120,
    marginRight: 10,
    marginLeft: 70,
    borderRadius: 10,
    elevation: 4, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: "#fff",
    // opacity: 0.85,
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  cardIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#012970", // Darker background for the icon container
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "merriweather-bold",
    color: "#000",
    textAlign: "left",
    marginBottom: 6,
  },
  balanceText: {
    fontSize: 20,
    fontFamily: "Roboto",
    color: "#000",
    textAlign: "left",
  },
});

export default DashCard;
