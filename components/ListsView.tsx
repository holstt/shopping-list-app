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

import { useState, useRef, useEffect } from "react";
import Item from "../models/Item";
import ItemList from "../models/ItemList";
import ListRow from "./ListRow";
import colors from "../Colors";
import { Feather } from "@expo/vector-icons";

interface Props {
  onDeleteList: (list: ItemList) => void;
  onAddList: (item: ItemList) => void;
  onEditList: (item: ItemList) => void;
  itemLists: ItemList[];
}

export default function ListsView({
  onDeleteList,
  onAddList,
  onEditList,
  itemLists,
}: Props) {
  const [isEditListMode, setIsEditListMode] = useState(false);
  const [currentEditList, setCurrentEditList] = useState<ItemList | null>(null);
  const [isAddItemMode, setIsAddItemMode] = useState(false);

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

    // Notify and pass edit item to parent
    onEditList({ ...currentEditList, title: event.nativeEvent.text });
  };

  // Item should be hidden from list if it is being edited.
  if (isEditListMode) {
    itemLists = itemLists.filter((item) => item.id !== currentEditList?.id);
  }

  // Handle item submitted
  const onSubmitAddItem = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    // Do nothing if empty text
    if (!event?.nativeEvent?.text || "") return;

    // Notify and pass new item to parent
    onAddList(new ItemList(event.nativeEvent.text, [], itemLists.length));
  };

  const addItemInput = (
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

  const editItemInput = (
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
  const inputComponent = isAddItemMode
    ? addItemInput
    : isEditListMode
    ? editItemInput
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>Lists</Text>
      {inputComponent}
      <ScrollView>{renderLists()}</ScrollView>
      {!isAddItemMode ? (
        <PlusButton onPress={() => setIsAddItemMode(true)}></PlusButton>
      ) : null}
    </View>
  );

  function renderLists() {
    return itemLists.map((l, i) => (
      <ListRow
        onDeleteButtonPress={onDeleteList}
        onListPress={onListPress}
        isLastElement={i === itemLists.length - 1}
        list={l}
        key={l.id}
      ></ListRow>
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
  inputField: {
    // XXX: Evt. global style for dette og item text
    paddingTop: 7,
    paddingBottom: 7,
    color: colors.darkGrey,
    fontSize: 20,
  },
});
