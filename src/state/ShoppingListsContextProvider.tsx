import { Dispatch, useEffect, useReducer, useState } from "react";
import AppData from "../AppData";
import ShoppingList from "../models/ShoppingList";
import LibraryItem from "../models/LibraryItem";
import StorageService from "../services/StorageService";
import { CategoriesContext } from "./CategoriesContext";
import { ShoppingListsContext } from "./ShoppingListsContext";
import ShoppingItem from "../models/ShoppingItem";
import shoppingListReducer from "./reducers/shoppingListsReducer";

// Global store for managing the item lists in the system.
interface Props {
  initialShoppingLists: ShoppingList[];
  initialCurrentListId: string | null;
  children: React.ReactNode;
}

// XXX: Samme som lists --> Lav generic!
export default function ShoppingListsContextProvider({
  initialShoppingLists,
  initialCurrentListId,
  children,
}: Props) {
  console.log("context rendered");

  // Try get index of start list.
  const getLastActiveListIndex = (startListId: string | null) => {
    console.log("getting last index");
    if (!startListId) {
      return 0;
    } else {
      // Find item
      const index = initialShoppingLists.map((l) => l.id).indexOf(startListId);
      if (index !== -1) {
        return index;
      } else {
        console.warn(
          `Id of last active shopping list (${startListId}) was not found.`
        );
        return 0;
      }
    }
  };

  const [state, dispatch] = useReducer(shoppingListReducer, {
    allLists: initialShoppingLists,
    currentListIndex: getLastActiveListIndex(initialCurrentListId),
  });

  // Sync app state to local storage at every change.
  useEffect(() => {
    if (state.allLists.length) {
      void StorageService.saveItemLists(state.allLists);
    }
  }, [state.allLists]);

  useEffect(() => {
    void (async () => {
      const currentAppData = await StorageService.loadAppData(); // XXX: Eller fra state?
      await StorageService.saveAppData({
        ...currentAppData,
        lastActiveListId: state.allLists[state.currentListIndex].id,
      });
    })();
  }, [state.currentListIndex]);

  // // Reload all lists from storage
  // const reload = async () => {
  //   console.log("Reloading item lists");
  //   setLists(await StorageService.loadShoppingLists());
  // };

  return (
    <ShoppingListsContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ShoppingListsContext.Provider>
  );
}
