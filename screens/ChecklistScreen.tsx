import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import ChecklistView from "../components/ChecklistView";
import Item from "../models/Item";
import { useEffect, useState } from "react";
import StorageService from "../services/StorageService";
import ItemList from "../models/ItemList";

import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../types";
import Category from "../models/Category";

type Props = BottomTabScreenProps<RootStackParamList, "ChecklistScreen">;

export default function CheckListScreen({ navigation, route }: Props) {
  // XXX: Skal komme fra context...
  const [categories] = useState<Category[]>(route.params.initCategories);
  const [itemLists, setItemLists] = useState<ItemList[]>(
    route.params.initItemLists
  );
  const [activeListIndex, setActiveListIndex] = useState(0);

  const addItemToList = (list: ItemList, item: Item) => {
    const updatedList: ItemList = { ...list, items: [item, ...list.items] };
    // tslint:disable-next-line: no-floating-promises
    StorageService.saveItemList(updatedList);
    return updatedList;
  };

  const onAddNewItem = async (itemAdded: Item) => {
    setItemLists((prev) => {
      return prev.map((prevList, index) =>
        index === activeListIndex
          ? addItemToList(prevList, itemAdded)
          : prevList
      );
    });
  };

  // XXX: Genbrug fra onAddItem
  const onEditItem = async (itemEdited: Item) => {
    setItemLists((prev) => {
      return prev.map((prevList, index) =>
        index === activeListIndex
          ? editItemInList(prevList, itemEdited)
          : prevList
      );
    });
  };

  const editItemInList = (list: ItemList, itemToEdit: Item) => {
    const updatedList: ItemList = {
      ...list,
      items: list.items.map((item) =>
        item.id === itemToEdit.id ? itemToEdit : item
      ),
    };

    // tslint:disable-next-line: no-floating-promises
    StorageService.saveItemList(updatedList);
    return updatedList;
  };

  const onDeleteItem = (itemToDelete: string) => {
    setItemLists((prev) => {
      return prev.map((prevList, index) =>
        index === activeListIndex
          ? deleteItemInList(prevList, itemToDelete)
          : prevList
      );
    });
  };

  const deleteItemInList = (list: ItemList, itemToDeleteId: string) => {
    const updatedList: ItemList = {
      ...list,
      items: list.items.filter((item) => item.id !== itemToDeleteId),
    };

    // tslint:disable-next-line: no-floating-promises
    StorageService.saveItemList(updatedList);
    return updatedList;
  };

  const onViewPrevList = () => {
    setActiveListIndex((prev) => {
      const newIndex = prev - 1;

      // Ensure has next list
      if (newIndex < 0) {
        return prev;
      }
      return newIndex;
    });
  };

  // XXX: Genbrug prev func
  const onViewNextList = () => {
    setActiveListIndex((prev) => {
      const newIndex = prev + 1;

      // Ensure has next list
      if (newIndex > itemLists.length - 1) {
        return prev;
      }
      return newIndex;
    });
  };

  // XXX: On modify item?? således generic.  Child forestår ændring
  const onItemPressed = (itemPressed: Item) => {
    setItemLists((prev) => {
      return prev.map((prevList, index) =>
        index === activeListIndex
          ? updateItemInList(prevList, itemPressed)
          : prevList
      );
    });
  };

  const updateItemInList = (prevList: ItemList, updatedItem: Item) => {
    // let itemUpdated: Item | null = null;
    const newItems = prevList.items.map((item) =>
      // Find and update pressed item.
      item.id === updatedItem.id
        ? { ...item, isChecked: !item.isChecked }
        : item
    );
    const updatedList = { ...prevList, items: newItems };

    // tslint:disable-next-line: no-floating-promises
    StorageService.saveItemList(updatedList);

    return updatedList;
  };

  return (
    <View style={styles.container}>
      <ChecklistView
        categories={categories}
        itemList={itemLists[activeListIndex]}
        onCheckButtonPressed={onItemPressed}
        onAddNewItem={onAddNewItem}
        onEditItem={onEditItem}
        onViewPrevList={onViewPrevList}
        onViewNextList={onViewNextList}
        hasPrevList={hasPrevList()}
        hasNextList={hasNextList()}
        onDeleteItem={onDeleteItem}
      ></ChecklistView>
    </View>
  );

  function hasNextList(): boolean {
    return activeListIndex + 1 <= itemLists.length - 1;
  }

  function hasPrevList(): boolean {
    return activeListIndex - 1 >= 0;
  }
}

const styles = StyleSheet.create({
  container: {},
});
