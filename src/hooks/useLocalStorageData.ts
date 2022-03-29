import Category from "../models/Category";
import { useState } from "react";
import StorageService from "../services/StorageService";
import StorageTestDataInitializer from "../services/StorageTestDataInitializer";
import ItemList from "../models/ItemList";
import LibraryItem from "../models/LibraryItem";
import AppData from "../AppData";

interface InitStateProps {
  itemLists: ItemList[];
  categories: Category[];
  libraryItems: LibraryItem[];
}

// Loads the initial app state from local storage
export default function useLocalStorageData() {
  const [isReady, setIsReady] = useState(false);
  const [data, setDataState] = useState<InitStateProps>();
  const [appData, setAppData] = useState<AppData | null>(null);

  const loadData = async () => {
    if (__DEV__) {
      // Seed test data in dev environment
      await StorageService.clearAllData();
      await StorageTestDataInitializer.seedTestData();
    }

    await loadDataFromLocalStorage();
  };

  // XXX: Abstraheres - container comp.?
  const loadDataFromLocalStorage = async () => {
    console.log("Loading data from local storage...");
    setDataState({
      itemLists: await StorageService.loadItemLists(),
      categories: await StorageService.loadCategories(),
      libraryItems: await StorageService.loadLibraryItems(),
    });

    setAppData(await StorageService.loadAppData());
    setIsReady(true);
    console.log("Data loaded!");
  };

  return { loadData, isReady, data, appData, setAppData };
}
