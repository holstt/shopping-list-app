import { useRef, useState } from "react";
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
import PlusButton from "./PlusButton";

import LibraryItem from "../models/LibraryItem";
import LibraryItemRow from "./LibraryItemRow";
import ListRow from "./ListRow";
import colors from "../Colors";
import Category from "../models/Category";
import CategoryPicker from "./Category/CategoryPicker";

interface Props {
  items: LibraryItem[];
  categories: Category[];

  onDeleteItem: (list: LibraryItem) => void;
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

  const renderInputType = (inputType: JSX.Element) => {
    return (
      <View>
        <View style={styles.inputContainer}>
          {inputType}
          {currentEditItemCategory && (
            <View
              style={[
                styles.categoryColorRectangle,
                { backgroundColor: currentEditItemCategory?.color },
              ]}
            ></View>
          )}
        </View>
        <CategoryPicker
          categories={categories}
          onCategoryPress={onCategoryPress}
        ></CategoryPicker>
      </View>
    );
  };

  const renderInputComponent = () => {
    return (
      (isAddItemMode && renderInputType(addItemInput)) ||
      (isEditItemMode && renderInputType(editItemInput))
    );
  };

  // XXX: Skal i component
  // Resolve input
  const inputComponent = renderInputComponent();

  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>Items</Text>
      {inputComponent}
      <ScrollView>{renderItems()}</ScrollView>
      {!isAddItemMode ? (
        <PlusButton onPress={() => setIsAddItemMode(true)}></PlusButton>
      ) : null}
    </View>
  );

  function renderItems() {
    return items.map((item, index) => (
      <LibraryItemRow
        onDeleteButtonPress={onDeleteItem}
        onItemPress={onItemPress}
        isLastElement={index === items.length - 1}
        item={item}
        key={item.id}
      ></LibraryItemRow>
    ));
  }
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
  categoryColorRectangle: {
    // backgroundColor: "blue",
    marginLeft: "auto",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
    marginTop: 7,
    marginBottom: 7,
  },
  inputField: {
    // XXX: Evt. global style for dette og item text
    paddingTop: 7,
    paddingBottom: 7,
    color: colors.darkGrey,
    fontSize: 20,
  },
  inputContainer: {
    flexDirection: "row",
  },
});
