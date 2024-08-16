import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Toast from "react-native-toast-message";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import profileImg from "../assets/PP.png";

const MyProfileScreen = ({ navigation }) => {
  const [fontsLoaded] = useCustomFonts();
  const [balance, setBalance] = useState("1000");
  const [userDetails, setUserDetails] = useState({
    emailID: "",
    fullName: "",
    password: "",
    occupation: "",
    monthlyIncome: 25000,
    imageName: "",
    balance: balance,
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const { login, authUser, setAuthUser } = useAuth();
  useEffect(() => {
    axios
      .get(`http://10.0.2.2:7026/api/UserAuth/${authUser.emailID}`)
      .then((result) => {
        setUserDetails(result.data);
        setImagePreview(result.data.imageName || profileImg);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`http://10.0.2.2:7026/api/Account/balance/${authUser.emailID}`)
      .then((result) => {
        if (result.status === 200) {
          setBalance(result.data);
        } else if (result.status === 202) {
          setBalance(0);
        }
      })
      .catch((err) => console.log(err));
  }, [authUser.emailID]);

  const handleEditBtn = () => {
    const formData = new FormData();
    formData.append("emailID", userDetails.emailID);
    formData.append("fullName", userDetails.fullName);
    formData.append("password", userDetails.password);
    formData.append("occupation", userDetails.occupation);
    formData.append("monthlyIncome", userDetails.monthlyIncome);
    if (userDetails.imageFile) {
      formData.append("imageFile", userDetails.imageFile); // Append the image file only if it exists
    }

    axios
      .put(`http://10.0.2.2:7026/api/UserAuth/${authUser.emailID}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        if (result.status === 200) {
          setAuthUser(userDetails);
          setImagePreview(result.data.imageName || profileImg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    Toast.show({
      type: "success",
      text1: "Profile Updated Successfully",
      position: "top",
      visibilityTime: 2000,
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileSetting}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../assets/PP.jpg")}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.plusIconBadge} onPress={pickImage}>
            <Text style={styles.plusIconText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.fullName}>{userDetails.fullName}</Text>
          <Text style={styles.email}>{userDetails.emailID}</Text>
        </View>
      </View>
      <View style={styles.formInput}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            autoComplete="off"
            value={userDetails.fullName}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email-Id:</Text>
          <TextInput
            style={[styles.input, styles.disabled]}
            placeholder="Enter your email-id"
            autoComplete="off"
            value={userDetails.emailID}
            editable={false}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Occupation:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your occupation"
            autoComplete="off"
            value={userDetails.occupation}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Monthly Income:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your monthly income"
            autoComplete="off"
            value={userDetails.monthlyIncome}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Balance:</Text>
          <TextInput
            style={[styles.input, styles.disabled]}
            placeholder="Enter your balance"
            autoComplete="off"
            value={balance}
            editable={false}
          />
        </View>
        <TouchableOpacity style={styles.updateButton} onPress={handleEditBtn}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  profileSetting: {
    marginTop: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  plusIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#012970",
    justifyContent: "center",
    alignItems: "center",
  },
  plusIconText: {
    color: "#fff",
    fontSize: 20,
  },
  profileDetails: {
    alignItems: "center",
  },
  fullName: {
    marginTop: 10,
    fontFamily: "merriweather-black",
  },
  email: {
    color: "gray",
    fontFamily: "merriweather-regular",
  },
  formInput: {
    flex: 1,
  },
  formGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontFamily: "merriweather-bold",
  },
  input: {
    flex: 2,
    borderWidth: 0.9,
    borderColor: "lightgray",
    borderRadius: 6,
    padding: 8,
    fontFamily: "merriweather-regular",
  },
  disabled: {
    backgroundColor: "#f1f0f0",
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "#012970",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontFamily: "merriweather-regular",
  },
});

export default MyProfileScreen;
