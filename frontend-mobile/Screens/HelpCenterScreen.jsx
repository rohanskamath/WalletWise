import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import LottieView from "lottie-react-native";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import Accordion from "react-native-collapsible/Accordion";
import { useAuth } from "../Context/AuthContext";

const HelpCenterScreen = () => {
  const [fontsLoaded] = useCustomFonts();
  const [activeSections, setActiveSections] = useState([]);
  const { login, authUser } = useAuth();

  const FAQ = [
    {
      question: "How can I categorize my expenses?",
      answer:
        'You can categorize your expenses by going to the "Expense Categories" section. In this section, you can create new categories by providing a name. These categories will help you organize your expenses and provide more detailed analytics.',
    },
    {
      question: "What information is displayed on the Dashboard?",
      answer:
        "The Dashboard gives you an overview of your financial status. It includes a summary of your account details, a list of your expense categories, recent transactions, and highlights from the Analytics section. The Dashboard helps you quickly understand your financial health at a glance.",
    },
    {
      question: "How do I add a new transaction?",
      answer:
        'To add a new transaction, go to the "Transactions" section. Select whether the transaction is an income or an expense. For expenses, choose the appropriate category from the list. Enter the amount, date, and any additional details, then save the transaction. This will ensure your records are up-to-date.',
    },
    {
      question: "Can I edit or delete previously added transactions?",
      answer:
        'Yes, you can edit previously added transactions, but deletion is not supported. To edit a transaction, navigate to the "Transactions" section, find the transaction you want to modify, and select the edit option. Editing a transaction will automatically update the analytics section to reflect the changes. This ensures that your visual representations and overall financial overview remain accurate.',
    },
    {
      question: "How do I add my account details?",
      answer:
        'To add your account details, navigate to the "My Account" section in the app. Here, you can input your account name, type, and other relevant details. Make sure to save your information before exiting the section to ensure your account is set up correctly.',
    },
    {
      question: "How do I handle multiple accounts within the application?",
      answer:
        'The application allows you to manage multiple accounts by adding each one separately in the "My Account" section. Each account can have its own set of transactions and expense categories. When adding a transaction, you can select the account to which it belongs. The analytics and dashboard will aggregate data across all accounts.',
    },
    {
      question:
        "Is there a way to import/export my transaction data for backup or analysis in other tools?",
      answer:
        'No, the application does not support importing or exporting transaction data for backup or analysis in other tools. If you need assistance with accessing or managing your data, please contact the admin. You can send an email using the "Contact Us" section in the app for further assistance.',
    },
    {
      question:
        "Can I customize the analytics charts to focus on specific expense categories or time periods?",
      answer:
        "Yes, the analytics charts are highly customizable. You can filter the charts by specific expense categories, income sources, and time periods such as days, weeks, months, or years. This customization allows you to focus on particular aspects of your finances, helping you to gain more detailed insights and make informed decisions.",
    },
    {
      question:
        "How does the app ensure the security and privacy of my financial data?",
      answer:
        "The app ensures the security and privacy of your financial data by not saving account details in the database. Account details are managed solely by the user and are added or edited directly within the app. This approach minimizes the risk of sensitive information being compromised. Additionally, the app implements encryption of data at rest and in transit, secure authentication methods, and follows industry-standard privacy practices to protect your transactions and other financial data.",
    },
    {
      question: "Can I sync my transaction data across multiple devices?",
      answer:
        'No, the application does not support importing or exporting transaction data for backup or analysis in other tools. Similarly, the application does not support syncing transaction data across multiple devices. If you need assistance with accessing your data on different devices or managing your data, please contact the admin. You can send an email using the "Contact Us" section in the app for further assistance.',
    },
  ];

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const renderHeader = (section, index, isActive) => {
    return (
      <View style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>{section.question}</Text>
      </View>
    );
  };

  const renderContent = (section) => {
    return (
      <View style={styles.accordionContent}>
        <Text style={styles.accordionContentText}>{section.answer}</Text>
      </View>
    );
  };

  const updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <View style={styles.pageTitle}>
        <Text style={styles.title}>Help Center</Text>
      </View> */}
      <View style={styles.profileSetting}>
        <Text style={styles.heading}>FAQs</Text>
        <Accordion
          sections={FAQ}
          activeSections={activeSections}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={updateSections}
          underlayColor="transparent"
        />
        <Text style={[styles.heading, styles.contactHeading]}>
          Still have any questions? Contact us to get your answer!
        </Text>
        <View style={styles.row}>
          <View style={styles.animationContainer}>
            <LottieView
              source={require("../assets/animation/helpcenter.json")}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </View>
        </View>
        <View style={styles.formInput}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={authUser.fullName}
              autoComplete="off"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email-Id:</Text>
            <TextInput
              style={[styles.input, styles.disabled]}
              placeholder="Enter your email-id"
              value={authUser.emailID}
              autoComplete="off"
              editable={false}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Message:</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Leave your queries here"
              multiline={true}
              numberOfLines={7}
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
  },
  pageTitle: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,

    fontFamily: "merriweather-black",
    textAlign: "center",
  },
  profileSetting: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontFamily: "merriweather-bold",
    marginBottom: 10,
    color: "#012970",
  },
  contactHeading: {
    marginTop: 20,
    color: "#012970",
    fontFamily: "merriweather-bold",
  },
  row: {
    flexDirection: "row",
    marginTop: 20,
  },
  animationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  formInput: {
    flex: 2,
    paddingLeft: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: "merriweather-bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 6,
    padding: 10,
    fontFamily: "merriweather-regular",
  },
  disabled: {
    backgroundColor: "#f1f0f0",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 6,
    padding: 10,
    fontFamily: "merriweather-regular",
    height: 100,
  },
  button: {
    backgroundColor: "#012970",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "merriweather-bold",
  },
  accordionHeader: {
    padding: 15,
    backgroundColor: "#f9f9f9",

    borderBottomWidth: 1,
    borderColor: "lightgray",
    fontFamily: "merriweather-bold",
  },
  accordionHeaderText: {
    // color: "#012970",
    fontSize: 16,
    fontFamily: "merriweather-bold",
  },
  accordionContent: {
    padding: 15,
    backgroundColor: "#f1f1f1",
  },
  accordionContentText: {
    fontSize: 14,
    fontFamily: "merriweather-regular",
  },
});

export default HelpCenterScreen;
