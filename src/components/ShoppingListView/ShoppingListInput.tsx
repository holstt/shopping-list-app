import { ReactElement, useContext, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import Category from "../../models/Category";
import CategoryPicker from "../common/CategoryPicker";
import CustomAutocomplete from "./CustomAutoCompleter";
import colors from "../../config/colors";
import ShoppingItem from "../../models/ShoppingItem";
import LibraryItem from "../../models/LibraryItem";
import {
  InputMode,
  useShoppingListUIContext,
} from "../../state/ShoppingListUIContext";
import { LibraryItemsContext } from "../../state/LibraryItemsContext";
import { CategoriesContext } from "../../state/CategoriesContext";
import { useShoppingListsContext } from "../../state/ShoppingListsContext";

interface Props {
  // onSubmitAddItem: (item: ShoppingItem) => void;
  // onSubmitEditItem: (text: string, category: Category | null) => void;
  currentIndex: number;
}

export default function ShoppingListInput({
  // onSubmitAddItem, // XXX: Fra context??
  // onSubmitEditItem, // XXX: Fra context??
  currentIndex,
}: Props) {
  console.log("render input");

  // Global state/contex
  const { state: stateUi, dispatch: dispatchUi } = useShoppingListUIContext();
  const { libraryItems } = useContext(LibraryItemsContext);
  const { categories } = useContext(CategoriesContext);
  const { state, dispatch } = useShoppingListsContext();

  // Local state
  const textInputRef = useRef<TextInput | null>();
  const [currentInputText, setCurrentInputText] = useState<string>(() =>
    stateUi.editItem ? stateUi.editItem.title : ""
  );

  const onAutocompleteItemPress = (libraryItem: LibraryItem) => {
    // Clear text input
    textInputRef?.current?.clear(); //XX: Evt. error hvis ej

    switch (stateUi.inputMode) {
      case InputMode.ADD:
        // Notify and pass new item to parent
        onLibraryItemAdded(libraryItem);
        break;

      case InputMode.EDIT:
        onItemEdited(libraryItem.title, libraryItem.category);
        break;
    }
    setCurrentInputText("");
  };

  // Clears what currently in the input field.
  const clearInput = () => textInputRef?.current?.clear();

  // XXX: Genbrug fra add item func
  const handleSubmitEditItem = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "") return;

    // Clear text input after item submitted
    // clearInput();
    setCurrentInputText("");
    onItemEdited(event.nativeEvent.text, stateUi.selectedCategory);
  };

  // Handle item submitted
  const handleSubmitAddItem = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "") return;

    // clearInput();
    setCurrentInputText("");
    onItemAdded(event.nativeEvent.text);
  };

  const onLibraryItemAdded = (libraryItem: LibraryItem) => {
    dispatch({
      type: "ITEM_ADDED",
      item: ShoppingItem.fromLibraryItem(libraryItem, currentIndex + 1),
    });
    dispatchUi({ type: "ADD_ITEM_ENDED" });
  };

  const onItemAdded = (title: string) => {
    dispatch({
      type: "ITEM_ADDED",
      item: ShoppingItem.fromNew(
        title,
        currentIndex + 1,
        stateUi.selectedCategory
      ),
    });
    dispatchUi({ type: "ADD_ITEM_ENDED" });
  };

  const onItemEdited = (text: string, category: Category | null) => {
    if (!stateUi.editItem) {
      // XXX: Fix
      console.warn("onSubmitEditItem: editItem missing");
      return;
    }
    //XXX: combineReducers?
    dispatch({
      type: "ITEM_CATEGORY_CHANGED",
      id: stateUi.editItem.id,
      category: category,
    });
    dispatch({
      type: "ITEM_TITLE_CHANGED",
      id: stateUi.editItem.id,
      newTitle: text,
    });
    dispatchUi({ type: "EDIT_ITEM_ENDED" });
  };

  const textInputComponent = (() => {
    switch (stateUi.inputMode) {
      case InputMode.ADD:
        return (
          <TextInput
            style={styles.inputField}
            placeholder="Add Item"
            // Focus from start
            autoFocus={true}
            onChangeText={(text) => {
              setCurrentInputText(text);
            }}
            // Keep focus even after submit
            blurOnSubmit={false}
            // Turn off add item mode if not focused on input
            onBlur={() => dispatchUi({ type: "ADD_ITEM_ENDED" })}
            ref={(ref) => (textInputRef.current = ref)}
            onSubmitEditing={(event) => {
              handleSubmitAddItem(event);
            }}
          />
        );

      case InputMode.EDIT:
        return (
          <TextInput
            style={styles.inputField}
            // Focus from start
            autoFocus={true}
            defaultValue={currentInputText}
            onChangeText={(text) => setCurrentInputText(text)}
            ref={(ref) => (textInputRef.current = ref)}
            // Turn off add item mode if not focused on input
            onBlur={() => dispatchUi({ type: "EDIT_ITEM_ENDED" })}
            onSubmitEditing={handleSubmitEditItem}
          />
        );
    }
  })();

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {textInputComponent}
        {stateUi.selectedCategory && (
          <View
            style={[
              styles.categoryColorRectangle,
              { backgroundColor: stateUi.selectedCategory.color },
            ]}
          />
        )}
      </View>
      {currentInputText !== "" && (
        <CustomAutocomplete
          onItemPress={onAutocompleteItemPress}
          query={currentInputText}
          items={libraryItems}
        ></CustomAutocomplete>
      )}
      <CategoryPicker
        categories={categories}
        onCategoryPress={(category) =>
          dispatchUi({ type: "CATEGORY_SELECTED", category })
        }
      ></CategoryPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
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
  inputField: {
    // XXX: Evt. global style for dette og item text
    paddingTop: 7,
    paddingBottom: 7,
    color: colors.darkGrey,
    fontSize: 20,
  },
});
