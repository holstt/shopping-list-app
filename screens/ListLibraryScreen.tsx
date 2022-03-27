import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../types";

import { StyleSheet } from "react-native";
import { useState } from "react";

import ItemList from "../models/ItemList";
import ListsView from "../components/ListsView";
import StorageService from "../services/StorageService";

type Props = BottomTabScreenProps<RootStackParamList, "ListLibraryScreen">;

export default function ListLibraryScreen({ route, navigation }: Props) {
  const [itemLists, setItemLists] = useState<ItemList[]>(
    route.params.initItemLists
  );

  const onDeleteList = (list: ItemList) => {
    setItemLists((prev) => {
      // tslint:disable-next-line: no-floating-promises
      StorageService.deleteItemList(list.id);
      return prev.filter((item) => item.id !== list.id);
    });
  };

  const onAddList = (listToAdd: ItemList) => {
    setItemLists((prev) => {
      // tslint:disable-next-line: no-floating-promises
      StorageService.saveItemList(listToAdd);
      return [...prev, listToAdd];
    });
  };

  const onEditList = (listToEdit: ItemList) => {
    setItemLists((prev) => {
      // tslint:disable-next-line: no-floating-promises
      StorageService.saveItemList(listToEdit);
      return prev.map((list) =>
        list.id === listToEdit.id ? listToEdit : list
      );
    });
  };

  return (
    <ListsView
      onDeleteList={onDeleteList}
      onAddList={onAddList}
      onEditList={onEditList}
      itemLists={itemLists}
    ></ListsView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
