import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import LibraryItem from "../models/LibraryItem";
import ListItem from "../models/ListItem";
import { RootStackParamList } from "../types";
import ItemLibraryView from "../components/ItemLibraryView";
import StorageService from "../services/StorageService";
import Category from "../models/Category";

type Props = BottomTabScreenProps<RootStackParamList, "ItemLibraryScreen">;

export default function ItemLibraryScreen({ navigation, route }: Props) {
  // XXX: Flyttes til global store
  const [items, setItems] = useState<LibraryItem[]>(route.params.initItems);
  const [categories] = useState<Category[]>(route.params.initCategories);

  console.log("Total library items: " + items.length);

  // XXX: Genalisér. Samme logik som ListsView
  const onDeleteItem = (itemToDelete: LibraryItem) => {
    setItems((prev) => {
      // tslint:disable-next-line: no-floating-promises
      StorageService.deleteLibraryItem(itemToDelete.id);
      return prev.filter((item) => item.id !== itemToDelete.id);
    });
  };

  const onAddItem = (itemToAdd: LibraryItem) => {
    setItems((prev) => {
      // tslint:disable-next-line: no-floating-promises
      StorageService.saveLibraryItem(itemToAdd);
      return [...prev, itemToAdd];
    });
  };

  const onEditItem = (itemToEdit: LibraryItem) => {
    setItems((prev) => {
      // tslint:disable-next-line: no-floating-promises
      StorageService.saveLibraryItem(itemToEdit);
      return prev.map((list) =>
        list.id === itemToEdit.id ? itemToEdit : list
      );
    });
  };

  return (
    <ItemLibraryView
      onDeleteItem={onDeleteItem}
      onAddItem={onAddItem}
      onEditItem={onEditItem}
      items={items}
      categories={categories}
    ></ItemLibraryView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
