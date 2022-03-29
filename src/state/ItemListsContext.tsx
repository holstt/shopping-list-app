import React, { createContext, useState, ReactNode, Dispatch } from "react";
import ItemList from "../models/ItemList";

interface ItemListState {
  addItemList: (list: ItemList) => void;
  updateItemList: (list: ItemList) => void;
  deleteItemList: (list: string) => void;
  itemLists: ItemList[];
  activeItemList: ItemList;
  hasPrevList: boolean;
  hasNextList: boolean;
  goToNextList: () => void;
  goToPrevList: () => void;
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
});
