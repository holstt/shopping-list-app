// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import ListItem from "./Item/ListItem";
import Item from "../models/Item";
import { useState } from "react";
import Category from "../models/Category";

interface ShoppingListProps {
  initialItems: Item[];
  initialCategories: Category[];
}

export default function ShoppingList({
  initialItems,
  initialCategories,
}: ShoppingListProps) {
  let { unchecked, checked } = splitItems(initialItems);

  const [uncheckedItems, setUncheckedItems] = useState(unchecked);
  const [checkedItems, setCheckedItems] = useState(checked);

  const itemPressed = (id: string) => {
    // console.log("pressed: " + id);

    const items = uncheckedItems.concat(checkedItems);
    const updatedItems = items.map((item, i) =>
      // Find and update pressed item.
      item.id == id ? { ...item, isChecked: !item.isChecked } : item
    );
    ({ unchecked, checked } = splitItems(updatedItems));

    // console.log("unchecked: ");
    // console.log(unchecked);

    // console.log("checked: ");
    // console.log(checked);
    // console.log("checked: " + checked);
    // XXX: Safe not using prev state?
    setUncheckedItems(unchecked);
    setCheckedItems(checked);

    // console.log(`ispressed: ${index} `);
  };

  // Create items.
  const itemListUnchecked = createListComponent(uncheckedItems);
  const itemListChecked = createListComponent(checkedItems);

  const itemListComponent = (
    <View>
      {itemListUnchecked}
      {itemListChecked.length != 0 ? (
        <Text style={styles.doneHeader}>Done</Text>
      ) : null}
      {itemListChecked}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>MyList</Text>
      <ScrollView style={styles.itemList}>{itemListComponent}</ScrollView>
    </View>
  );

  function createListComponent(items: Item[]) {
    return items.map((item, i) => {
      return (
        <ListItem
          key={item.id}
          item={item}
          isLastElement={i == items.length - 1}
          onPress={itemPressed}
        ></ListItem>
      );
    });
  }
}

// Reorder items. Put checked items at bottom
function splitItems(items: Item[]) {
  const unchecked = items.filter((item) => !item.isChecked);
  const checked = items.filter((item) => item.isChecked);
  return { unchecked, checked };
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
  doneHeader: {
    color: "#464b53e6",
    // backgroundColor: "#fff",
    textAlign: "left",
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 2,
  },
  listHeader: {
    color: "#454a52",
    // backgroundColor: "#fff",
    textAlign: "left",
    fontSize: 40,
    paddingBottom: 10,
  },
});
