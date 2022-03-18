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
  const [itemLists, setItemLists] = useState<ItemList[]>([]);
  const [activeListIndex, setActiveListIndex] = useState(0);
  // const [activeItemList, setActiveItemList] = useState<ItemList | null>(null);

  console.log("Active list index: " + activeListIndex);

  const [categories, setCategories] = useState<Category[]>([]);

  const loadData = async () => {
    if (__DEV__) {
      // Seed test data in dev environment
      // await StorageService.clearAllData();
      await StorageTestDataInitializer.seedTestData();
    }

    await loadDataFromLocalStorage();
  };

  // XXX: Abstraheres - custom hook?
  const loadDataFromLocalStorage = async () => {
    console.log("Loading data from local storage...");
    // const existingItems = await StorageService.loadItems();
    const appData = await StorageService.loadAppData();
    let existingItemLists = await StorageService.loadItemLists();

    // Ensure order.
    existingItemLists = existingItemLists.sort((e) => e.index);

    console.log("Existing lists loaded: " + existingItemLists.length);

    // console.log("Existing items: " + existingItemLists);

    // Handle no existing lists...
    if (existingItemLists.length === 0) {
      console.log(
        "No existing items found in local storage. Creating initial list."
      );
      const firstList = new ItemList("My First List", [], 0);
      existingItemLists = [firstList];
      appData.lastActiveListId = firstList.id;
    }

    // // Find active list.
    // let lastActiveList: ItemList | null = null;
    // if (!appData.lastActiveListId) {
    //   console.log("No last active list id found");
    //   // Select first of existing lists
    //   lastActiveList = existingItemLists[0];
    //   appData.lastActiveListId = lastActiveList.id;
    // } else {
    //   // Find the last active list among existing.
    //   const result = existingItemLists.find(
    //     (e) => e.id === appData.lastActiveListId
    //   );
    //   if (!!result) {
    //     lastActiveList = result;
    //   } else {
    //     throw new Error("Unable to set active list");
    //   }
    // }

    // const otherExistingItemLists = existingItemLists.filter(
    //   (e) => e.id !== appData.lastActiveListId
    // );
    const existingCategories = await StorageService.loadCategories();

    // console.log(existingItems);

    // existingItems ? setItems(existingItems) : null;
    // setActiveItemList(lastActiveList);
    setItemLists(existingItemLists);
    setCategories(existingCategories);
    console.log("Data loaded!");
  };

  const addItemToList = (list: ItemList, item: Item) => {
    const updatedList: ItemList = { ...list, items: [...list.items, item] };
    // tslint:disable-next-line: no-floating-promises
    StorageService.saveItemList(updatedList);
    return updatedList;
  };

  const onAddNewItem = async (itemAdded: Item) => {
    setItemLists((prev) => {
      return prev.map((prevList, index) =>
        index === activeListIndex
          ? addItemToList(prevList, itemAdded)
          : prevList
      );
    });
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

  // if (!activeItemList) {
  //   throw new Error("No active item list");
  // }

  const onViewPrevList = () => {
    console.log("Moving to prev list");

    setActiveListIndex((prev) => {
      const newIndex = prev - 1;
      // Ensure has next list
      if (newIndex < 0) {
        console.log("No more");
        return prev;
      }
      return newIndex;
    });
  };

  // XXX: Genbrug prev func
  const onViewNextList = () => {
    console.log("Moving to next list");
    setActiveListIndex((prev) => {
      const newIndex = prev + 1;
      console.log(newIndex);
      // Ensure has next list
      if (newIndex > itemLists.length - 1) {
        console.log("No more");
        return prev;
      }
      return newIndex;
    });
  };

  // XXX: On modify item?? således generic.  Child forestår ændring
  const onItemPressed = (itemPressed: Item) => {
    setItemLists((prev) => {
      return prev.map((prevList, index) =>
        index === activeListIndex
          ? updateItemInList(prevList, itemPressed)
          : prevList
      );
    });
  };

  const updateItemInList = (prevList: ItemList, updatedItem: Item) => {
    // let itemUpdated: Item | null = null;
    const newItems = prevList.items.map((item) =>
      // Find and update pressed item.
      item.id === updatedItem.id
        ? { ...item, isChecked: !item.isChecked }
        : item
    );
    const updatedList = { ...prevList, items: newItems };

    // tslint:disable-next-line: no-floating-promises
    StorageService.saveItemList(updatedList);

    return updatedList;
  };

  return (
    <View style={styles.container}>
      <ListView
        itemList={itemLists[activeListIndex]}
        categories={categories}
        onItemPressed={onItemPressed}
        onAddNewItem={onAddNewItem}
        onViewPrevList={onViewPrevList}
        onViewNextList={onViewNextList}
        hasPrevList={activeListIndex - 1 >= 0}
        // hasNextList={activeListIndex + 1 < itemLists.length}
        hasNextList={activeListIndex + 1 <= itemLists.length - 1}
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
