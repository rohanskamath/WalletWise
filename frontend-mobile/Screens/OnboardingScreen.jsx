import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import React from "react";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import LottieView from "lottie-react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { setItem } from "../utils/asyncStorage";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useCustomFonts();

  const handleDone = () => {
    setItem("onboarded", "1");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        bottomBarHighlight={false}
        containerStyles={{
          paddingHorizontal: 15,
        }}
        pages={[
          {
            key: "page1", // Add a unique key prop to each page
            backgroundColor: "#012970",
            fontFamily: "merriweather-regular",
            image: (
              <View>
                <LottieView
                  style={styles.lottie}
                  source={require("../assets/animation/expenses.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: (
              <Text style={styles.title}>Effortless Expense Management</Text>
            ),
            subtitle: (
              <Text style={styles.subtitle}>
                Customize and add new categories to organize your expenses
                efficiently.
              </Text>
            ),
          },
          {
            key: "page2", // Add a unique key prop to each page
            backgroundColor: "#012970",
            image: (
              <View>
                <LottieView
                  style={styles.lottie}
                  source={require("../assets/animation/finance.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: (
              <Text style={styles.title}>Comprehensive Financial Insights</Text>
            ),
            subtitle: (
              <Text style={styles.subtitle}>
                Visualize your income, expenses, and financial trends with
                interactive charts and graphs.
              </Text>
            ),
          },
          {
            key: "page3", // Add a unique key prop to each page
            backgroundColor: "#012970",
            image: (
              <View>
                <LottieView
                  style={styles.lottie}
                  source={require("../assets/animation/user.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: (
              <Text style={styles.title}>Personalized User Experience</Text>
            ),
            subtitle: (
              <Text style={styles.subtitle}>
                Manage and update your personal information and preferences with
                ease.
              </Text>
            ),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: 300,
    height: 400,
  },
  donebtn: {
    padding: 18,
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
  },
  title: {
    fontFamily: "merriweather-bold",
    fontSize: 22,
    marginTop: -90,
    marginBottom: 20,
    color: "#fff",
    padding: 10,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "merriweather-regular",
    color: "#fff",
    paddingRight: 15,
    paddingLeft: 15,
    fontSize: 14,
  },
});
