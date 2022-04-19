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
import Autocomplete from "./Autocomplete";
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

  const filterData = (query: string) => {
    return libraryItems.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    );
  };

  // Maximum items displayed in autocomplete list.
  const MAX_ITEMS = 6;
  const queryResult = filterData(currentInputText).slice(0, MAX_ITEMS);

  const showAutoComplete = currentInputText !== "" && queryResult.length !== 0;

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
            style={[
              styles.inputTextField,
              showAutoComplete && styles.inputTextFieldWithAutocomplete,
            ]}
            placeholder="Add Item"
            defaultValue={currentInputText}
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
            style={[
              styles.inputTextField,
              showAutoComplete && styles.inputTextFieldWithAutocomplete,
            ]}
            // Focus from start
            autoFocus={true}
            defaultValue={currentInputText}
            onChangeText={(text) => setCurrentInputText(text)}
            ref={(ref) => (textInputRef.current = ref)}
            // Turn off add item mode if not focused on input
            onBlur={() => dispatchUi({ type: "EDIT_ITEM_ENDED" })}
            onSubmitEditing={handleSubmitEditItem}
            // keyboardType="visible-password"
          />
        );
    }
  })();

  const inputField = (
    <View style={styles.input}>
      {textInputComponent}
      {showAutoComplete && (
        <Autocomplete
          onItemPress={onAutocompleteItemPress}
          suggestions={queryResult}
        ></Autocomplete>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {inputField}
        {stateUi.selectedCategory && (
          <View
            style={[
              styles.categoryColorMarker,
              { backgroundColor: stateUi.selectedCategory.color },
            ]}
          />
        )}
      </View>
      <CategoryPicker
        isHidden={showAutoComplete}
        categories={categories}
        onCategoryPress={(category) =>
          dispatchUi({ type: "CATEGORY_SELECTED", category })
        }
      ></CategoryPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
  },
  input: {
    margin: 10,
    // marginBottom: 0,
    flex: 1,
  },
  categoryColorMarker: {
    marginLeft: "auto",
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    width: 13,
    marginTop: 10,
    marginBottom: 10, //XXX: Bør afhænge af inputText margin
  },
  inputContainer: {
    flexDirection: "row",
    zIndex: 1, // TODO: Not working on iOS

    backgroundColor: "white",
  },
  inputTextField: {
    // XXX: Evt. global style for dette og item text
    paddingTop: 7,
    paddingBottom: 7,
    color: colors.darkGrey,
    fontSize: 20,
    backgroundColor: "#ECEBEC",
    // borderRadius: 20,
    borderRadius: 10,
    paddingLeft: 10,
  },
  inputTextFieldWithAutocomplete: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  gapColorFillDefault: {
    backgroundColor: colors.backgroundBlue,
    height: 6,
  },
});
