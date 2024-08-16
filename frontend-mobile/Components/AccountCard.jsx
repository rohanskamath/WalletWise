import React from "react";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const AccountCard = ({ account, navigation }) => {
  const maskAccountNumber = (accountNo) => {
    const lastFourDigits = accountNo.slice(-4);
    const maskedPart = accountNo.slice(0, -4).replace(/./g, "x");
    return maskedPart + lastFourDigits;
  };

  const [fontsLoaded] = useCustomFonts();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <FontAwesome name="bank" size={32} color="#fff" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.bankName}>{account.bankName}</Text>
        <Text style={styles.accountNo}>
          {maskAccountNumber(account.accountNo)}
        </Text>
        <Text style={styles.branchName}>{account.branchName}</Text>
        <Text style={styles.balance}>Balance: ₹ {account.balance}</Text>
      </View>
      <TouchableOpacity
        style={styles.editIconContainer}
        onPress={() =>
          navigation.navigate("EditAccount", { accountData: account })
        }
      >
        <Feather
          name="edit"
          size={20}
          color="#012970"
          style={styles.editIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "75%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    margin: 18,
    marginBottom: 22,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    top: -30,
    backgroundColor: "#012970",
    borderRadius: 50,
    padding: 16,
    elevation: 3,
  },
  cardContent: {
    alignItems: "center",
    marginTop: 30,
  },
  bankName: {
    fontSize: 18,
    fontFamily: "merriweather-bold",
    color: "#012970",
  },
  accountNo: {
    fontSize: 16,
    fontFamily: "merriweather-regular",
    marginVertical: 8,
  },
  branchName: {
    fontSize: 14,
    fontFamily: "merriweather-regular",
  },
  balance: {
    fontSize: 16,
    fontFamily: "merriweather-regular",
    marginTop: 8,
  },
  editIconContainer: {
    position: "absolute",
    bottom: -20,
    right: -125,
  },
  editIcon: {
    position: "relative",
  },
});

export default AccountCard;
