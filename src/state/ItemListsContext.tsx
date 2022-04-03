import React, { createContext, useState, ReactNode, Dispatch } from "react";
import ShoppingList from "../models/ShoppingList";

interface ItemListState {
  addItemList: (list: ShoppingList) => void;
  updateItemList: (list: ShoppingList) => void;
  deleteItemList: (list: string) => void;
  itemLists: ShoppingList[];
  activeItemList: ShoppingList;
  hasPrevList: boolean;
  hasNextList: boolean;
  goToNextList: () => void;
  goToPrevList: () => void;
  reloadShoppingLists: () => void;
}
// Give initial empty values to avoid not null. // XXX: Fix senere med library
export const ItemListsContext = createContext<ItemListState>({
  // appData: { id: "", lastActiveListId: "" }, // XXX: Væk med det
  // tslint:disable-next-line: no-empty
  addItemList: () => {},
  // tslint:disable-next-line: no-empty
  updateItemList: () => {},
  // tslint:disable-next-line: no-empty
  deleteItemList: () => {},
  itemLists: [],
  // updateLastActiveListId: () => {},
  activeItemList: { id: "", title: "", items: [], index: 0 },
  hasPrevList: false,
  hasNextList: false,
  // tslint:disable-next-line: no-empty
  goToPrevList: () => {},
  // tslint:disable-next-line: no-empty
  goToNextList: () => {},
  reloadShoppingLists: () => {},
});
