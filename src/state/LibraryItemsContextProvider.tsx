import { useContext, useState } from "react";
import LibraryItem from "../models/LibraryItem";
import StorageService from "../services/StorageService";
import { ItemListsContext } from "./ItemListsContext";
import { LibraryItemsContext } from "./LibraryItemsContext";

interface Props {
  initLibraryItems: LibraryItem[];
  children: React.ReactNode;
}

export default function LibraryItemsContextProvider({
  initLibraryItems,
  children,
}: Props) {
  const [libraryItems, setLibraryItems] =
    useState<LibraryItem[]>(initLibraryItems);

  const { reload: reloadItemLists } = useContext(ItemListsContext);

  // XXX: Genalisér. Samme logik som ListsView
  const addLibraryItem = (itemToAdd: LibraryItem) =>
    setLibraryItems((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      StorageService.saveLibraryItem(itemToAdd);
      return [...prev, itemToAdd];
    });

  const editLibraryItem = (itemToEdit: LibraryItem) =>
    setLibraryItems((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      StorageService.saveLibraryItem(itemToEdit).then(() => reloadItemLists());
      return prev.map((item) =>
        item.id === itemToEdit.id ? itemToEdit : item
      );
    });

  const deleteLibraryItem = (itemToDeleteId: string) =>
    setLibraryItems((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      StorageService.deleteLibraryItem(itemToDeleteId).then(() =>
        reloadItemLists()
      );
      return prev.filter((item) => item.id !== itemToDeleteId);
    });

  return (
    <LibraryItemsContext.Provider
      value={{
        libraryItems,
        addLibraryItem,
        editLibraryItem,
        deleteLibraryItem,
      }}
    >
      {children}
    </LibraryItemsContext.Provider>
  );
}
