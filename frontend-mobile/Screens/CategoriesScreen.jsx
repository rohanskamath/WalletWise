import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import Toast from "react-native-toast-message";
import AddCategoryModal from "../Components/AddCategoryModal";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const CategoriesScreen = ({ navigation }) => {
  const [fontsLoaded] = useCustomFonts();
  const [myCategory, setMyCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [updateCategory, setUpdateCategory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { login, authUser } = useAuth();

  useEffect(() => {
    axios
      .get("http://10.0.2.2:7026/api/Category")
      .then((result) => {
        setCategories(result.data);
      })
      .catch((err) => console.log(err));
  });

  useEffect(() => {
    axios
      .get(`http://10.0.2.2:7026/api/CatMapUsers/${authUser.emailID}`)
      .then((result) => {
        if (result.status === 200) {
          setMyCategory(result.data);
        } else if (result.status === 202) {
          setMyCategory([]);
        }
      })
      .catch((err) => console.log(err));
  }, [authUser.emailID]);

  const isSelected = (categoryName) =>
    myCategory.some((cat) => cat.catName === categoryName);

  const handleCategoryClick = (categoryName, id) => {
    if (!isSelected(categoryName)) {
      setMyCategory([...myCategory, { catName: categoryName }]);
      setUpdateCategory([
        ...updateCategory,
        { categoryId: id, emailID: authUser.emailID },
      ]);
    }
  };

  const handleSaveChanges = () => {
    axios
      .put("http://10.0.2.2:7026/api/CatMapUsers", updateCategory)
      .then((result) => {
        if (result.status === 200) {
          Toast.show({
            type: "success",
            text1: "Categories saved successfully!!",
            position: "top",
            visibilityTime: 2000,
          });
        }
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Some error occured!!",
          position: "top",
          visibilityTime: 2000,
        });
        console.log(err);
      });
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>Standard Categories</Text>
        <View style={styles.badgesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.badge,
                isSelected(category.categoryName) && styles.selectedBadge,
              ]}
              onPress={() =>
                handleCategoryClick(category.categoryName, category.categoryId)
              }
            >
              <Text
                style={[
                  styles.badgeText,
                  isSelected(category.categoryName) && styles.selectedBadgeText,
                ]}
              >
                {category.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      {myCategory.length > 0 && (
        <View style={styles.myCategoryContainer}>
          <Text style={styles.sectionTitle}>My Categories</Text>
          <View style={styles.badgesContainer}>
            {myCategory.map((category, index) => (
              <View key={index} style={styles.myBadge}>
                <Text style={styles.MybadgeText}>{category.catName}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
      <AddCategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      {/* Toast message component */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexGrow: 1,
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 24,
    borderColor: "#fff",
    borderWidth: 0.8,
    borderRadius: 10,
    elevation: 4, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "merriweather-bold",
    marginBottom: 10,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#012970",
    padding: 10,
    borderRadius: 8,
    margin: 4,
  },
  selectedBadge: {
    backgroundColor: "#CDC7C7",

    borderColor: "#A09C9C",
  },
  selectedBadgeText: {
    fontSize: 14,
    color: "#868181",
    fontFamily: "merriweather-regular",
  },
  badgeText: {
    fontSize: 14,
    fontFamily: "merriweather-regular",
  },
  MybadgeText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "merriweather-regular",
  },
  addButton: {
    backgroundColor: "#012970",
    borderRadius: 8,
    margin: 4,
    width: 35,
    maxHeight: 40,
    alignContent: "center",
    justifyContent: "center",
  },
  addButtonText: {
    marginLeft: 10,
    color: "white",
    fontSize: 24,
  },
  myCategoryContainer: {
    marginTop: 24,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 10,
    paddingRight: 25,
    borderColor: "#fff",
    borderWidth: 0.8,
    borderRadius: 10,
    elevation: 4, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: "#fff",
  },
  myBadge: {
    backgroundColor: "#012970",
    padding: 10,
    borderRadius: 8,
    marginEnd: 5,
  },
  saveButton: {
    borderWidth: 0.9,
    borderColor: "#012970",
    backgroundColor: "#fff",
    width: 100,
    height: 32,
    padding: 8,

    borderRadius: 8,
    marginTop: 30,
    marginHorizontal: 210,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#012970",
    fontSize: 10,
    fontFamily: "merriweather-regular",
  },
});

export default CategoriesScreen;
