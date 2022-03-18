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
  GestureResponderEvent,
} from "react-native";
import ListItem from "./Item/ListItem";
import Item from "../models/Item";
import { useState, useRef, LegacyRef, useEffect } from "react";
import Category from "../models/Category";
import { Feather } from "@expo/vector-icons";
import ItemList from "../models/ItemList";
import { FontAwesome } from "@expo/vector-icons";

interface ShoppingListProps {
  itemList: ItemList;
  categories: Category[];
  onAddNewItem(item: Item): void;
  onItemPressed(item: Item): void;
  onViewNextList(event: GestureResponderEvent): void;
  onViewPrevList(event: GestureResponderEvent): void;
  hasNextList: boolean;
  hasPrevList: boolean;
}

export default function ListView({
  itemList,
  categories,
  onAddNewItem,
  onViewNextList,
  onViewPrevList,
  hasNextList,
  hasPrevList,
  onItemPressed,
}: ShoppingListProps) {
  // Mode only active when input for add new item is visible
  const [isAddItemMode, setIsAddItemMode] = useState(false);
  const textInputRef = useRef<TextInput | null>();

  // console.log("has prev: " + hasPrevList);
  // console.log("has next: " + hasNextList);

  // Create items.
  const { unchecked, checked } = splitItems(itemList.items);
  const itemListUncheckedComponent = createListComponent(
    unchecked,
    onItemPressed
  );
  const itemListCheckedComponent = createListComponent(checked, onItemPressed);

  // Handle item submitted
  const onSubmitEditing = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "") return;

    // Clear text input after item submitted
    textInputRef?.current?.clear();
    // Notify and pass new item to parent
    onAddNewItem(new Item(event.nativeEvent.text, false));
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
          // Turn off add item mode if not focused on input
          onBlur={() => setIsAddItemMode(false)}
          ref={(ref) => (textInputRef.current = ref)}
          style={styles.inputField}
          onSubmitEditing={onSubmitEditing}
          placeholder="Add Item"
        />
      ) : null}

      {itemListUncheckedComponent}
      {itemListCheckedComponent.length !== 0 ? (
        <Text style={styles.doneHeader}>Done</Text>
      ) : null}
      {itemListCheckedComponent}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeader}>{itemList.title}</Text>
        {/* XXX: Flyt i button component */}
        <View style={styles.upDownButtonContainer}>
          <TouchableOpacity onPress={onViewPrevList}>
            <FontAwesome
              name="chevron-up"
              style={[styles.logo, !hasPrevList ? styles.logoDisabled : null]}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome
              onPress={onViewNextList}
              name="chevron-down"
              style={[styles.logo, !hasNextList ? styles.logoDisabled : null]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.listStyles}>{itemListComponent}</ScrollView>
      {!isAddItemMode ? (
        <TouchableOpacity
          style={styles.plusButton}
          // Button activates Add Item Mode
          onPress={() => {
            setIsAddItemMode(true);
          }}
        >
          <Feather name="plus" size={33} color="white" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// const onItemModified = (item : Item) => {

// }

function createListComponent(
  items: Item[],
  onItemPressed: (item: Item) => void
) {
  return items.map((item, i) => {
    return (
      <ListItem
        key={item.id}
        item={item}
        isLastElement={i === items.length - 1}
        onPress={onItemPressed}
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

// Colors
const lightGrey = "#464b53e6";
const darkGrey = "#454a52";
const lightGreyDisabled = "#464b5366";

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
    color: darkGrey,
    fontSize: 20,
  },
  listStyles: {
    // borderColor: "green",
    // borderWidth: 1,
  },
  plusButton: {
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
  listHeaderContainer: {
    flexDirection: "row",
    marginLeft: 5,
  },

  listHeader: {
    color: darkGrey,
    // backgroundColor: "#fff",
    textAlign: "left",
    fontSize: 40,
    paddingBottom: 10,
    // marginLeft: 12,
  },
  upDownButtonContainer: {
    // backgroundColor: "red",
    marginLeft: "auto",
  },
  logo: {
    fontSize: 26,
    color: lightGrey,
    // backgroundColor: "red",
    // borderWidth: 2,
    // borderColor: "black",
  },
  logoDisabled: {
    color: lightGreyDisabled,
  },
  doneHeader: {
    color: lightGrey,
    // backgroundColor: "#fff",
    textAlign: "left",
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 2,
  },
});
