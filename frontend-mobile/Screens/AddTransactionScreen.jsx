import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DropDown from "react-native-drop-down-mith";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const AddTransactionScreen = ({ navigation }) => {
  const [fontsLoaded] = useCustomFonts();
  const [transactionDetails, setTransactionDetails] = useState({
    transactionType: "",
    transactionDate: new Date(),
    tCategory: "",
    bAccount: "",
    remarks: "",
    amount: 0,
  });
  const { authUser } = useAuth();
  const [errors, setErrors] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (authUser && authUser.emailID) {
      axios
        .get(`http://10.0.2.2:7026/api/CatMapUsers/${authUser.emailID}`)
        .then((result) => {
          if (result.status === 200) {
            setCategories(result.data);
          } else if (result.status === 202) {
            setCategories([]);
          }
        })
        .catch((err) => console.log(err));

      axios
        .get(
          `http://10.0.2.2:7026/api/Account/AllAccounts?EmailId=${encodeURIComponent(
            authUser.emailID
          )}`
        )
        .then((result) => {
          setAccounts(result.data);
        })
        .catch((err) => console.log(err));
      console.log(accounts);
    }
  }, [authUser]);

  const validateForm = () => {
    const newErrors = {};
    if (!transactionDetails.transactionType) {
      newErrors.transactionType = "* Transaction type is required";
    }
    if (!transactionDetails.transactionDate) {
      newErrors.transactionDate = "* Transaction Date is required";
    }
    if (
      transactionDetails.transactionType === "Expense" &&
      !transactionDetails.tCategory
    ) {
      newErrors.tCategory = "* Category is required for expense mode";
    }
    if (!transactionDetails.bAccount) {
      newErrors.bAccount = "* Bank account is required";
    }
    if (!transactionDetails.amount) {
      newErrors.amount = "* Amount is required";
    }
    if (!transactionDetails.remarks) {
      newErrors.remarks = "* Remarks are required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTransactionDetails({
        ...transactionDetails,
        transactionDate: selectedDate,
      });
    }
  };

  const handleSubmitBtn = () => {
    if (validateForm()) {
      if (transactionDetails.transactionType === "Income") {
        const incomeTransaction = {
          incomeDate: transactionDetails.transactionDate,
          amount: transactionDetails.amount,
          remarks: transactionDetails.remarks,
          accountNo: transactionDetails.bAccount,
          emailId: authUser.emailID,
        };
        axios
          .post("http://10.0.2.2:7026/api/Income", incomeTransaction)
          .then((result) => {
            if (result.status === 201) {
              Toast.show({
                type: "success",
                text1: "Income Transaction Added Successfully",
                visibilityTime: 2000,
                onHide: () => {
                  navigation.goBack();
                },
              });
              setTransactionDetails({
                transactionType: "",
                transactionDate: new Date(),
                tCategory: "",
                bAccount: "",
                remarks: "",
                amount: 0,
              });
            } else if (result.status === 200) {
              Toast.show({
                type: "error",
                text1: result.data,
                visibilityTime: 2000,
              });
            }
          })
          .catch((err) => console.log(err));
      } else {
        const expenseTransaction = {
          expenseDate: transactionDetails.transactionDate,
          categoryId: transactionDetails.tCategory,
          amount: transactionDetails.amount,
          remarks: transactionDetails.remarks,
          accountNo: transactionDetails.bAccount,
          emailId: authUser.emailID,
        };

        axios
          .post("http://10.0.2.2:7026/api/Expense", expenseTransaction)
          .then((result) => {
            if (result.status === 201) {
              Toast.show({
                type: "success",
                text1: "Expense Transaction Added Successfully",
                visibilityTime: 2000,
                onHide: () => {
                  navigation.goBack();
                },
              });
              setTransactionDetails({
                transactionType: "",
                transactionDate: new Date(),
                tCategory: "",
                bAccount: "",
                remarks: "",
                amount: 0,
              });
            } else {
              Toast.show({
                type: "error",
                text1: result.data,
                visibilityTime: 2000,
              });
            }
          })
          .catch((err) => console.log(err));
      }
    } else {
      console.log("Some error occured!");
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Transaction Type</Text>
        <DropDown
          titleStyle={styles.dropdownTitle}
          onClick={(item) =>
            setTransactionDetails({
              ...transactionDetails,
              transactionType: item.value,
            })
          }
          placeHolder="Choose your transaction mode"
          data={[
            { id: 0, value: "Income", label: "Income Mode" },
            { id: 1, value: "Expense", label: "Expense Mode" },
          ]}
          itemStyle={styles.dropdownItem}
        />
        {errors.transactionType && (
          <Text style={styles.error}>{errors.transactionType}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Transaction Date</Text>
        <TextInput
          style={styles.input}
          value={transactionDetails.transactionDate.toDateString()}
          onTouchStart={() => setShowDatePicker(true)}
          editable={true}
        />
        {showDatePicker && (
          <DateTimePicker
            value={transactionDetails.transactionDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {errors.transactionDate && (
          <Text style={styles.error}>{errors.transactionDate}</Text>
        )}
      </View>

      {transactionDetails.transactionType === "Expense" && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <DropDown
            titleStyle={styles.dropdownTitle}
            // title={"Choose your category"}
            onClick={(item) =>
              setTransactionDetails({
                ...transactionDetails,
                tCategory: item.id,
              })
            }
            placeHolder="Choose your category"
            data={categories.map((cat) => ({
              id: cat.categoryId,
              value: cat.catName,
              label: cat.categoryId,
            }))}
            itemStyle={styles.dropdownItem}
          />
          {errors.tCategory && (
            <Text style={styles.error}>{errors.tCategory}</Text>
          )}
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bank Account</Text>
        <DropDown
          titleStyle={styles.dropdownTitle}
          onClick={(item) =>
            setTransactionDetails({
              ...transactionDetails,
              bAccount: item.id,
            })
          }
          placeHolder="Choose your bank account"
          data={accounts.map((acc) => ({
            id: acc.accountNo,
            value: `${acc.accountNo} - ${acc.bankName}`,
            label: acc.accountNo,
          }))}
          itemStyle={styles.dropdownItem}
        />
        {errors.bAccount && <Text style={styles.error}>{errors.bAccount}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={transactionDetails.amount}
          keyboardType="numeric"
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9.]/g, "");
            setTransactionDetails({
              ...transactionDetails,
              amount: numericValue,
            });
          }}
        />
        {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Leave your remarks here"
          multiline
          value={transactionDetails.remarks}
          textAlignVertical="top"
          onChangeText={(text) =>
            setTransactionDetails({ ...transactionDetails, remarks: text })
          }
        />
        {errors.remarks && <Text style={styles.error}>{errors.remarks}</Text>}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmitBtn}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "merriweather-bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    fontFamily: "merriweather-regular",
    height: 40,
  },
  dropdownTitle: {
    marginBottom: 5,
    marginLeft: 3,
    fontFamily: "merriweather-bold",
  },
  dropdownItem: {
    fontFamily: "merriweather-regular",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    fontFamily: "merriweather-regular",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    height: 100,
  },
  error: {
    color: "red",
    marginTop: 5,
    fontFamily: "merriweather-regular",
    fontSize: 10,
  },
  button: {
    backgroundColor: "#012970",
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "merriweather-regular",
  },
});

export default AddTransactionScreen;
