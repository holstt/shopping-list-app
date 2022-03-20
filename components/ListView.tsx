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
import ItemRow from "./Item/ItemRow";
import Item from "../models/Item";
import { useState, useRef, LegacyRef, useEffect } from "react";
import Category from "../models/Category";
import { Feather } from "@expo/vector-icons";
import ItemList from "../models/ItemList";
import colors from "../Colors";
import UpDownButton from "./UpDownButton";

interface ShoppingListProps {
  itemList: ItemList;
  categories: Category[];
  onAddNewItem(item: Item): void;
  onEditItem(item: Item): void;
  onDeleteItem(item: Item): void;
  onCheckButtonPressed(item: Item): void;
  onViewNextList(event: GestureResponderEvent): void;
  onViewPrevList(event: GestureResponderEvent): void;
  hasNextList: boolean;
  hasPrevList: boolean;
}

export default function ListView({
  itemList,
  categories,
  onAddNewItem,
  onEditItem,
  onViewNextList,
  onViewPrevList,
  onDeleteItem,
  hasNextList,
  hasPrevList,
  onCheckButtonPressed,
}: ShoppingListProps) {
  // Mode only active when input for add new item is visible
  const [isAddItemMode, setIsAddItemMode] = useState(false);
  const [isEditItemMode, setIsEditItemMode] = useState(false);
  const textInputRef = useRef<TextInput | null>();
  // XXX: Egen comp??
  const [currentEditItem, setCurrentEditItem] = useState<Item | null>(null);

  console.log(onDeleteItem);

  const onItemPress = (item: Item) => {
    setIsEditItemMode(true);
    setCurrentEditItem(item);
  };

  let items: Item[] | null = null;
  // Item should be hidden from list if it is being edited.
  if (isEditItemMode) {
    items = itemList.items.filter((item) => item.id !== currentEditItem?.id);
  } else {
    items = itemList.items;
  }
  // Create items.
  const { unchecked, checked } = splitItems(items);
  const itemListUncheckedComponent = renderListComponent(unchecked);
  const itemListCheckedComponent = renderListComponent(checked);

  // Handle item submitted
  const onSubmitAddItem = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "") return;

    // Clear text input after item submitted
    textInputRef?.current?.clear();
    // Notify and pass new item to parent
    onAddNewItem(new Item(event.nativeEvent.text, false));
  };

  // XXX: Genbrug fra add item func
  const onSubmitEditItem = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "" || !currentEditItem) return;

    // Clear text input after item submitted
    textInputRef?.current?.clear();
    // Notify and pass edit item to parent
    onEditItem({ ...currentEditItem, title: event.nativeEvent.text });
  };

  // XXX: Skal i component
  // Resolve input
  const inputComponent = isAddItemMode ? (
    <TextInput
      style={styles.inputField}
      placeholder="Add Item"
      // Focus from start
      autoFocus={true}
      // Keep focus even after submit
      blurOnSubmit={false}
      // Turn off add item mode if not focused on input
      onBlur={() => setIsAddItemMode(false)}
      ref={(ref) => (textInputRef.current = ref)}
      onSubmitEditing={onSubmitAddItem}
    />
  ) : isEditItemMode ? (
    <TextInput
      style={styles.inputField}
      // Focus from start
      autoFocus={true}
      defaultValue={currentEditItem?.title}
      // Turn off add item mode if not focused on input
      onBlur={() => setIsEditItemMode(false)}
      onSubmitEditing={onSubmitEditItem}
    />
  ) : null;

  function renderListComponent(fromItems: Item[]) {
    return fromItems.map((item, i) => {
      return (
        <ItemRow
          key={item.id}
          item={item}
          isLastElement={i === fromItems.length - 1}
          onCheckButtonPress={onCheckButtonPressed}
          onItemPress={onItemPress}
          onDeleteItem={onDeleteItem}
        ></ItemRow>
      );
    });
  }

  // XXX: Skal i component
  const itemListComponent = (
    // Add input field
    <View>
      {inputComponent}
      {itemListUncheckedComponent}
      {itemListCheckedComponent.length !== 0 ? (
        <Text style={styles.doneHeader}>Done</Text>
      ) : null}
      {itemListCheckedComponent}
    </View>
  );

  return (
    <View
      style={styles.container}
      // onTouchEnd={() => console.log("hej!")}
    >
      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeader}>{itemList.title}</Text>
        <UpDownButton
          onButtonUp={onViewPrevList}
          onButtonDown={onViewNextList}
          hasPrevList={hasPrevList}
          hasNextList={hasNextList}
        ></UpDownButton>
      </View>
      <ScrollView>{itemListComponent}</ScrollView>
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

// Reorder items. Put checked items at bottom
function splitItems(items: Item[]) {
  const unchecked = items.filter((item) => !item.isChecked);
  const checked = items.filter((item) => item.isChecked);
  return { unchecked, checked };
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    // backgroundColor: "blue",
  },
  inputField: {
    // XXX: Evt. global style for dette og item text
    paddingTop: 7,
    paddingBottom: 7,
    color: colors.darkGrey,
    fontSize: 20,
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
  listHeaderContainer: {
    flexDirection: "row",
    marginLeft: 5,
  },
  listHeader: {
    color: colors.darkGrey,
    textAlign: "left",
    fontSize: 40,
    paddingBottom: 10,
  },
  doneHeader: {
    color: colors.lightGrey,
    textAlign: "left",
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 2,
  },
});
