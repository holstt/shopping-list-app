import { StyleSheet, View, StatusBar, Text } from "react-native";
import ShoppingList from "./components/ShoppingList";
import Category from "./models/Category";
import Item from "./models/Item";
import AppLoading from "expo-app-loading";

import { useEffect, useState } from "react";
import StorageService from "./services/StorageService";

if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

interface Entity {
  id: string;
}

export default function App() {
  const [items, setItems] = useState<Item[]>();
  const [categories, setCategories] = useState<Category[]>();

  const loadDataFromLocalStorage = async () => {
    console.log("Loading data from local storage...");
    const existingItems = await StorageService.loadItems();
    const existingCategories = await StorageService.loadCategories();

    existingItems ? setItems(existingItems) : null;
    existingCategories ? setCategories(existingCategories) : null;
    console.log("Data loaded!");
  };

  // useEffect(() => {
  const loadData = async () => {
    if (__DEV__) {
      // Seed test data in dev environment
      await StorageService.seedTestData();
    }

    await loadDataFromLocalStorage();
  };

  //   // tslint:disable-next-line: no-floating-promises
  //   loadData();
  // }, []);

  if (!items || !categories) {
    return (
      <AppLoading
        startAsync={loadData}
        onFinish={() => console.log("done")}
        onError={console.warn}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ShoppingList
        initialItems={items}
        initialCategories={categories}
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
