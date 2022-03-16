import { StyleSheet, View, StatusBar, Text } from "react-native";
import ListView from "./components/ListView";
import Category from "./models/Category";
import Item from "./models/Item";
import AppLoading from "expo-app-loading";

import { useEffect, useState } from "react";
import StorageService from "./services/StorageService";
import StorageTestDataInitializer from "./services/StorageTestDataInitializer";
import ItemList from "./models/ItemList";

// Use Reactotron dev tool
if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

interface Entity {
  id: string;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  // const [items, setItems] = useState<Item[]>([]);
  const [otherItemLists, setOtherItemLists] = useState<ItemList[]>([]);
  const [activeItemList, setActiveItemList] = useState<ItemList | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const loadData = async () => {
    if (__DEV__) {
      // Seed test data in dev environment
      await StorageService.clearAllData();
      await StorageTestDataInitializer.seedTestData();
    }

    await loadDataFromLocalStorage();
  };

  // XXX: Abstraheres
  const loadDataFromLocalStorage = async () => {
    console.log("Loading data from local storage...");
    // const existingItems = await StorageService.loadItems();
    const appData = await StorageService.loadAppData();
    let existingItemLists = await StorageService.loadItemLists();

    // console.log("Existing items: " + existingItemLists);

    // Handle no existing lists...
    if (existingItemLists.length === 0) {
      const firstList = new ItemList("My First List", []);
      existingItemLists = [firstList];
      appData.lastActiveListId = firstList.id;
    }

    // Find active list.
    let lastActiveList: ItemList | null = null;
    if (!appData.lastActiveListId) {
      console.log("No last active list id found");
      // Select first of existing lists
      lastActiveList = existingItemLists[0];
      appData.lastActiveListId = lastActiveList.id;
    } else {
      // Find the last active list among existing.
      const result = existingItemLists.find(
        (e) => e.id === appData.lastActiveListId
      );
      if (!!result) {
        lastActiveList = result;
      } else {
        throw new Error("Unable to set active list");
      }
    }

    const otherExistingItemLists = existingItemLists.filter(
      (e) => e.id !== appData.lastActiveListId
    );
    const existingCategories = await StorageService.loadCategories();

    // console.log(existingItems);

    // existingItems ? setItems(existingItems) : null;
    setActiveItemList(lastActiveList);
    setOtherItemLists(otherExistingItemLists);
    setCategories(existingCategories);
    console.log("Data loaded!");
  };

  // XXX: On modify item?? således generic.  Child forestår ændring
  const onItemPressed = (itemPressed: Item) => {
    setActiveItemList((prev) => {
      if (!prev) {
        return null;
      }

      // let itemUpdated: Item | null = null;
      const newItems = prev.items.map((item) =>
        // Find and update pressed item.
        item.id === itemPressed.id
          ? { ...item, isChecked: !item.isChecked }
          : item
      );
      const newList = { ...prev, items: newItems };

      StorageService.saveItemList(newList);

      return newList;
    });
  };

  const onAddNewItem = async (itemAdded: Item) => {
    // XXX: Undgå null check -> check i parent og pass til child
    if (!activeItemList) {
      return;
    }
    await StorageService.saveItemList({
      ...activeItemList,
      items: [...activeItemList.items, itemAdded],
    });
    setActiveItemList((prev) =>
      !!prev ? { ...prev, items: [...prev.items, itemAdded] } : null
    );
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

  if (!activeItemList) {
    throw new Error("No active item list");
  }

  return (
    <View style={styles.container}>
      <ListView
        itemList={activeItemList}
        categories={categories}
        onItemPressed={onItemPressed}
        onAddNewItem={onAddNewItem}
      ></ListView>
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
