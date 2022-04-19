import Category from "../models/Category";
import { useEffect, useState } from "react";
import StorageService from "../services/StorageService";
import StorageTestDataInitializer from "../services/StorageTestDataInitializer";
import ShoppingList from "../models/ShoppingList";
import LibraryItem from "../models/LibraryItem";
import AppData from "../AppData";

interface DataProps {
  shoppingLists: ShoppingList[];
  categories: Category[];
  libraryItems: LibraryItem[];
  appData: AppData;
}

// Loads the most recent app state from local storage
export default function useLocalStorageState() {
  const [loading, setIsLoading] = useState(true);
  const [storageState, setStorageState] = useState<DataProps>();

  useEffect(() => {
    void (async () => {
      if (__DEV__) {
        // Seed test data in dev environment
        await StorageService.clearAllData(); // Comment if want to persist data.
        await StorageTestDataInitializer.seedTestData();
      }
      await loadDataFromLocalStorage();
    })();
  }, []);

  // XXX: Abstraheres - container comp.?
  const loadDataFromLocalStorage = async () => {
    console.log(
      "useLocalStorageState: Loading application state from local storage..."
    );

    const [shoppingLists, categories, libraryItems, appData] =
      await Promise.all([
        StorageService.loadShoppingLists(),
        StorageService.loadCategories(),
        StorageService.loadLibraryItems(),
        StorageService.loadAppData(),
      ]);

    setStorageState({
      shoppingLists: shoppingLists,
      categories: categories,
      libraryItems: libraryItems,
      appData: appData,
    });

    console.log("useLocalStorageState: State loaded!");
    setIsLoading(false);
  };

  return { loading, storageState };
}
