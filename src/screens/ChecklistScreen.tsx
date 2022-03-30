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
import ItemRow from "../components/Checklist/ItemRow";
import ListItem from "../models/ListItem";
import { useState, useRef, useContext } from "react";
import colors from "../config/colors";
import UpDownButton from "../components/Checklist/UpDownButton";
import PlusButton from "../components/common/Input/PlusButton";
import Category from "../models/Category";
import { CategoriesContext } from "../state/CategoriesContext";
import { ItemListsContext } from "../state/ItemListsContext";
import ListInput from "../components/common/Input/ListInput";
import { RootStackParamList } from "../RootNavigator";
import ChecklistListInput, {
  InputMode,
} from "../components/common/Input/ChecklistListInput";
import { LibraryItemsContext } from "../state/LibraryItemsContext";

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

  console.log("Checklist rerender with list: " + activeItemList.id);

  // XXX: Lav custom hooks til det her
  // Mode only active when input for add new item is visible
  const [isAddItemMode, setIsAddItemMode] = useState(false);
  const [isEditItemMode, setIsEditItemMode] = useState(false);
  // const textInputRef = useRef<TextInput | null>();
  // XXX: Egen comp?? Context?
  const [currentEditItem, setCurrentEditItem] = useState<ListItem | null>(null);
  const [currentEditItemCategory, setCurrentEditItemCategory] =
    useState<Category | null>(null);

  let items: ListItem[] | null = null;

  // Item should be hidden from list if it is being edited.
  if (isEditItemMode) {
    items = activeItemList.items.filter(
      (item) => item.id !== currentEditItem?.id
    );
  } else {
    items = activeItemList.items;
  }

  // XXX: Evt. wrap disse i context/hook
  const addItemToList = (item: ListItem) =>
    // XXX: Skidt ej at bruge prev?
    updateItemList({
      ...activeItemList,
      items: [item, ...activeItemList.items],
    });

  const updateItemInList = (updatedItem: ListItem) =>
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

  const onItemCheckToggled = (itemToggled: ListItem) => {
    const itemUpdated: ListItem = Object.create(itemToggled);
    itemUpdated.isChecked = !itemToggled.isChecked;
    updateItemInList(itemUpdated);
  };

  // XXX: Rykkes i hook.
  // When an item is pressed
  const onItemPress = (item: ListItem) => {
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
    setIsEditItemMode(false);
    setCurrentEditItem(null);
    setCurrentEditItemCategory(null);
  };

  // Handle item submitted
  const onSubmitAddItem = (newItem: ListItem) => {
    // Notify and pass new item to parent
    addItemToList(newItem);
  };

  // XXX: Genbrug fra add item func
  const onSubmitEditItem = (text: string, category: Category | null) => {
    // Do nothing if empty text
    // if (!event?.nativeEvent?.text || "" || !currentEditItem) return;

    const editedItem: ListItem = Object.create(currentEditItem);
    editedItem.title = text;
    editedItem.category = currentEditItemCategory;
    // Notify and pass edit item to parent
    updateItemInList(editedItem);
  };

  const renderListComponent = (fromItems: ListItem[]) => {
    return fromItems.map((item, i) => {
      return (
        <ItemRow
          key={item.id}
          item={item}
          isLastElement={i === fromItems.length - 1}
          onCheckButtonPress={onItemCheckToggled}
          onItemPress={onItemPress}
          onRemoveItem={deleteItemInList}
        ></ItemRow>
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
        ></ChecklistListInput>
      )}
      <ScrollView>{itemListComponent}</ScrollView>
      {!isAddItemMode && !isEditItemMode ? (
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
