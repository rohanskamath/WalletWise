import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import AccountCard from "../Components/AccountCard";

const AccountScreen = ({ navigation }) => {
  const { authUser } = useAuth();
  const [myAccount, setMyAccount] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://10.0.2.2:7026/api/Account/AllAccounts?EmailId=${encodeURIComponent(
          authUser.emailID
        )}`
      )
      .then((result) => {
        setMyAccount(result.data);
      })
      .catch((err) => console.log(err));
  });

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardContainer}>
          {myAccount.map((account, index) => (
            <AccountCard
              key={index}
              account={account}
              navigation={navigation}
            />
          ))}
          <TouchableOpacity
            style={styles.addCard}
            onPress={() => navigation.navigate("AddAccount")}
          >
            <Text style={styles.addText}> + </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  addCard: {
    width: "75%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#012970",
    borderWidth: 2,
    borderStyle: "dotted",
    borderRadius: 8,
    margin: 8,
    alignSelf: "center",
  },
  addText: {
    fontSize: 38,
    color: "#012970",
  },
});

export default AccountScreen;
