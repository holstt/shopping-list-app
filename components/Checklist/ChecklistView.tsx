import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  GestureResponderEvent,
} from "react-native";
import ItemRow from "./ItemRow";
import ListItem from "../../models/ListItem";
import { useState, useRef } from "react";
import ItemList from "../../models/ItemList";
import colors from "../../Colors";
import UpDownButton from "./UpDownButton";
import PlusButton from "../PlusButton";
import Category from "../../models/Category";
import CategoryPicker from "../Category/CategoryPicker";

interface ShoppingListProps {
  itemList: ItemList;
  categories: Category[];
  onAddNewItem(item: ListItem): void;
  onEditItem(item: ListItem): void;
  onDeleteItem(itemId: string): void;
  onCheckButtonPressed(item: ListItem): void;
  onViewNextList(event: GestureResponderEvent): void;
  onViewPrevList(event: GestureResponderEvent): void;
  hasNextList: boolean;
  hasPrevList: boolean;
}

export default function ChecklistView({
  itemList,
  onAddNewItem,
  onEditItem,
  onViewNextList,
  onViewPrevList,
  onDeleteItem,
  hasNextList,
  hasPrevList,
  onCheckButtonPressed,
  categories,
}: ShoppingListProps) {
  // Mode only active when input for add new item is visible
  const [isAddItemMode, setIsAddItemMode] = useState(false);
  const [isEditItemMode, setIsEditItemMode] = useState(false);
  const textInputRef = useRef<TextInput | null>();
  // XXX: Egen comp??
  const [currentEditItem, setCurrentEditItem] = useState<ListItem | null>(null);
  const [currentEditItemCategory, setCurrentEditItemCategory] =
    useState<Category | null>(null);

  let items: ListItem[] | null = null;
  // Item should be hidden from list if it is being edited.
  if (isEditItemMode) {
    items = itemList.items.filter((item) => item.id !== currentEditItem?.id);
  } else {
    items = itemList.items;
  }

  // When an item is pressed
  const onItemPress = (item: ListItem) => {
    // XXX: Setting multiple states?
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

  // Handle item submitted
  const onSubmitAddItem = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "") return;

    // Clear text input after item submitted
    textInputRef?.current?.clear();
    // Notify and pass new item to parent
    onAddNewItem(
      ListItem.fromNonLibraryItem(
        event.nativeEvent.text,
        currentEditItemCategory
      )
    );
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

  const addInput = (
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

  const editInput = (
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
      (isAddItemMode && renderInputType(addInput)) ||
      (isEditItemMode && renderInputType(editInput))
    );
  };

  const renderListComponent = (fromItems: ListItem[]) => {
    return fromItems.map((item, i) => {
      return (
        <ItemRow
          key={item.id}
          item={item}
          isLastElement={i === fromItems.length - 1}
          onCheckButtonPress={onCheckButtonPressed}
          onItemPress={onItemPress}
          onRemoveItem={onDeleteItem}
        ></ItemRow>
      );
    });
  };

  // Create items.
  const { unchecked, checked } = splitItems(items);
  const itemListUncheckedComponent = renderListComponent(unchecked);
  const itemListCheckedComponent = renderListComponent(checked);

  // XXX: Skal i component
  // Resolve input
  const inputComponent = renderInputComponent();

  // XXX: Skal i component
  const itemListComponent = (
    <View>
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
        <Text numberOfLines={1} style={styles.listHeader}>
          {itemList.title}
        </Text>
        <UpDownButton
          onButtonUp={onViewPrevList}
          onButtonDown={onViewNextList}
          isUpButtonEnabled={hasPrevList}
          isDownButtonEnabled={hasNextList}
        ></UpDownButton>
      </View>

      {inputComponent}
      <ScrollView>{itemListComponent}</ScrollView>
      {!isAddItemMode ? (
        <PlusButton onPress={() => setIsAddItemMode(true)}></PlusButton>
      ) : null}
    </View>
  );

  // Reorder items. Put checked items at bottom
  function splitItems(itemsToSplit: ListItem[]) {
    const unchecked = itemsToSplit.filter((item) => !item.isChecked);
    const checked = itemsToSplit.filter((item) => item.isChecked);
    return { unchecked, checked };
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  inputField: {
    // XXX: Evt. global style for dette og item text
    paddingTop: 7,
    paddingBottom: 7,
    color: colors.darkGrey,
    fontSize: 20,
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
  categoryColorRectangle: {
    // backgroundColor: "blue",
    marginLeft: "auto",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
    marginTop: 7,
    marginBottom: 7,
  },
  inputContainer: {
    flexDirection: "row",
  },
});
