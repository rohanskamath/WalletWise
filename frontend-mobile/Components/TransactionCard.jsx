import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import { MaterialIcons, Feather } from "@expo/vector-icons";

const TransactionCard = ({ transactions }) => {
  const [fontsLoaded] = useCustomFonts();

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        item.type === "Income" ? styles.incomeCard : styles.expenseCard,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.cardTitle}>
          Transaction ID: T100{item.transactionId}
        </Text>
        <Feather
          name={item.type === "Income" ? "arrow-down-left" : "arrow-up-right"}
          size={24}
          color={item.type === "Income" ? "green" : "red"}
        />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.leftColumn}>
          <Text style={styles.cardText}>
            <Text style={styles.cardLabel}>Date:</Text> {item.formattedDate}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.cardLabel}>Acc No:</Text> {item.accountNo}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.cardLabel}>Amount :</Text> ₹{item.amount}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.cardLabel}>Category:</Text>{" "}
            {item.type === "Expense" ? item.categoryName : "N/A"}
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={[styles.cardText, styles.remarks]}>
            <Text style={styles.cardLabel}>Remarks:</Text> {item.remarks}
          </Text>
          <Text style={styles.cardText}>
            <Text style={styles.cardLabel}>Balance:</Text>{" "}
            <Text style={{ color: "brown", fontWeight: "bold" }}>
              {" "}
              {item.newBalance}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.transactionId.toString()}
      ListEmptyComponent={() => (
        <Text style={styles.noRecordsText}>No Records Found</Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  incomeCard: {
    borderLeftWidth: 5,
    borderLeftColor: "green",
  },
  expenseCard: {
    borderLeftWidth: 5,
    borderLeftColor: "red",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "merriweather-bold",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  cardText: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: "merriweather-regular",
  },
  cardLabel: {
    fontWeight: "bold",
  },
  remarks: {
    fontSize: 13,
    color: "#012970",
    fontFamily: "merriweather-bold",
  },
  noRecordsText: {
    textAlign: "center",
    color: "grey",
    fontSize: 14,
    marginTop: 20,
  },
});

export default TransactionCard;
