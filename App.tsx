import { StyleSheet, View, StatusBar } from "react-native";
import ShoppingList from "./components/ShoppingList";
import Item from "./models/Item";

export default function App() {
  // XXX: Indlæs fra local storage. UseEffect?
  const loadedItems = [
    new Item("Item1", true),
    new Item("Item2", false),
    new Item("Item3", false),
  ];

  return (
    <View style={styles.container}>
      <ShoppingList initialItems={loadedItems}></ShoppingList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "red",
    // height: "100%",
    borderWidth: 2,
    padding: 10,
    paddingTop: StatusBar.currentHeight,
  },
});
