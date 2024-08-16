import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Load user data from AsyncStorage when the component mounts
    const loadAuthData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("authUser");
        const storedIsLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        if (storedUser) setAuthUser(JSON.parse(storedUser));
        if (storedIsLoggedIn === "true") setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to load auth data", error);
      }
    };

    loadAuthData();
  }, []);

  const login = async (user) => {
    try {
      await AsyncStorage.setItem("authUser", JSON.stringify(user));
      await AsyncStorage.setItem("isLoggedIn", "true");
      setAuthUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to login", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authUser");
      await AsyncStorage.setItem("isLoggedIn", "false");
      setAuthUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const value = {
    authUser,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
