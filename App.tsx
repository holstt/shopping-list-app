import { StyleSheet, View, StatusBar } from "react-native";
import ShoppingList from "./components/ShoppingList";
import Category from "./models/Category";
import Item from "./models/Item";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const loadedCategories = [
    new Category("Category1", "#EB7474"),
    new Category("Category2", "#1FDA6D"),
    new Category("Category3", "#1F76DA"),
  ];
  // XXX: Indlæs fra local storage. UseEffect?
  const loadedItems = [
    new Item("Item1", true, loadedCategories[0]),
    new Item("Item2", false, loadedCategories[1]),
    new Item("Item3", false, null),
  ];

  return (
    <View style={styles.container}>
      <ShoppingList
        initialItems={loadedItems}
        initialCategories={loadedCategories}
      ></ShoppingList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // borderColor: "red",
    // height: "100%",
    // borderWidth: 2,
    padding: 10,
    paddingTop: StatusBar.currentHeight,
  },
});
