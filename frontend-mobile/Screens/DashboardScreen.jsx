import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useCustomFonts } from "../fonts/useCustomFont";
import AppLoading from "expo-app-loading";
import { BarChart, PieChart } from "react-native-chart-kit";
import DashCard from "../Components/DashCard";
import Carousel from "react-native-reanimated-carousel";
import PaginationDots from "../Components/PaginationDots";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#ffffff",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.7,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
  style: {
    borderRadius: 16,
    fontFamily: "merriweather-regular",
  },
  fillShadowGradient: "#3FCA89",
  fillShadowGradientOpacity: 1,
};

const DashboardScreen = () => {
  const [fontsLoaded] = useCustomFonts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myCategory, setMyCategory] = useState([]);
  const [myRecentTransactions, setMyRecentTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const { authUser } = useAuth();
  const [cardData, setCardData] = useState([
    {
      id: "1",
      title: "Balance",
      balance: 0,
      icon: "wallet-outline",
      type: "balance",
    },
    {
      id: "2",
      title: "Income",
      balance: 0,
      icon: "cash-plus",
      type: "income",
    },
    {
      id: "3",
      title: "Expense",
      balance: 0,
      icon: "cash-minus",
      type: "expense",
    },
  ]);

  useEffect(() => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (authUser && authUser.emailID) {
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

      axios
        .get(`http://10.0.2.2:7026/api/Transaction/${authUser.emailID}`)
        .then((result) => {
          if (result.status === 200) {
            setMyRecentTransactions(result.data);
          } else if (result.status === 202) {
            setMyRecentTransactions([]);
          }
        })
        .catch((err) => console.log(err));

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

      axios
        .get(
          `http://10.0.2.2:7026/api/Analytics/total-expense-by-month?email=${encodeURIComponent(
            authUser.emailID
          )}&year=${encodeURIComponent(year)}&month=${encodeURIComponent(
            month
          )}`
        )
        .then((result) => {
          if (result.status === 200) {
            setExpense(result.data);
          } else if (result.status === 202) {
            setExpense(0);
          }
        })
        .catch((err) => console.log(err));

      axios
        .get(
          `http://10.0.2.2:7026/api/Analytics/total-income-by-month?email=${encodeURIComponent(
            authUser.emailID
          )}&year=${encodeURIComponent(year)}&month=${encodeURIComponent(
            month
          )}`
        )
        .then((result) => {
          if (result.status === 200) {
            setIncome(result.data);
          } else if (result.status === 202) {
            setIncome(0);
          }
        })
        .catch((err) => console.log(err));

      setCardData([
        {
          id: "1",
          title: "Balance",
          balance: balance || 0,
          icon: "wallet-outline",
          type: "balance",
        },
        {
          id: "2",
          title: "Income",
          balance: income || 0,
          icon: "cash-plus",
          type: "income",
        },
        {
          id: "3",
          title: "Expense",
          balance: expense || 0,
          icon: "cash-minus",
          type: "expense",
        },
      ]);

      axios
        .get(
          `http://10.0.2.2:7026/api/Analytics/total-expense-by-category-this-month?email=${encodeURIComponent(
            authUser.emailID
          )}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(
            year
          )}`
        )
        .then((result) => {
          if (result.status === 200) {
            setCategoryData(result.data);
          } else if (result.status === 202) {
            setCategoryData({});
          }
        })
        .catch((err) => console.log(err));
    }
  }, [balance, income, expense]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleSnapToItem = (index) => {
    setCurrentIndex(index);
  };

  const barData = {
    labels: categoryData.map((item) => item.key),
    datasets: [
      {
        data: categoryData.map((item) => item.value),
      },
    ],
  };

  const pieData = [
    {
      name: "Balance",
      population: balance,
      color: "#FFBB28",
      legendFontColor: "#000",
      legendFontSize: 15,
    },
    {
      name: "Income",
      population: income,
      color: "#012970",
      legendFontColor: "#000",
      legendFontSize: 15,
    },
    {
      name: "Expense",
      population: expense,
      color: "#00C49F",
      legendFontColor: "#000",
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <Carousel
            loop
            autoPlay
            autoPlayInterval={3000}
            width={screenWidth}
            height={150}
            data={cardData}
            layout="parallax-horizontal"
            renderItem={({ item }) => (
              <DashCard
                title={item.title}
                balance={item.balance}
                icon={item.icon}
                style={styles.dashCard}
              />
            )}
            onSnapToItem={handleSnapToItem}
          />
          <PaginationDots currentIndex={currentIndex} data={cardData} />
        </View>
        <View style={styles.additionalCardsContainer}>
          <View style={styles.additionalCard}>
            <ScrollView
              contentContainerStyle={styles.additionalCardContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.cardTitle}>Expense Categories</Text>
              <View style={styles.badgesContainer}>
                {myCategory.map((category, index) => (
                  <View key={index} style={styles.badge}>
                    <Text style={styles.badgeText}>{category.catName}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          <View style={styles.additionalCard}>
            <ScrollView
              contentContainerStyle={styles.additionalCardContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.cardTitle}>Recent Transactions</Text>
              {myRecentTransactions.map((transaction, index) => (
                <View key={index} style={styles.transactionItem}>
                  <Feather
                    name={
                      transaction.type === "Income"
                        ? "arrow-down-left"
                        : "arrow-up-right"
                    }
                    size={20}
                    color={transaction.type === "Income" ? "green" : "red"}
                    style={styles.transactionIcon}
                  />
                  <Text style={[styles.transactionText]}>
                    ₹{transaction.amount} -
                    <Text style={{ color: "#012970" }}>
                      {transaction.remarks}
                    </Text>
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Expenses</Text>
          <BarChart
            style={styles.graphStyle}
            data={barData}
            width={screenWidth - 64}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
          />
        </View>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expense Breakdown</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 64}
            height={210}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 5]}
            absolute
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
  },
  carouselContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  additionalCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  additionalCard: {
    width: "48%",
    minHeight: 210,
    maxHeight: 210,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 10,
    margin: 5,
  },
  additionalCardContent: {
    paddingVertical: 10,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "merriweather-bold",
  },
  cardBody: {
    fontSize: 14,
    textAlign: "center",
    color: "lightgray",
    fontFamily: "merriweather-regular",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 16,
    marginVertical: 8,
  },
  graphStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: "merriweather-bold",
    marginBottom: 8,
    textAlign: "left",
  },
  dashCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionIcon: {
    marginRight: 8,
  },
  transactionText: {
    fontFamily: "merriweather-regular",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#fff",
    borderWidth: 0.8,
    borderColor: "#012970",
    padding: 7,
    borderRadius: 8,
    margin: 4,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "merriweather-regular",
  },
});
