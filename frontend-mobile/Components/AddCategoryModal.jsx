import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import axios from "axios";

const AddCategoryModal = ({ visible, onClose }) => {
  const [newCategory, setNewCategory] = useState({
    categoryId: 0,
    categoryName: "",
  });
  const [errors, setErrors] = useState("");

  const validateCategory = () => {
    if (newCategory.categoryName.trim() === "") {
      setErrors("* Category name field is required");
      return false;
    }
    setErrors("");
    return true;
  };

  const handleAddCategory = () => {
    if (!validateCategory()) {
      return;
    }
    axios
      .post("http://10.0.2.2:7026/api/Category/Add", newCategory)
      .then((result) => {
        if (result.status === 200) {
          setNewCategory({ categoryId: 0, categoryName: "" });
          onClose(); // Close the modal
        } else {
          Toast.show({
            type: "error",
            text1: "Some Error Occured!!",
            position: "top",
            visibilityTime: 2000,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={styles.title}>Add New Category</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="tag-outline"
                size={20}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter category name"
                value={newCategory.categoryName}
                onChangeText={(text) =>
                  setNewCategory({ ...newCategory, categoryName: text })
                }
                onBlur={validateCategory}
              />
            </View>
            {errors ? <Text style={styles.error}>{errors}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
              <Text style={styles.buttonText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {/* Toast message component */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 5,
    right: 10,
    padding: 10,
  },
  title: {
    fontFamily: "merriweather-bold",
    color: "#012970",
    fontSize: 16,
    marginBottom: 20,
    marginLeft: -130,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.9,
    borderColor: "#ccc",
    marginBottom: 14,
    borderRadius: 10,
    width: "100%",
  },
  icon: {
    marginRight: 8,
    marginLeft: 10,
    color: "gray",
  },
  input: {
    flex: 1,
    padding: 13,
    fontSize: 14,
    fontFamily: "merriweather-regular",
  },
  error: {
    color: "red",
    fontSize: 11,
    fontFamily: "merriweather-regular",
    marginLeft: -90,
    marginBottom: 8,
    marginTop: -8,
  },
  button: {
    backgroundColor: "#012970",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "merriweather-bold",
  },
});

export default AddCategoryModal;
