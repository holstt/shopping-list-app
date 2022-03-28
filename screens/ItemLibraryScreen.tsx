import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { RootStackParamList } from "../types";
import ItemLibraryView from "../components/ItemLibraryView";
import Category from "../models/Category";
import { useContext } from "react";
import { LibraryItemsContext } from "../context/LibraryItemsContext";

type Props = BottomTabScreenProps<RootStackParamList, "ItemLibraryScreen">;

export default function ItemLibraryScreen({ navigation, route }: Props) {
  const context = useContext(LibraryItemsContext);
  const items = context.libraryItems;
  // const {libraryItems} = useContext(AppContext);

  console.log("Total library items: " + context?.libraryItems.length);

  // XXX: Flyttes til global store
  const [categories] = useState<Category[]>(route.params.initCategories);

  return (
    <ItemLibraryView
      onDeleteItem={context.deleteLibraryItem}
      onAddItem={context.addLibraryItem}
      onEditItem={context.editLibraryItem}
      items={items}
      categories={categories}
    ></ItemLibraryView>
  );
}
