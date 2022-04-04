import { StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ShoppingListScreen from "./screens/ShoppingListScreen";
import ListLibraryScreen from "./screens/ListLibraryScreen";
import ItemLibraryScreen from "./screens/ItemLibraryScreen";
import CategoryLibraryScreen from "./screens/CategoryLibraryScreen";

export type RootStackParamList = {
  ShoppingListScreen: undefined;
  ListLibraryScreen: undefined;
  ItemLibraryScreen: undefined;
  CategoryLibraryScreen: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="ShoppingListScreen"
        sceneContainerStyle={styles.container}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 2,
          },
        }}
      >
        <Tab.Screen
          name="ShoppingListScreen"
          component={ShoppingListScreen}
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
});
