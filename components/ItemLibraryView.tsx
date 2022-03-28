import { ReactElement, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import PlusButton from "./PlusButton";

import LibraryItem from "../models/LibraryItem";
import LibraryItemRow from "./LibraryItemRow";
import colors from "../Colors";
import Category from "../models/Category";
import ListInput from "./ListInput";

interface Props {
  items: LibraryItem[];
  categories: Category[];

  onDeleteItem: (itemId: string) => void;
  onAddItem: (item: LibraryItem) => void;
  onEditItem: (item: LibraryItem) => void;
}

export default function ItemLibraryView({
  items,
  onDeleteItem,
  onAddItem,
  onEditItem,
  categories,
}: Props) {
  const [isAddItemMode, setIsAddItemMode] = useState(false);
  const [isEditItemMode, setIsEditItemMode] = useState(false);
  const textInputRef = useRef<TextInput | null>();

  const [currentEditItem, setCurrentEditItem] = useState<LibraryItem | null>(
    null
  );
  const [currentEditItemCategory, setCurrentEditItemCategory] =
    useState<Category | null>(null);

  // Item should be hidden from list if it is being edited.
  if (isEditItemMode) {
    items = items.filter((item) => item.id !== currentEditItem?.id);
  }

  const onItemPress = (item: LibraryItem) => {
    setIsEditItemMode(true);
    setCurrentEditItem(item);
    setCurrentEditItemCategory(item.category);
  };

  const onCategoryPress = (category: Category) => {
    // If category pressed is same as current, then remove the category
    setCurrentEditItemCategory((prev) =>
      prev?.id !== category.id ? category : null
    );
  };

  const onAddItemModeEnded = () => {
    setIsAddItemMode(false);
    setCurrentEditItemCategory(null);
  };

  const onEditItemModeEnded = () => {
    setIsEditItemMode(false);
    setCurrentEditItem(null);
    setCurrentEditItemCategory(null);
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
    onEditItem({
      ...currentEditItem,
      title: event.nativeEvent.text,
      category: currentEditItemCategory,
    });
  };

  // Handle item submitted
  const onSubmitAddItem = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "") return;

    // Clear text input after item submitted
    textInputRef?.current?.clear();

    // Notify and pass new item to parent
    onAddItem(new LibraryItem(event.nativeEvent.text, currentEditItemCategory));
  };

  const addItemInput = (
    <TextInput
      style={styles.inputField}
      placeholder="Add Item"
      // Focus from start
      autoFocus={true}
      // Keep focus even after submit
      blurOnSubmit={false}
      // Turn off add item mode if not focused on input
      onBlur={onAddItemModeEnded}
      ref={(ref) => (textInputRef.current = ref)}
      onSubmitEditing={onSubmitAddItem}
    />
  );

  const editItemInput = (
    <TextInput
      style={styles.inputField}
      // Focus from start
      autoFocus={true}
      defaultValue={currentEditItem?.title}
      // Turn off add item mode if not focused on input
      onBlur={onEditItemModeEnded}
      onSubmitEditing={onSubmitEditItem}
    />
  );

  const inputComponent =
    (isAddItemMode && (
      <ListInput
        inputComponent={addItemInput}
        categories={categories}
        onCategoryPress={onCategoryPress}
        showCategory={currentEditItemCategory}
      ></ListInput>
    )) ||
    (isEditItemMode && (
      <ListInput
        inputComponent={editItemInput}
        categories={categories}
        onCategoryPress={onCategoryPress}
        showCategory={currentEditItemCategory}
      ></ListInput>
    ));

  const itemsComponent = items.map((item, index) => (
    <LibraryItemRow
      onDeleteButtonPress={(itemToDelete) => onDeleteItem(itemToDelete.id)}
      onItemPress={onItemPress}
      isLastElement={index === items.length - 1}
      item={item}
      key={item.id}
    ></LibraryItemRow>
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>Items</Text>
      {inputComponent}
      <ScrollView>{itemsComponent}</ScrollView>
      {!isAddItemMode ? (
        <PlusButton onPress={() => setIsAddItemMode(true)}></PlusButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    // backgroundColor: "blue",
  },
  listHeader: {
    textAlign: "center",
    fontSize: 45,
    paddingBottom: 5,
    color: colors.darkGrey,
  },

  inputField: {
    // XXX: Evt. global style for dette og item text
    paddingTop: 7,
    paddingBottom: 7,
    color: colors.darkGrey,
    fontSize: 20,
  },
});
