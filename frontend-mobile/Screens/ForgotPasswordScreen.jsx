import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import axios from "axios";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [codeSent, setCodeSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newCPassword, setNewCPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewCPassword, setShowNewCPassword] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [fontsLoaded] = useCustomFonts();

  const otpRefs = useRef([]);

  const handleSendCode = () => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);

    axios
      .post("http://10.0.2.2:5000/send_recovery_email", {
        userEmail: email,
        OTP: newOtp,
      })
      .then((response) => {
        setCodeSent(true);
        setIsOtpSent(true);
        setSeconds(60);
        setShowPasswordFields(false);
        setMessage({
          text: "OTP has been sent to your email!",
          type: "success",
        });
      })
      .catch((err) => {
        console.log("Error sending OTP", err);
        setMessage({
          text: "Error sending OTP. Please try again.",
          type: "error",
        });
      });
  };

  const handleChangeCode = (text, index) => {
    if (text.length > 1) {
      text = text.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const verifyOtpBtn = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === generatedOtp) {
      setIsOtpVerified(true);
      setShowPasswordFields(true);
      setMessage({ text: "Valid OTP... Reset your password", type: "success" });
    } else {
      setMessage({
        text: "Invalid OTP!.. Resend the code again",
        type: "error",
      });
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== newCPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return;
    }

    if (!newPassword || !newCPassword) {
      setMessage({ text: "Password fields cannot be empty!", type: "error" });
      return;
    }

    const updatedPassword = {
      emailId: email,
      password: newPassword,
    };
    axios
      .put("http://10.0.2.2:7026/api/UserAuth/ChangePassword", updatedPassword)
      .then((result) => {
        if (result.status === 202) {
          Toast.show({
            type: "success",
            text1: "Password updated successfully",
            visibilityTime: 2000,
            onHide: () => {
              navigation.goBack();
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  useEffect(() => {
    let timer;
    if (isOtpSent && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(timer);
            setIsOtpSent(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isOtpSent, seconds]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      {message.text && (
        <Text
          style={[
            styles.message,
            { color: message.type === "success" ? "green" : "red" },
          ]}
        >
          {message.text}
        </Text>
      )}
      {!showPasswordFields && !isOtpVerified && (
        <>
          {!codeSent ? (
            <>
              <Text style={styles.instructions}>
                Enter your email to change your password
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                <Text style={styles.buttonText}>Send Code</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.instructions}>
                Enter the 6-digit code sent to your email
              </Text>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (otpRefs.current[index] = ref)}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChangeCode(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (
                        nativeEvent.key === "Backspace" &&
                        !digit &&
                        index > 0
                      ) {
                        otpRefs.current[index - 1].focus();
                      }
                    }}
                  />
                ))}
              </View>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                  Time remaining: {seconds} seconds
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: seconds === 0 ? "#ff5722" : "#012970" },
                ]}
                onPress={handleSendCode}
                disabled={seconds > 0}
              >
                <Text style={styles.buttonText}>
                  {seconds === 0 ? "Resend Code" : "Send Code"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={verifyOtpBtn}
                disabled={seconds === 0 || isOtpVerified}
              >
                <Text style={styles.buttonText}>Verify Code</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
      {showPasswordFields && (
        <View>
          <Text style={styles.label}>Enter New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Icon name={showNewPassword ? "eye-off" : "eye"} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm New Password"
              value={newCPassword}
              onChangeText={setNewCPassword}
              secureTextEntry={!showNewCPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewCPassword(!showNewCPassword)}
            >
              <Icon name={showNewCPassword ? "eye-off" : "eye"} size={20} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "merriweather-regular",
  },
  instructions: {
    fontSize: 16,
    fontFamily: "merriweather-regular",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "merriweather-regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "merriweather-regular",
  },
  button: {
    backgroundColor: "#012970",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "merriweather-regular",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: 40,
    textAlign: "center",
    fontFamily: "merriweather-regular",
  },
  message: {
    fontSize: 14,
    fontFamily: "merriweather-regular",
    marginBottom: 15,
    textAlign: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontFamily: "merriweather-regular",
  },
  timerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  timerText: {
    fontSize: 14,
    fontFamily: "merriweather-regular",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "merriweather-regular",
  },
});

export default ForgotPasswordScreen;
