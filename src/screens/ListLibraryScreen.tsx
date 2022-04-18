import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";
import PlusButtonOld from "../components/common/PlusButtonOld";

import { useState, useContext } from "react";
import ItemList from "../models/ShoppingList";
import ShoppingListRow from "../components/ListLibrary/ShoppingListRow";
import colors from "../config/colors";
import {
  ShoppingListsContext,
  useShoppingListsContext,
} from "../state/ShoppingListsContext";
import { RootStackParamList } from "../RootNavigator";
import { State } from "react-native-gesture-handler";

type Props = BottomTabScreenProps<RootStackParamList, "ListLibraryScreen">;

export default function ListLibraryScreen({ route, navigation }: Props) {
  console.log("ListLibraryScreen: Rendering");
  const [isEditListMode, setIsEditListMode] = useState(false);
  const [isAddListMode, setIsAddItemMode] = useState(false);
  const [currentEditList, setCurrentEditList] = useState<ItemList | null>(null);

  // const listsContext = useContext(ItemListsContext);

  let {
    state: { allLists: shoppingLists },
    // eslint-disable-next-line prefer-const
    dispatch,
  } = useShoppingListsContext();

  const onListPress = (list: ItemList) => {
    setIsEditListMode(true);
    setCurrentEditList(list);
  };

  // XXX: Genbrug fra add item func
  const onSubmitEditItem = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "" || !currentEditList) return;

    dispatch({
      type: "LIST_TITLE_CHANGED",
      listId: currentEditList.id,
      newTitle: event.nativeEvent.text,
    });
  };

  // Item should be hidden from list if it is being edited.
  if (isEditListMode) {
    shoppingLists = shoppingLists.filter(
      (item) => item.id !== currentEditList?.id
    );
  }

  // Handle item submitted
  const onSubmitAddItem = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "" || !currentEditList) return;

    dispatch({
      type: "LIST_ADDED",
      list: new ItemList(event.nativeEvent.text, [], shoppingLists.length),
    });
  };

  const addListInput = (
    <TextInput
      style={styles.inputField}
      placeholder="Add List"
      // Focus from start
      autoFocus={true}
      // Turn off add item mode if not focused on input
      onBlur={() => setIsAddItemMode(false)}
      onSubmitEditing={onSubmitAddItem}
    />
  );

  const editListInput = (
    <TextInput
      style={styles.inputField}
      // Focus from start
      autoFocus={true}
      defaultValue={currentEditList?.title}
      // Turn off add item mode if not focused on input
      onBlur={() => setIsEditListMode(false)}
      onSubmitEditing={onSubmitEditItem}
    />
  );
  // XXX: Skal i component
  // Resolve input
  const inputComponent = isAddListMode
    ? addListInput
    : isEditListMode
    ? editListInput
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>List Library</Text>
      {inputComponent}
      <ScrollView>{renderLists()}</ScrollView>
      <View style={styles.viewTest}></View>
      {!isAddListMode ? (
        <PlusButtonOld onPress={() => setIsAddItemMode(true)}></PlusButtonOld>
      ) : null}
    </View>
  );

  function renderLists() {
    return shoppingLists.map((list, index) => (
      <ShoppingListRow
        onDeleteButtonPress={(list) => {
          console.log("Call for delete");
          dispatch({
            type: "LIST_REMOVED",
            listId: list.id,
          });
        }}
        onListPress={onListPress}
        isLastElement={index === shoppingLists.length - 1}
        list={list}
        key={list.id}
      ></ShoppingListRow>
    ));
  }
}

const styles = StyleSheet.create({
  container: {
    // height: "100%",
    // backgroundColor: "blue",
  },
  listHeader: {
    textAlign: "center",
    fontSize: 45,
    paddingBottom: 5,
    color: colors.darkGrey,
  },
  inputField: {
    paddingTop: 7,
    paddingBottom: 7,
    color: colors.darkGrey,
    fontSize: 20,
  },
  viewTest: {
    marginLeft: 100,
    width: 200,
    height: 400,
    shadowColor: "black",
    shadowOpacity: 0.99,
    shadowOffset: { width: 0, height: 0 },
    // shadowRadius: 50,
    // borderWidth: 1,
    elevation: 10,
    backgroundColor: "green",
  },
});
