import { useEffect, useState } from "react";
import AppData from "../AppData";
import ShoppingList from "../models/ShoppingList";
import LibraryItem from "../models/LibraryItem";
import StorageService from "../services/StorageService";
import { CategoriesContext } from "./CategoriesContext";
import { ItemListsContext } from "./ItemListsContext";

// Global store for managing the item lists in the system.
interface Props {
  initItemLists: ShoppingList[];
  startListId: string | null;
  onActiveListChanged: (index: string) => void; // XXX: Bare update app data herfra??
  children: React.ReactNode;
}

// XXX: Lave updateActiveList helper methods???

// XXX: Samme som lists --> Lav generic!
export default function ItemListsContextProvider({
  initItemLists,
  startListId,
  onActiveListChanged,
  children,
}: Props) {
  // Handle no existing lists.
  const createInitItemLists = () => {
    if (initItemLists.length === 0) {
      console.log(
        "ChecklistScreen: No initial lists in global store. Creating a default list..."
      );
      const firstList = new ShoppingList("Default List", [], 0);

      startListId = firstList.id;
      return [firstList];
    }
    return initItemLists;
  };

  const [itemLists, setLists] = useState<ShoppingList[]>(createInitItemLists);
  // const [appData, setAppData] = useState<AppData>(initAppData);
  console.log("ItemListsContext render");

  // XXX: Ansvar?
  const initListIndex = () => {
    if (!startListId) {
      return 0;
    }
    // Try get index of start list.
    if (startListId) {
      // Find item
      let index = itemLists.map((l) => l.id).indexOf(startListId);
      if (index === -1) {
        console.warn(
          `Start list id provided (${startListId}) was not found. Defaults to 0`
        );
        index = 0;
      }
      return index;
    }
    return 0;
  };

  const [activeListIndex, setActiveListIndex] = useState(initListIndex);
  const getActiveItemList = () => itemLists[activeListIndex];
  const getHasNextList = () => activeListIndex + 1 <= itemLists.length - 1;
  const getHasPrevList = () => activeListIndex - 1 >= 0;

  // React to changes in active list index.
  useEffect(() => {
    onActiveListChanged(getActiveItemList().id);
  }, [activeListIndex]);

  // XXX: Flyt i selvstændig hook?
  const goToPrevList = () => {
    setActiveListIndex((prev) => {
      const newIndex = prev - 1;

      // Ensure has next list
      if (newIndex < 0) {
        return prev;
      }
      return newIndex;
    });
  };

  const goToNextList = () => {
    setActiveListIndex((prev) => {
      const newIndex = prev + 1;

      // Ensure has next list
      if (newIndex > itemLists.length - 1) {
        return prev;
      }
      return newIndex;
    });
  };

  // Reload all lists from storage
  const reload = async () => {
    console.log("Reloading item lists");
    setLists(await StorageService.loadItemLists());
  };

  const updateItemList = (listUpdated: ShoppingList) =>
    setLists((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      StorageService.saveItemList(listUpdated);
      return prev.map((list) =>
        list.id === listUpdated.id ? listUpdated : list
      );
    });

  // XXX: Genalisér. Samme logik som ListsView
  const addItemList = (listToAdd: ShoppingList) =>
    setLists((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      StorageService.saveItemList(listToAdd);
      return [...prev, listToAdd];
    });

  const deleteItemList = (listToDeleteId: string) => {
    setLists((prev) => {
      let newList = prev.filter((item) => item.id !== listToDeleteId);
      setActiveListIndex(0);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      StorageService.deleteLibraryItem(listToDeleteId);

      // Handle if deletion results in empty list.
      if (newList.length === 0) {
        const firstList = new ShoppingList("My First List", [], 0);
        newList = [firstList];
        StorageService.saveItemList(firstList);
      }
      return newList;
    });
  };

  return (
    <ItemListsContext.Provider
      value={{
        itemLists,
        addItemList,
        updateItemList,
        deleteItemList,
        activeItemList: getActiveItemList(),
        hasPrevList: getHasPrevList(),
        hasNextList: getHasNextList(),
        goToPrevList,
        goToNextList,
        reloadShoppingLists: reload,
      }}
    >
      {children}
    </ItemListsContext.Provider>
  );
}
