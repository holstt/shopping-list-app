import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import Category from "../models/Category";
import { LibraryItemsContext } from "../state/LibraryItemsContext";
import { CategoriesContext } from "../state/CategoriesContext";
import { useContext, useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import PlusButton from "../components/common/PlusButton";
import LibraryItem from "../models/LibraryItem";
import LibraryItemRow from "../components/ItemLibrary/LibraryItemRow";
import colors from "../config/colors";
import ListInput from "../components/common/ListInput";
import { RootStackParamList } from "../RootNavigator";

type Props = BottomTabScreenProps<RootStackParamList, "ItemLibraryScreen">;

export default function ItemLibraryScreen({ navigation, route }: Props) {
  const {
    deleteLibraryItem,
    addLibraryItem,
    editLibraryItem,
    libraryItems,
    updateLibraryItems,
  } = useContext(LibraryItemsContext);
  const { categories } = useContext(CategoriesContext);

  const [isAddItemMode, setIsAddItemMode] = useState(false);
  const [isEditItemMode, setIsEditItemMode] = useState(false);
  const textInputRef = useRef<TextInput | null>();

  const [currentEditItem, setCurrentEditItem] = useState<LibraryItem | null>(
    null
  );
  const [currentEditItemCategory, setCurrentEditItemCategory] =
    useState<Category | null>(null);

  let items = libraryItems;
  // Item should be hidden from list if it is being edited.
  if (isEditItemMode) {
    items = libraryItems.filter((item) => item.id !== currentEditItem?.id);
  }

  // XXX: Genbrug fra checklist, fix
  const itemComparer = (a: LibraryItem, b: LibraryItem): number => {
    if (a.category?.title === b.category?.title)
      return a.title.localeCompare(b.title);
    else if (a.category === null) return 1;
    else if (b.category === null) return -1;
    else return a.category.title.localeCompare(b.category.title);
  };

  libraryItems.sort(itemComparer);

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
    editLibraryItem({
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
    addLibraryItem(
      new LibraryItem(
        event.nativeEvent.text,
        libraryItems.length,
        currentEditItemCategory
      )
    );
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
        categoryToDisplay={currentEditItemCategory}
      ></ListInput>
    )) ||
    (isEditItemMode && (
      <ListInput
        inputComponent={editItemInput}
        categories={categories}
        onCategoryPress={onCategoryPress}
        categoryToDisplay={currentEditItemCategory}
      ></ListInput>
    ));

  const itemsComponent = items.map((item, index) => (
    <LibraryItemRow
      onDeleteButtonPress={(itemToDelete) => deleteLibraryItem(itemToDelete.id)}
      onItemPress={onItemPress}
      isLastElement={index === items.length - 1}
      item={item}
      key={item.id}
      hasPrevItemCategory={
        items[index - 1]?.category?.title === item.category?.title
      }
      hasNextItemCategory={
        items[index + 1]?.category?.title === item.category?.title
      }
    ></LibraryItemRow>
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>Item Library</Text>
      {inputComponent}
      <ScrollView>{itemsComponent}</ScrollView>
      {!isAddItemMode && !isEditItemMode ? (
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
  // XXX: Evt. global style for dette og item text
  inputField: {
    paddingTop: 7,
    paddingBottom: 7,
    color: colors.darkGrey,
    fontSize: 20,
  },
});
