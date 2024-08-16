import { StyleSheet, Text, View, StatusBar } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DashboardScreen from "../Screens/DashboardScreen";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import CategoriesScreen from "../Screens/CategoriesScreen";
import TransactionScreen from "../Screens/TransactionScreen";
import AccountScreen from "../Screens/AccountScreen";
import AnalyticsScreen from "../Screens/AnalyticsScreen";
import HelpCenterScreen from "../Screens/HelpCenterScreen";
import {
  MaterialCommunityIcons,
  Entypo,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import OnboardingScreen from "../Screens/OnboardingScreen";
import CustomDrawer from "../Components/CustomDrawer";
import MyProfileScreen from "../Screens/MyProfileScreen";
import AddAccountScreen from "../Screens/AddAccountScreen";
import AddTransactionScreen from "../Screens/AddTransactionScreen";
import EditAccountScreen from "../Screens/EditAccountScreen";
import ForgotPasswordScreen from "../Screens/ForgotPasswordScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [fontsLoaded] = useCustomFonts();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const DrawerNavigator = () => (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#012970",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "merriweather-bold",
        },
        drawerLabelStyle: {
          fontFamily: "merriweather-regular",
          marginLeft: -25,
        },
        drawerActiveBackgroundColor: "#012970",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#012970",
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              size={22}
              color={color}
            />
          ),
        }}
        component={DashboardScreen}
      />
      <Drawer.Screen
        name="Categories"
        options={{
          title: "Expense Categories",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="format-list-checkbox"
              size={22}
              color={color}
            />
          ),
        }}
        component={CategoriesScreen}
      />
      <Drawer.Screen
        name="Transactions"
        options={{
          title: "Transactions",
          drawerIcon: ({ color }) => (
            <Entypo name="back-in-time" size={22} color={color} />
          ),
        }}
        component={TransactionScreen}
      />
      <Drawer.Screen
        name="Accounts"
        options={{
          title: "My Accounts",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="bank-outline"
              size={22}
              color={color}
            />
          ),
        }}
        component={AccountScreen}
      />
      <Drawer.Screen
        name="Analytics"
        options={{
          title: "Analytics",
          drawerIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" size={22} color={color} />
          ),
        }}
        component={AnalyticsScreen}
      />
      <Drawer.Screen
        name="HelpCenter"
        options={{
          title: "Help Center",
          drawerIcon: ({ color }) => (
            <AntDesign name="customerservice" size={22} color={color} />
          ),
        }}
        component={HelpCenterScreen}
      />
    </Drawer.Navigator>
  );

  return (
    <>
      <StatusBar backgroundColor="#012970" />
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          // options={{ headerShown: false }}
          options={{
            title: "Account Recovery",
            headerStyle: {
              backgroundColor: "#012970",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "merriweather-bold",
            },
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={MyProfileScreen}
          // options={{ headerShown: false }}
          options={{
            title: "My Profile",
            headerStyle: {
              backgroundColor: "#012970",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "merriweather-bold",
            },
          }}
        />
        <Stack.Screen
          name="AddAccount"
          component={AddAccountScreen}
          // options={{ headerShown: false }}
          options={{
            title: "Add New Account",
            headerStyle: {
              backgroundColor: "#012970",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "merriweather-bold",
            },
          }}
        />
        <Stack.Screen
          name="EditAccount"
          component={EditAccountScreen}
          // options={{ headerShown: false }}
          options={{
            title: "Edit Account Information",
            headerStyle: {
              backgroundColor: "#012970",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "merriweather-bold",
            },
          }}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          // options={{ headerShown: false }}
          options={{
            title: "Add New Transaction",
            headerStyle: {
              backgroundColor: "#012970",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "merriweather-bold",
            },
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
