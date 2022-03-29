import AppLoading from "expo-app-loading";
import StorageService from "./src/services/StorageService";
import LibraryItemsContextProvider from "./src/state/LibraryItemsContextProvider";
import CategoriesContextProvider from "./src/state/CategoriesContextProvider";
import ItemListsContextProvider from "./src/state/ItemListsContextProvider";
import useLocalStorageData from "./src/hooks/useLocalStorageData";
import RootNavigator from "./src/RootNavigator";

// Use Reactotron dev tool
if (__DEV__) {
  // tslint:disable-next-line: no-floating-promises
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
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
      // tslint:disable-next-line: no-floating-promises
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
      <LibraryItemsContextProvider initLibraryItems={data.libraryItems}>
        <ItemListsContextProvider
          startListId={appData ? appData.lastActiveListId : null} // XXX: Fix appdata
          onActiveListChanged={onActiveListIdChanged}
          initItemLists={data.itemLists}
        >
          <RootNavigator />
        </ItemListsContextProvider>
      </LibraryItemsContextProvider>
    </CategoriesContextProvider>
  );
}
