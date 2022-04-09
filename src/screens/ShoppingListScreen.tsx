import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

import { StyleSheet, Text, View, ScrollView } from "react-native";
import ShoppingItemRow from "../components/ShoppingListView/ShoppingItemRow";
import ShoppingItem from "../models/ShoppingItem";
import { useState, useContext, useReducer } from "react";
import colors from "../config/colors";
import UpDownButton from "../components/ShoppingListView/UpDownButton";
import PlusButton from "../components/common/PlusButton";
import Category from "../models/Category";
import { CategoriesContext } from "../state/CategoriesContext";
import {
  ShoppingListsContext,
  useShoppingListsContext,
} from "../state/ShoppingListsContext";
import { RootStackParamList } from "../RootNavigator";
import ShoppingListInput, {
  InputMode,
} from "../components/ShoppingListView/ShoppingListInput";
import { LibraryItemsContext } from "../state/LibraryItemsContext";
import { CountType } from "../components/ShoppingListView/Counter";
import ShoppingList from "../models/ShoppingList";
import { ActionKind } from "../state/reducers/shoppingListsReducer";

type Props = BottomTabScreenProps<RootStackParamList, "ShoppingListScreen">;

export default function ShoppingListScreen({ navigation, route }: Props) {
  const { categories } = useContext(CategoriesContext);
  const { state, dispatch } = useShoppingListsContext();

  // XXX: Genbrug fra context
  const currentList = state.allLists[state.currentListIndex];
  const hasPrevList = state.currentListIndex - 1 >= 0;
  const hasNextList = state.currentListIndex + 1 <= state.allLists.length - 1;

  // Create list if no lists in app state.
  if (!currentList) {
    console.log("No current list");
    const firstList = new ShoppingList("My First List", [], 0);
    // Add list to global store and wait for rerender with new state.
    dispatch({ type: ActionKind.ADD_LIST, payload: { inputList: firstList } });
    return null;
  }

  const { libraryItems } = useContext(LibraryItemsContext);

  // XXX: Lav custom hooks til det her
  // Mode only active when input for add new item is visible
  const [isAddItemMode, setIsAddItemMode] = useState(false);
  const [isEditItemMode, setIsEditItemMode] = useState(false);

  // XXX: Egen comp?? Context?
  // XXX: Hvorfor ikke slå sammen?
  const [currentEditItem, setCurrentEditItem] = useState<ShoppingItem | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  let items: ShoppingItem[];

  // Item should be hidden from list if it is being edited.
  if (isEditItemMode) {
    items = currentList.items.filter((item) => item.id !== currentEditItem?.id);
  } else {
    items = currentList.items;
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

  // XXX: Rykkes i hook.
  // When an item is pressed
  const onItemPress = (item: ShoppingItem) => {
    console.log("Item pressed");
    // XXX: Setting multiple states?
    setIsEditItemMode(true);
    setCurrentEditItem(item);
    setSelectedCategory(item.category);
  };

  const onCategoryPress = (category: Category) => {
    // If category pressed is same as current, then remove the category
    setSelectedCategory((prev) => (prev?.id !== category.id ? category : null));
  };

  const onItemCheckToggled = (itemToggled: ShoppingItem) => {
    const itemUpdated: ShoppingItem = Object.create(itemToggled);
    itemUpdated.isChecked = !itemToggled.isChecked;
    dispatch({
      type: ActionKind.UPDATE_ITEM,
      payload: { inputItem: itemUpdated },
    });
  };

  const onAddItemModeEnded = () => {
    console.log("add item mode ended");
    setIsAddItemMode(false);
    setSelectedCategory(null);
  };

  const onEditItemModeEnded = () => {
    console.log("edit item mode ended");

    setIsEditItemMode(false);
    setCurrentEditItem(null);
    setSelectedCategory(null);
  };

  // Handle item submitted
  const onSubmitAddItem = (newItem: ShoppingItem) => {
    console.log("Checklist: on submit item");
    setCurrentEditItem(null);
    setSelectedCategory(null);
    // Notify and pass new item to parent
    dispatch({ type: ActionKind.ADD_ITEM, payload: { inputItem: newItem } });
  };

  // XXX: Genbrug fra add item func
  const onSubmitEditItem = (text: string, category: Category | null) => {
    const editedItem: ShoppingItem = Object.create(currentEditItem);
    editedItem.title = text;
    editedItem.category = category;
    // Notify and pass edit item to parent
    dispatch({
      type: ActionKind.UPDATE_ITEM,
      payload: { inputItem: editedItem },
    });
    onEditItemModeEnded(); //XXX: Burde slåes sammen?
  };

  const onPressCounter = (id: string, countType: CountType) => {
    const itemFound = items.find((item) => item.id === id);
    if (!itemFound) {
      throw new Error("Count item was not found: " + id);
    }

    switch (countType) {
      case CountType.INCREMENT:
        dispatch({
          type: ActionKind.UPDATE_ITEM,
          payload: {
            inputItem: { ...itemFound, quantity: ++itemFound.quantity },
          },
        });
        break;

      case CountType.DECREMENT:
        // XXX: hvor placeres domæne validering for et item?
        if (itemFound.quantity - 1 < 1) {
          return;
        }
        dispatch({
          type: ActionKind.UPDATE_ITEM,
          payload: {
            inputItem: { ...itemFound, quantity: --itemFound.quantity },
          },
        });
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
          onRemoveItem={(item) =>
            dispatch({
              type: ActionKind.REMOVE_ITEM,
              payload: { inputItem: item },
            })
          }
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
          {currentList.title}
        </Text>
        <UpDownButton
          onButtonUp={() =>
            dispatch({ type: ActionKind.GO_TO_PREV_LIST, payload: {} })
          }
          onButtonDown={() =>
            dispatch({ type: ActionKind.GO_TO_NEXT_LIST, payload: {} })
          }
          isUpButtonEnabled={hasPrevList}
          isDownButtonEnabled={hasNextList}
        ></UpDownButton>
      </View>

      {/* {inputComponent} */}
      {(isAddItemMode || isEditItemMode) && (
        // XXX: Skal have context
        <ShoppingListInput
          libraryItems={libraryItems}
          categories={categories}
          chosenCategory={selectedCategory}
          onCategoryPress={onCategoryPress}
          text={currentEditItem ? currentEditItem.title : ""}
          inputMode={isAddItemMode ? InputMode.ADD : InputMode.EDIT}
          onAddItemModeEnded={onAddItemModeEnded}
          onSubmitAddItem={onSubmitAddItem}
          onEditItemModeEnded={onEditItemModeEnded}
          onSubmitEditItem={onSubmitEditItem}
          currentIndex={currentList.items.length - 1}
        ></ShoppingListInput>
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
    // backgroundColor: "red",
    flexDirection: "row",
    marginLeft: 5,
    // marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  listHeader: {
    flex: 4,
    color: colors.darkGrey,
    textAlign: "left",
    fontSize: 35,
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
