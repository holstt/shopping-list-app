// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import ListItem from "./Item/ListItem";
import Item from "../models/Item";
import { useState, useRef, LegacyRef, useEffect } from "react";
import Category from "../models/Category";
import { Feather } from "@expo/vector-icons";

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
  // Mode only active when input for add new item is visible
  const [isAddItemMode, setIsAddItemMode] = useState(false);

  // useEffect(() => {
  //   console.log("hello");
  // }, []);

  const itemPressed = (id: string) => {
    const items = uncheckedItems.concat(checkedItems);
    const updatedItems = items.map((item, i) =>
      // Find and update pressed item.
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    ({ unchecked, checked } = splitItems(updatedItems));
    // XXX: Safe not using prev state?
    setUncheckedItems(unchecked);
    setCheckedItems(checked);
  };

  // Create items.
  const itemListUnchecked = createListComponent(uncheckedItems, itemPressed);
  const itemListChecked = createListComponent(checkedItems, itemPressed);

  const textInputRef = useRef<TextInput | null>();

  // Handle item submitted
  const onSubmitEditing = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // console.log("Submitted:");
    // console.log(event?.nativeEvent?.text);

    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "") return;

    // Clear text input after item submitted
    setUncheckedItems((prev) => [
      new Item(event.nativeEvent.text, false),
      ...prev,
    ]);
    textInputRef?.current?.clear();
  };

  // XXX: Skal i component
  const itemListComponent = (
    <View>
      {isAddItemMode ? (
        <TextInput
          // Focus from start
          autoFocus={true}
          // Keep focus even after submit
          blurOnSubmit={false}
          onBlur={() => setIsAddItemMode(false)}
          // onFocus={() => setIsAddItemMode(true)}
          ref={(ref) => (textInputRef.current = ref)}
          style={styles.inputField}
          onSubmitEditing={onSubmitEditing}
          // value={""}
          placeholder="Add Item"
          // keyboardType="default"
        />
      ) : null}

      {itemListUnchecked}
      {itemListChecked.length !== 0 ? (
        <Text style={styles.doneHeader}>Done</Text>
      ) : null}
      {itemListChecked}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>MyList</Text>
      <ScrollView style={styles.listStyles}>{itemListComponent}</ScrollView>
      {!isAddItemMode ? (
        <TouchableOpacity
          style={styles.plusButton}
          // Button activates Add Item Mode
          onPress={() => {
            console.log(textInputRef?.current);
            // textInputRef?.current?.focus();
            setIsAddItemMode(true);
          }}
        >
          <Feather name="plus" size={33} color="white" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function createListComponent(items: Item[], itemPressed: (id: string) => void) {
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

// Reorder items. Put checked items at bottom
function splitItems(items: Item[]) {
  const unchecked = items.filter((item) => !item.isChecked);
  const checked = items.filter((item) => item.isChecked);
  return { unchecked, checked };
}

const styles = StyleSheet.create({
  container: {
    // borderColor: "blue",
    // borderWidth: 1,
    height: "100%",
  },
  inputField: {
    // XXX: Evt. global style for dette og item text
    paddingTop: 7,
    paddingBottom: 7,
    color: "#454a52",
    fontSize: 20,
  },
  listStyles: {
    // borderColor: "green",
    // borderWidth: 1,
  },
  plusButton: {
    // borderWidth: 2,
    // borderColor: "#74ABEB",
    backgroundColor: "#2473E9",
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 6,
  },
  // itemList: {
  //   borderColor: "yellow",
  //   // borderWidth: 1,
  //   // height: "50%",
  // },
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
