import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import google from "../assets/google.png";
import microsoft from "../assets/microsoft.png";
import facebook from "../assets/facebook-icon.png";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [fontsLoaded] = useCustomFonts();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { login, authUser } = useAuth();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const validateLoginEmail = (email) => {
    const newEmailErrors = {};
    if (!email) {
      newEmailErrors.emailLogin = "Email Field is required";
    }
    setErrors(newEmailErrors);
    return !newEmailErrors.emailLogin;
  };

  const validateLoginPassword = (password) => {
    const passwordErrors = {};
    if (!password) {
      passwordErrors.passwordLogin = "Password Field is required";
    }
    setErrors(passwordErrors);
    return !passwordErrors.passwordLogin;
  };

  const handleLogin = () => {
    if (validateLoginEmail(email) && validateLoginPassword(password)) {
      const loginUser = {
        emailID: email,
        password: password,
      };
      axios
        .post("http://10.0.2.2:7026/api/UserAuth/login", loginUser)
        .then((result) => {
          console.log(result);
          if (result.status === 200) {
            Toast.show({
              type: "success",
              text1: "Logged In Successfully",
              position: "top",
              visibilityTime: 4000,
            });
            setEmail("");
            setPassword("");

            login(result.data);

            //printing async storage key values in console
            async function showAsyncStorageContent() {
              try {
                const keys = await AsyncStorage.getAllKeys();
                console.log("Keys:", keys);

                const result = await AsyncStorage.multiGet(keys);

                result.forEach(([key, value]) => {
                  console.log(`Key: ${key}, Value: ${value}`);
                });
              } catch (error) {
                console.error("Error fetching AsyncStorage content:", error);
              }
            }
            showAsyncStorageContent();
            //end of async storage function

            setTimeout(() => {
              navigation.dispatch(
                CommonActions.reset(
                  {
                    index: 0,
                    routes: [{ name: "Main" }],
                  },
                  4000
                )
              );
            });
          } else if (result.status === 202) {
            Toast.show({
              type: "error",
              text1: result.data,
              position: "top",
              visibilityTime: 2000,
            });
          }
        })
        .catch((err) => {
          Toast.show({
            type: "success",
            text1: err.response.data,
            position: "top",
            visibilityTime: 2000,
          });
        });
    }
  };

  const handleGoogleLogin = () => {};

  const handleFaceBookLogin = () => {};

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.signInText}>Sign In</Text>
        <Text style={styles.socialText}>with your social network</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity onPress={handleGoogleLogin}>
            <Image source={google} alt="Google" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={microsoft} alt="Microsoft" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={facebook} alt="Facebook" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.orText}>OR</Text>
        <TextInput
          style={[styles.input, errors.emailLogin && styles.errorInput]}
          placeholder="Enter your email-id"
          autoCompleteType="off"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              errors.passwordLogin && styles.errorInput,
            ]}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Entypo
              name={showPassword ? "eye-with-line" : "eye"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.forgotPasswordContainer}>
          <Text
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotPasswordText}
          >
            {" "}
            Forgot Password?
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text
          style={{
            marginTop: 10,
            fontFamily: "merriweather-regular",
            fontSize: 14,
          }}
        >
          Don't have an account?
          <Text
            onPress={() => navigation.navigate("Register")}
            style={{ color: "blue" }}
          >
            {" "}
            Register
          </Text>
        </Text>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

export default LoginScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: "#ffffff",
  },
  signInText: {
    fontSize: 24,
    marginVertical: 10,
    fontFamily: "merriweather-bold",
    color: "#012970",
  },
  socialText: {
    fontSize: 16,
    marginVertical: 10,
    fontFamily: "merriweather-regular",
    color: "gray",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  icon: {
    marginHorizontal: 10,
    width: 38,
    height: 38,
  },
  orText: {
    fontSize: 16,
    marginVertical: 10,
    marginBottom: 15,
    fontFamily: "merriweather-regular",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    fontFamily: "merriweather-regular",
  },
  errorInput: {
    borderColor: "red",
  },
  validationText: {
    color: "red",
    marginTop: 4,
  },
  passwordContainer: {
    width: "80%",

    position: "relative",
  },
  passwordInput: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: "merriweather-regular",
    paddingRight: 40,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 10,
    top: 20,
  },
  forgotPasswordContainer: {
    width: "75%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: "blue",
    fontFamily: "merriweather-regular",
    fontSize: 11,
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "#012970",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    fontFamily: "merriweather-regular",
    color: "#fff",
    fontSize: 16,
  },
});
