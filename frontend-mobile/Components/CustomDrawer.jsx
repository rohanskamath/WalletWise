import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import { CommonActions } from "@react-navigation/native";
import { MaterialCommunityIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const CustomDrawer = (props) => {
  const [fontsLoaded] = useCustomFonts();
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  const { navigation } = props;
  const { login, authUser } = useAuth();

  return (
    <View style={styles.DrawerContainer}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#012970" }}
      >
        <View style={{ padding: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={require("../assets/PP.jpg")}
              style={styles.ProfileImage}
            />
            <Text style={styles.ProfileText}>{authUser.fullName}</Text>
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                style={{ marginTop: 5 }}
                name="email-open-outline"
                size={15}
                color="white"
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "merriweather-regular",
                  color: "#fff",
                  margin: 5,
                }}
              >
                {authUser.emailID}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.Footer}>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="share" size={20} color="#012970" />
            <Text
              style={{
                fontSize: 13,
                fontFamily: "merriweather-regular",
                marginLeft: 5,
              }}
            >
              Share this app
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }],
              })
            );
          }}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit-outline" size={20} color="#012970" />
            <Text
              style={{
                fontSize: 13,
                fontFamily: "merriweather-regular",
                marginLeft: 5,
              }}
            >
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  DrawerContainer: {
    flex: 1,
  },
  ProfileImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  ProfileText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "merriweather-bold",
  },
  Footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});
