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
import { useState, useRef, useEffect } from "react";
import ItemList from "../models/ItemList";
import colors from "../Colors";
import UpDownButton from "./UpDownButton";
import PlusButton from "./PlusButton";
import Category from "../models/Category";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import CategoryButton from "./CategoryButton";

interface ShoppingListProps {
  itemList: ItemList;
  categories: Category[];
  onAddNewItem(item: Item): void;
  onEditItem(item: Item): void;
  onDeleteItem(itemId: string): void;
  onCheckButtonPressed(item: Item): void;
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
  const [currentEditItem, setCurrentEditItem] = useState<Item | null>(null);

  const [currentAddItemCategory, setCurrentEditItemCategory] =
    useState<Category | null>(null);

  let items: Item[] | null = null;
  // Item should be hidden from list if it is being edited.
  if (isEditItemMode) {
    items = itemList.items.filter((item) => item.id !== currentEditItem?.id);
  } else {
    items = itemList.items;
  }

  const onItemPress = (item: Item) => {
    setIsEditItemMode(true);
    setCurrentEditItem(item);
  };

  const renderListComponent = (fromItems: Item[]) => {
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
      new Item(event.nativeEvent.text, false, currentAddItemCategory)
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
    onEditItem({ ...currentEditItem, title: event.nativeEvent.text });
  };

  const onCategoryPress = (category: Category) => {
    setCurrentEditItemCategory(category);
  };

  const categoryButtons = (
    <ScrollView keyboardShouldPersistTaps="always" horizontal={true}>
      <View style={styles.categoryPickerContainer}>
        {categories.map((cat) => (
          <CategoryButton
            key={cat.id}
            onPress={onCategoryPress}
            category={cat}
          ></CategoryButton>
        ))}
      </View>
    </ScrollView>
  );

  function renderInputComponent() {
    return isAddItemMode ? (
      <View>
        <View style={styles.inputContainer}>
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
          {currentAddItemCategory && (
            // <View style={[styles.categoryColor]}></View>
            <View
              style={[
                styles.categoryColor,
                { backgroundColor: currentAddItemCategory?.color },
              ]}
            ></View>
          )}
        </View>
        {categoryButtons}
      </View>
    ) : isEditItemMode ? (
      <TextInput
        style={styles.inputField}
        // Focus from start
        autoFocus={true}
        defaultValue={currentEditItem?.title}
        // Turn off add item mode if not focused on input
        onBlur={onEditItemModeEnded}
        onSubmitEditing={onSubmitEditItem}
      />
    ) : null;
  }

  const onEditItemModeEnded = () => {
    setIsEditItemMode(false);
    setCurrentEditItem(null);
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
  function splitItems(items: Item[]) {
    const unchecked = items.filter((item) => !item.isChecked);
    const checked = items.filter((item) => item.isChecked);
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
  // XXX: I component
  categoryPickerContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
  },
  categoryCircle: {
    borderRadius: 50,
    height: 70,
    width: 70,
    backgroundColor: "red",
    marginRight: 5,
    color: "#FFF6F4",
    flex: 1,
    fontSize: 14,
    padding: 10,
    textAlign: "center",
    textAlignVertical: "center",
  },
  categoryColor: {
    // backgroundColor: "blue",
    marginLeft: "auto",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 13,
    marginTop: 7,
    marginBottom: 7,
    // height: 14,
  },
  inputContainer: {
    flexDirection: "row",
  },
});
