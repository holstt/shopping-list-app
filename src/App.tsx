import AppLoading from "expo-app-loading";
import StorageService from "./services/StorageService";
import LibraryItemsContextProvider from "./state/LibraryItemsContextProvider";
import CategoriesContextProvider from "./state/CategoriesContextProvider";
import ShoppingListsContextProvider from "./state/ShoppingListsContextProvider";
import useLocalStorageState from "./hooks/useLocalStorageState";
import RootNavigator from "./RootNavigator";
import { View, Text, StatusBar } from "react-native";
import StorageTestDataInitializer from "./services/StorageTestDataInitializer";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { NavigationContext } from "@react-navigation/native";
import NavigationContextProvider from "./state/NavigationContext";

// Use Reactotron dev tool
// if (__DEV__) {
//   // eslint-disable-next-line @typescript-eslint/no-floating-promises
//   import("../ReactotronConfig").then(() =>
//     console.log("Reactotron Configured")
//   );
// }

export default function App() {
  console.log("App: Rendered");
  StatusBar.setBarStyle("light-content", true);
  const { loading, storageState } = useLocalStorageState();

  useEffect(() => {
    void (async () => {
      if (loading) {
        await SplashScreen.preventAutoHideAsync();
      } else {
        // Hide when stopped loading.
        await SplashScreen.hideAsync();
      }
    })();
  }, [loading]);

  if (loading) return null;

  if (!storageState) {
    throw new Error("Expected storage state to be initialized.");
  }

  return (
    <CategoriesContextProvider initCategories={storageState.categories}>
      <ShoppingListsContextProvider
        initialCurrentListId={storageState.appData.lastActiveListId} // XXX: Fix appdata
        initialShoppingLists={storageState.shoppingLists}
      >
        <LibraryItemsContextProvider
          initLibraryItems={storageState.libraryItems}
        >
          <NavigationContextProvider>
            <RootNavigator />
          </NavigationContextProvider>
        </LibraryItemsContextProvider>
      </ShoppingListsContextProvider>
    </CategoriesContextProvider>
  );
}
