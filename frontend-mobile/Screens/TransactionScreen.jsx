import React from "react";
import { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import { useNavigation } from "@react-navigation/native";
import TransactionCard from "../Components/TransactionCard";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const TransactionScreen = () => {
  const [fontsLoaded] = useCustomFonts();
  const [transactions, setTransactions] = useState([]);
  const navigation = useNavigation();
  const { login, authUser } = useAuth();
  useEffect(() => {
    axios
      .get(`http://10.0.2.2:7026/api/Transaction/${authUser.emailID}`)
      .then((result) => {
        setTransactions(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTransaction")}
      >
        <Text style={styles.addButtonText}>Add New Transaction</Text>
      </TouchableOpacity>
      <TransactionCard transactions={transactions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  addButton: {
    backgroundColor: "#012970",
    padding: 10,
    borderRadius: 5,
    margin: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "merriweather-regular",
  },
});

export default TransactionScreen;
