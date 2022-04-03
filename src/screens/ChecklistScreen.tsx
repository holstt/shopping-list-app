import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import ShoppingItemRow from "../components/ShoppingListView/ShoppingItemRow";
import ShoppingItem from "../models/ShoppingItem";
import { useState, useRef, useContext, useEffect } from "react";
import colors from "../config/colors";
import UpDownButton from "../components/ShoppingListView/UpDownButton";
import PlusButton from "../components/common/PlusButton";
import Category from "../models/Category";
import { CategoriesContext } from "../state/CategoriesContext";
import { ItemListsContext } from "../state/ItemListsContext";
import ListInput from "../components/common/ListInput";
import { RootStackParamList } from "../RootNavigator";
import ChecklistListInput, {
  InputMode,
} from "../components/ShoppingListView/ChecklistListInput";
import { LibraryItemsContext } from "../state/LibraryItemsContext";
import { CountType } from "../components/ShoppingListView/Counter";

type Props = BottomTabScreenProps<RootStackParamList, "ChecklistScreen">;

export default function CheckListScreen({ navigation, route }: Props) {
  const { categories } = useContext(CategoriesContext);
  const {
    updateItemList,
    activeItemList,
    hasPrevList,
    hasNextList,
    goToPrevList,
    goToNextList,
  } = useContext(ItemListsContext);

  const { libraryItems } = useContext(LibraryItemsContext);

  // XXX: Lav custom hooks til det her
  // Mode only active when input for add new item is visible
  const [isAddItemMode, setIsAddItemMode] = useState(false);
  const [isEditItemMode, setIsEditItemMode] = useState(false);

  // console.log(
  //   "mode -> Add item: " + isAddItemMode + ", Edit item: " + isEditItemMode
  // );

  // const textInputRef = useRef<TextInput | null>();
  // XXX: Egen comp?? Context?
  // XXX: Hvorfor ikke slå sammen?
  const [currentEditItem, setCurrentEditItem] = useState<ShoppingItem | null>(
    null
  );
  const [currentEditItemCategory, setCurrentEditItemCategory] =
    useState<Category | null>(null);

  let items: ShoppingItem[] | null = null;

  // Item should be hidden from list if it is being edited.
  if (isEditItemMode) {
    items = activeItemList.items.filter(
      (item) => item.id !== currentEditItem?.id
    );
  } else {
    items = activeItemList.items;
  }

  // XXX: Ansvar?
  // Compares items by category and then by item title
  const itemComparer = (a: ShoppingItem, b: ShoppingItem): number => {
    if (a.category?.title === b.category?.title)
      return a.title.localeCompare(b.title);
    else if (a.category === null) return 1;
    else if (b.category === null) return -1;
    else return a.category.title.localeCompare(b.category.title);
  };

  items.sort(itemComparer);

  // XXX: Evt. wrap disse i context/hook
  const addItemToList = (item: ShoppingItem) =>
    // XXX: Skidt ej at bruge prev?
    updateItemList({
      ...activeItemList,
      items: [...activeItemList.items, item],
    });

  // XXX: Skidt ej prev?
  const updateItemInList = (updatedItem: ShoppingItem) =>
    updateItemList({
      ...activeItemList,
      items: activeItemList.items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    });

  const deleteItemInList = (itemToDeleteId: string) =>
    updateItemList({
      ...activeItemList,
      items: activeItemList.items.filter((item) => item.id !== itemToDeleteId),
    });

  const onItemCheckToggled = (itemToggled: ShoppingItem) => {
    const itemUpdated: ShoppingItem = Object.create(itemToggled);
    itemUpdated.isChecked = !itemToggled.isChecked;
    updateItemInList(itemUpdated);
  };

  // XXX: Rykkes i hook.
  // When an item is pressed
  const onItemPress = (item: ShoppingItem) => {
    // XXX: Setting multiple states?
    setIsEditItemMode(true);
    setCurrentEditItem(item);
    setCurrentEditItemCategory(item.category);
    console.log("Set all on pressed");
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
    // console.log("XXXX Edit mode ended!");

    setIsEditItemMode(false);
    setCurrentEditItem(null);
    setCurrentEditItemCategory(null);
  };

  // Handle item submitted
  const onSubmitAddItem = (newItem: ShoppingItem) => {
    setCurrentEditItem(null);
    setCurrentEditItemCategory(null);
    // Notify and pass new item to parent
    addItemToList(newItem);
  };

  // XXX: Genbrug fra add item func
  const onSubmitEditItem = (text: string, category: Category | null) => {
    const editedItem: ShoppingItem = Object.create(currentEditItem);
    editedItem.title = text;
    editedItem.category = currentEditItemCategory;
    // Notify and pass edit item to parent
    updateItemInList(editedItem);
    onEditItemModeEnded(); //XXX: Burde slåes sammen?
  };

  const onPressCounter = (id: string, countType: CountType) => {
    const itemFound = activeItemList.items.find((item) => item.id === id);
    if (!itemFound) {
      throw new Error("Count item was not found: " + id);
    }

    switch (countType) {
      case CountType.INCREMENT:
        updateItemInList({ ...itemFound, quantity: ++itemFound.quantity });
        break;

      case CountType.DECREMENT:
        if (itemFound.quantity - 1 < 1) {
          return;
        }
        updateItemInList({ ...itemFound, quantity: --itemFound.quantity });
        break;
    }
  };

  const renderListComponent = (fromItems: ShoppingItem[]) => {
    return fromItems.map((item, index) => {
      return (
        <ShoppingItemRow
          key={item.id}
          item={item}
          isLastElement={index === fromItems.length - 1}
          onCheckButtonPress={onItemCheckToggled}
          onItemPress={onItemPress}
          onRemoveItem={deleteItemInList}
          onPressCounter={onPressCounter}
          hasPrevItemCategory={
            fromItems[index - 1]?.category?.title === item.category?.title
          }
          hasNextItemCategory={
            fromItems[index + 1]?.category?.title === item.category?.title
          }
        ></ShoppingItemRow>
      );
    });
  };

  // Create items.
  const { unchecked, checked } = splitItems(items);
  const itemListUncheckedComponent = renderListComponent(unchecked);
  const itemListCheckedComponent = renderListComponent(checked);

  // XXX: Skal i component
  const itemListComponent = (
    <View>
      {itemListUncheckedComponent}
      {itemListCheckedComponent.length !== 0 && (
        <View>
          <Text style={styles.doneHeader}>Done</Text>
          {itemListCheckedComponent}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listHeaderContainer}>
        <Text numberOfLines={1} style={styles.listHeader}>
          {activeItemList.title}
        </Text>
        <UpDownButton
          onButtonUp={goToPrevList}
          onButtonDown={goToNextList}
          isUpButtonEnabled={hasPrevList}
          isDownButtonEnabled={hasNextList}
        ></UpDownButton>
      </View>

      {/* {inputComponent} */}
      {(isAddItemMode || isEditItemMode) && (
        <ChecklistListInput
          libraryItems={libraryItems}
          categories={categories}
          chosenCategory={currentEditItemCategory}
          onCategoryPress={onCategoryPress}
          text={currentEditItem ? currentEditItem.title : ""}
          inputMode={isAddItemMode ? InputMode.ADD : InputMode.EDIT}
          onAddItemModeEnded={onAddItemModeEnded}
          onSubmitAddItem={onSubmitAddItem}
          onEditItemModeEnded={onEditItemModeEnded}
          onSubmitEditItem={onSubmitEditItem}
          currentIndex={activeItemList.items.length - 1}
        ></ChecklistListInput>
      )}
      <ScrollView>{itemListComponent}</ScrollView>
      {!isAddItemMode && !isEditItemMode ? (
        <PlusButton onPress={() => setIsAddItemMode(true)}></PlusButton>
      ) : null}
    </View>
  );

  // Reorder items. Put checked items at bottom
  function splitItems(itemsToSplit: ShoppingItem[]) {
    const unchecked = itemsToSplit.filter((item) => !item.isChecked);
    const checked = itemsToSplit.filter((item) => item.isChecked);
    return { unchecked, checked };
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
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
