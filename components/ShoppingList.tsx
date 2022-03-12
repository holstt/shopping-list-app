// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import ShoppingItem from "./ShoppingItem";
import Item from "../models/Item";
import { useState } from "react";

interface ShoppingListProps {
  itemsExisting: Item[];
}

export default function ShoppingList({ itemsExisting }: ShoppingListProps) {
  const [items, setItems] = useState(orderItems(itemsExisting));

  const itemPressed = (index: number) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item, i) =>
        // Find and update pressed item.
        i == index ? { ...item, isChecked: !item.isChecked } : item
      );
      return orderItems(updatedItems);
    });
    // console.log(`ispressed: ${index} `);
  };

  // Create items.
  const itemList = items.map((item, i) => {
    return (
      <ShoppingItem
        key={i}
        item={item}
        index={i}
        isLastElement={i == items.length - 1}
        onPress={itemPressed}
      ></ShoppingItem>
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>MyList</Text>
      <ScrollView style={styles.itemList}>{itemList}</ScrollView>
    </View>
  );
}

// Reorder items. Put checked items at bottom
function orderItems(items: Item[]) {
  const unchecked = items.filter((item) => !item.isChecked);
  const checked = items.filter((item) => item.isChecked);
  return unchecked.concat(checked);
}

const styles = StyleSheet.create({
  container: {
    borderColor: "blue",
    borderWidth: 1,
    height: "100%",
  },
  listContainer: {
    height: "100%",
    borderColor: "green",
    borderWidth: 2,
  },
  itemList: {
    borderColor: "yellow",
    // borderWidth: 1,
    // height: "50%",
  },
  listHeader: {
    color: "#454a52",
    backgroundColor: "#fff",
    textAlign: "left",
    fontSize: 40,
    paddingBottom: 10,
  },
});
