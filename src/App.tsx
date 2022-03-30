import AppLoading from "expo-app-loading";
import StorageService from "./services/StorageService";
import LibraryItemsContextProvider from "./state/LibraryItemsContextProvider";
import CategoriesContextProvider from "./state/CategoriesContextProvider";
import ItemListsContextProvider from "./state/ItemListsContextProvider";
import useLocalStorageData from "./hooks/useLocalStorageData";
import RootNavigator from "./RootNavigator";

// Use Reactotron dev tool
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  import("../ReactotronConfig").then(() =>
    console.log("Reactotron Configured")
  );
}

export default function App() {
  const { loadData, isReady, data, appData, setAppData } =
    useLocalStorageData();

  // Save updates to app data.
  const onActiveListIdChanged = (id: string) => {
    // XXX: Flyttes i context??
    setAppData((prev) => {
      if (!prev) {
        throw new Error("AppData not set");
      }

      const newData = { ...prev, lastActiveListId: id };
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      StorageService.saveAppData(newData);

      return newData;
    });
  };

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadData}
        // onFinish={() => setIsDoneLoading(true)}
        onFinish={() => console.log("Loading done")}
        onError={console.warn}
      />
    );
  }

  if (!data) {
    throw new Error("Unable to load data from local storage due to an error");
  }

  return (
    <CategoriesContextProvider initCategories={data.categories}>
      <ItemListsContextProvider
        startListId={appData ? appData.lastActiveListId : null} // XXX: Fix appdata
        onActiveListChanged={onActiveListIdChanged}
        initItemLists={data.itemLists}
      >
        <LibraryItemsContextProvider initLibraryItems={data.libraryItems}>
          <RootNavigator />
        </LibraryItemsContextProvider>
      </ItemListsContextProvider>
    </CategoriesContextProvider>
  );
}
