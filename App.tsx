import AppLoading from "expo-app-loading";

import { StatusBar, StyleSheet } from "react-native";

import StorageService from "./services/StorageService";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChecklistScreen from "./screens/ChecklistScreen";
import { RootStackParamList } from "./types";
import ListLibraryScreen from "./screens/ListLibraryScreen";
import ItemLibraryScreen from "./screens/ItemLibraryScreen";
import CategoryLibraryScreen from "./screens/CategoryLibraryScreen";
import LibraryItemsContextProvider from "./context/LibraryItemsContextProvider";
import CategoriesContextProvider from "./context/CategoriesContextProvider";
import ItemListsContextProvider from "./context/ItemListsContextProvider";
import useLocalStorageData from "./hooks/useLocalStorageData";

// Use Reactotron dev tool
if (__DEV__) {
  // tslint:disable-next-line: no-floating-promises
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

export default function App() {
  const { loadData, isDoneLoading, data, appData, setAppData } =
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

  if (!isDoneLoading) {
    return (
      <AppLoading
        startAsync={loadData}
        // onFinish={() => setIsDoneLoading(true)}
        onFinish={() => console.log("hej")}
        onError={console.warn}
      />
    );
  }

  if (!data) {
    throw new Error("Unable to load data from local storage due to an error");
  }

  const Tab = createBottomTabNavigator<RootStackParamList>();
  return (
    <CategoriesContextProvider initCategories={data.categories}>
      <LibraryItemsContextProvider initLibraryItems={data.libraryItems}>
        <ItemListsContextProvider
          startListId={appData ? appData.lastActiveListId : null} // XXX: Fix appdata
          onActiveListChanged={onActiveListIdChanged}
          initItemLists={data.itemLists}
        >
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="ChecklistScreen"
              sceneContainerStyle={styles.container}
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  paddingBottom: 2,
                },
              }}
            >
              <Tab.Screen
                name="ChecklistScreen"
                component={ChecklistScreen}
                options={{
                  title: "Shopping",
                  tabBarIcon: ({ focused, color, size }) => (
                    <FontAwesome
                      name="check-circle"
                      size={size}
                      color={color}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="ListLibraryScreen"
                component={ListLibraryScreen}
                options={{
                  title: "Lists",
                  tabBarIcon: ({ focused, color, size }) => (
                    <FontAwesome name="list-ul" size={size} color={color} />
                  ),
                }}
              />
              <Tab.Screen
                name="ItemLibraryScreen"
                component={ItemLibraryScreen}
                options={{
                  title: "Items",
                  tabBarIcon: ({ focused, color, size }) => (
                    <MaterialCommunityIcons
                      name="library-shelves"
                      size={size}
                      color={color}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="CategoryLibraryScreen"
                component={CategoryLibraryScreen}
                options={{
                  title: "Categories",
                  tabBarIcon: ({ focused, color, size }) => (
                    <MaterialIcons name="category" size={size} color={color} />
                  ),
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </ItemListsContextProvider>
      </LibraryItemsContextProvider>
    </CategoriesContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
});
