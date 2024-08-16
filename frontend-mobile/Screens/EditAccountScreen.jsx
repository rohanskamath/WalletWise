import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";

const EditAccountScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { accountData } = route.params;

  const [accountDetails, setAccountDetails] = useState({
    bankName: "",
    accountNo: "",
    branchName: "",
    balance: "",
    email: "",
  });

  const [fontsLoaded] = useCustomFonts();

  useEffect(() => {
    if (accountData) {
      setAccountDetails({
        bankName: accountData.bankName,
        accountNo: accountData.accountNo,
        branchName: accountData.branchName,
        balance: accountData.balance.toString(),
        email: accountData.userId,
      });
    }
  }, [accountData]);

  const handleUpdateAccount = () => {
    const userAccountUpdate = {
      accountNo: accountDetails.accountNo,
      bankName: accountDetails.bankName,
      branchName: accountDetails.branchName,
      balance: accountDetails.balance,
      emailID: accountDetails.email,
    };
    axios
      .put("http://10.0.2.2:7026/api/Account/UpdateAccount", userAccountUpdate)
      .then((result) => {
        if (result.status === 200) {
          Toast.show({
            type: "success",
            text1: "Account Details Updated Successfully",
            position: "top",
            visibilityTime: 2000,
            onHide: () => {
              navigation.goBack();
            },
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Some Error Occurred",
            position: "top",
            visibilityTime: 2000,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <MaterialCommunityIcons name="bank" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={accountDetails.bankName}
          onChangeText={(text) =>
            setAccountDetails({ ...accountDetails, bankName: text })
          }
          placeholder="Enter bank name"
        />
      </View>
      <View style={styles.inputGroup}>
        <FontAwesome name="id-card-o" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={accountDetails.accountNo}
          onChangeText={(text) =>
            setAccountDetails({ ...accountDetails, accountNo: text })
          }
          placeholder="Enter account number"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputGroup}>
        <MaterialCommunityIcons
          name="office-building-marker-outline"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={accountDetails.branchName}
          onChangeText={(text) =>
            setAccountDetails({ ...accountDetails, branchName: text })
          }
          placeholder="Enter branch name"
        />
      </View>
      <View style={styles.inputGroup}>
        <MaterialCommunityIcons name="cash-multiple" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={accountDetails.balance}
          onChangeText={(text) =>
            setAccountDetails({ ...accountDetails, balance: text })
          }
          placeholder="Enter balance amount"
          keyboardType="numeric"
          editable={false}
        />
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleUpdateAccount}
      >
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      {/* Toast message component */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "white",
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
    marginLeft: 4,
    // color: "gray",
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "merriweather-regular",
    paddingVertical: 4,
  },
  buttonContainer: {
    marginTop: 16,
    fontFamily: "merriweather-bold",
    backgroundColor: "#012970",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "merriweather-bold",
  },
});

export default EditAccountScreen;
