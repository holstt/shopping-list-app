import ChecklistView from "./components/Checklist/ChecklistView";
import Category from "./models/Category";
import ListItem from "./models/ListItem";
import AppLoading from "expo-app-loading";

import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";

import { useEffect, useState } from "react";
import StorageService from "./services/StorageService";
import StorageTestDataInitializer from "./services/StorageTestDataInitializer";
import ItemList from "./models/ItemList";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChecklistScreen from "./screens/ChecklistScreen";
import { RootStackParamList } from "./types";
import ListLibraryScreen from "./screens/ListLibraryScreen";
import LibraryItem from "./models/LibraryItem";
import ItemLibraryScreen from "./screens/ItemLibraryScreen";
import CategoryLibraryScreen from "./screens/CategoryLibraryScreen";

// Use Reactotron dev tool
if (__DEV__) {
  // tslint:disable-next-line: no-floating-promises
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // XXX: Lægges i context/global store
  const [itemLists, setItemLists] = useState<ItemList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);

  const loadData = async () => {
    if (__DEV__) {
      // Seed test data in dev environment
      await StorageService.clearAllData();
      await StorageTestDataInitializer.seedTestData();
    }

    await loadDataFromLocalStorage();
  };

  // XXX: Abstraheres - custom hook?
  const loadDataFromLocalStorage = async () => {
    console.log("Loading data from local storage...");
    const appData = await StorageService.loadAppData();
    let existingItemLists = await StorageService.loadItemLists();

    // Handle no existing lists...
    if (existingItemLists.length === 0) {
      console.log(
        "No existing items found in local storage. Creating initial list."
      );
      const firstList = new ItemList("My First List", [], 0);
      existingItemLists = [firstList];
      appData.lastActiveListId = firstList.id;
    }

    // Ensure order.
    const existingCategories = await StorageService.loadCategories();
    const existingLibraryItems = await StorageService.loadLibraryItems();
    setItemLists(existingItemLists);
    setCategories(existingCategories);
    setLibraryItems(existingLibraryItems);
    console.log("Data loaded!");
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

  const Tab = createBottomTabNavigator<RootStackParamList>();
  return (
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
          initialParams={{
            initItemLists: itemLists,
            initCategories: categories,
          }}
          options={{
            title: "Shopping",
            tabBarIcon: ({ focused, color, size }) => (
              <FontAwesome name="check-circle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ListLibraryScreen"
          component={ListLibraryScreen}
          initialParams={{ initItemLists: itemLists }}
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
          initialParams={{
            initItems: libraryItems,
            initCategories: categories,
          }}
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
          initialParams={{ categories }}
          options={{
            title: "Categories",
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialIcons name="category" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
});
