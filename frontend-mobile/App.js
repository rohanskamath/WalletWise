import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, StatusBar, LogBox } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./Navigation/AppNavigation";
import { AuthProvider } from "./Context/AuthContext";

export default function App() {
  LogBox.ignoreAllLogs(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    /* Splash Screen Code Starts */
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
    /* Splash Screen Code Ends */
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  /* Splash Screen Section Starts */
  if (!appIsReady) {
    return (
      <>
        <StatusBar backgroundColor="#012970" />
        <View style={styles.splashContainer}>
          <Image
            source={require("./assets/wallet-logo.png")}
            style={styles.splashImage}
          />
        </View>
      </>
    );
  }
  /* Splash Screen Section Ends */

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#012970",
  },
  splashImage: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
});
