import { StyleSheet, View, StatusBar, Text } from "react-native";
import ShoppingList from "./components/ShoppingList";
import Category from "./models/Category";
import Item from "./models/Item";
import AppLoading from "expo-app-loading";

import { useEffect, useState } from "react";
import StorageService from "./services/StorageService";

// Use Reactotron dev tool
if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

interface Entity {
  id: string;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadData = async () => {
    if (__DEV__) {
      // Seed test data in dev environment
      // await StorageService.clearAllData();
      await StorageService.seedTestData();
    }

    await loadDataFromLocalStorage();
  };

  const loadDataFromLocalStorage = async () => {
    console.log("Loading data from local storage...");
    const existingItems = await StorageService.loadItems();
    console.log("Existing items: ");
    // console.log(existingItems);

    const existingCategories = await StorageService.loadCategories();

    existingItems ? setItems(existingItems) : null;
    existingCategories ? setCategories(existingCategories) : null;
    console.log("Data loaded!");
  };

  // XXX: On modify item?? således generic.  Child forestår ændring
  const onItemPressed = async (itemPressed: Item) => {
    const saveAndUpdateItem = (item: Item) => {
      const itemUpdated = { ...item, isChecked: !item.isChecked };
      StorageService.saveItem(itemUpdated);
      return itemUpdated;
    };

    setItems((prevItems) => {
      // let itemUpdated: Item | null = null;
      const newItems = prevItems.map((item) =>
        // Find and update pressed item.
        item.id === itemPressed.id ? saveAndUpdateItem(item) : item
      );
      return newItems;
    });
  };

  const onAddNewItem = async (itemAdded: Item) => {
    await StorageService.saveItem(itemAdded);
    setItems((prev) => [...prev, itemAdded]);
  };

  if (isLoading) {
    return (
      <AppLoading
        startAsync={loadData}
        onFinish={() => setIsLoading(false)}
        onError={console.warn}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ShoppingList
        items={items}
        categories={categories}
        onItemPressed={onItemPressed}
        onAddNewItem={onAddNewItem}
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
