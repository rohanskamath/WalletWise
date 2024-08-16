import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Toast from "react-native-toast-message";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import {
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const AddAccountScreen = ({ navigation }) => {
  const { authUser } = useAuth();

  const [fontsLoaded] = useCustomFonts();
  const [userBankDetails, setUserBankDetails] = useState({
    accountNo: "",
    bankName: "",
    branchName: "",
    balance: "",
    emailID: authUser.emailID,
  });
  const [errors, setErrors] = useState({});

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const validateBankName = () => {
    const bankNameError = {};
    if (userBankDetails.bankName.trim() === "") {
      bankNameError.bankErrMsg = "* Bank name field is required";
      setErrors(bankNameError);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateBranchName = () => {
    const branchNameError = {};
    if (userBankDetails.branchName.trim() === "") {
      branchNameError.branchErrMsg = "* Branch name field is required";
      setErrors(branchNameError);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateAccNo = () => {
    const accoNoError = {};
    const accountNoRegex = /^\d{11,16}$/;

    if (userBankDetails.accountNo.trim() === "") {
      accoNoError.accnoErrMsg = "* Account number field is required";
      setErrors(accoNoError);
      return false;
    } else if (!accountNoRegex.test(userBankDetails.accountNo)) {
      accoNoError.accnoErrMsg =
        "* Account number must be between 11 to 16 digits";
      setErrors(accoNoError);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateBalance = () => {
    const balanceError = {};
    if (
      userBankDetails.balance.trim() === "" ||
      isNaN(userBankDetails.balance)
    ) {
      balanceError.balanceErrMsg =
        "* Balance field is required and must be a number";
      setErrors(balanceError);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleAccountBtn = () => {
    if (
      !validateBankName() ||
      !validateAccNo() ||
      !validateBranchName() ||
      !validateBalance()
    ) {
      return;
    }

    axios
      .post("http://10.0.2.2:7026/api/Account/", userBankDetails)
      .then((result) => {
        if (result.status === 200) {
          Toast.show({
            type: "success",
            text1: "Account Added Successfully",
            position: "top",
            visibilityTime: 2000,
            onHide: () => {
              setUserBankDetails({
                accountNo: "",
                bankName: "",
                branchName: "",
                balance: "",
              });
              navigation.goBack();
            },
          });
        } else {
          Toast.show({
            type: "error",
            text1: result.data,
            position: "top",
            visibilityTime: 2000,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="bank-outline"
              size={20}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter bank name"
              value={userBankDetails.bankName}
              onChangeText={(text) =>
                setUserBankDetails({ ...userBankDetails, bankName: text })
              }
              onBlur={validateBankName}
            />
          </View>
          {errors.bankErrMsg && (
            <Text style={styles.error}>{errors.bankErrMsg}</Text>
          )}

          <View style={styles.inputContainer}>
            <FontAwesome name="id-card-o" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter account number"
              value={userBankDetails.accountNo}
              onChangeText={(text) =>
                setUserBankDetails({ ...userBankDetails, accountNo: text })
              }
              keyboardType="numeric"
              onBlur={validateAccNo}
            />
          </View>
          {errors.accnoErrMsg && (
            <Text style={styles.error}>{errors.accnoErrMsg}</Text>
          )}

          <View style={styles.inputContainer}>
            <FontAwesome5 name="code-branch" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter branch name"
              value={userBankDetails.branchName}
              onChangeText={(text) =>
                setUserBankDetails({ ...userBankDetails, branchName: text })
              }
              onBlur={validateBranchName}
            />
          </View>
          {errors.branchErrMsg && (
            <Text style={styles.error}>{errors.branchErrMsg}</Text>
          )}

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="cash-multiple"
              size={20}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter balance amount"
              value={userBankDetails.balance}
              onChangeText={(text) =>
                setUserBankDetails({ ...userBankDetails, balance: text })
              }
              keyboardType="numeric"
              onBlur={validateBalance}
            />
          </View>
          {errors.balanceErrMsg && (
            <Text style={styles.error}>{errors.balanceErrMsg}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleAccountBtn}>
            <Text style={styles.buttonText}>Add Account</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      {/* Toast message component */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.7,
    borderColor: "#ccc",
    marginBottom: 16,
    borderRadius: 10,
  },
  icon: {
    marginRight: 8,
    marginLeft: 10,
    color: "gray",
  },
  input: {
    flex: 1,
    padding: 13,
    fontSize: 14,
    fontFamily: "merriweather-regular",
  },
  error: {
    color: "red",
    fontSize: 11,
    fontFamily: "merriweather-regular",
    marginBottom: 8,
    marginTop: -8,
  },
  button: {
    backgroundColor: "#012970",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "merriweather-bold",
  },
});

export default AddAccountScreen;
