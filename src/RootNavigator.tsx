import { StatusBar, StyleSheet, View, TouchableOpacity } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import ShoppingListScreen from "./screens/ShoppingListScreen";
import ListLibraryScreen from "./screens/ListLibraryScreen";
import ItemLibraryScreen from "./screens/ItemLibraryScreen";
import CategoryLibraryScreen from "./screens/CategoryLibraryScreen";
import Constants from "expo-constants";
import colors from "./config/colors";
import PlusButtonOld from "./components/common/PlusButtonOld";
import PlusButtonNew from "./components/common/PlusButtonNew";
import { useRef } from "react";
import { useNavigationContext } from "./state/NavigationContext";
import ShoppingListUIContextProvider, {
  ShoppingListUIContext,
} from "./state/ShoppingListUIContext";
// import { useNavigationContext } from "./state/NavigationContext";

export type RootStackParamList = {
  ShoppingListScreen: undefined;
  ListLibraryScreen: undefined;
  ButtonPlaceHolderScreen: undefined;
  ItemLibraryScreen: undefined;
  CategoryLibraryScreen: undefined;
};

// Note: Necessary to add custom button on nav bar.
const ButtonPlaceHolderScreen = () => null;

const Tab = createBottomTabNavigator<RootStackParamList>();

// Wrap in context local to this screen.
const ShoppingListScreenWithContext = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any // OK? Ej typed
) => (
  <ShoppingListUIContextProvider>
    <ShoppingListScreen {...props}></ShoppingListScreen>
  </ShoppingListUIContextProvider>
);

export default function RootNavigator() {
  const navigationRef = useRef<any>(); // XXX: Hvilken type??
  const { addItemEventFiredOnScreen, setaddItemEventFiredOnScreen } =
    useNavigationContext();
  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator
        initialRouteName="ShoppingListScreen"
        sceneContainerStyle={styles.container}
        // tabBar=
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "white",
            paddingBottom: 5,
            paddingTop: 5,
            // height: "8%",
            // borderColor: "grey",
            // borderBottomWidth: 1,
            // borderWidth: 0.5,

            height: 55,
            // borderRadius: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        <Tab.Screen
          name="ShoppingListScreen"
          component={ShoppingListScreenWithContext}
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
          name="ButtonPlaceHolderScreen"
          options={{
            title: "Lists",
            tabBarButton: (props) => (
              // if(props.)
              <PlusButtonNew
                {...props}
                onPress={() => {
                  // console.log("tab custom button");
                  const currentScreenName: keyof RootStackParamList =
                    navigationRef?.current?.getCurrentRoute()?.name; // XXX: Fix type
                  setaddItemEventFiredOnScreen(currentScreenName);
                }}
              ></PlusButtonNew>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              console.log("tab press");
              // Prevent default action
              e.preventDefault();
            },
          }}
          component={ButtonPlaceHolderScreen}
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
    // padding: 10,
    // backgroundColor: colors.blue,
    // backgroundColor: "white",
    // backgroundColor: "red",
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingTop: Constants.statusBarHeight,
    // backgroundColor: "#0769D1",
  },

  // shadow: {
  //   shadowColor: "#7F5DF0",
  //   shadowOffset: {
  //     width: 0,
  //     height: 0,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.5,
  //   elevation: 5,
  // },
});
